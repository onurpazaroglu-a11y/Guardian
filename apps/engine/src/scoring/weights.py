#Ağırlık Yönetimi

from dataclasses import dataclass
from typing import Dict, Optional


@dataclass
class IndicatorWeights:
    """Configurable weights for indicators"""
    ema_stack: float = 0.30
    macd: float = 0.20
    rsi: float = 0.15
    volatility: float = 0.15
    pattern: float = 0.20
    
    def to_dict(self) -> Dict[str, float]:
        return {
            "ema_stack": self.ema_stack,
            "macd": self.macd,
            "rsi": self.rsi,
            "volatility": self.volatility,
            "pattern": self.pattern,
        }
    
    @classmethod
    def from_dict(cls, data: Dict[str, float]) -> "IndicatorWeights":
        return cls(**data)
    
    def validate(self) -> bool:
        """Ensure weights sum to 1.0 (with small tolerance)"""
        total = sum(self.to_dict().values())
        return 0.99 <= total <= 1.01


class WeightManager:
    """Manage indicator weights per user/strategy"""
    
    DEFAULT_WEIGHTS = IndicatorWeights()
    
    def __init__(self):
        self._user_weights: Dict[str, IndicatorWeights] = {}
    
    def get_weights(self, user_id: Optional[str] = None) -> IndicatorWeights:
        """Get weights for user, or default"""
        if user_id and user_id in self._user_weights:
            return self._user_weights[user_id]
        return self.DEFAULT_WEIGHTS
    
    def set_weights(self, user_id: str, weights: IndicatorWeights) -> None:
        """Set custom weights for user"""
        if not weights.validate():
            raise ValueError("Weights must sum to 1.0")
        self._user_weights[user_id] = weights
    
    def reset_weights(self, user_id: str) -> None:
        """Reset to default weights"""
        if user_id in self._user_weights:
            del self._user_weights[user_id]