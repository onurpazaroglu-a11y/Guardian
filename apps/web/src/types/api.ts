import { UserTier } from './engine';

export interface User {
    id: string;
    email: string;
    tier: UserTier;
    created_at: string;
    api_keys?: {
        binance_api_key?: string;
        binance_secret?: string;
    };
}

export interface Subscription {
    id: string;
    user_id: string;
    tier: UserTier;
    status: 'active' | 'cancelled' | 'past_due';
    current_period_start: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
}

export interface ApiResponse<T> {
    data: T;
    error: null;
}

export interface ApiError {
    data: null;
    error: {
        code: string;
        message: string;
    };
}