# Trade Signal Modülü / Devam eden trend içerisinde işlem açaya uygun durumlar için sinyal oluşturur

from datetime import datetime
from typing import List, Tuple, Optional

from data.models import SignalOutput, Direction, ConsistencyResult, Candle


class SignalModule:
    """
    Signal Module: Trend direction and strength
    Output: Direction, Trend Score (1-100), Entry Zones
    """
    
    def __init__(self):
        self.strength_thresholds = {
            "WEAK": (60, 70),
            "MODERATE": (70, 85),
            "STRONG": (85, 100),
        }
    
    def generate(
        self,
        consistency: ConsistencyResult,
        candles: List[Candle],
        strategy: str = "breakout"
    ) -> SignalOutput:
        """Generate trading signal"""
        
        score = consistency.score
        direction = consistency.direction
        
        # Determine strength
        strength = self._calculate_strength(score)
        
        # Calculate entry zones based on strategy
        entry_zones = self._calculate_entry_zones(
            candles, direction, strategy, consistency
        )
        
        # Calculate risk levels
        stop_loss, take_profit = self._calculate_risk_levels(
            candles, direction, entry_zones
        )
        
        return SignalOutput(
            direction=direction,
            trend_score=score,
            strength=strength,
            entry_zones=entry_zones,
            stop_loss=stop_loss,
            take_profit=take_profit,
            timestamp=datetime.utcnow()
        )
    
    def _calculate_strength(self, score: int) -> str:
        """Determine signal strength from score"""
        if score >= self.strength_thresholds["STRONG"][0]:
            return "STRONG"
        elif score >= self.strength_thresholds["MODERATE"][0]:
            return "MODERATE"
        return "WEAK"
    
    def _calculate_entry_zones(
        self,
        candles: List[Candle],
        direction: Direction,
        strategy: str,
        consistency: ConsistencyResult
    ) -> List[Tuple[float, float]]:
        """Calculate optimal entry price zones"""
        
        recent_candles = candles[-20:]
        current_price = candles[-1].close
        
        if strategy == "breakout":
            return self._breakout_zones(recent_candles, direction, current_price)
        elif strategy == "pullback":
            return self._pullback_zones(recent_candles, direction, current_price)
        else:  # continuation
            return self._continuation_zones(recent_candles, direction, current_price)
    
    def _breakout_zones(
        self, 
        candles: List[Candle], 
        direction: Direction,
        current: float
    ) -> List[Tuple[float, float]]:
        """Breakout strategy: Enter above resistance / below support"""
        
        high = max(c.high for c in candles)
        low = min(c.low for c in candles)
        
        if direction == Direction.UP:
            # Enter near breakout level
            entry = high * 0.998
            return [(entry, high * 1.002)]
        else:
            entry = low * 1.002
            return [(low * 0.998, entry)]
    
    def _pullback_zones(
        self,
        candles: List[Candle],
        direction: Direction,
        current: float
    ) -> List[Tuple[float, float]]:
        """Pullback strategy: Enter on retracement"""
        
        # Calculate Fibonacci retracement levels
        high = max(c.high for c in candles)
        low = min(c.low for c in candles)
        range_size = high - low
        
        if direction == Direction.UP:
            # Look for pullback to 38.2% or 50%
            level_382 = high - range_size * 0.382
            level_50 = high - range_size * 0.5
            return [
                (level_50 * 0.995, level_50 * 1.005),
                (level_382 * 0.995, level_382 * 1.005),
            ]
        else:
            level_382 = low + range_size * 0.382
            level_50 = low + range_size * 0.5
            return [
                (level_50 * 0.995, level_50 * 1.005),
                (level_382 * 0.995, level_382 * 1.005),
            ]
    
    def _continuation_zones(
        self,
        candles: List[Candle],
        direction: Direction,
        current: float
    ) -> List[Tuple[float, float]]:
        """Continuation strategy: Enter in direction of trend"""
        
        # Enter near current price with small buffer
        buffer = current * 0.002
        
        if direction == Direction.UP:
            return [(current - buffer, current + buffer * 0.5)]
        else:
            return [(current - buffer * 0.5, current + buffer)]
    
    def _calculate_risk_levels(
        self,
        candles: List[Candle],
        direction: Direction,
        entry_zones: List[Tuple[float, float]]
    ) -> Tuple[Optional[float], Optional[float]]:
        """Calculate stop loss and take profit levels"""
        
        if not entry_zones:
            return None, None
        
        avg_entry = sum(entry_zones[0]) / 2
        atr = self._calculate_atr(candles, 14)
        
        if direction == Direction.UP:
            stop_loss = avg_entry - atr * 2
            take_profit = avg_entry + atr * 3  # 1:1.5 R:R
        else:
            stop_loss = avg_entry + atr * 2
            take_profit = avg_entry - atr * 3
        
        return round(stop_loss, 2), round(take_profit, 2)
    
    def _calculate_atr(self, candles: List[Candle], period: int) -> float:
        """Calculate Average True Range"""
        if len(candles) < period + 1:
            period = len(candles) - 1
        
        true_ranges = []
        for i in range(1, len(candles)):
            c = candles[i]
            p = candles[i-1]
            tr1 = c.high - c.low
            tr2 = abs(c.high - p.close)
            tr3 = abs(c.low - p.close)
            true_ranges.append(max(tr1, tr2, tr3))
        
        return sum(true_ranges[-period:]) / period