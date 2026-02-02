# Trade Blocker Modülü / İşleme izin veren ya da engelleyen kuralları yöneten modül

from datetime import datetime
from typing import Optional

from data.models import BlockerOutput, Decision, ConsistencyResult


class BlockerModule:
    """
    Blocker Module: Trade permission system
    Output: ALLOWED / BLOCKED
    """
    
    def __init__(self, threshold: int = 60):
        self.threshold = threshold
    
    def evaluate(self, consistency: ConsistencyResult) -> BlockerOutput:
        """
        Evaluate if trading is allowed based on consistency score
        
        Rules:
        - Score >= threshold: ALLOWED
        - Score < threshold: BLOCKED (insufficient alignment)
        - Score 40-60: BLOCKED (neutral zone, no clear direction)
        """
        score = consistency.score
        
        # Neutral zone block
        if 40 <= score <= 60:
            return BlockerOutput(
                decision=Decision.BLOCKED,
                reason=f"Neutral zone (score: {score}). No clear trend direction.",
                consistency_score=score,
                timestamp=datetime.utcnow()
            )
        
        # Low confidence block
        if score < self.threshold:
            return BlockerOutput(
                decision=Decision.BLOCKED,
                reason=f"Low consistency score ({score}). Minimum required: {self.threshold}",
                consistency_score=score,
                timestamp=datetime.utcnow()
            )
        
        # Check indicator confidence
        low_confidence_count = sum(
            1 for iv in consistency.indicator_values 
            if iv.confidence < 0.5
        )
        
        if low_confidence_count >= 2:
            return BlockerOutput(
                decision=Decision.BLOCKED,
                reason=f"Multiple low-confidence indicators ({low_confidence_count})",
                consistency_score=score,
                timestamp=datetime.utcnow()
            )
        
        return BlockerOutput(
            decision=Decision.ALLOWED,
            reason=f"Strong alignment (score: {score}). Direction: {consistency.direction.value}",
            consistency_score=score,
            timestamp=datetime.utcnow()
        )