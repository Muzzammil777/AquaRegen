import httpx
from typing import Dict, Any, List, Optional
import logging
from datetime import datetime, timedelta
from collections import defaultdict
import urllib.parse
import time

logger = logging.getLogger(__name__)

# Predefined coordinates for fast offline/fallback resolution
PREDEFINED_COORDINATES: Dict[str, Dict[str, Any]] = {
    "chennai": {"lat": 13.0827, "lon": 80.2707, "name": "Chennai", "admin1": "Tamil Nadu", "country": "India"},
    "karur": {"lat": 10.9577, "lon": 78.0810, "name": "Karur", "admin1": "Tamil Nadu", "country": "India"},
    "bengaluru": {"lat": 12.9716, "lon": 77.5946, "name": "Bengaluru", "admin1": "Karnataka", "country": "India"},
    "mumbai": {"lat": 19.0760, "lon": 72.8777, "name": "Mumbai", "admin1": "Maharashtra", "country": "India"},
    "delhi": {"lat": 28.7041, "lon": 77.1025, "name": "Delhi", "admin1": "Delhi NCR", "country": "India"},
    "hyderabad": {"lat": 17.3850, "lon": 78.4867, "name": "Hyderabad", "admin1": "Telangana", "country": "India"},
    "pune": {"lat": 18.5204, "lon": 73.8567, "name": "Pune", "admin1": "Maharashtra", "country": "India"},
    "coimbatore": {"lat": 11.0055, "lon": 76.9661, "name": "Coimbatore", "admin1": "Tamil Nadu", "country": "India"},
    "madurai": {"lat": 9.9190, "lon": 78.1195, "name": "Madurai", "admin1": "Tamil Nadu", "country": "India"},
    "jaipur": {"lat": 26.9124, "lon": 75.7873, "name": "Jaipur", "admin1": "Rajasthan", "country": "India"}
}

MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

class WeatherService:
    """
    Real-Time Weather and Meteorological Precipitation Service using Open-Meteo APIs.
    Integrates:
      1. Open-Meteo Geocoding API (Strict dynamic location geocoding)
      2. Open-Meteo Weather Forecast API (Live parameters: temperature, humidity, current rain, 7-day storm radar, past 90-days sum)
      3. Open-Meteo Historical Weather API /v1/archive (5 completed calendar years genuine precipitation totals)
    """

    def __init__(self):
        self._geocode_cache: Dict[str, Dict[str, Any]] = {}
        self._live_cache: Dict[str, Dict[str, Any]] = {}
        self._archive_cache: Dict[str, Dict[str, Any]] = {}

    async def geocode_location(self, location_name: str) -> Optional[Dict[str, Any]]:
        """
        Geocodes a location name into latitude, longitude, and formatted region using Open-Meteo Geocoding API,
        with fallbacks to Nominatim and regional coordinates.
        """
        if not location_name:
            return None

        clean_query = location_name.strip()
        cache_key = clean_query.lower()
        if cache_key in self._geocode_cache:
            return self._geocode_cache[cache_key]

        # 1. Check local predefined database first for instant hit
        city_slug = cache_key.split(",")[0].strip().replace(" ", "_")
        if city_slug in PREDEFINED_COORDINATES:
            match = PREDEFINED_COORDINATES[city_slug]
            result = {
                "name": match["name"],
                "display_name": f"{match['name']}, {match['admin1']}",
                "latitude": match["lat"],
                "longitude": match["lon"],
                "admin1": match["admin1"],
                "country": match["country"]
            }
            self._geocode_cache[cache_key] = result
            return result

        # 2. Query Open-Meteo Geocoding API
        try:
            encoded_query = urllib.parse.quote(clean_query)
            url = f"https://geocoding-api.open-meteo.com/v1/search?name={encoded_query}&count=5&language=en&format=json"
            async with httpx.AsyncClient(timeout=6.0) as client:
                res = await client.get(url)
                if res.status_code == 200:
                    data = res.json()
                    results = data.get("results", [])
                    if results:
                        # Prioritize match in India if applicable, else take first
                        chosen = results[0]
                        for r in results:
                            if r.get("country_code") == "IN":
                                chosen = r
                                break

                        name = chosen.get("name", clean_query.title())
                        admin1 = chosen.get("admin1", "")
                        country = chosen.get("country", "")
                        disp_parts = [name]
                        if admin1 and admin1 != name:
                            disp_parts.append(admin1)
                        if country:
                            disp_parts.append(country)

                        geo_result = {
                            "name": name,
                            "display_name": ", ".join(disp_parts),
                            "latitude": float(chosen["latitude"]),
                            "longitude": float(chosen["longitude"]),
                            "admin1": admin1,
                            "country": country
                        }
                        self._geocode_cache[cache_key] = geo_result
                        return geo_result
        except Exception as e:
            logger.warning(f"Open-Meteo geocoding error for '{clean_query}': {e}")

        # 3. Fallback: Nominatim OpenStreetMap
        try:
            headers = {"User-Agent": "AquaRegen-ClimateTech/1.0 (contact@aquaregen.com)"}
            async with httpx.AsyncClient(timeout=5.0) as client:
                res = await client.get(
                    "https://nominatim.openstreetmap.org/search",
                    params={"q": clean_query, "format": "json", "limit": 1},
                    headers=headers
                )
                if res.status_code == 200 and len(res.json()) > 0:
                    data = res.json()[0]
                    disp = data.get("display_name", clean_query)
                    parts = disp.split(",")
                    short_disp = f"{parts[0].strip()}, {parts[-1].strip()}" if len(parts) > 1 else disp
                    geo_result = {
                        "name": parts[0].strip(),
                        "display_name": short_disp,
                        "latitude": float(data.get("lat")),
                        "longitude": float(data.get("lon")),
                        "admin1": parts[1].strip() if len(parts) > 1 else "",
                        "country": parts[-1].strip() if len(parts) > 1 else ""
                    }
                    self._geocode_cache[cache_key] = geo_result
                    return geo_result
        except Exception as e:
            logger.warning(f"Nominatim geocoding fallback error for '{clean_query}': {e}")

        return None

    async def get_live_precipitation_data(self, latitude: float, longitude: float) -> Dict[str, Any]:
        """
        Fetches live real-time precipitation, atmospheric telemetry, 7-day storm forecast,
        and aggregates past 90-days cumulative rainfall from Open-Meteo Weather Forecast API.
        """
        cache_key = f"{round(latitude, 2)}_{round(longitude, 2)}"
        now_ts = time.time()
        if cache_key in self._live_cache:
            entry = self._live_cache[cache_key]
            if now_ts - entry["cached_at"] < 600:  # 10 minute cache
                return entry["data"]

        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                url = "https://api.open-meteo.com/v1/forecast"
                params = {
                    "latitude": latitude,
                    "longitude": longitude,
                    "current": "temperature_2m,relative_humidity_2m,precipitation,rain",
                    "daily": "precipitation_sum",
                    "timezone": "auto",
                    "past_days": 90,
                    "forecast_days": 7
                }
                res = await client.get(url, params=params)
                if res.status_code == 200:
                    data = res.json()
                    current = data.get("current", {})
                    daily = data.get("daily", {})

                    dates = daily.get("time", [])
                    precip_list = daily.get("precipitation_sum", [])

                    # 1. Past 90 days cumulative sum (entries 0 to 89)
                    past_90_vals = precip_list[:90] if len(precip_list) >= 90 else precip_list[:-7]
                    total_past_90_days = sum(p for p in past_90_vals if p is not None)

                    # 2. Live atmospheric telemetry
                    current_temp = float(current.get("temperature_2m", 28.0))
                    current_humidity = int(current.get("relative_humidity_2m", 65))
                    current_rain = float(current.get("precipitation", 0.0))

                    # 3. 7-day storm radar daily precipitation
                    forecast_dates = dates[-7:]
                    forecast_precip = precip_list[-7:]
                    forecast_items = []
                    for d_str, p in zip(forecast_dates, forecast_precip):
                        try:
                            parsed_dt = datetime.strptime(d_str, "%Y-%m-%d")
                            display_date = parsed_dt.strftime("%a %d")
                        except Exception:
                            display_date = d_str
                        val = round(float(p) if p is not None else 0.0, 1)
                        forecast_items.append({
                            "date": display_date,
                            "full_date": d_str,
                            "rain_mm": val,
                            "precipitation_mm": val
                        })

                    result = {
                        "source": "Open-Meteo Weather Forecast API",
                        "status": "live",
                        "latitude": latitude,
                        "longitude": longitude,
                        "current_temp_c": round(current_temp, 1),
                        "current_humidity_pct": current_humidity,
                        "current_rain_mm": round(current_rain, 1),
                        "past_90_days_sum_mm": round(total_past_90_days, 1),
                        "forecast_7days": forecast_items,
                        "forecast_7_days": forecast_items,
                        "is_live": True
                    }

                    self._live_cache[cache_key] = {"data": result, "cached_at": now_ts}
                    return result
        except Exception as e:
            logger.warning(f"Open-Meteo forecast API error for ({latitude}, {longitude}): {e}")

        # Fallback in case of network issue
        return {
            "source": "Open-Meteo Baseline Offline Model",
            "status": "fallback",
            "latitude": latitude,
            "longitude": longitude,
            "current_temp_c": 28.0,
            "current_humidity_pct": 65,
            "current_rain_mm": 0.0,
            "past_90_days_sum_mm": 195.0,
            "forecast_7days": [
                {"date": "Day 1", "full_date": "2026-10-26", "rain_mm": 0.0, "precipitation_mm": 0.0},
                {"date": "Day 2", "full_date": "2026-10-27", "rain_mm": 1.2, "precipitation_mm": 1.2},
                {"date": "Day 3", "full_date": "2026-10-28", "rain_mm": 0.0, "precipitation_mm": 0.0},
                {"date": "Day 4", "full_date": "2026-10-29", "rain_mm": 4.5, "precipitation_mm": 4.5},
                {"date": "Day 5", "full_date": "2026-10-30", "rain_mm": 2.1, "precipitation_mm": 2.1},
                {"date": "Day 6", "full_date": "2026-10-31", "rain_mm": 0.0, "precipitation_mm": 0.0},
                {"date": "Day 7", "full_date": "2026-11-01", "rain_mm": 8.0, "precipitation_mm": 8.0}
            ],
            "forecast_7_days": [],
            "is_live": False
        }

    async def get_historical_archive_data(
        self,
        latitude: float,
        longitude: float,
        years_back: int = 5
    ) -> Dict[str, Any]:
        """
        Queries Open-Meteo Historical Weather API (/v1/archive) to fetch genuine past rainfall totals
        for the last 5 completed calendar years, computes historical averages and monthly climatology.
        """
        cache_key = f"{round(latitude, 2)}_{round(longitude, 2)}"
        now_ts = time.time()
        if cache_key in self._archive_cache:
            entry = self._archive_cache[cache_key]
            if now_ts - entry["cached_at"] < 86400:  # 24 hour cache
                return entry["data"]

        current_year = datetime.now().year
        end_year = current_year - 1
        start_year = end_year - years_back + 1
        start_date = f"{start_year}-01-01"
        end_date = f"{end_year}-12-31"

        try:
            async with httpx.AsyncClient(timeout=12.0) as client:
                url = "https://archive-api.open-meteo.com/v1/archive"
                params = {
                    "latitude": latitude,
                    "longitude": longitude,
                    "start_date": start_date,
                    "end_date": end_date,
                    "daily": "precipitation_sum",
                    "timezone": "auto"
                }
                res = await client.get(url, params=params)
                if res.status_code == 200:
                    data = res.json()
                    daily = data.get("daily", {})
                    times = daily.get("time", [])
                    precip_list = daily.get("precipitation_sum", [])

                    by_year: Dict[int, float] = defaultdict(float)
                    by_month: Dict[int, float] = defaultdict(float)

                    for t_str, p in zip(times, precip_list):
                        if p is not None:
                            yr = int(t_str[:4])
                            mo_idx = int(t_str[5:7]) - 1
                            val = float(p)
                            by_year[yr] += val
                            by_month[mo_idx] += val

                    # 5-Year Climate Precipitation Trends
                    years_found = [yr for yr in range(start_year, end_year + 1) if yr in by_year]
                    if years_found:
                        avg_annual_mm = sum(by_year[yr] for yr in years_found) / len(years_found)
                    else:
                        avg_annual_mm = 850.0

                    historical_comparison = []
                    for yr in range(start_year, end_year + 1):
                        tot = round(by_year.get(yr, avg_annual_mm), 1)
                        if avg_annual_mm > 0:
                            dev_pct = round(((tot - avg_annual_mm) / avg_annual_mm) * 100, 1)
                            dev_str = f"+{dev_pct}%" if dev_pct >= 0 else f"{dev_pct}%"
                        else:
                            dev_str = "0%"

                        historical_comparison.append({
                            "year": str(yr),
                            "rainfall_mm": tot,
                            "deviation": dev_str
                        })

                    # Monthly averages across completed calendar years
                    monthly_averages = []
                    div_years = len(years_found) if years_found else 1
                    for mo_idx in range(12):
                        avg_m = round(by_month.get(mo_idx, 0.0) / div_years, 1)
                        monthly_averages.append({
                            "month": MONTH_NAMES[mo_idx],
                            "rainfall_mm": avg_m
                        })

                    # Determine peak month and monsoon characteristics
                    peak_idx = max(range(12), key=lambda m: by_month.get(m, 0.0))
                    peak_month_name = MONTH_NAMES[peak_idx]

                    if peak_idx in [9, 10, 11]:  # Oct, Nov, Dec
                        monsoon_intensity = "Northeast Monsoon (Post-Monsoon)"
                    elif peak_idx in [5, 6, 7, 8]:  # Jun, Jul, Aug, Sep
                        monsoon_intensity = "Southwest Monsoon (Primary)"
                    else:
                        monsoon_intensity = "Pre-Monsoon / Convective"

                    result = {
                        "source": "Open-Meteo Historical Weather API (/v1/archive)",
                        "start_year": start_year,
                        "end_year": end_year,
                        "annual_rainfall_mm": round(avg_annual_mm, 1),
                        "historical_comparison": historical_comparison,
                        "monthly_averages": monthly_averages,
                        "peak_month": peak_month_name,
                        "monsoon_intensity": monsoon_intensity,
                        "is_live_archive": True
                    }

                    self._archive_cache[cache_key] = {"data": result, "cached_at": now_ts}
                    return result
        except Exception as e:
            logger.warning(f"Open-Meteo archive API error for ({latitude}, {longitude}): {e}")

        # Fallback baseline
        return {
            "source": "Regional Climatological Fallback",
            "start_year": start_year,
            "end_year": end_year,
            "annual_rainfall_mm": 950.0,
            "historical_comparison": [
                {"year": "2021", "rainfall_mm": 920.0, "deviation": "-3.2%"},
                {"year": "2022", "rainfall_mm": 980.0, "deviation": "+3.2%"},
                {"year": "2023", "rainfall_mm": 890.0, "deviation": "-6.3%"},
                {"year": "2024", "rainfall_mm": 1040.0, "deviation": "+9.5%"},
                {"year": "2025", "rainfall_mm": 920.0, "deviation": "-3.2%"}
            ],
            "monthly_averages": [
                {"month": "Jan", "rainfall_mm": 12.0},
                {"month": "Feb", "rainfall_mm": 8.0},
                {"month": "Mar", "rainfall_mm": 15.0},
                {"month": "Apr", "rainfall_mm": 35.0},
                {"month": "May", "rainfall_mm": 70.0},
                {"month": "Jun", "rainfall_mm": 110.0},
                {"month": "Jul", "rainfall_mm": 140.0},
                {"month": "Aug", "rainfall_mm": 130.0},
                {"month": "Sep", "rainfall_mm": 125.0},
                {"month": "Oct", "rainfall_mm": 180.0},
                {"month": "Nov", "rainfall_mm": 110.0},
                {"month": "Dec", "rainfall_mm": 15.0}
            ],
            "peak_month": "October",
            "monsoon_intensity": "Monsoon Season",
            "is_live_archive": False
        }

weather_service = WeatherService()
