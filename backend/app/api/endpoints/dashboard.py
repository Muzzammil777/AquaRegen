from fastapi import APIRouter, Depends
from typing import Optional
from app.api.endpoints.auth import get_current_user
from app.db.repository import db_repo
from app.db.seed_data import SEED_RAINFALL_SERIES, SEED_GROUNDWATER_TREND
from app.services.hydro_engine import HydroEngine
from app.services.simulator_service import SimulatorService
from app.services.weather_service import weather_service

router = APIRouter()

@router.get("")
@router.get("/")
async def get_dashboard_data(
    period: Optional[str] = "daily",
    current_user: dict = Depends(get_current_user)
):
    # Fetch active property
    properties = await db_repo.find_many("properties", {"user_id": current_user["id"]})
    if not properties:
        prop = {
            "roof_area_sqm": 120.0,
            "surface_type": "concrete",
            "annual_rainfall_mm": 850.0,
            "daily_demand_litres": 360.0,
            "storage_capacity_litres": 2000.0,
            "soil_type": "sandy_loam",
            "groundwater_depth_m": 7.4,
            "location": "Bengaluru Urban, KA",
            "latitude": 12.9716,
            "longitude": 77.5946
        }
    else:
        prop = properties[0]

    roof_area = float(prop.get("roof_area_sqm", 120.0))
    annual_rainfall = float(prop.get("annual_rainfall_mm", 850.0))
    surface = prop.get("surface_type", "concrete")
    daily_demand = float(prop.get("daily_demand_litres", 360.0))
    storage = float(prop.get("storage_capacity_litres", 2000.0))
    gw_depth = float(prop.get("groundwater_depth_m", 7.4))
    lat = float(prop.get("latitude", 12.9716))
    lon = float(prop.get("longitude", 77.5946))

    # Fetch live meteorological data from Open-Meteo
    live_weather = await weather_service.get_live_precipitation_data(lat, lon)
    if live_weather.get("is_live"):
        annual_rainfall = live_weather.get("annual_rainfall_mm", annual_rainfall)

    # Hydrological calculations
    harvest_metrics = HydroEngine.calculate_harvest_potential(roof_area, annual_rainfall, surface)
    storage_metrics = HydroEngine.calculate_storage_and_sufficiency(harvest_metrics["net_harvestable_litres"], daily_demand, storage)
    
    # Simulation overview for harvest vs demand
    sim = SimulatorService.simulate_water_balance(annual_rainfall, roof_area, storage, daily_demand, surface)

    # Rainfall series selection
    active_series = SEED_RAINFALL_SERIES.get(period.lower(), SEED_RAINFALL_SERIES["daily"])

    current_rain = live_weather.get("current_rain_mm", 0.0)
    past_90_days = live_weather.get("past_90_days_sum_mm", 283.0)

    # 4 Primary KPI Cards
    kpis = {
        "rainfall": {
            "label": "Recent Precipitation",
            "value": f"{past_90_days} mm",
            "raw_value": past_90_days,
            "unit": "mm (Live Feed)",
            "change_pct": f"{live_weather.get('current_temp_c', 26)}°C",
            "change_label": f"Humidity: {live_weather.get('current_humidity_pct', 60)}%",
            "trend": "up",
            "status": "healthy"
        },
        "harvestable_water": {
            "label": "Harvestable Water",
            "value": f"{round(harvest_metrics['net_harvestable_litres']):,} L",
            "raw_value": round(harvest_metrics["net_harvestable_litres"]),
            "unit": "L/year",
            "change_pct": "+12.4%",
            "change_label": f"at {annual_rainfall} mm live rain",
            "trend": "up",
            "status": "healthy"
        },
        "groundwater_level": {
            "label": "Groundwater Depth",
            "value": f"{gw_depth} m",
            "raw_value": gw_depth,
            "unit": "m",
            "change_pct": "-0.5 m",
            "change_label": "improving trend (higher water table)",
            "trend": "improving",
            "status": "healthy" if gw_depth < 10 else "moderate"
        },
        "water_availability": {
            "label": "Water Availability",
            "value": f"{storage_metrics['water_sufficiency_pct']}%",
            "raw_value": storage_metrics["water_sufficiency_pct"],
            "unit": "%",
            "change_pct": f"{storage_metrics['days_of_water_autonomy']} Days",
            "change_label": "autonomous water supply",
            "trend": "up",
            "status": "healthy" if storage_metrics["water_sufficiency_pct"] >= 70 else "moderate"
        }
    }

    # Harvest vs Demand vs Groundwater Dependency breakdown
    harvest_vs_demand = [
        {"name": "Rainwater Harvested", "volume": round(sim["rainwater_utilized_litres"]), "color": "#159BD7"},
        {"name": "Annual Consumption", "volume": round(sim["annual_demand_litres"]), "color": "#0B3558"},
        {"name": "Groundwater Drawn", "volume": round(sim["groundwater_drawn_litres"]), "color": "#F59E0B"},
        {"name": "Recharge Contributed", "volume": round(sim["recharge_achieved_litres"]), "color": "#2FA36B"}
    ]

    return {
        "greeting": {
            "headline": "Good morning 👋",
            "subheadline": f"Real-time water & live precipitation status for {prop.get('location', 'Bengaluru Urban')}."
        },
        "live_weather": live_weather,
        "kpis": kpis,
        "rainfall_trend": {
            "selected_period": period,
            "data": active_series
        },
        "water_availability_gauge": {
            "percentage": storage_metrics["water_sufficiency_pct"],
            "status_label": "Optimal Water Security" if storage_metrics["water_sufficiency_pct"] >= 75 else "Moderate Self-Sufficiency",
            "days_of_autonomy": storage_metrics["days_of_water_autonomy"]
        },
        "harvest_vs_demand": harvest_vs_demand,
        "groundwater_trend": {
            "current_depth_m": gw_depth,
            "interpretation": "Aquifer recharge active — water table depth has improved from 9.8m in 2022 to 7.4m in 2026.",
            "status": "improving",
            "history": SEED_GROUNDWATER_TREND
        },
        "property_summary": {
            "name": prop.get("name", "My Property"),
            "roof_area_sqm": roof_area,
            "surface_type": surface,
            "location": prop.get("location", "Bengaluru Urban"),
            "is_live_feed": live_weather.get("is_live", False)
        }
    }
