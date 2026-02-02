export type Direction = 'UP' | 'DOWN' | 'NEUTRAL';
export type Decision = 'ALLOWED' | 'BLOCKED';
export type Strength = 'WEAK' | 'MODERATE' | 'STRONG';
export type Strategy = 'breakout' | 'pullback' | 'continuation';
export type UserTier = 'free' | 'pro';

export type MarketCondition =
    | 'trending_up'
    | 'trending_down'
    | 'ranging'
    | 'volatile'
    | 'unknown';

export interface IndicatorValue {
    name: string;
    value: number | Record<string, number>;
    signal: -1 | 0 | 1;
    weight: number;
    confidence: number;
}

export interface ConsistencyResult {
    score: number;
    direction: Direction;
    condition: MarketCondition;
    indicator_values: IndicatorValue[];
    timestamp: string;
}

export interface BlockerOutput {
    decision: Decision;
    reason: string;
    consistency_score: number;
    timestamp: string;
}

export interface SignalOutput {
    direction: Direction;
    trend_score: number;
    strength: Strength;
    entry_zones: [number, number][];
    stop_loss: number | null;
    take_profit: number | null;
    timestamp: string;
}

export interface AnalysisRequest {
    symbol: string;
    interval: string;
    strategy: Strategy;
    user_tier: UserTier;
}

export interface AnalysisResponse {
    symbol: string;
    interval: string;
    blocker: BlockerOutput;
    signal: SignalOutput;
    consistency: ConsistencyResult;
    cached: boolean;
    generated_at: string;
}

export interface LogEntry {
    id: string;
    user_id: string;
    symbol: string;
    interval: string;
    strategy: Strategy;
    blocker_decision: Decision;
    signal_direction: Direction;
    signal_score: number;
    consistency_score: number;
    entry_price: number | null;
    exit_price: number | null;
    result: 'SUCCESS' | 'FAILURE' | 'PENDING';
    pnl_percent: number | null;
    timestamp: string;
    validated_at: string | null;
}

export interface UserMetrics {
    total_decisions: number;
    accuracy: number;
    avg_score: number;
    best_interval: string | null;
    interval_breakdown: Record<string, {
        accuracy: number;
        count: number;
    }>;
}