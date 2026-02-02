import talib
import numpy as np

from .base import MomentumIndicator
from data.models import Candle, IndicatorValue


class MACDIndicator(MomentumIndicator):
    """
    MACD with histogram and line relationship
    Bullish: MACD line > Signal line, histogram increasing
    Bearish: MACD line < Signal line, histogram decreasing
    """
    
    name = "MACD"
    
    def __init__(self, weight: float = 0.20):
        super().__init__(weight)
        self.fast = 12
        self.slow = 26
        self.signal = 9
    
    def calculate(self, candles: list[Candle]) -> IndicatorValue:
        if len(candles) < self.slow + self.signal:
            raise ValueError("Insufficient data for MACD")
        
        close = [c.close for c in candles]
        
        macd, signal_line, hist = talib.MACD(
            close, 
            fastperiod=self.fast,
            slowperiod=self.slow,
            signalperiod=self.signal
        )
        
        # Get last values
        macd_curr = macd[-1]
        macd_prev = macd[-2]
        signal_curr = signal_line[-1]
        hist_curr = hist[-1]
        hist_prev = hist[-2]
        
        # Determine signal
        if macd_curr > signal_curr and hist_curr > hist_prev:
            signal = 1
            confidence = min(1.0, abs(hist_curr) / abs(close[-1]) * 100)
        elif macd_curr < signal_curr and hist_curr < hist_prev:
            signal = -1
            confidence = min(1.0, abs(hist_curr) / abs(close[-1]) * 100)
        else:
            signal = 0
            confidence = 0.4
        
        return IndicatorValue(
            name=self.name,
            value={
                "macd": macd_curr,
                "signal": signal_curr,
                "histogram": hist_curr,
                "trend": "increasing" if hist_curr > hist_prev else "decreasing"
            },
            signal=signal,  # type: ignore
            weight=self.weight,
            confidence=round(confidence, 2)
        )


class RSIIndicator(MomentumIndicator):
    """
    RSI for risk areas
    Overbought (>70): Potential reversal down
    Oversold (<30): Potential reversal up
    """
    
    name = "RSI"
    
    def __init__(self, weight: float = 0.15):
        super().__init__(weight)
        self.period = 14
        self.overbought = 70
        self.oversold = 30
    
    def calculate(self, candles: list[Candle]) -> IndicatorValue:
        if len(candles) < self.period:
            raise ValueError("Insufficient data for RSI")
        
        close = [c.close for c in candles]
        rsi = talib.RSI(close, timeperiod=self.period)[-1]
        
        # RSI is contrarian for extreme values
        if rsi > self.overbought:
            signal = -1  # Overbought, expect reversal down
            confidence = min(1.0, (rsi - self.overbought) / 30)
        elif rsi < self.oversold:
            signal = 1  # Oversold, expect reversal up
            confidence = min(1.0, (self.oversold - rsi) / 30)
        else:
            # Neutral zone - follow trend
            signal = 0
            confidence = 0.5
        
        return IndicatorValue(
            name=self.name,
            value={"rsi": rsi, "zone": self._get_zone(rsi)},
            signal=signal,  # type: ignore
            weight=self.weight,
            confidence=round(confidence, 2)
        )
    
    def _get_zone(self, rsi: float) -> str:
        if rsi > 70:
            return "overbought"
        elif rsi < 30:
            return "oversold"
        return "neutral"