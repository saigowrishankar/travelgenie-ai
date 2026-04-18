# TravelGenie v2.0 — NestJS + PostgreSQL Edition

Stack: HTML/CSS/JS · **NestJS** · Anthropic Claude · **PostgreSQL**

Converted from: FastAPI + MongoDB → NestJS + PostgreSQL

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env and fill in ANTHROPIC_API_KEY and DATABASE_URL

# 3. Start dev server (tables auto-created on first boot)
npm run start:dev

# 4. Open frontend
open frontend/index.html
```

See **POSTGRESQL_SETUP.txt** for a full database setup guide (Neon, Supabase, or local).

---

## Project Structure

```
travelgenie-nest/
├── src/
│   ├── main.ts                          # Bootstrap (port, CORS, validation)
│   ├── app.module.ts                    # Root module — TypeORM config
│   ├── app.controller.ts                # GET / status endpoint
│   │
│   ├── entities/
│   │   ├── destination.entity.ts        # destinations table
│   │   ├── user.entity.ts               # rate_limit_users table
│   │   └── search-log.entity.ts         # search_logs table
│   │
│   ├── search/
│   │   ├── search.module.ts
│   │   ├── search.controller.ts         # POST /api/search
│   │   ├── search.service.ts            # Orchestrator
│   │   ├── claude.service.ts            # Anthropic API calls
│   │   ├── destination-cache.service.ts # PostgreSQL cache helpers
│   │   ├── rate-limit.service.ts        # Per-IP rate limiting
│   │   ├── prompt.builder.ts            # Claude prompt template
│   │   └── dto/search.dto.ts            # Request validation
│   │
│   ├── cache/
│   │   ├── cache.module.ts
│   │   ├── cache.controller.ts          # GET /api/cache/stats, /api/stats/top, DELETE /api/cache/clear
│   │   └── cache-stats.service.ts       # Analytics queries
│   │
│   └── health/
│       ├── health.module.ts
│       └── health.controller.ts         # GET /health
│
├── frontend/
│   └── index.html                       # Unchanged UI (open in browser)
│
├── .env.example
├── POSTGRESQL_SETUP.txt
├── package.json
├── tsconfig.json
└── nest-cli.json
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Server status + cache count |
| GET | `/health` | PostgreSQL ping |
| POST | `/api/search` | Main AI search |
| GET | `/api/cache/stats` | Analytics + hit rate |
| GET | `/api/stats/top` | Top 10 destinations |
| DELETE | `/api/cache/clear` | Clear all cached results |

### POST /api/search

```json
// Request
{ "destination": "Tokyo", "force_refresh": false }

// Response
{
  "destination": "Tokyo",
  "data": { ... },
  "cached": false,
  "storage": "PostgreSQL",
  "searches_remaining": 4
}
```

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | ✅ | — | Your Claude API key |
| `DATABASE_URL` | ✅ | — | PostgreSQL connection string |
| `PORT` | | 8000 | Server port |
| `FREE_SEARCHES_PER_IP` | | 5 | Rate limit per IP per window |
| `CACHE_TTL_DAYS` | | 7 | How long to cache AI results |
| `RATE_WINDOW_HOURS` | | 24 | Rate limit window duration |

---

## What Changed vs FastAPI + MongoDB

| | FastAPI Version | NestJS Version |
|--|--|--|
| **Runtime** | Python / uvicorn | Node.js / Express |
| **Framework** | FastAPI | NestJS (TypeScript) |
| **Database** | MongoDB Atlas (motor) | PostgreSQL (TypeORM) |
| **Schema** | Schemaless BSON | Typed entities + JSONB |
| **Rate limiting** | Motor upsert | TypeORM save |
| **Cache TTL** | MongoDB `expires_at` field | PostgreSQL `expires_at` column |
| **Start command** | `uvicorn main:app --reload` | `npm run start:dev` |
| **Deployment** | Railway / Render / Fly.io | Same — all support NestJS |

### Why PostgreSQL over MongoDB for this app?
- **JSONB** column stores the AI payload exactly like MongoDB documents — same flexibility, zero schema migration needed
- **Free tiers** on Neon / Supabase / Railway are generous and need no credit card
- **TypeORM synchronize** auto-creates all tables on first boot — zero manual SQL

---

## Deploy to Railway (free)

```bash
# 1. Push to GitHub
git init && git add . && git commit -m "TravelGenie NestJS"
gh repo create travelgenie-nest --public --push

# 2. railway.app → New Project → Deploy from GitHub
# 3. Add a PostgreSQL plugin (free)
# 4. Set env vars: ANTHROPIC_API_KEY + DATABASE_URL (auto-set by Railway plugin)
# 5. Done — Railway detects package.json and runs npm start
```
