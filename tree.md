guardian/
├── 📁 apps/
│   ├── 📁 web/                    # Next.js frontend (Vercel)
│   │   ├── 📁 src/
│   │   │   ├── 📁 app/           # App Router (Next.js 14+)
│   │   │   │   ├── 📁 (auth)/
│   │   │   │   │   ├── login/
│   │   │   │   │   ├── register/
│   │   │   │   │   └── layout.tsx
│   │   │   │   ├── 📁 dashboard/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── layout.tsx
│   │   │   │   ├── 📁 settings/
│   │   │   │   │   ├── api-keys/
│   │   │   │   │   ├── subscription/
│   │   │   │   │   └── profile/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   └── globals.css
│   │   │   ├── 📁 components/
│   │   │   │   ├── 📁 ui/        # shadcn/ui veya benzeri
│   │   │   │   ├── 📁 blocker/
│   │   │   │   ├── 📁 signal/
│   │   │   │   ├── 📁 logger/
│   │   │   │   └── 📁 shared/
│   │   │   ├── 📁 hooks/
│   │   │   ├── 📁 lib/
│   │   │   │   ├── supabase.ts
│   │   │   │   ├── api.ts
│   │   │   │   └── utils.ts
│   │   │   ├── 📁 types/
│   │   │   └── 📁 stores/        # Zustand veya Redux
│   │   ├── 📁 public/
│   │   ├── .env.local
│   │   ├── next.config.js
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── 📁 engine/                 # Python trading engine (Docker)
│       ├── 📁 src/
│       │   ├── 📁 core/
│       │   │   ├── __init__.py
│       │   │   ├── engine.py          # Ana engine orkestratörü
│       │   │   ├── config.py          # Config yönetimi
│       │   │   └── exceptions.py
│       │   │
│       │   ├── 📁 indicators/
│       │   │   ├── __init__.py
│       │   │   ├── base.py            # Base indicator class
│       │   │   ├── trend.py           # EMA200/50/20
│       │   │   ├── momentum.py        # MACD, RSI
│       │   │   ├── volatility.py      # Bollinger, Keltner
│       │   │   ├── pattern.py         # ZigZag, Fractal
│       │   │   └── registry.py        # Indicator kayıt/fabrika
│       │   │
│       │   ├── 📁 modules/
│       │   │   ├── __init__.py
│       │   │   ├── blocker.py         # Blocker modülü
│       │   │   ├── signal.py          # Signal modülü
│       │   │   ├── logger.py          # Logger modülü
│       │   │   └── bundle.py          # Bundle orchestrator
│       │   │
│       │   ├── 📁 scoring/
│       │   │   ├── __init__.py
│       │   │   ├── consistency.py     # Consistency Score 1-100
│       │   │   ├── weights.py         # Ağırlık yönetimi
│       │   │   └── adaptive.py        # Profil adaptasyonu
│       │   │
│       │   ├── 📁 data/
│       │   │   ├── __init__.py
│       │   │   ├── fetcher.py         # Binance API wrapper
│       │   │   ├── cache.py           # Redis/local cache
│       │   │   └── models.py          # Pydantic modeller
│       │   │
│       │   ├── 📁 api/
│       │   │   ├── __init__.py
│       │   │   ├── server.py          # FastAPI app
│       │   │   ├── routes/
│   │   │   │   │   ├── __init__.py
│   │   │   │   │   ├── health.py
│   │   │   │   │   ├── engine.py      # /analyze, /signal
│   │   │   │   │   ├── logger.py      # /logs, /metrics
│   │   │   │   │   └── websocket.py   # Real-time updates
│   │   │   │   └── middleware/
│   │   │   │       ├── auth.py
│   │   │   │       └── rate_limit.py
│   │   │   │
│   │   │   └── 📁 workers/
│   │   │       ├── __init__.py
│   │   │       └── scheduler.py       # Interval-based jobs
│   │   │
│   │   ├── 📁 tests/
│   │   │   ├── 📁 unit/
│   │   │   ├── 📁 integration/
│   │   │   └── conftest.py
│   │   │
│   │   ├── 📁 notebooks/              # EDA, backtest analizleri
│   │   │
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   ├── pyproject.toml
│   │   └── .env.example
│   │
├── 📁 packages/
│   └── 📁 shared/                 # Ortak tipler/utilities
│       ├── 📁 src/
│       │   ├── types/
│       │   │   ├── index.ts
│       │   │   └── api.ts
│       │   └── constants/
│       ├── package.json
│       └── tsconfig.json
│
├── 📁 infra/
│   ├── 📁 docker/
│   │   ├── docker-compose.yml
│   │   ├── docker-compose.prod.yml
│   │   └── 📁 scripts/
│   ├── 📁 supabase/
│   │   ├── 📁 migrations/
│   │   │   ├── 001_init.sql
│   │   │   ├── 002_auth.sql
│   │   │   ├── 003_logger.sql
│   │   │   └── 004_subscriptions.sql
│   │   ├── 📁 functions/          # Edge functions (gerekirse)
│   │   └── seed.sql
│   ├── 📁 terraform/              # IaaC (opsiyonel)
│   └── 📁 k8s/                    # Kubernetes manifests (opsiyonel)
│
├── 📁 docs/
│   ├── MVP.md
│   ├── PRD.md
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── 📁 decisions/              # ADR (Architecture Decision Records)
│
├── .gitignore
├── .env.example
├── Makefile                       # Yaygın komutlar
├── README.md
└── turbo.json                     # Monorepo orchestration (opsiyonel)