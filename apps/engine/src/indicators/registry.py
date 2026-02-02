from typing import Type, Optional
from .base import Indicator
from .trend import EMAStack
from .momentum import MACDIndicator, RSIIndicator
from .volatility import BollingerKeltnerCombo
from .pattern import ZigZagFractal


class IndicatorRegistry:
    """Factory and registry for indicators"""
    
    _indicators: dict[str, Type[Indicator]] = {
        "ema_stack": EMAStack,
        "macd": MACDIndicator,
        "rsi": RSIIndicator,
        "volatility": BollingerKeltnerCombo,
        "pattern": ZigZagFractal,
    }
    
    @classmethod
    def get(cls, name: str, weight: Optional[float] = None) -> Indicator:
        if name not in cls._indicators:
            raise ValueError(f"Unknown indicator: {name}")
        
        indicator_class = cls._indicators[name]
        if weight is not None:
            return indicator_class(weight=weight)
        return indicator_class()
    
    @classmethod
    def get_default_set(cls) -> list[Indicator]:
        """Return default indicator set for Engine v1"""
        return [
            EMAStack(weight=0.30),
            MACDIndicator(weight=0.20),
            RSIIndicator(weight=0.15),
            BollingerKeltnerCombo(weight=0.15),
            ZigZagFractal(weight=0.20),
        ]
    
    @classmethod
    def list_available(cls) -> list[str]:
        return list(cls._indicators.keys())