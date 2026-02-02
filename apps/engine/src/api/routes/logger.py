from fastapi import APIRouter, Depends
from typing import Optional
from api.middleware.auth import verify_token

router = APIRouter()

@router.get("/metrics")
async def get_metrics(
    symbol: Optional[str] = None,
    days: int = 30,
    user=Depends(verify_token)
):
    """Get performance metrics for the authenticated user"""
    # Import here to avoid circular dependencies
    from api.server import bundle
    
    if not bundle:
        return {"error": "Engine not initialized"}
        
    return await bundle.get_user_metrics(
        user_id=user["sub"],
        symbol=symbol,
        days=days
    )

@router.get("/logs")
async def get_logs(
    limit: int = 100,
    user=Depends(verify_token)
):
    """Get recent logs for the user"""
    # This would typically fetch from a DB or LoggerModule
    return {"logs": [], "message": "Log retrieval not fully implemented yet"}