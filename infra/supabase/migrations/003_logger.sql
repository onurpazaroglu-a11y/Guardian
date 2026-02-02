-- Logger schema for trading decisions

CREATE TABLE IF NOT EXISTS public.trading_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    symbol TEXT NOT NULL,
    interval TEXT NOT NULL,
    strategy TEXT NOT NULL,
    blocker_decision TEXT NOT NULL,
    signal_direction TEXT NOT NULL,
    signal_score INTEGER,
    consistency_score INTEGER,
    entry_price NUMERIC,
    exit_price NUMERIC,
    result TEXT DEFAULT 'PENDING',
    pnl_percent NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    validated_at TIMESTAMPTZ
);

-- Index for user performance queries
CREATE INDEX IF NOT EXISTS idx_trading_logs_user_id ON public.trading_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_trading_logs_symbol ON public.trading_logs(symbol);
