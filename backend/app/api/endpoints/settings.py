from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.api.endpoints.auth import get_current_user
from app.db.repository import db_repo
from app.db.seed_data import seed_initial_data, SEED_PROPERTIES

router = APIRouter()

class SettingsUpdateRequest(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    property_type: Optional[str] = None
    roof_area_sqm: Optional[float] = None
    surface_type: Optional[str] = None
    annual_rainfall_mm: Optional[float] = None
    daily_demand_litres: Optional[float] = None
    storage_capacity_litres: Optional[float] = None
    unit_system: Optional[str] = "metric"
    theme_preference: Optional[str] = "light"
    email_notifications: Optional[bool] = True
    rainfall_alerts: Optional[bool] = True

@router.get("")
@router.get("/")
async def get_user_settings(current_user: dict = Depends(get_current_user)):
    props = await db_repo.find_many("properties", {"user_id": current_user["id"]})
    prop = props[0] if props else {}
    
    return {
        "profile": {
            "name": current_user.get("name", "User"),
            "email": current_user.get("email", ""),
            "role": current_user.get("role", "Community Member"),
            "location": current_user.get("location", "Bengaluru Urban, KA")
        },
        "property": {
            "name": prop.get("name", "Primary Property"),
            "property_type": prop.get("property_type", "House"),
            "roof_area_sqm": prop.get("roof_area_sqm", 120.0),
            "surface_type": prop.get("surface_type", "concrete"),
            "annual_rainfall_mm": prop.get("annual_rainfall_mm", 850.0),
            "daily_demand_litres": prop.get("daily_demand_litres", 360.0),
            "storage_capacity_litres": prop.get("storage_capacity_litres", 2000.0),
            "soil_type": prop.get("soil_type", "sandy_loam"),
            "groundwater_depth_m": prop.get("groundwater_depth_m", 7.4),
            "available_land_sqm": prop.get("available_land_sqm", 45.0)
        },
        "preferences": {
            "unit_system": "metric",
            "theme_preference": "light",
            "email_notifications": True,
            "rainfall_alerts": True,
            "demo_mode_active": current_user.get("email") == "demo@aquaregen.com"
        }
    }

@router.put("")
@router.put("/")
async def update_user_settings(
    settings_in: SettingsUpdateRequest,
    current_user: dict = Depends(get_current_user)
):
    # Update user basic profile
    user_updates = {}
    if settings_in.name:
        user_updates["name"] = settings_in.name
    if settings_in.location:
        user_updates["location"] = settings_in.location
    if settings_in.property_type:
        user_updates["property_type"] = settings_in.property_type
    if settings_in.roof_area_sqm:
        user_updates["property_area"] = settings_in.roof_area_sqm
        
    if user_updates:
        await db_repo.update_one("users", {"id": current_user["id"]}, user_updates)
        
    # Update primary property
    props = await db_repo.find_many("properties", {"user_id": current_user["id"]})
    if props:
        prop_id = props[0]["id"]
        prop_updates = {}
        if settings_in.location:
            prop_updates["location"] = settings_in.location
        if settings_in.property_type:
            prop_updates["property_type"] = settings_in.property_type
        if settings_in.roof_area_sqm:
            prop_updates["roof_area_sqm"] = settings_in.roof_area_sqm
        if settings_in.surface_type:
            prop_updates["surface_type"] = settings_in.surface_type
        if settings_in.annual_rainfall_mm:
            prop_updates["annual_rainfall_mm"] = settings_in.annual_rainfall_mm
        if settings_in.daily_demand_litres:
            prop_updates["daily_demand_litres"] = settings_in.daily_demand_litres
        if settings_in.storage_capacity_litres:
            prop_updates["storage_capacity_litres"] = settings_in.storage_capacity_litres
            
        if prop_updates:
            await db_repo.update_one("properties", {"id": prop_id}, prop_updates)

    return {"status": "success", "message": "Settings updated successfully"}

@router.post("/reset-demo")
async def reset_demo_data():
    await seed_initial_data()
    return {"status": "success", "message": "Demo data refreshed successfully"}
