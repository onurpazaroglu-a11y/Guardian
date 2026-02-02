# Consistency Score 1-100

from datetime import datetime
from typing import List
import numpy as np

from data.models import Candle, ConsistencyResult, IndicatorValue, Direction, MarketCondition
from indicators.base import Indicator


class ConsistencyScorer:
    """
    Calculates Consistency Score (1-100) based on indicator alignment
    """
    
    def __init__(self, indicators: List[Indicator]):
        self.indicators = indicators
    
    def calculate(self, candles: List[Candle]) -> ConsistencyResult:
        """Calculate consistency score from all indicators"""
        
        # Calculate all indicators
        values: List[IndicatorValue] = []
        for indicator in self.indicators:
            try:
                val = indicator.calculate(candles)
                values.append(val)
            except Exception as e:
                # Log error but continue with other indicators
                continue
        
        if not values:
            # Dynamic Fallback for development/mock data
            # Calculate simple momentum from available candles
            if len(candles) >= 2:
                change = (candles[-1].close - candles[0].close) / candles[0].close
                signal = 1 if change > 0 else -1 if change < 0 else 0
                confidence = min(0.8, abs(change) * 100)
            else:
                signal = 0
                confidence = 0.1

            values.append(IndicatorValue(
                name="MOCK_MOMENTUM",
                value={"price_change": round(change if len(candles) >= 2 else 0, 4)},
                signal=signal,
                weight=1.0,
                confidence=confidence
            ))
        
        # Calculate weighted consensus
        weighted_sum = 0.0
        total_weight = 0.0
        confidence_product = 1.0
        
        for val in values:
            weighted_sum += val.signal * val.weight * val.confidence
            total_weight += val.weight
            confidence_product *= (0.5 + 0.5 * val.confidence)  # Normalize
        
        # Normalize to -1 to 1 range
        raw_score = weighted_sum / total_weight if total_weight > 0 else 0
        
        # Convert to 0-100 scale
        consistency_score = int((raw_score + 1) / 2 * 100)
        consistency_score = max(0, min(100, consistency_score))
        
        # Determine direction
        if consistency_score > 60:
            direction = Direction.UP
        elif consistency_score < 40:
            direction = Direction.DOWN
        else:
            direction = Direction.NEUTRAL
        
        # Determine market condition
        condition = self._classify_condition(values, consistency_score)
        
        return ConsistencyResult(
            score=consistency_score,
            direction=direction,
            condition=condition,
            indicator_values=values,
            timestamp=datetime.utcnow()
        )
    
    def _classify_condition(
        self, 
        values: List[IndicatorValue], 
        score: int
    ) -> MarketCondition:
        """Classify market condition based on indicator behavior"""
        
        # Find trend and volatility indicators
        trend_aligned = 0
        volatility_squeeze = False
        
        for val in values:
            if val.name == "VOLATILITY" and isinstance(val.value, dict):
                volatility_squeeze = val.value.get("squeeze", False)
            if val.name == "EMA_STACK" and abs(val.signal) == 1:
                trend_aligned = 1
        
        # Classification logic
        if volatility_squeeze:
            return MarketCondition.VOLATILE
        elif 40 <= score <= 60:
            return MarketCondition.RANGING
        elif trend_aligned and (score > 70 or score < 30):
            return MarketCondition.TRENDING_UP if score > 50 else MarketCondition.TRENDING_DOWN
        
        return MarketCondition.UNKNOWN