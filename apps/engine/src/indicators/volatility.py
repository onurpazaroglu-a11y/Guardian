import talib
import numpy as np

from .base import VolatilityIndicator
from data.models import Candle, IndicatorValue


class BollingerKeltnerCombo(VolatilityIndicator):
    """
    Combined Bollinger Bands and Keltner Channels
    Squeeze detection: Bollinger inside Keltner = low volatility, potential breakout
    """
    
    name = "VOLATILITY"
    
    def __init__(self, weight: float = 0.15):
        super().__init__(weight)
        self.bb_period = 20
        self.bb_dev = 2
        self.kc_period = 20
        self.kc_atr = 1.5
    
    def calculate(self, candles: list[Candle]) -> IndicatorValue:
        if len(candles) < self.bb_period:
            raise ValueError("Insufficient data")
        
        df = self._to_dataframe(candles)
        close = df['close'].values
        high = df['high'].values
        low = df['low'].values
        
        # Bollinger Bands
        upper_bb, middle_bb, lower_bb = talib.BBANDS(
            close, 
            timeperiod=self.bb_period,
            nbdevup=self.bb_dev,
            nbdevdn=self.bb_dev
        )
        
        # ATR for Keltner
        atr = talib.ATR(high, low, close, timeperiod=self.kc_period)
        
        # Keltner Channels (manual calculation)
        typical_price = (high + low + close) / 3
        upper_kc = typical_price + self.kc_atr * atr
        lower_kc = typical_price - self.kc_atr * atr
        
        # Current values
        curr_close = close[-1]
        bb_width = (upper_bb[-1] - lower_bb[-1]) / middle_bb[-1]
        
        # Squeeze detection
        squeeze = bool(upper_bb[-1] < upper_kc[-1] and lower_bb[-1] > lower_kc[-1])
        
        # Position within bands
        bb_position = (curr_close - lower_bb[-1]) / (upper_bb[-1] - lower_bb[-1])
        
        # Signal logic
        if squeeze:
            # Prepare for breakout
            signal = 0  # Neutral, waiting for breakout
            confidence = 0.6
        elif bb_position > 0.8:
            signal = -1  # Near upper band, potential reversal
            confidence = bb_position
        elif bb_position < 0.2:
            signal = 1  # Near lower band, potential reversal
            confidence = 1 - bb_position
        else:
            signal = 0
            confidence = 0.5
        
        return IndicatorValue(
            name=self.name,
            value={
                "bb_position": round(bb_position, 3),
                "bb_width": round(bb_width, 4),
                "squeeze": squeeze,
                "atr": round(atr[-1], 2)
            },
            signal=signal,  # type: ignore
            weight=self.weight,
            confidence=round(confidence, 2)
        )