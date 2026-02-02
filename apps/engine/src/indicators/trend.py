import talib
import pandas as pd
import numpy as np

from .base import TrendIndicator
from data.models import Candle, IndicatorValue


class EMAStack(TrendIndicator):
    """
    EMA200 > EMA50 > EMA20 hierarchy
    Bullish: EMA20 > EMA50 > EMA200 (uptrend)
    Bearish: EMA20 < EMA50 < EMA200 (downtrend)
    """
    
    name = "EMA_STACK"
    
    def __init__(self, weight: float = 0.30):
        super().__init__(weight)
        self.ema_fast = 20
        self.ema_medium = 50
        self.ema_slow = 200
    
    def calculate(self, candles: list[Candle]) -> IndicatorValue:
        if len(candles) < self.ema_slow:
            raise ValueError(f"Need at least {self.ema_slow} candles")
        
        df = self._to_dataframe(candles)
        close = df['close'].values
        
        ema20 = float(talib.EMA(close, timeperiod=self.ema_fast)[-1])
        ema50 = float(talib.EMA(close, timeperiod=self.ema_medium)[-1])
        ema200 = float(talib.EMA(close, timeperiod=self.ema_slow)[-1])
        
        # Determine signal
        if ema20 > ema50 > ema200:
            signal = 1  # Strong uptrend
            confidence = min(1.0, (ema20 - ema200) / ema200 * 10)
        elif ema20 < ema50 < ema200:
            signal = -1  # Strong downtrend
            confidence = min(1.0, (ema200 - ema20) / ema200 * 10)
        else:
            signal = 0  # Mixed/confused
            confidence = 0.3
        
        return IndicatorValue(
            name=self.name,
            value={"ema20": ema20, "ema50": ema50, "ema200": ema200},
            signal=signal,  # type: ignore
            weight=self.weight,
            confidence=round(confidence, 2)
        )