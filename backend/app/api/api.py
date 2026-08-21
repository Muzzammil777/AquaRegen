from fastapi import APIRouter
from app.api.endpoints import (
    auth,
    dashboard,
    rainfall,
    harvesting,
    groundwater,
    simulator,
    map_zones,
    analytics,
    ai_assistant,
    settings
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication & Profile"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(rainfall.router, prefix="/rainfall", tags=["Rainfall Analysis"])
api_router.include_router(harvesting.router, prefix="/harvesting", tags=["Harvesting Planner"])
api_router.include_router(groundwater.router, prefix="/groundwater", tags=["Groundwater Recharge"])
api_router.include_router(simulator.router, prefix="/water", tags=["Water Simulator"])
api_router.include_router(simulator.router, prefix="/scenario", tags=["Scenario Comparison"])
api_router.include_router(map_zones.router, prefix="/map", tags=["GIS Water Map"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Impact & Analytics"])
api_router.include_router(ai_assistant.router, prefix="/ai", tags=["Aqua AI Assistant"])
api_router.include_router(settings.router, prefix="/settings", tags=["Settings & Preferences"])
