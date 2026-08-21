from fastapi import APIRouter, Depends
from app.schemas.schemas import HarvestingCalculateRequest, HarvestingCalculateResponse
from app.services.hydro_engine import HydroEngine, RUNOFF_COEFFICIENTS

router = APIRouter()

@router.post("/calculate")
async def calculate_harvesting(req: HarvestingCalculateRequest):
    harvest = HydroEngine.calculate_harvest_potential(
        roof_area_sqm=req.roof_area_sqm,
        annual_rainfall_mm=req.annual_rainfall_mm,
        surface_type=req.surface_type
    )
    
    storage = HydroEngine.calculate_storage_and_sufficiency(
        net_harvestable_litres=harvest["net_harvestable_litres"],
        daily_demand_litres=req.daily_demand_litres or 360.0,
        existing_storage_litres=req.existing_storage_litres
    )
    
    # Generate structured recommendation
    estimated_recharge = round(harvest["net_harvestable_litres"] * 0.52)
    
    system_type = "Modular Storage Tank + Recharge Pit"
    if req.roof_area_sqm >= 600:
        system_type = "Multi-Tank Cistern Battery + Dual Recharge Trenches"
    elif req.roof_area_sqm <= 80:
        system_type = "Compact Overhead Rain Barrel + Direct Soak Pit"
        
    recommendation_details = {
        "system_type": system_type,
        "estimated_annual_collection_litres": round(harvest["net_harvestable_litres"]),
        "recommended_storage_litres": storage["recommended_storage_litres"],
        "estimated_recharge_litres_per_year": estimated_recharge,
        "water_sufficiency_pct": storage["water_sufficiency_pct"],
        "days_of_water_autonomy": storage["days_of_water_autonomy"],
        "why_text": [
            f"Your {req.surface_type.capitalize()} roof provides an efficient runoff yield of {harvest['runoff_coefficient']*100:.0f}%.",
            f"A {storage['recommended_storage_litres']:,} L storage tank balances monsoon storage without risking stagnation.",
            f"Diverting the remaining ~{estimated_recharge:,} L of surplus overflow prevents urban stormwater flooding and charges the localized water table.",
            f"Your water sufficiency is modeled at {storage['water_sufficiency_pct']}%, significantly mitigating municipal water dependency."
        ]
    }

    # Step-by-step math calculation visual breakdown
    calculation_steps = [
        {
            "step": 1,
            "title": "Gross Catchment Inflow",
            "formula": f"Rainfall ({req.annual_rainfall_mm} mm) × Roof Area ({req.roof_area_sqm} m²)",
            "result": f"{round(req.annual_rainfall_mm * req.roof_area_sqm):,} L (Theoretical Maximum)",
            "explanation": "Standard physical equivalence: 1 mm of rain over 1 m² area equals exactly 1.0 Litre of water."
        },
        {
            "step": 2,
            "title": "Surface Runoff Coefficient Deduction",
            "formula": f"Gross Inflow × {harvest['runoff_coefficient']} ({req.surface_type.capitalize()})",
            "result": f"{round(harvest['gross_potential_litres']):,} L",
            "explanation": f"Accounts for roof absorption, surface evaporation, and splash loss."
        },
        {
            "step": 3,
            "title": "First-Flush & Mesh Filtration Efficiency",
            "formula": f"Effective Runoff × 90% (After First Flush Diversion)",
            "result": f"{round(harvest['net_harvestable_litres']):,} L/year",
            "explanation": "Diverts initial 1.5mm contaminated wash and particulate matter to maintain clean tank water."
        }
    ]

    return {
        "harvest_metrics": harvest,
        "storage_metrics": storage,
        "recommendation": recommendation_details,
        "calculation_steps": calculation_steps,
        "surface_coefficients": RUNOFF_COEFFICIENTS
    }
