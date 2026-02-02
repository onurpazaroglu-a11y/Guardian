# FastAPI app

from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from core.exceptions import GuardianException
from data.models import AnalysisRequest, AnalysisResponse
from modules.bundle import Bundle
from .middleware.auth import verify_token
from .routes import health, engine, logger as logger_routes


# Global bundle instance
bundle: Bundle | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    global bundle
    bundle = Bundle()
    yield
    # Cleanup
    if bundle:
        await bundle.close()
    bundle = None


app = FastAPI(
    title="Guardian Engine",
    description="Trading decision support system",
    version="0.1.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://guardian.vercel.app", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handler
@app.exception_handler(GuardianException)
async def guardian_exception_handler(request, exc):
    raise HTTPException(status_code=400, detail=str(exc))


# Include routers
app.include_router(health.router, tags=["Health"])
app.include_router(engine.router, prefix="/api/v1", tags=["Engine"])
app.include_router(logger_routes.router, prefix="/api/v1", tags=["Logger"])


@app.post("/api/v1/analyze", response_model=AnalysisResponse)
async def analyze(
    request: AnalysisRequest,
    user=Depends(verify_token)
):
    """Main analysis endpoint"""
    if not bundle:
        raise HTTPException(status_code=503, detail="Engine not initialized")
    
    # Add user context
    if isinstance(user, dict):
        request.user_tier = user.get("tier", "pro") # Default to pro for testing
    else:
        request.user_tier = "pro"
    
    return await bundle.analyze(request)


@app.get("/api/v1/metrics")
async def get_metrics(
    symbol: str | None = None,
    days: int = 30,
    user=Depends(verify_token)
):
    """Get user performance metrics"""
    if not bundle:
        raise HTTPException(status_code=503, detail="Engine not initialized")
    
    return await bundle.get_user_metrics(
        user_id=user["sub"],
        symbol=symbol,
        days=days
    )