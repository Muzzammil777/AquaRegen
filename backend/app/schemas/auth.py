from pydantic import BaseModel, EmailStr
from typing import Optional, List

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    location: Optional[str] = "Bengaluru Urban, KA"
    property_type: Optional[str] = "House"
    property_area: Optional[float] = 120.0

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class UserProfile(BaseModel):
    id: str
    name: str
    email: str
    role: str = "user"
    location: str
    property_type: str
    property_area: float
    is_active: bool = True
    onboarding_completed: bool = False

class OnboardingRequest(BaseModel):
    location: str
    property_type: str
    roof_area_sqm: float
    surface_type: str = "concrete"
    annual_rainfall_mm: float = 850.0
    daily_demand_litres: float = 360.0
    occupants: int = 4
    storage_capacity_litres: float = 2000.0
    soil_type: str = "sandy_loam"
    groundwater_depth_m: float = 7.4
    available_land_sqm: float = 45.0
