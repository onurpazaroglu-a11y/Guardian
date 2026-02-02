# Architecture Documentation - Guardian

## 1. System Overview
Guardian is built as a monorepo using Turborepo, separating the engine logic from the web interface and infrastructure.

## 2. Component Stack
- **Frontend:** Next.js 14, Tailwind CSS, shadcn/ui, Zustand.
- **Backend:** Python 3.12, FastAPI, TA-Lib, Pydantic.
- **Database:** Supabase (PostgreSQL, Auth, Edge Functions).
- **Exchange Integration:** Binance API (via `ccxt` or manual wrapper).

## 3. Data Flow
1. **User Request:** Frontend sends a request with `symbol`, `interval`, and `strategy`.
2. **Engine Orchestration:** `Bundle` module fetches historical data from Binance.
3. **Scoring:** `ConsistencyScorer` runs multiple indicators and aggregates their signals.
4. **Decisioning:** `Blocker` evaluates the score; `Signal` generates trade details.
5. **Persistence:** `Logger` stores the analysis in Supabase for user metrics.
6. **Response:** API returns a comprehensive `AnalysisResponse` object to the UI.

## 4. Scalability
Internal components are modular. New indicators can be added by extending the `Indicator` base class and registering them in `IndicatorRegistry`.
