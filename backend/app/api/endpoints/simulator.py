from fastapi import APIRouter
from app.schemas.schemas import SimulateRequest, ScenarioCompareRequest
from app.services.simulator_service import SimulatorService

router = APIRouter()

@router.post("/simulate")
async def run_simulation(req: SimulateRequest):
    result = SimulatorService.simulate_water_balance(
        annual_rainfall_mm=req.annual_rainfall_mm,
        roof_area_sqm=req.roof_area_sqm,
        storage_capacity_litres=req.storage_capacity_litres,
        daily_demand_litres=req.daily_demand_litres,
        surface_type=req.surface_type or "concrete",
        has_recharge_system=True
    )
    return result

@router.post("/compare")
async def compare_scenarios(req: ScenarioCompareRequest):
    result = SimulatorService.compare_scenarios(
        annual_rainfall_mm=req.annual_rainfall_mm,
        roof_area_sqm=req.roof_area_sqm,
        storage_capacity_litres=req.storage_capacity_litres,
        daily_demand_litres=req.daily_demand_litres,
        surface_type=req.surface_type or "concrete"
    )
    return result
