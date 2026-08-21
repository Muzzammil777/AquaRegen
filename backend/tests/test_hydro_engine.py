import pytest
from app.services.hydro_engine import HydroEngine
from app.services.simulator_service import SimulatorService

def test_harvest_calculation_accuracy():
    # 850 mm rainfall * 120 m² roof * 0.80 runoff coefficient = 81,600 L gross
    res = HydroEngine.calculate_harvest_potential(
        roof_area_sqm=120.0,
        annual_rainfall_mm=850.0,
        surface_type="concrete",
        filter_efficiency=0.90
    )
    # Gross potential
    assert res["gross_potential_litres"] == pytest.approx(850.0 * 120.0 * 0.85, rel=1e-2)
    # Net harvestable water is positive and scaled properly
    assert res["net_harvestable_litres"] > 70000
    assert "850.0 mm" in res["formula_string"]

def test_groundwater_recharge_scoring():
    # Deep sandy loam assessment
    res = HydroEngine.evaluate_groundwater_recharge(
        soil_type="sandy_loam",
        groundwater_depth_m=7.4,
        available_land_sqm=45.0,
        annual_rainfall_mm=850.0,
        catchment_area_sqm=120.0
    )
    assert res["suitability_score"] >= 80
    assert res["potential_category"] == "HIGH POTENTIAL"
    assert "Recharge Pit" in res["recommended_structure"] or "Recharge Trench" in res["recommended_structure"]

def test_simulator_scenarios():
    scenarios = SimulatorService.compare_scenarios(
        annual_rainfall_mm=850.0,
        roof_area_sqm=120.0,
        storage_capacity_litres=2000.0,
        daily_demand_litres=360.0
    )
    assert scenarios["scenario_a"]["groundwater_dependency_litres"] == 360.0 * 365.0
    assert scenarios["scenario_c"]["groundwater_dependency_litres"] < scenarios["scenario_a"]["groundwater_dependency_litres"]
    assert scenarios["insights"]["dependency_reduction_pct"] > 30.0
