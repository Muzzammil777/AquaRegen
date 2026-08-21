from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.api.api import api_router
from app.db.repository import db_repo
from app.db.seed_data import seed_initial_data
import time

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AquaRegen — Smart Rainwater Harvesting & Groundwater Recharge Decision-Support Platform",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    print("Starting AquaRegen API server...")
    await db_repo.initialize()
    await seed_initial_data()
    print("AquaRegen ready to serve climate-tech decision support!")

@app.get("/")
async def root():
    return {
        "app": "AquaRegen API",
        "tagline": "Turn Rainfall Into Water Security.",
        "version": settings.VERSION,
        "status": "online",
        "docs": "/docs",
        "timestamp": time.time()
    }

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "database": "mongodb" if db_repo.is_mongo else "local_json_store",
        "ai_active": bool(settings.GROQ_API_KEY or settings.OPENAI_API_KEY)
    }

# Include all API v1 endpoints
app.include_router(api_router, prefix=settings.API_V1_STR)

# Global exception fallback
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"Unhandled Exception on {request.url}: {exc}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal Server Error", "message": str(exc)}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
