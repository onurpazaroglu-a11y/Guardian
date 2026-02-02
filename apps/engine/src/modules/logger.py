# Logger Modülü / Loglama işlemleri için modül

from datetime import datetime
from typing import List, Optional, Literal
from dataclasses import dataclass

from data.models import LogEntry, Decision, Direction


class LoggerModule:
    """
    Logger Module: Track decision accuracy over time
    Stores and analyzes historical performance
    """
    
    def __init__(self, db_client=None):
        self.db = db_client
        self._buffer: List[LogEntry] = []
    
    def log_decision(self, entry: LogEntry) -> None:
        """Log a new trading decision"""
        self._buffer.append(entry)
        
        # Flush to DB if buffer is large
        if len(self._buffer) >= 100:
            self._flush()
    
    def validate_outcome(
        self,
        log_id: str,
        exit_price: float,
        result: Literal["SUCCESS", "FAILURE"],
        pnl_percent: Optional[float] = None
    ) -> None:
        """Update log entry with outcome (called by user or system)"""
        # Implementation depends on DB
        pass
    
    def get_metrics(
        self,
        user_id: str,
        symbol: Optional[str] = None,
        interval: Optional[str] = None,
        lookback_days: int = 30
    ) -> dict:
        """Calculate performance metrics for user"""
        
        # Query logs from DB
        logs = self._query_logs(user_id, symbol, interval, lookback_days)
        
        if not logs:
            return {
                "total_decisions": 0,
                "accuracy": 0.0,
                "avg_score": 0.0,
                "best_interval": None,
            }
        
        # Calculate metrics
        total = len(logs)
        successful = sum(1 for l in logs if l.result == "SUCCESS")
        accuracy = successful / total if total > 0 else 0
        
        avg_score = sum(l.consistency_score for l in logs) / total
        
        # Find best interval
        interval_performance = {}
        for log in logs:
            key = log.interval
            if key not in interval_performance:
                interval_performance[key] = {"success": 0, "total": 0}
            interval_performance[key]["total"] += 1
            if log.result == "SUCCESS":
                interval_performance[key]["success"] += 1
        
        best_interval = max(
            interval_performance.items(),
            key=lambda x: x[1]["success"] / x[1]["total"] if x[1]["total"] > 0 else 0
        )[0] if interval_performance else None
        
        return {
            "total_decisions": total,
            "accuracy": round(accuracy * 100, 2),
            "avg_score": round(avg_score, 2),
            "best_interval": best_interval,
            "interval_breakdown": {
                k: {
                    "accuracy": round(v["success"] / v["total"] * 100, 2),
                    "count": v["total"]
                }
                for k, v in interval_performance.items()
            }
        }
    
    def _flush(self) -> None:
        """Write buffer to database"""
        # DB implementation
        self._buffer.clear()
    
    def _query_logs(
        self,
        user_id: str,
        symbol: Optional[str],
        interval: Optional[str],
        days: int
    ) -> List[LogEntry]:
        """Query logs from database"""
        # DB implementation
        return []