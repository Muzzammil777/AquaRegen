from fastapi import APIRouter, Query
from typing import Optional, List, Dict, Any
from app.db.repository import db_repo
from app.db.seed_data import SEED_MAP_ZONES

router = APIRouter()

CATEGORIES_LIST = [
    {"id": "all", "label": "All Locations"},
    {"id": "recharge_zone", "label": "Recharge Zones"},
    {"id": "groundwater", "label": "Groundwater Monitoring"},
    {"id": "storage", "label": "Storage Facilities"},
    {"id": "critical_areas", "label": "Critical Stress Areas"}
]

@router.get("/zones")
async def get_map_zones(
    category: Optional[str] = None,
    lat: Optional[float] = None,
    lon: Optional[float] = None,
    location_name: Optional[str] = None
):
    # If coordinates are provided, generate localized zones around the user's real location
    if lat is not None and lon is not None:
        loc_label = location_name or "Local Area"
        local_zones = [
            {
                "id": "zone_user_property",
                "name": f"📍 Your Property ({loc_label})",
                "category": "recharge_zone",
                "latitude": lat,
                "longitude": lon,
                "status": "healthy",
                "groundwater_depth_m": 6.8,
                "recharge_potential_pct": 92,
                "annual_rainfall_mm": 850.0,
                "recommended_structure": "Rooftop Rainwater Harvesting & Recharge Pit",
                "estimated_recharge_litres": 78000,
                "soil_type": "Sandy Loam",
                "description": f"Active user property in {loc_label}. High rooftop catchment yield with active recharge soakaway potential."
            },
            {
                "id": "zone_local_swale",
                "name": f"{loc_label} — North Groundwater Swale",
                "category": "recharge_zone",
                "latitude": round(lat + 0.009, 5),
                "longitude": round(lon + 0.008, 5),
                "status": "healthy",
                "groundwater_depth_m": 7.4,
                "recharge_potential_pct": 88,
                "annual_rainfall_mm": 860.0,
                "recommended_structure": "Percolation Trench & Swale",
                "estimated_recharge_litres": 125000,
                "soil_type": "Coarse Sand & Silt",
                "description": "Natural depression swale with high infiltration rates and zero runoff contamination."
            },
            {
                "id": "zone_local_well",
                "name": f"{loc_label} — Community Observation Well #1",
                "category": "groundwater",
                "latitude": round(lat - 0.011, 5),
                "longitude": round(lon - 0.007, 5),
                "status": "moderate",
                "groundwater_depth_m": 12.8,
                "recharge_potential_pct": 65,
                "annual_rainfall_mm": 840.0,
                "recommended_structure": "Deep Aquifer Injection Shaft",
                "estimated_recharge_litres": 95000,
                "soil_type": "Loamy Clay",
                "description": "Localized water table monitoring well showing seasonal summer drawdown."
            },
            {
                "id": "zone_local_pond",
                "name": f"{loc_label} — Stormwater Retention Wetland",
                "category": "storage",
                "latitude": round(lat + 0.007, 5),
                "longitude": round(lon - 0.012, 5),
                "status": "healthy",
                "groundwater_depth_m": 5.2,
                "recharge_potential_pct": 95,
                "annual_rainfall_mm": 880.0,
                "recommended_structure": "Percolation Pond & Silt Trap",
                "estimated_recharge_litres": 340000,
                "soil_type": "Alluvial Silt Sand",
                "description": "Public retention wetland capturing seasonal monsoon overflow for local unconfined aquifer recovery."
            },
            {
                "id": "zone_local_stress",
                "name": f"{loc_label} — High Extraction Zone (South Basin)",
                "category": "critical_areas",
                "latitude": round(lat - 0.018, 5),
                "longitude": round(lon + 0.014, 5),
                "status": "critical",
                "groundwater_depth_m": 22.5,
                "recharge_potential_pct": 42,
                "annual_rainfall_mm": 810.0,
                "recommended_structure": "Dual Multi-Stage Recharge Wells",
                "estimated_recharge_litres": 45000,
                "soil_type": "Dense Clay / Hardpan",
                "description": "Severe aquifer depletion zone requiring urgent artificial recharge intervention to arrest water table decline."
            }
        ]

        if category and category.lower() != "all":
            local_filtered = [z for z in local_zones if z.get("category", "").lower() == category.lower()]
            return {
                "zones": local_filtered,
                "total": len(local_filtered),
                "categories": CATEGORIES_LIST
            }

        return {
            "zones": local_zones,
            "total": len(local_zones),
            "categories": CATEGORIES_LIST
        }

    # Fallback to database or seed list
    zones = await db_repo.find_many("map_zones")
    if not zones:
        zones = SEED_MAP_ZONES
        
    if category and category.lower() != "all":
        filtered = [z for z in zones if z.get("category", "").lower() == category.lower()]
        return {
            "zones": filtered,
            "total": len(filtered),
            "categories": CATEGORIES_LIST
        }
        
    return {
        "zones": zones,
        "total": len(zones),
        "categories": CATEGORIES_LIST
    }

@router.get("/zones/{zone_id}")
async def get_zone_detail(zone_id: str):
    zone = await db_repo.find_one("map_zones", {"id": zone_id})
    if not zone:
        for z in SEED_MAP_ZONES:
            if z["id"] == zone_id:
                return z
        return {"error": "Zone not found"}
    return zone
