from app.core.security import get_password_hash
from app.db.repository import db_repo

SEED_USERS = [
    {
        "id": "usr_demo_01",
        "name": "Sarah Jenkins",
        "email": "demo@aquaregen.com",
        "hashed_password": get_password_hash("password123"),
        "role": "community_leader",
        "location": "Bengaluru Urban, KA",
        "property_type": "House",
        "property_area": 180.0,
        "is_active": True,
        "onboarding_completed": True
    }
]

SEED_PROPERTIES = [
    {
        "id": "prop_demo_01",
        "user_id": "usr_demo_01",
        "name": "Green Haven Residence",
        "property_type": "House",
        "location": "Bengaluru Urban, KA",
        "latitude": 12.9716,
        "longitude": 77.5946,
        "roof_area_sqm": 120.0,
        "surface_type": "concrete",
        "annual_rainfall_mm": 850.0,
        "daily_demand_litres": 360.0,
        "occupants": 4,
        "storage_capacity_litres": 2000.0,
        "soil_type": "sandy_loam",
        "groundwater_depth_m": 7.4,
        "available_land_sqm": 45.0,
        "has_recharge_pit": True,
        "created_at": "2026-01-10T10:00:00Z"
    },
    {
        "id": "prop_demo_02",
        "user_id": "usr_demo_01",
        "name": "Green Heights Apartment Community",
        "property_type": "Apartment",
        "location": "Whitefield, Bengaluru",
        "latitude": 12.9698,
        "longitude": 77.7499,
        "roof_area_sqm": 1250.0,
        "surface_type": "concrete",
        "annual_rainfall_mm": 880.0,
        "daily_demand_litres": 4500.0,
        "occupants": 48,
        "storage_capacity_litres": 25000.0,
        "soil_type": "clay_loam",
        "groundwater_depth_m": 16.8,
        "available_land_sqm": 220.0,
        "has_recharge_pit": False,
        "created_at": "2026-01-15T11:00:00Z"
    }
]

SEED_MAP_ZONES = [
    {
        "id": "zone_01",
        "name": "Recharge Zone #01 - North Valley",
        "category": "recharge_zone",
        "latitude": 12.9850,
        "longitude": 77.5800,
        "status": "healthy",
        "groundwater_depth_m": 5.8,
        "recharge_potential_pct": 92,
        "annual_rainfall_mm": 910,
        "recommended_structure": "Recharge Trench & Pit Network",
        "estimated_recharge_litres": 78000,
        "soil_type": "Sandy Loam",
        "description": "High infiltration permeable sandy basin with active retention swale."
    },
    {
        "id": "zone_02",
        "name": "Recharge Zone #04 - Indiranagar Sub-basin",
        "category": "recharge_zone",
        "latitude": 12.9716,
        "longitude": 77.6412,
        "status": "healthy",
        "groundwater_depth_m": 7.2,
        "recharge_potential_pct": 82,
        "annual_rainfall_mm": 856,
        "recommended_structure": "Recharge Pit",
        "estimated_recharge_litres": 42500,
        "soil_type": "Sandy Loam",
        "description": "Dense urban residential sector with modular rooftop desilting pits."
    },
    {
        "id": "zone_03",
        "name": "Central Monitoring Well - CW-09",
        "category": "groundwater",
        "latitude": 12.9550,
        "longitude": 77.6100,
        "status": "moderate",
        "groundwater_depth_m": 14.3,
        "recharge_potential_pct": 64,
        "annual_rainfall_mm": 840,
        "recommended_structure": "Recharge Shaft / Deep Injection",
        "estimated_recharge_litres": 65000,
        "soil_type": "Clay Loam",
        "description": "Moderate aquifer drawdown due to commercial extraction; trending stable."
    },
    {
        "id": "zone_04",
        "name": "Industrial Tech Park Reservoir - Storage Tank A",
        "category": "storage",
        "latitude": 12.9900,
        "longitude": 77.6700,
        "status": "healthy",
        "groundwater_depth_m": 11.2,
        "recharge_potential_pct": 78,
        "annual_rainfall_mm": 860,
        "recommended_structure": "Rainwater Storage Cistern (50kL)",
        "estimated_recharge_litres": 120000,
        "soil_type": "Fissured Rock",
        "description": "Multi-stage rooftop collection with automatic UV filtration."
    },
    {
        "id": "zone_05",
        "name": "South Bellandur Depleted Aquifer Point #03",
        "category": "critical_areas",
        "latitude": 12.9300,
        "longitude": 77.6800,
        "status": "critical",
        "groundwater_depth_m": 26.5,
        "recharge_potential_pct": 41,
        "annual_rainfall_mm": 820,
        "recommended_structure": "Deep Aquifer Recharge Injection Well",
        "estimated_recharge_litres": 32000,
        "soil_type": "Dense Hardpan Clay",
        "description": "Severe aquifer depletion zone with heavy extraction pressure; urgent recharge mandated."
    },
    {
        "id": "zone_06",
        "name": "Hebbal Lake Community Percolation Basin",
        "category": "recharge_zone",
        "latitude": 13.0400,
        "longitude": 77.5900,
        "status": "healthy",
        "groundwater_depth_m": 4.2,
        "recharge_potential_pct": 95,
        "annual_rainfall_mm": 940,
        "recommended_structure": "Percolation Pond & Check Dam",
        "estimated_recharge_litres": 240000,
        "soil_type": "Coarse Alluvium",
        "description": "Public community recharge wetland sustaining surrounding unconfined shallow aquifers."
    }
]

SEED_RAINFALL_SERIES = {
    "daily": [
        {"time": "Mon", "rainfall_mm": 12.4, "harvest_litres": 980},
        {"time": "Tue", "rainfall_mm": 24.8, "harvest_litres": 1950},
        {"time": "Wed", "rainfall_mm": 6.2, "harvest_litres": 490},
        {"time": "Thu", "rainfall_mm": 0.0, "harvest_litres": 0},
        {"time": "Fri", "rainfall_mm": 18.5, "harvest_litres": 1460},
        {"time": "Sat", "rainfall_mm": 42.0, "harvest_litres": 3240},
        {"time": "Sun", "rainfall_mm": 8.1, "harvest_litres": 640}
    ],
    "weekly": [
        {"time": "W1 (Aug)", "rainfall_mm": 28.5, "harvest_litres": 2250},
        {"time": "W2 (Aug)", "rainfall_mm": 64.2, "harvest_litres": 5080},
        {"time": "W3 (Aug)", "rainfall_mm": 112.0, "harvest_litres": 8850},
        {"time": "W4 (Aug)", "rainfall_mm": 42.0, "harvest_litres": 3240}
    ],
    "monthly": [
        {"time": "Jan", "rainfall_mm": 8.0, "harvest_litres": 630},
        {"time": "Feb", "rainfall_mm": 10.5, "harvest_litres": 830},
        {"time": "Mar", "rainfall_mm": 18.0, "harvest_litres": 1420},
        {"time": "Apr", "rainfall_mm": 45.0, "harvest_litres": 3550},
        {"time": "May", "rainfall_mm": 92.0, "harvest_litres": 7250},
        {"time": "Jun", "rainfall_mm": 145.0, "harvest_litres": 11450},
        {"time": "Jul", "rainfall_mm": 210.0, "harvest_litres": 16580},
        {"time": "Aug", "rainfall_mm": 178.0, "harvest_litres": 14050},
        {"time": "Sep", "rainfall_mm": 98.0, "harvest_litres": 7740},
        {"time": "Oct", "rainfall_mm": 35.0, "harvest_litres": 2760},
        {"time": "Nov", "rainfall_mm": 12.0, "harvest_litres": 950},
        {"time": "Dec", "rainfall_mm": 4.5, "harvest_litres": 350}
    ]
}

SEED_GROUNDWATER_TREND = [
    {"year": "2022", "depth_m": 9.8, "status": "Declining"},
    {"year": "2023", "depth_m": 9.2, "status": "Moderate"},
    {"year": "2024", "depth_m": 8.4, "status": "Improving"},
    {"year": "2025", "depth_m": 7.9, "status": "Improving"},
    {"year": "2026", "depth_m": 7.4, "status": "Healthy (Recharge Active)"}
]

async def seed_initial_data():
    """Inserts initial seed data if collections are empty."""
    user = await db_repo.find_one("users", {"email": "demo@aquaregen.com"})
    if not user:
        for u in SEED_USERS:
            await db_repo.insert_one("users", u)
        for p in SEED_PROPERTIES:
            await db_repo.insert_one("properties", p)
        for z in SEED_MAP_ZONES:
            await db_repo.insert_one("map_zones", z)
        print("Initial AquaRegen seed data populated.")
