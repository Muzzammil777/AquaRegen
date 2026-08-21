from fastapi import APIRouter, Query
from typing import Optional, List, Dict, Any
from app.db.repository import db_repo
from app.db.seed_data import SEED_MAP_ZONES

router = APIRouter()

@router.get("/zones")
async def get_map_zones(category: Optional[str] = None):
    # Fetch from repository or fallback seed list
    zones = await db_repo.find_many("map_zones")
    if not zones:
        zones = SEED_MAP_ZONES
        
    if category and category.lower() != "all":
        filtered = [z for z in zones if z.get("category", "").lower() == category.lower()]
        return {"zones": filtered, "total": len(filtered)}
        
    return {
        "zones": zones,
        "total": len(zones),
        "categories": [
            {"id": "all", "label": "All Locations"},
            {"id": "recharge_zone", "label": "Recharge Zones"},
            {"id": "groundwater", "label": "Groundwater Monitoring"},
            {"id": "storage", "label": "Storage Facilities"},
            {"id": "critical_areas", "label": "Critical Stress Areas"}
        ]
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
