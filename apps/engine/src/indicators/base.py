from abc import ABC, abstractmethod
from typing import Protocol
import pandas as pd
import numpy as np

from data.models import Candle, IndicatorValue


class Indicator(ABC):
    """Base class for all indicators"""
    
    name: str
    weight: float = 1.0
    
    def __init__(self, weight: float = 1.0):
        self.weight = weight
    
    @abstractmethod
    def calculate(self, candles: list[Candle]) -> IndicatorValue:
        """Calculate indicator value from candle data"""
        pass
    
    def _to_dataframe(self, candles: list[Candle]) -> pd.DataFrame:
        """Convert candles to pandas DataFrame"""
        data = {
            'open': [c.open for c in candles],
            'high': [c.high for c in candles],
            'low': [c.low for c in candles],
            'close': [c.close for c in candles],
            'volume': [c.volume for c in candles],
        }
        df = pd.DataFrame(data)
        df.index = pd.to_datetime([c.timestamp for c in candles])
        return df


class TrendIndicator(Indicator):
    """Base for trend indicators"""
    pass


class MomentumIndicator(Indicator):
    """Base for momentum indicators"""
    pass


class VolatilityIndicator(Indicator):
    """Base for volatility indicators"""
    pass


class PatternIndicator(Indicator):
    """Base for pattern indicators"""
    pass