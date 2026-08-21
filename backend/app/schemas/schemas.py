from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

# Harvesting Schemas
class HarvestingCalculateRequest(BaseModel):
    roof_area_sqm: float = Field(..., gt=0, description="Catchment roof area in square meters")
    annual_rainfall_mm: float = Field(..., gt=0, description="Annual rainfall in mm")
    surface_type: str = Field(default="concrete", description="Surface material: concrete, metal, tile, asphalt, paved, green_roof")
    daily_demand_litres: Optional[float] = Field(default=360.0, ge=0)
    existing_storage_litres: Optional[float] = Field(default=2000.0, ge=0)

class HarvestingCalculateResponse(BaseModel):
    roof_area_sqm: float
    annual_rainfall_mm: float
    surface_type: str
    runoff_coefficient: float
    filter_efficiency: float
    first_flush_deduction_litres: float
    gross_potential_litres: float
    net_harvestable_litres: float
    daily_average_harvest_litres: float
    formula_string: str
    storage_recommendation: Dict[str, Any]

# Groundwater Schemas
class GroundwaterRecommendRequest(BaseModel):
    location: Optional[str] = "Bengaluru"
    groundwater_depth_m: float = Field(..., ge=0, description="Current depth to water table in meters")
    soil_type: str = Field(default="sandy_loam", description="Soil type: gravel_sand, sandy_loam, silt_loam, clay_loam, clay, rocky")
    available_land_sqm: float = Field(default=45.0, ge=0)
    annual_rainfall_mm: float = Field(default=850.0, gt=0)
    catchment_area_sqm: float = Field(default=120.0, gt=0)
    surface_type: str = Field(default="concrete")

# Simulator Schemas
class SimulateRequest(BaseModel):
    annual_rainfall_mm: float = Field(..., gt=0)
    roof_area_sqm: float = Field(..., gt=0)
    storage_capacity_litres: float = Field(..., ge=0)
    daily_demand_litres: float = Field(..., gt=0)
    recharge_capacity_litres: Optional[float] = Field(default=50000.0, ge=0)
    surface_type: Optional[str] = "concrete"

class ScenarioCompareRequest(BaseModel):
    annual_rainfall_mm: float = Field(default=850.0, gt=0)
    roof_area_sqm: float = Field(default=120.0, gt=0)
    storage_capacity_litres: float = Field(default=2000.0, ge=0)
    daily_demand_litres: float = Field(default=360.0, gt=0)
    surface_type: Optional[str] = "concrete"

# AI Schemas
class AIChatRequest(BaseModel):
    message: str
    property_context: Optional[Dict[str, Any]] = None
    chat_history: Optional[List[Dict[str, str]]] = None

class AIChatResponse(BaseModel):
    reply: str
    provider: str
    context_used: Dict[str, Any]
