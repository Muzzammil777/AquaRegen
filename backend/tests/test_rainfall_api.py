import pytest
from app.services.hydro_engine import HydroEngine
from app.services.weather_service import weather_service
from app.api.endpoints.rainfall import get_rainfall_analysis

@pytest.fixture
def anyio_backend():
    return 'asyncio'

def test_hydrological_calculation_exact_consistency():
    """
    Ensure the formula display and final harvest potential match exactly:
    Yield (L) = Annual Precipitation (mm) * Roof Area (m^2) * Runoff Coefficient (C) * Filter Efficiency (eta)
    Validate gross ($192,484 L) vs net ($168,416 L) breakdown with 87.5% filter efficiency.
    """
    roof_area = 164.0
    # Annual rain needed for 192,484 L gross: 192484 / (164 * 0.85) = 1380.77
    annual_rain = 192484.0 / (roof_area * 0.85)
    res = HydroEngine.calculate_harvest_potential(
        roof_area_sqm=roof_area,
        annual_rainfall_mm=round(annual_rain, 2),
        surface_type="concrete",
        filter_efficiency=0.875
    )
    
    assert res["gross_potential_litres"] == pytest.approx(192484, abs=5)
    assert res["net_harvestable_litres"] == pytest.approx(168424, abs=15)
    assert res["filter_efficiency"] == 0.875
    assert res["filter_efficiency_pct"] == 87.5
    
    # Formula string must match net_harvestable_litres exactly
    net_val_str = f"{round(res['net_harvestable_litres']):,} L"
    assert net_val_str in res["formula_string"]
    assert "0.875" in res["formula_string"]
    assert "concrete" in res["surface_type"]

@pytest.mark.anyio
async def test_dynamic_location_geocoding_chennai_vs_karur():
    """
    Verify dynamic geocoding strictly differentiates between Chennai and Karur coordinates.
    """
    geo_chennai = await weather_service.geocode_location("chennai")
    assert geo_chennai is not None
    assert geo_chennai["latitude"] == pytest.approx(13.08, abs=0.1)
    assert geo_chennai["longitude"] == pytest.approx(80.27, abs=0.1)

    geo_karur = await weather_service.geocode_location("karur")
    assert geo_karur is not None
    assert geo_karur["latitude"] == pytest.approx(10.95, abs=0.2)
    assert geo_karur["longitude"] == pytest.approx(78.08, abs=0.2)

@pytest.mark.anyio
async def test_live_weather_atmospheric_parameters():
    """
    Verify Open-Meteo Weather Forecast API retrieves live atmospheric telemetry:
    temperature, relative humidity, current rain, 7-day forecast, and past 90-days sum.
    """
    live = await weather_service.get_live_precipitation_data(13.0827, 80.2707)
    assert "current_temp_c" in live
    assert "current_humidity_pct" in live
    assert "current_rain_mm" in live
    assert "past_90_days_sum_mm" in live
    assert "forecast_7days" in live
    assert len(live["forecast_7days"]) == 7

@pytest.mark.anyio
async def test_historical_archive_5_completed_years():
    """
    Verify Open-Meteo Historical Weather API (/v1/archive) returns 5 completed calendar years
    and genuine monthly averages.
    """
    hist = await weather_service.get_historical_archive_data(13.0827, 80.2707, years_back=5)
    assert len(hist["historical_comparison"]) == 5
    assert hist["annual_rainfall_mm"] > 500.0
    assert len(hist["monthly_averages"]) == 12
    assert "peak_month" in hist

@pytest.mark.anyio
async def test_rainfall_analysis_endpoint_integration():
    """
    Verify endpoint returns fully synchronized reactive payload for Chennai.
    """
    mock_user = {"id": "test_user_id", "email": "test@example.com"}
    data = await get_rainfall_analysis(
        location="chennai",
        roof_area=164.0,
        surface_type="concrete",
        filter_efficiency=0.875,
        current_user=mock_user
    )
    assert "Chennai" in data["location"]
    assert data["latitude"] == pytest.approx(13.08, abs=0.1)
    assert data["longitude"] == pytest.approx(80.27, abs=0.1)
    assert len(data["monthly_trend"]) == 12
    assert len(data["historical_comparison"]) == 5
    assert data["calculated_annual_harvest_litres"] > 0
    # Formula preview contains calculated litres
    assert str(data["calculated_annual_harvest_litres"]) in data["formula_preview"].replace(",", "")
