import talib
import numpy as np

from .base import PatternIndicator
from data.models import Candle, IndicatorValue


class ZigZagFractal(PatternIndicator):
    """
    ZigZag pivots + Fractal pattern detection
    Identifies swing highs/lows and breakout/continuation patterns
    """
    
    name = "PATTERN"
    
    def __init__(self, weight: float = 0.20):
        super().__init__(weight)
        self.zigzag_deviation = 5  # Percentage
        self.fractal_window = 5
    
    def calculate(self, candles: list[Candle]) -> IndicatorValue:
        if len(candles) < self.fractal_window * 2:
            raise ValueError("Insufficient data for pattern detection")
        
        df = self._to_dataframe(candles)
        high = df['high'].values
        low = df['low'].values
        close = df['close'].values
        
        # Find fractals
        last_idx = len(close) - 1
        window = self.fractal_window // 2
        
        # Bullish fractal: low lower than 2 bars each side
        bullish_fractal = all(
            low[last_idx - window] < low[last_idx - window - i]
            for i in range(1, window + 1)
        ) and all(
            low[last_idx - window] < low[last_idx - window + i]
            for i in range(1, window + 1)
        )
        
        # Bearish fractal: high higher than 2 bars each side
        bearish_fractal = all(
            high[last_idx - window] > high[last_idx - window - i]
            for i in range(1, window + 1)
        ) and all(
            high[last_idx - window] > high[last_idx - window + i]
            for i in range(1, window + 1)
        )
        
        # Simple ZigZag approximation using recent swing
        recent_high = max(high[-20:])
        recent_low = min(low[-20:])
        current = close[-1]
        
        # Distance from recent extremes
        from_high = (recent_high - current) / recent_high
        from_low = (current - recent_low) / recent_low
        
        if bullish_fractal and from_low < 0.02:
            signal = 1  # Bullish reversal at support
            confidence = 0.8
        elif bearish_fractal and from_high < 0.02:
            signal = -1  # Bearish reversal at resistance
            confidence = 0.8
        elif current > recent_high * 0.99:
            signal = 1  # Breakout continuation
            confidence = 0.7
        elif current < recent_low * 1.01:
            signal = -1  # Breakdown continuation
            confidence = 0.7
        else:
            signal = 0
            confidence = 0.4
        
        return IndicatorValue(
            name=self.name,
            value={
                "bullish_fractal": bullish_fractal,
                "bearish_fractal": bearish_fractal,
                "recent_high": float(recent_high),
                "recent_low": float(recent_low),
                "from_high_percent": round(float(from_high) * 100, 2),
                "from_low_percent": round(float(from_low) * 100, 2)
            },
            signal=signal,  # type: ignore
            weight=self.weight,
            confidence=round(confidence, 2)
        )