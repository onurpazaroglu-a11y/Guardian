# /analyze, /signal

from fastapi import APIRouter, Depends, HTTPException
from typing import Literal

from data.models import AnalysisRequest, AnalysisResponse
from api.middleware.auth import verify_token

router = APIRouter()


@router.get("/indicators")
async def list_indicators():
    """List available technical indicators"""
    from indicators.registry import IndicatorRegistry
    
    return {
        "indicators": IndicatorRegistry.list_available(),
        "default_weights": {
            "ema_stack": 0.30,
            "macd": 0.20,
            "rsi": 0.15,
            "volatility": 0.15,
            "pattern": 0.20,
        }
    }


@router.get("/intervals")
async def list_intervals(
    tier: Literal["free", "pro"] = "free"
):
    """List available intervals for tier"""
    from core.config import settings
    
    if tier == "free":
        return {"intervals": settings.FREE_INTERVALS, "delayed": True}
    return {"intervals": settings.PRO_INTERVALS, "delayed": False}