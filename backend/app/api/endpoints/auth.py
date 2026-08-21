from fastapi import APIRouter, HTTPException, Depends, status
from app.schemas.auth import UserRegister, UserLogin, TokenResponse, UserProfile, OnboardingRequest
from app.core.security import verify_password, get_password_hash, create_access_token, decode_access_token, oauth2_scheme
from app.db.repository import db_repo
from app.services.weather_service import weather_service
import uuid

router = APIRouter()

async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    if not token:
        demo_user = await db_repo.find_one("users", {"email": "demo@aquaregen.com"})
        if demo_user:
            return demo_user
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
        
    user_id = decode_access_token(token)
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
        
    user = await db_repo.find_one("users", {"id": user_id})
    if not user:
        # Fallback to demo user if session was initiated for demo account
        demo_user = await db_repo.find_one("users", {"email": "demo@aquaregen.com"})
        if demo_user and user_id in ("usr_demo_01", demo_user.get("id")):
            return demo_user
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User session not found")
    return user

@router.post("/register", response_model=TokenResponse)
async def register(user_in: UserRegister):
    existing = await db_repo.find_one("users", {"email": user_in.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists.")
        
    new_user_id = f"usr_{uuid.uuid4().hex[:12]}"
    user_doc = {
        "id": new_user_id,
        "name": user_in.name,
        "email": user_in.email.lower(),
        "hashed_password": get_password_hash(user_in.password),
        "role": "user",
        "location": user_in.location or "Bengaluru Urban, KA",
        "property_type": user_in.property_type or "House",
        "property_area": user_in.property_area or 120.0,
        "is_active": True,
        "onboarding_completed": False
    }
    
    await db_repo.insert_one("users", user_doc)
    
    # Auto-resolve real coordinates
    lat = 12.9716
    lon = 77.5946
    try:
        geo = await weather_service.geocode_location(user_in.location or "Bengaluru Urban, KA")
        if geo:
            lat = geo.get("latitude", 12.9716)
            lon = geo.get("longitude", 77.5946)
    except Exception:
        pass

    # Create default property
    prop_doc = {
        "id": f"prop_{uuid.uuid4().hex[:12]}",
        "user_id": new_user_id,
        "name": f"{user_in.name}'s Primary Property",
        "property_type": user_in.property_type or "House",
        "location": user_in.location or "Bengaluru Urban, KA",
        "latitude": lat,
        "longitude": lon,
        "roof_area_sqm": user_in.property_area or 120.0,
        "surface_type": "concrete",
        "annual_rainfall_mm": 850.0,
        "daily_demand_litres": 360.0,
        "occupants": 4,
        "storage_capacity_litres": 2000.0,
        "soil_type": "sandy_loam",
        "groundwater_depth_m": 7.4,
        "available_land_sqm": 45.0,
        "has_recharge_pit": False
    }
    await db_repo.insert_one("properties", prop_doc)
    
    token = create_access_token(new_user_id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user_doc["id"],
            "name": user_doc["name"],
            "email": user_doc["email"],
            "location": user_doc["location"],
            "property_type": user_doc["property_type"],
            "property_area": user_doc["property_area"],
            "onboarding_completed": False
        }
    }

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = await db_repo.find_one("users", {"email": credentials.email.lower()})
    if not user or not verify_password(credentials.password, user.get("hashed_password", "")):
        raise HTTPException(status_code=400, detail="Invalid email or password.")
        
    token = create_access_token(user["id"])
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "location": user.get("location", "Bengaluru Urban, KA"),
            "property_type": user.get("property_type", "House"),
            "property_area": user.get("property_area", 120.0),
            "onboarding_completed": user.get("onboarding_completed", True)
        }
    }

@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    user_properties = await db_repo.find_many("properties", {"user_id": current_user["id"]})
    primary_prop = user_properties[0] if user_properties else None
    
    # Auto-resolve and backfill true coordinates if default
    if primary_prop:
        loc = primary_prop.get("location", "")
        lat = primary_prop.get("latitude", 12.9716)
        lon = primary_prop.get("longitude", 77.5946)
        if loc and abs(lat - 12.9716) < 0.001 and abs(lon - 77.5946) < 0.001 and "bengaluru" not in loc.lower():
            try:
                geo = await weather_service.geocode_location(loc)
                if geo:
                    primary_prop["latitude"] = geo.get("latitude", lat)
                    primary_prop["longitude"] = geo.get("longitude", lon)
                    await db_repo.update_one("properties", {"id": primary_prop["id"]}, {
                        "latitude": primary_prop["latitude"],
                        "longitude": primary_prop["longitude"]
                    })
            except Exception:
                pass

    return {
        "user": {
            "id": current_user["id"],
            "name": current_user["name"],
            "email": current_user["email"],
            "location": current_user.get("location", ""),
            "property_type": current_user.get("property_type", "House"),
            "property_area": current_user.get("property_area", 120.0),
            "onboarding_completed": current_user.get("onboarding_completed", True)
        },
        "primary_property": primary_prop
    }

@router.post("/onboarding")
async def complete_onboarding(data: OnboardingRequest, current_user: dict = Depends(get_current_user)):
    # Update user
    await db_repo.update_one("users", {"id": current_user["id"]}, {
        "location": data.location,
        "property_type": data.property_type,
        "property_area": data.roof_area_sqm,
        "onboarding_completed": True
    })
    
    # Geocode location for real coordinates
    lat = 12.9716
    lon = 77.5946
    try:
        geo = await weather_service.geocode_location(data.location)
        if geo:
            lat = geo.get("latitude", 12.9716)
            lon = geo.get("longitude", 77.5946)
    except Exception:
        pass

    # Update or insert property
    existing_prop = await db_repo.find_one("properties", {"user_id": current_user["id"]})
    prop_data = {
        "user_id": current_user["id"],
        "name": f"{current_user['name']}'s {data.property_type}",
        "property_type": data.property_type,
        "location": data.location,
        "latitude": lat,
        "longitude": lon,
        "roof_area_sqm": data.roof_area_sqm,
        "surface_type": data.surface_type,
        "annual_rainfall_mm": data.annual_rainfall_mm,
        "daily_demand_litres": data.daily_demand_litres,
        "occupants": data.occupants,
        "storage_capacity_litres": data.storage_capacity_litres,
        "soil_type": data.soil_type,
        "groundwater_depth_m": data.groundwater_depth_m,
        "available_land_sqm": data.available_land_sqm
    }
    
    if existing_prop:
        await db_repo.update_one("properties", {"id": existing_prop["id"]}, prop_data)
    else:
        prop_data["id"] = f"prop_{uuid.uuid4().hex[:12]}"
        await db_repo.insert_one("properties", prop_data)
        
    return {"status": "success", "message": "Onboarding profile created successfully"}
