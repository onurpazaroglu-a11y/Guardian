from typing import Optional
from pydantic_settings import BaseSettings
from pydantic import Field
from enum import Enum


class Environment(str, Enum):
    DEV = "development"
    STAGING = "staging"
    PROD = "production"


class Interval(str, Enum):
    # Pro intervals
    SECONDS_15 = "15s"
    MINUTE_1 = "1m"
    MINUTES_5 = "5m"
    MINUTES_15 = "15m"
    MINUTES_30 = "30m"
    HOUR_1 = "1h"
    # Free intervals
    HOURS_4 = "4h"
    DAY_1 = "1d"


class Settings(BaseSettings):
    # App
    ENV: Environment = Environment.DEV
    DEBUG: bool = Field(default=False)
    
    # API
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    WORKERS: int = 1
    
    # Security
    JWT_SECRET: str = Field(default="dev-secret-change-in-prod")
    JWT_ALGORITHM: str = "HS256"
    API_KEY_HEADER: str = "X-API-Key"
    
    # Binance
    BINANCE_API_KEY: str = Field(default="")
    BINANCE_SECRET: str = Field(default="")
    BINANCE_TESTNET: bool = Field(default=True)
    
    # Supabase
    SUPABASE_URL: str = Field(default="")
    SUPABASE_KEY: str = Field(default="")
    
    # Redis (cache)
    REDIS_URL: str = Field(default="redis://localhost:6379/0")
    CACHE_TTL_SECONDS: int = 60
    
    # Engine
    DEFAULT_SYMBOL: str = "BTCUSDT"
    DEFAULT_MARKET: str = "futures"
    
    # Mock Market
    MOCK_MARKET_URL: Optional[str] = Field(default=None)
    
    # Free/Pro tier limits
    FREE_INTERVALS: list[str] = ["4h", "1d"]
    PRO_INTERVALS: list[str] = ["15s", "1m", "5m", "15m", "30m", "1h", "4h", "1d"]
    
    # Scoring thresholds
    BLOCKER_THRESHOLD: int = 60  # Consistency Score < 60 = Blocked
    MIN_CONFIDENCE: int = 40
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()