# Pydantic modeller.

from pydantic import BaseModel, Field
from datetime import datetime
from typing import Literal, Optional
from enum import Enum


class Direction(str, Enum):
    UP = "UP"
    DOWN = "DOWN"
    NEUTRAL = "NEUTRAL"


class Decision(str, Enum):
    ALLOWED = "ALLOWED"
    BLOCKED = "BLOCKED"


class MarketCondition(str, Enum):
    TRENDING_UP = "trending_up"
    TRENDING_DOWN = "trending_down"
    RANGING = "ranging"
    VOLATILE = "volatile"
    UNKNOWN = "unknown"


class Candle(BaseModel):
    timestamp: datetime
    open: float
    high: float
    low: float
    close: float
    volume: float
    
    class Config:
        frozen = True


class IndicatorValue(BaseModel):
    name: str
    value: float | dict
    signal: Literal[-1, 0, 1]  # -1: bearish, 0: neutral, 1: bullish
    weight: float = 1.0
    confidence: float = Field(ge=0.0, le=1.0)


class ConsistencyResult(BaseModel):
    score: int = Field(ge=0, le=100)
    direction: Direction
    condition: MarketCondition
    indicator_values: list[IndicatorValue]
    timestamp: datetime
    
    @property
    def is_blocked(self) -> bool:
        from core.config import settings
        return self.score < settings.BLOCKER_THRESHOLD


class BlockerOutput(BaseModel):
    decision: Decision
    reason: str
    consistency_score: int
    timestamp: datetime


class SignalOutput(BaseModel):
    direction: Direction
    trend_score: int = Field(ge=0, le=100)
    strength: Literal["WEAK", "MODERATE", "STRONG"]
    entry_zones: list[tuple[float, float]]  # (min, max) price zones
    stop_loss: Optional[float] = None
    take_profit: Optional[float] = None
    timestamp: datetime


class LogEntry(BaseModel):
    user_id: str
    symbol: str
    interval: str
    strategy: str
    blocker_decision: Decision
    signal_direction: Direction
    signal_score: int
    consistency_score: int
    entry_price: Optional[float] = None
    exit_price: Optional[float] = None
    result: Optional[Literal["SUCCESS", "FAILURE", "PENDING"]] = "PENDING"
    pnl_percent: Optional[float] = None
    timestamp: datetime
    validated_at: Optional[datetime] = None


class AnalysisRequest(BaseModel):
    symbol: str = Field(default="BTCUSDT", pattern=r"^[a-zA-Z0-9_]{3,20}$")
    interval: str = Field(default="1h")
    strategy: Literal["breakout", "pullback", "continuation"] = "breakout"
    user_tier: Literal["free", "pro"] = "free"


class AnalysisResponse(BaseModel):
    symbol: str
    interval: str
    blocker: BlockerOutput
    signal: SignalOutput
    consistency: ConsistencyResult
    cached: bool = False
    generated_at: datetime