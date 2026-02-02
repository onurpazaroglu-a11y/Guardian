# Bundle orchestrator

from typing import Optional, Literal
from datetime import datetime

from core.config import settings
from core.exceptions import SubscriptionError, InsufficientDataError
from data.models import (
    AnalysisRequest, 
    AnalysisResponse,
    Candle,
    LogEntry
)
from data.fetcher import BinanceFetcher
from indicators.registry import IndicatorRegistry
from scoring.consistency import ConsistencyScorer
from scoring.weights import WeightManager
from .blocker import BlockerModule
from .signal import SignalModule
from .logger import LoggerModule


class Bundle:
    """
    Bundle Module: Orchestrates Blocker + Signal + Logger
    Required package - cannot use modules separately
    """
    
    def __init__(
        self,
        fetcher: Optional[BinanceFetcher] = None,
        weight_manager: Optional[WeightManager] = None,
        logger: Optional[LoggerModule] = None
    ):
        self.fetcher = fetcher or BinanceFetcher()
        self.weight_manager = weight_manager or WeightManager()
        self.logger = logger or LoggerModule()
        
        self.blocker = BlockerModule(threshold=settings.BLOCKER_THRESHOLD)
        self.signal = SignalModule()
        
        self._scorer_cache: dict[str, ConsistencyScorer] = {}
    
    async def analyze(self, request: AnalysisRequest) -> AnalysisResponse:
        """
        Main analysis pipeline
        1. Validate tier access
        2. Fetch data
        3. Calculate indicators
        4. Score consistency
        5. Generate Blocker + Signal
        6. Log decision
        """
        
        # 1. Validate tier access
        self._validate_tier(request)
        
        # 2. Fetch candles
        candles = await self._fetch_data(request)
        
        # 3. Setup scorer with user weights
        scorer = self._get_scorer(request)
        
        # 4. Calculate consistency
        try:
            consistency = scorer.calculate(candles)
        except Exception as e:
            raise InsufficientDataError(f"Could not calculate indicators: {e}")
        
        # 5. Generate Blocker output
        blocker_output = self.blocker.evaluate(consistency)
        
        # 6. Generate Signal output (even if blocked, for logging)
        signal_output = self.signal.generate(
            consistency, 
            candles, 
            request.strategy
        )
        
        # 7. Log the decision
        log_entry = LogEntry(
            user_id="anonymous",  # From auth context
            symbol=request.symbol,
            interval=request.interval,
            strategy=request.strategy,
            blocker_decision=blocker_output.decision,
            signal_direction=signal_output.direction,
            signal_score=signal_output.trend_score,
            consistency_score=consistency.score,
            timestamp=datetime.utcnow()
        )
        self.logger.log_decision(log_entry)
        
        return AnalysisResponse(
            symbol=request.symbol,
            interval=request.interval,
            blocker=blocker_output,
            signal=signal_output,
            consistency=consistency,
            cached=False,
            generated_at=datetime.utcnow()
        )
    
    def _validate_tier(self, request: AnalysisRequest) -> None:
        """Check if user tier allows requested interval"""
        if request.user_tier == "free":
            if request.interval not in settings.FREE_INTERVALS:
                raise SubscriptionError(
                    f"Interval '{request.interval}' requires Pro subscription. "
                    f"Free tier: {settings.FREE_INTERVALS}"
                )
        
        # Temporary: Allow 1m for testing if it's mock market
        if settings.MOCK_MARKET_URL and request.interval == "1m":
            return
    
    async def _fetch_data(self, request: AnalysisRequest) -> list[Candle]:
        """Fetch candle data from exchange"""
        # Add delay for free tier
        delay = 1 if request.user_tier == "free" else 0
        
        candles = await self.fetcher.get_candles(
            symbol=request.symbol,
            interval=request.interval,
            limit=100,  # Adjusted to 100 as requested
            delay_candles=delay
        )
        
        if len(candles) < 100:
            raise InsufficientDataError(
                f"Need at least 100 candles, got {len(candles)}"
            )
        
        return candles
    
    def _get_scorer(self, request: AnalysisRequest) -> ConsistencyScorer:
        """Get or create consistency scorer for user"""
        cache_key = f"{request.user_tier}_{request.strategy}"
        
        if cache_key not in self._scorer_cache:
            weights = self.weight_manager.get_weights()
            indicators = IndicatorRegistry.get_default_set()
            self._scorer_cache[cache_key] = ConsistencyScorer(indicators)
        
        return self._scorer_cache[cache_key]
    
    async def get_user_metrics(
        self,
        user_id: str,
        symbol: Optional[str] = None,
        days: int = 30
    ) -> dict:
        """Get performance metrics for user"""
        return self.logger.get_metrics(user_id, symbol, days=days)

    async def close(self):
        """Cleanup resources"""
        await self.fetcher.close()