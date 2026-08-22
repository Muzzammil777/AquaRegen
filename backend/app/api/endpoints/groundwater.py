from fastapi import APIRouter, Query
from typing import Optional
from app.schemas.schemas import GroundwaterRecommendRequest
from app.services.hydro_engine import HydroEngine, SOIL_FACTORS
from app.services.nwdp_service import NWDPService

router = APIRouter()

@router.get("/nwdp-telemetry")
async def get_nwdp_groundwater_telemetry(
    district: str = Query("karur", description="District in Tamil Nadu (e.g. Karur, Chennai, Coimbatore)"),
    agency: str = Query("State Ground Water Department", description="Monitoring Agency"),
    start_date: Optional[str] = Query(None, description="Start date dd-mm-yyyy"),
    end_date: Optional[str] = Query(None, description="End date dd-mm-yyyy")
):
    """
    Fetches official 6-hourly telemetry data from the National Water Data Portal (NWIC)
    Dataset: Ground Water Level Tamil_Nadu_SW_GW Tamil Nadu (2026 - 2030) Telemetry Six Hourly
    Resource ID: 6857c02f-c77e-4576-b349-3e45aacc1c21
    """
    telemetry_data = await NWDPService.fetch_groundwater_telemetry(
        district=district,
        agency=agency,
        start_date=start_date,
        end_date=end_date
    )
    return telemetry_data

@router.post("/recommend")
async def recommend_groundwater_structure(req: GroundwaterRecommendRequest):
    recharge = HydroEngine.evaluate_groundwater_recharge(
        soil_type=req.soil_type,
        groundwater_depth_m=req.groundwater_depth_m,
        available_land_sqm=req.available_land_sqm,
        annual_rainfall_mm=req.annual_rainfall_mm,
        catchment_area_sqm=req.catchment_area_sqm,
        surface_type=req.surface_type
    )
    
    # Soil types list for selector
    soil_options = [
        {"id": k, "name": v["name"], "drainage": v["drainage"], "rate_mm_hr": v["rate_mm_hr"]}
        for k, v in SOIL_FACTORS.items()
    ]
    
    return {
        "assessment": recharge,
        "input_summary": {
            "soil_type": req.soil_type,
            "groundwater_depth_m": req.groundwater_depth_m,
            "available_land_sqm": req.available_land_sqm,
            "annual_rainfall_mm": req.annual_rainfall_mm,
            "catchment_area_sqm": req.catchment_area_sqm
        },
        "soil_options": soil_options
    }

@router.get("/overview")
async def get_groundwater_overview():
    return {
        "status": "Monitored Basin Active",
        "average_basin_depth_m": 7.4,
        "historical_recharge_total_litres": 348000,
        "active_monitoring_points": 14,
        "structures_catalog": [
            {
                "type": "Recharge Pit",
                "ideal_for": "Individual houses, small roofs (<150 m²)",
                "depth_range": "2m to 3m",
                "cost_estimate": "$250 - $450"
            },
            {
                "type": "Recharge Trench",
                "ideal_for": "Driveways, perimeter boundaries, medium roofs (150-500 m²)",
                "depth_range": "1.5m to 2.5m",
                "cost_estimate": "$400 - $800"
            },
            {
                "type": "Recharge Shaft / Well",
                "ideal_for": "Deep aquifers (>15m) with impermeable clay topsoil",
                "depth_range": "15m to 30m",
                "cost_estimate": "$900 - $1,800"
            },
            {
                "type": "Percolation Pond",
                "ideal_for": "Campuses, farm lands, community spaces (>1000 m²)",
                "depth_range": "2m to 4m",
                "cost_estimate": "$1,500 - $4,000"
            }
        ]
    }
