# CLAUDE.md

# ============================================================
# DBB-PSC — PLATFORM SALES COMMUNICATION (INTERNAL)
# ============================================================
# AI Agent: read this file COMPLETELY before any action.
# This is your operating manual for this project.
# This is an internal omnichannel sales platform.
#
# ⚠️ PRD lives at prd.md — read it for full product context.
# ⚠️ All task workflows MUST follow the 5 phases below.
# ============================================================

## PROJECT MAP

```
dbb-psc/
├── CLAUDE.md                 → Operating manual AI agent (file ini)
├── README.md                 → Background permanen, arsitektur, setup
├── STATUS.md                 → Status terkini, open items, next actions
├── PROGRESS.md               → Log kerja harian berurutan waktu
├── DECISIONS.md              → Log keputusan arsitektural & teknis
├── EPICS.md                  → Daftar fitur MVP per modul
├── CHANGELOG.md              → Log perubahan untuk user (Bahasa Indonesia)
├── prd.md                    → Product Requirements Document
├── original_prd.md           → PRD asli sebelum modifikasi
├── apps/
│   ├── web/                  → Frontend (Vite + React + React Router)
│   └── server/               → Backend (Elysia + Bun)
├── packages/
│   └── shared/               → Shared types & utilities
├── docker-compose.yml        → PostgreSQL pgvector, Redis, MinIO
└── bun.lockb                 → Bun lockfile
```

**Organization:** Conflux Platform (Internal Sales Communication)

---

# ⛔ BRANDING & NAMING RULE (NON-NEGOTIABLE)

**Project ini adalah project uji coba / testing. BELUM production. BELUM digunakan oleh user nyata.**

### Aturan Keras

- **JANGAN PERNAH** menampilkan kata "Dibimbing", "Dibimbing.ID", "dibimbing.id", atau variasi apapun di dalam kode, UI, atau output yang dihasilkan
- **JANGAN PERNAH** menggunakan branding apapun di dalam kode — ini murni testing/sandbox
- **JANGAN PERNAH** menampilkan nama perusahaan, email production, atau data asli di dalam kode
- **GUNAKAN** placeholder names untuk semua testing data:
  - ✅ "Acme Corp", "Test University", "Sample Organization"
  - ✅ "admin@test.com", "user@example.com"
  - ✅ "Program A", "Program B", "Course Name"
  - ❌ "Dibimbing", "Dibimbing.ID", nama program asli, email asli

### Scope

Aturan ini berlaku untuk:
- Source code (frontend & backend)
- Database seed data
- UI component (judul, label, teks, placeholder)
- API responses untuk testing
- Email templates
- Semua output yang bisa dilihat manusia

### Pengecualian

- File dokumentasi internal (CLAUDE.md, prd.md, STATUS.md, PROGRESS.md, DECISIONS.md, EPICS.md, CHANGELOG.md) — boleh menyebut konteks asli untuk referensi
- `prd.md` dan `original_prd.md` — boleh berisi konteks asli karena ini dokumentasi product

---

# BEHAVIORAL GUIDELINES

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

# TECH STACK

| Layer | Technology | Notes |
|---|---|---|
| **Runtime** | Bun | 4x faster than Node.js, TypeScript native |
| **Frontend Framework** | Vite + React + React Router | SPA for internal dashboard, no SSR needed |
| **UI Components** | shadcn/ui + Tailwind CSS | Accessible, customizable |
| **Icons** | itsHover + Lordicon | itsHover primary (186 animated). Lordicon fallback (43,900+). **WAJIB** cek itsHover dulu. Custom SVG hanya untuk brand icons (WA/IG/FB) |
| **Design System** | `DESIGN.md` | **WAJIB dibaca sebelum membuat/modifikasi komponen frontend** |
| **State (client)** | Zustand | ~1KB, for UI state (inbox, filters, sidebar) |
| **State (server)** | TanStack Query | Caching, background refetch, optimistic updates |
| **Charts** | Apache ECharts | Heatmap, gauge, large dataset support |
| **Rich Text** | Tiptap (Community) | Knowledge base editor |
| **Form** | React Hook Form + Zod | TypeScript-first validation |
| **Backend Framework** | Elysia | 2.4M req/s, built-in µWebSocket, Eden type safety |
| **WebSocket** | Bun native µWebSocket | No Socket.IO — manual room implementation |
| **ORM** | Drizzle ORM | Zero overhead, raw SQL for pgvector queries |
| **Job Queue** | BullMQ + Redis (ioredis) | Broadcast, AI processing, notifications |
| **Auth** | Elysia JWT plugin | JWT + Refresh Token |
| **Database** | PostgreSQL 16 + pgvector | Relational + vector search for knowledge base |
| **Cache/Queue** | Redis 7 | Session, rate limiting, BullMQ, pub/sub |
| **File Storage** | MinIO (dev) / Cloudflare R2 (prod) | Media attachments from chat |
| **AI** | Vercel AI SDK | Multi-provider: Gemini → OpenRouter → GPT-4o-mini |
| **Error Tracking** | Sentry Cloud (free tier) | 5K events/month |
| **Unit/Integration Test** | Vitest | Fast, native ESM, TypeScript-first. Backend & Frontend |
| **E2E Test** | Playwright | Cross-browser testing untuk critical user flows |
| **Containerization** | Docker + Docker Compose | Dev environment consistency |
| **CI/CD** | GitHub Actions | Free for private repos |

---

# ⛔ MANDATORY DOCUMENTATION UPDATE RULE (NON-NEGOTIABLE)

**Setiap task yang dikerjakan — frontend-only, backend-only, full-stack, atau docs-only — WAJIB diikuti dengan update ke core documentation files di root monorepo. TIDAK ADA PENGEcualian.**

### Files yang WAJIB Dicek & Diupdate

| File | Kapan WAJIB Diupdate |
|------|----------------------|
| `STATUS.md` | **SELALU** — pindahkan Open → Done, update state, update timestamp |
| `PROGRESS.md` | **SELALU** — tambah entry baru di ATAS entry lama |
| `DECISIONS.md` | **SELALU** — log keputusan arsitektural/teknis baru (jika ada) |
| `EPICS.md` | **SELALU** — update status fitur 🔴→🟡→🟢 (jika applicable) |
| `CHANGELOG.md` | Hanya saat user minta |

### Scope Tidak Mempengaruhi Aturan Ini

Aturan ini berlaku **tanpa terkecuali** berdasarkan scope pekerjaan:

| Scope Pekerjaan | WAJIB Update Docs? | Alasan |
|----------------|---------------------|--------|
| Frontend-only (React components, pages, UI) | ✅ **YA** | Status fitur berubah, ada file/component baru |
| Backend-only (API, DB, workers) | ✅ **YA** | Endpoint baru, schema berubah, ada keputusan teknis |
| Full-stack (FE + BE) | ✅ **YA** | Semua alasan di atas |
| Bug fix (di mana saja) | ✅ **YA** | Bug ditemukan + di-fix harus tercatat |
| Config/infra change (Docker, CI/CD, env) | ✅ **YA** | Infra berubah mempengaruhi workflow |
| Documentation-only (README, md files) | ✅ **YA** | Dokumentasi berubah harus tercatat |
| Refactoring (tanpa perubahan behavior) | ✅ **YA** | Refactor tercatat untuk konteks session berikutnya |

### Minimum Update Requirements per File

```
STATUS.md minimum:
  → Pindahkan minimal 1 item dari Open ke Done
  → Update "Current State" timestamp

PROGRESS.md minimum:
  → Tambah entry baru di ATAS (format: ## YYYY-MM-DD — Judul Task)
  → Isi minimal: "Yang Dikerjakan" + "Yang Berhasil"

DECISIONS.md minimum:
  → Jika ada keputusan baru → log dengan DEC-XXX
  → Jika tidak ada keputusan → skip (tidak wajib)

EPICS.md minimum:
  → Jika ada fitur yang berubah status → update emoji
  → Jika tidak ada perubahan fitur → skip (tidak wajib)
```

### Verifikasi Akhir Task

Sebelum mendeklarasikan task selesai, agent WAJIB:

1. Baca ulang `STATUS.md` → pastikan informasi sinkron dengan apa yang baru dikerjakan
2. Baca ulang `PROGRESS.md` → pastikan entry baru ada dan lengkap
3. Cek `DECISIONS.md` → pastikan keputusan baru tercatat (jika ada)
4. Cek `EPICS.md` → pastikan status fitur terupdate (jika applicable)
5. **Jika ada 1 saja yang belum diupdate → task BELUM selesai**

### ⛔ Anti-Pattern — Yang TIDAK BOLEH

- ❌ "Ini cuma frontend fix, ga perlu update STATUS.md" → **SALAH**, WAJIB update
- ❌ "Cuma ganti 1 baris di backend, skip docs" → **SALAH**, WAJIB update
- ❌ "Nanti aja update docsnya" → **SALAH**, WAJIB sekarang juga
- ❌ "User cuma minta X, bukan minta update docs" → **SALAH**, docs update WAJIB regardless
- ❌ Update STATUS.md tapi lupa PROGRESS.md → **SALAH**, keduanya WAJIB
- ❌ Update PROGRESS.md tapi entry-nya kosong/vague → **SALAH**, harus spesifik

---

# SECTION 1: MANDATORY TASK WORKFLOW (5 PHASES)

YOU MUST follow ALL 5 phases for EVERY task. Skipping any phase will produce low-quality output.

## PHASE 1 — UNDERSTAND

Before writing a single line of code:

### ⚠️ SCOPE ISOLATION RULE

**HANYA baca dan analisa file yang AKAN diedit.**
Jangan pernah membaca file yang TIDAK disebut dan TIDAK akan dimodifikasi.

**Cara menentukan scope:**
- User menyebut "frontend" → HANYA baca `apps/web/`
- User menyebut "backend" → HANYA baca `apps/server/`
- User menyebut fitur full-stack (FE + BE) → baca KEDUA folder, BUKAN yang lain
- User minta perubahan docs di root → HANYA baca root files, JANGAN baca apps/

### Langkah-langkah

1. **Identify target scope FIRST** — tentukan sebelum membaca apapun.

2. **Read core documentation files** (WAJIB di Phase 1):
   - `STATUS.md` → apa yang done, open, blocked, next actions
   - `DECISIONS.md` → keputusan yang sudah diambil (JANGAN buka ulang Final)
   - `PROGRESS.md` → entri terakhir SAJA untuk konteks terkini
   - `prd.md` → product requirements (skip jika sudah pernah baca)
   - `EPICS.md` → daftar fitur MVP (SKIP jika task tidak terkait fitur baru)

3. **Read project-specific files HANYA untuk target scope**:
   - Frontend: `apps/web/src/` structure, component patterns, existing pages
   - Backend: `apps/server/src/` structure, route patterns, existing services

4. **Read relevant skills**:
   - `.agents/skills/shadcn/SKILL.md` → shadcn/ui patterns
   - `.agents/skills/frontend-design/SKILL.md` → React design patterns
   - `.agents/skills/vercel-react-best-practices/SKILL.md` → React performance
   - `.agents/skills/tdd/SKILL.md` → test-driven development
   - `.agents/skills/webapp-testing/SKILL.md` → Playwright testing

5. **Search codebase HANYA di dalam target scope** — jangan search di project lain.

## PHASE 2 — PLAN

Create a clear plan before coding:

1. **List all files** that will be created or modified.
2. **Define the order** of changes (dependencies first):
   - Backend: schema → types → services → workers → routes → middleware
   - Frontend: types → stores → hooks → components → pages → routes
3. **Performance impact assessment**:
   - Unnecessary re-renders? → restructure state
   - Over-fetching? → add pagination/select fields
   - N+1 queries? → batch/prefetch
4. **Identify risks**: break existing? circular deps? duplicate code? endpoint exists?
5. **Decide what NOT to do**: no new libs, no unrelated refactoring, no over-engineering.

## PHASE 3 — IMPLEMENT

### Code Quality Standards (NON-NEGOTIABLE)

- **NEVER** add comments in code — self-documenting through clear naming
- **NEVER** add unnecessary intermediate variables
- **NEVER** use `any` type in TypeScript — if you must, add explicit justification
- **NEVER** hardcode values that should be configurable
- **NEVER** store derived state — compute inline
- **NEVER** create god components — split into focused units
- **NEVER** fetch data inside presentational components
- **NEVER** use `useEffect` when the same result can be achieved without it
- **NEVER** ignore error states — handle loading, error, empty consistently
- **NEVER** render large lists without pagination or virtualization
- **NEVER** use `console.log` for production code — use proper error tracking
- **NEVER** mix business logic into UI components — separate concerns

### Naming Conventions

- Variables/functions: `camelCase`, descriptive, intention-revealing
- Components: `PascalCase`, noun-based (e.g., `ConversationList`, `AgentStatusCard`)
- Types/Interfaces: `PascalCase`, no `I` prefix (e.g., `Contact`, not `IContact`)
- Files: match the primary export name
- Boolean variables: prefix with `is`, `has`, `can`, `should`
- Event handlers: prefix with `handle` (e.g., `handleSubmit`)
- Backend routes: RESTful convention, resource-based
- DB tables: `snake_case` (Drizzle handles conversion)
- Environment variables: `UPPER_SNAKE_CASE`

### Architecture Rules

- Separate concerns: UI | Logic | Data — one component/function = one responsibility
- Reuse before create — compose small units — data flows down, events flow up
- Type everything — no implicit any, no untyped props
- Follow existing project patterns exactly — check before inventing new patterns

## PHASE 4 — AUDIT

After implementation, perform a deep self-audit. Check EVERY item:

### Correctness Audit

- [ ] Code compiles without errors?
- [ ] Handles all edge cases (null, undefined, empty array, error response)?
- [ ] All TypeScript types correct and complete?
- [ ] API request/response shapes match between frontend and backend?
- [ ] Error states use backend-originated messages in Bahasa Indonesia?
- [ ] WebSocket event types consistent between sender and receiver?

### Performance Audit

- [ ] No N+1 queries (backend)? No unnecessary re-renders (frontend)?
- [ ] No large lists rendered without pagination?
- [ ] No unused imports or dead code? No expensive computations inside render?
- [ ] No memory leaks (unclean effects, event listeners)?
- [ ] Only needed columns selected in database queries? (no `SELECT *`)
- [ ] Lazy loading applied to pages and routes?
- [ ] No barrel file importing unused modules?
- [ ] No blocking render — loading states use skeleton/placeholder?
- [ ] Database queries use indexes and avoid full table scans?
- [ ] Redis cache used where appropriate (sessions, hot data)?

### Pattern Compliance Audit

- [ ] Zero comments in code? No unnecessary intermediate variables?
- [ ] Follows project pattern exactly? Uses existing utilities/types?
- [ ] No hardcoded values? No new libraries without justification?
- [ ] Backend uses Elysia conventions (not raw Express/Fastify patterns)?
- [ ] Frontend follows React Router + TanStack Query patterns?
- [ ] No code modified outside the task scope?

### Security Audit

- [ ] No sensitive data exposed to client? Input validated at boundary?
- [ ] No SQL injection vectors (parameterized queries via Drizzle)?
- [ ] Auth/role checks in place for protected endpoints?
- [ ] Webhook signature validation (Meta X-Hub-Signature-256)?
- [ ] JWT tokens handled securely (httpOnly, short expiry)?
- [ ] Channel credentials encrypted in database?

### Scalability Audit

- [ ] Works with 1000+ items? No tight coupling?
- [ ] Safe for future additions? No global mutable state?
- [ ] BullMQ workers handle failures gracefully (retry + dead letter queue)?

## PHASE 5 — REGISTER

This is the MOST CRITICAL phase. After verified implementation, agent WAJIB update semua core documentation files. **Task TIDAK dianggap selesai sampai SEMUA item berikut dicek dan diupdate.**

### ⚠️ MANDATORY POST-TASK UPDATE CHECKLIST

- [ ] **`STATUS.md`** — pindahkan Open → Done, tambah blocker, update next best actions, update timestamp
- [ ] **`PROGRESS.md`** — tambah entry baru di ATAS entry lama (format: `## YYYY-MM-DD — Judul Task`)
- [ ] **`DECISIONS.md`** — log keputusan arsitektural baru dengan kode DEC-XXX (jika ada)
- [ ] **`EPICS.md`** — update status fitur (🔴→🟡→🟢) jika applicable
- [ ] **`CHANGELOG.md`** — tambah entry changelog jika user minta (jangan otomatis)

### Cara verifikasi

Baca ulang setiap file yang diupdate → pastikan informasi sinkron. Jika tidak → fix dulu baru task dianggap selesai.

---

# SECTION 2: PERFORMANCE RULES

## FRONTEND PERFORMANCE (apps/web/)

### Rendering & Re-renders

- State changes granular as possible — push state down to child level
- Never store derived/computed values in state — calculate inline
- `useMemo`/`useCallback` ONLY when profiling proves measurable cost — not by default
- Avoid new object/array/function references in render unless necessary

### Component Design

- Small, focused, predictable — separate data-fetching containers from presentational
- Heavy components (modals, editors, knowledge base) MUST be lazy-loaded
- Lists 50+ items MUST use pagination or virtualization
- shadcn/ui components used as base — never build from scratch when shadcn has it

### Data Fetching

- TanStack Query for ALL server state — no manual fetch/axios in components
- Fetch ONLY needed data — never over-fetch; paginate ALL list endpoints
- Cache aggressively — consistent `queryKey`, prefetch predictable navigation targets
- `placeholderData: keepPreviousData` for pagination layout stability

### Bundle Size & Code Loading

- Lazy-load ALL pages/routes with `React.lazy` + `<Suspense>`
- Avoid barrel files — they cause tree-shaking failures; import specifically
- ECharts: use dynamic import, never bundle into main chunk

### Effects & Lifecycle

- `useEffect` is a LAST RESORT — prefer derived values, event handlers, or TanStack Query
- Accurate minimal dependencies, always cleanup, never cascading effects
- For TanStack Query mutations with fully handled `onError`, prefer `mutation.mutate(...)` over `mutateAsync()` without try/catch

### Memory & UX

- No large objects in state, clean up ALL listeners/intervals
- Skeleton/placeholder immediately, no layout shift, debounce search (300ms+)
- Zustand for UI state (inbox selection, sidebar, filters) — NOT for server state

### WebSocket

- Native WebSocket (no Socket.IO) — implement reconnection logic manually
- Room-based routing: subscribe/unsubscribe on component mount/unmount
- Handle connection states: connecting, connected, reconnecting, failed

## BACKEND PERFORMANCE (apps/server/)

### Database & Query Performance

- SELECT only needed columns — NEVER `SELECT *`
- Every `WHERE` clause must hit an index — Drizzle schema should define indexes
- NEVER query inside a loop — batch with `WHERE IN` or join
- Use Drizzle `leftJoin`/`innerJoin` for related data instead of multiple queries
- COUNT queries must use indexed columns — avoid `COUNT(*)` on large tables
- Paginate ALL list endpoints — cursor-based or offset
- Filter, sort, and paginate in SQL — never load full table into memory
- For text search, use PostgreSQL full-text search — never fetch all + filter in JS

### Data Flow & Memory

- Never load entire result sets into memory — stream or paginate
- Use specific types for each query — never a "catch-all" type with 50 fields
- Minimize allocations in hot paths
- Drizzle's query builder preferred over raw SQL for type safety

### Endpoint Design

- Endpoints must respond under 200ms for list queries, 100ms for single-item queries
- Fail fast on invalid input — validate before any DB call
- Never swallow errors — log with context for debugging via Sentry
- Return minimal response payload — never send unused fields to the client
- Batch related reads into single queries — never sequential dependent queries

### BullMQ & Job Queue

- Every webhook from Meta (WA/IG/FB) → push to BullMQ queue → process async
- Workers MUST handle failures with retry (max 3x, exponential backoff)
- Dead letter queue for permanently failed jobs
- Never process webhooks inline — always queue first
- AI responses queued separately from message processing

### Concurrency & Safety

- Bun single-threaded with async I/O — no shared mutable state between handlers
- Use Redis for cross-instance state (sessions, pub/sub for WebSocket)
- Rate limiting on all public endpoints (Redis-based)
- Webhook signature validation BEFORE any processing

### Scalability

- Every endpoint must handle expected load without degradation
- No global bottlenecks — no single mutex protecting an entire service
- No in-memory caches that grow unbounded — use Redis for shared cache
- Design for horizontal scaling — no server-local state

---

# SECTION 3: LOCAL DATABASE ACCESS

**WAJIB:** Sebelum query database, baca `docker-compose.yml` atau `.env` untuk credentials.

**Default Dev Credentials:**
- Host: `localhost`
- Port: `5432`
- Username: `postgres`
- Password: `postgres`
- Database: `dbb_psc`

```bash
# List tables
psql -U postgres -d dbb_psc -c "\dt"

# Describe table
psql -U postgres -d dbb_psc -c "\d contacts"

# Query data
psql -U postgres -d dbb_psc -c "SELECT * FROM contacts LIMIT 10;"

# Drizzle migration
bun run db:migrate

# Seed database
bun run db:seed
```

---

# SECTION 4: LOCAL API TESTING

**Base URL:** `http://localhost:3000/api/v1`

```bash
# Health check
curl -s http://localhost:3000/health | jq .

# Login (get JWT)
TOKEN=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@company.com","password":"password"}' | jq -r '.data.token')

# GET list / GET detail / POST / PUT / DELETE
curl -s http://localhost:3000/api/v1/{resource}?page=1\&limit=10 -H "Authorization: Bearer $TOKEN" | jq .
curl -s http://localhost:3000/api/v1/{resource}/1 -H "Authorization: Bearer $TOKEN" | jq .
curl -s -X POST http://localhost:3000/api/v1/{resource} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"field":"value"}' | jq .
curl -s -X PUT http://localhost:3000/api/v1/{resource}/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"field":"new_value"}' | jq .
curl -s -X DELETE http://localhost:3000/api/v1/{resource}/1 -H "Authorization: Bearer $TOKEN" | jq .
```

Pastikan backend sedang running (`bun run dev:server`).

---

# SECTION 5: UNIVERSAL CODING PRINCIPLES

## Principles

- **DRY** — no duplicated logic
- **KISS** — simplicity over cleverness
- **YAGNI** — do not build for hypothetical futures
- **SOLID** — especially SRP and Dependency Inversion
- **SSOT** — single source of truth
- **Performance First** — every decision considers runtime cost

## Code Quality

- Readable, testable, maintainable — production-ready, simple is king
- Zero comments — code is self-documenting through naming
- Explicit data flow — no hidden magic

## Hard Constraints (NEVER VIOLATE)

- Follow the existing project structure exactly
- Do NOT add libraries unless absolutely necessary
- Do NOT modify code outside the scope of the current task
- Do NOT sacrifice performance for "elegant abstractions"
- Do NOT include explanations unless explicitly asked
- Do NOT hardcode values that should be configurable
- Output ONLY the code that is needed

## Behavioral Guidelines

- **Don't assume. Don't guess.** If unclear → STOP AND ASK. Multiple interpretations → present all.
- **Minimum code.** No features beyond what was asked. If 200 lines could be 50, rewrite.
- **Surgical changes.** Touch only what you must. Match existing style. Every changed line traces to the request.
- **Goal-driven.** Define success criteria per step. Loop until verified.
- **No false completion.** If code doesn't compile or tests fail → task is NOT done.

## Critical Decision Points

- New component? → Check existing shadcn/ui first
- Add library? → Almost always NO
- Refactor? → Only if IN SCOPE
- Add comment? → NO — improve naming
- useEffect? → Probably not — find alternative
- Global state? → NO — use local state or TanStack Query cache
- SELECT *? → NEVER
- Fetch all + filter in FE? → NEVER — filter in backend SQL
- Render all list items? → NEVER if >50 — paginate/virtualize
- Raw fetch/axios? → NEVER — use TanStack Query
- Manual WebSocket reconnection? → Implement it, never assume it works

---

# SECTION 5.5: MANDATORY TESTING PROTOCOL (NON-NEGOTIABLE)

## ⛔ Rule Utama

**Setiap fitur baru, endpoint baru, atau perubahan behavior WAJIB punya test sebelum dianggap selesai. Tidak ada pengecualian.**

## Tujuan

- **Regression detection** — AI agent atau developer tidak sengaja merusak fitur lain
- **Refactor safety** — percaya diri mengubah kode tanpa takut pecah
- **Living documentation** — test menjelaskan apa yang kode seharusnya lakukan
- **CI/CD gate** — test harus PASS sebelum code di-merge

## Framework

| Layer | Framework | Config Location |
|---|---|---|
| **Backend unit/integration** | Vitest | `apps/server/vitest.config.ts` |
| **Frontend unit/integration** | Vitest | `apps/web/vitest.config.ts` |
| **E2E** | Playwright | `playwright.config.ts` (root) |

## Apa yang Harus Ditest

### Backend (apps/server/)

| Component | Test Type | Contoh |
|---|---|---|
| **Service layer** | Unit test | `contacts/services.test.ts` — test createContact, searchContacts logic |
| **Query layer** | Integration test | `contacts/queries.test.ts` — test against real/test database |
| **Handler layer** | Integration test | `contacts/handlers.test.ts` — test HTTP request/response |
| **Auth middleware** | Unit test | `lib/auth.test.ts` — test JWT verify, role check |
| **AI fallback chain** | Unit test | `lib/ai.test.ts` — test fallback provider behavior |
| **Workers** | Integration test | `workers/document-worker.test.ts` — test queue processing |
| **Zod schemas** | Unit test | `contacts/types.test.ts` — test validation (valid + invalid) |

### Frontend (apps/web/)

| Component | Test Type | Contoh |
|---|---|---|
| **Zustand stores** | Unit test | `stores/ui.test.ts` — test state transitions |
| **Utility functions** | Unit test | `lib/utils.test.ts` — test formatDate, formatRelativeTime |
| **Complex components** | Integration test | `components/InboxList.test.tsx` — test rendering + interaction |
| **Forms** | Integration test | Contact form validation + submission |
| **Router** | Integration test | Navigation between pages |

### E2E (Critical Flows Only)

| Flow | Test |
|---|---|
| Login → Dashboard | Auth flow works |
| Inbox → Select conversation → Reply | Core messaging flow |
| Create contact → Assign to pipeline | CRM flow |
| Upload document to knowledge base → AI uses it | KB + AI flow |

## Test File Convention

```
# Unit test — di samping file yang ditest
apps/server/src/modules/contacts/services.ts
apps/server/src/modules/contacts/services.test.ts

# Integration test — suffix .integration.test.ts
apps/server/src/modules/contacts/queries.integration.test.ts

# E2E test — di folder e2e/
apps/web/e2e/auth.spec.ts
apps/web/e2e/inbox.spec.ts
```

## Naming Convention

```typescript
// services.test.ts
describe('createContact', () => {
  it('should create contact with valid data', () => { ... })
  it('should throw error when phone number already exists', () => { ... })
  it('should default pipeline_status to new_lead', () => { ... })
})

// handlers.test.ts
describe('POST /api/v1/contacts', () => {
  it('should return 201 with created contact', () => { ... })
  it('should return 400 with invalid payload', () => { ... })
  it('should return 401 without auth token', () => { ... })
})
```

## Coverage Thresholds

| Layer | Minimum | Target |
|---|---|---|
| **Services** | 80% | 90%+ |
| **Handlers** | 80% | 90%+ |
| **Queries** | 70% | 80%+ |
| **Stores** | 80% | 90%+ |
| **Utils** | 90% | 95%+ |
| **E2E** | All critical flows | All flows |

## Test Execution

```bash
# Backend unit tests
cd apps/server && bun run test

# Frontend unit tests
cd apps/web && bun run test

# All unit tests
bun run test

# E2E tests
bun run test:e2e

# Coverage report
bun run test:coverage
```

## CI/CD Gate

GitHub Actions workflow **WAJIB** include:
1. `bun run test` — all unit/integration tests pass
2. `bun run test:coverage` — coverage above threshold
3. `bun run typecheck` — TypeScript zero errors
4. `bun run build` — build success

**Merge block jika ada 1 saja yang gagal.**

## Anti-Pattern — Yang TIDAK Boleh

- ❌ Menulis kode fitur baru tanpa test → task TIDAK selesai
- ❌ Skip test karena "nanti saja" → TIDAK ada nanti
- ❌ Test yang hanya happy path → WAJIB test error cases juga
- ❌ Test yang hardcode data tanpa cleanup → test harus isolated
- ❌ Mock berlebihan → mock hanya external dependencies (DB, API, Redis)
- ❌ Test yang flaky (kadang pass kadang fail) → fix atau hapus

---

# SECTION 6: CHANGELOG PROTOCOL

## Kapan Menulis Changelog

- Saat user meminta ("tulis changelog", "update changelog", dll)
- User menjelaskan perubahan apa saja di prompt

## Lokasi File

`CHANGELOG.md` — satu file untuk semua perubahan

## Format Entry

```markdown
## [YYYY-MM-DD] — Judul Fitur [Environment]

### Ditambahkan
- Deskripsi perubahan dalam bahasa Indonesia non-teknis

### Diperbaiki
- Deskripsi perbaikan

### Diubah
- Deskripsi perubahan perilaku/tampilan
```

- **Judul Fitur** = nama fitur yang sedang dikerjakan
- **Environment** = `Development`, `Staging`, atau `Production`
- Setiap sesi chat = 1 entry terpisah (tidak gabung dengan sesi lain meskipun tanggal sama)

## Format Output Discord (siap copy-paste)

```
📋 Changelog — DBB-PSC [Environment] — YYYY-MM-DD
Judul: [Judul Fitur]

### Ditambahkan
• Halaman inbox untuk melihat semua percakapan

### Diperbaiki
• Formulir pendaftaran tidak menampilkan pesan error dengan benar

### Diubah
• Tata letak halaman profil lebih rapi di layar kecil
```

## Aturan Penulisan

- **Bahasa Indonesia** — tanpa istilah teknis
- Target pembaca: Project Manager dan QA Tester
- ✅ "Halaman baru untuk mengelola percakapan" — ❌ "Endpoint GET /api/v1/conversations"
- Kategori: Ditambahkan / Diperbaiki / Diubah / Dihapus
- Gunakan bullet `•` (bukan `-`) untuk output Discord
- Tidak perlu baca commit — cukup berdasarkan penjelasan user di prompt

### 🔴 Aturan Entry — NON-NEGOTIABLE

Setiap sesi chat = **satu entry changelog baru yang berdiri sendiri**. TIDAK BISA DINEGO:

- **JANGAN PERNAH menghapus** entry changelog yang sudah ada
- **JANGAN PERNAH menggabungkan** entry baru dengan entry lain
- **JANGAN PERNAH memodifikasi** entry changelog lama
- **JANGAN PERNAH merge** dua session yang berbeda menjadi satu entry

---

# SECTION 7: SMART MEMORY SYSTEM — Core Documentation Protocol

Ini adalah SISTEM MEMORY project. Core documentation files berfungsi sebagai **persistent memory** antar session chat. AI Agent yang berbeda session HARUS bisa melanjutkan pekerjaan dengan membaca files ini.

## Prinsip Utama

**Core documentation files = otak project.** Jika files ini outdated, AI Agent berikutnya akan membuat keputusan yang salah. Update files ini sama pentingnya dengan menulis kode yang benar.

## Core Files & Perannya

| File | Fungsi | Kapan Dibaca | Kapan Diupdate |
|------|--------|--------------|----------------|
| `CLAUDE.md` | Operating manual AI agent | **Selalu** — sebelum setiap task | Hanya jika workflow/rules berubah |
| `STATUS.md` | Status terkini (sumber kebenaran) | **Awal setiap sesi** | **Akhir setiap sesi** yang mengubah status |
| `PROGRESS.md` | Log kerja harian (memory jangka pendek) | Awal sesi — baca entry terakhir saja | **Akhir setiap sesi** — entry baru di ATAS |
| `DECISIONS.md` | Keputusan arsitektural (memory jangka panjang) | Sebelum buat keputusan baru | Setiap kali ada keputusan baru |
| `EPICS.md` | Scope MVP (tracking fitur) | Untuk cek scope & prioritas | Hanya jika scope MVP berubah |
| `CHANGELOG.md` | Log perubahan untuk user | Saat user minta | Saat user minta |

## Prioritas Baca di Awal Sesi

```
1. CLAUDE.md            → cara kerja (WAJIB selalu)
2. STATUS.md            → kondisi saat ini (WAJIB selalu)
3. DECISIONS.md         → keputusan yang sudah ada (WAJIB sebelum decide)
4. PROGRESS.md          → entry terakhir SAJA (untuk konteks session terakhir)
5. prd.md               → product requirements (jika task terkait fitur baru)
6. EPICS.md             → scope MVP (cek jika relevan)
```

## 🔴 ATURAN UPDATE — NON-NEGOTIABLE

### Rule 1: Selalu Update STATUS.md

Setelah setiap task selesai, STATUS.md WAJIB diupdate:
- Pindahkan item dari `Open Items` ke `Done Items`
- Tambah item baru ke `Open Items` jika ditemukan selama pengerjaan
- Update `Current State` table
- Update `Next Best Actions`
- Update `Last updated` timestamp

### Rule 2: Selalu Tambah PROGRESS.md Entry

Setiap sesi = 1 entry baru di ATAS entry lama:
```markdown
## YYYY-MM-DD — Judul Task

### Yang Dikerjakan
- Deskripsi apa yang dilakukan

### Keputusan yang Diambil
- Keputusan teknis (jika ada, juga log ke DECISIONS.md)

### Yang Berhasil
- Hasil yang dicapai

### Yang Perlu Dikerjakan Selanjutnya
- Pekerjaan berikutnya (jika ada)
```

### Rule 3: Log Setiap Keputusan Arsitektural ke DECISIONS.md

Format:
```markdown
## DEC-XXX: Judul Keputusan

**Status:** Final | Under Review
**Tanggal:** YYYY-MM-DD

**Keputusan:** Apa yang diputuskan.

**Alternatives:**
- Option A (yang dipilih) — alasan
- Option B — alasan
- Option C — alasan

**Alasan:** Mengapa option ini dipilih.

**Impact:** Dampak terhadap project.
```

- Gunakan kode DEC-XXX yang berurutan
- JANGAN buka ulang keputusan yang statusnya `Final`
- Bisa update status dari `Under Review` → `Final`

### Rule 4: Update EPICS.md Saat Fitur Progress

- 🔴 Belum mulai → 🟡 Sedang dikerjakan → 🟢 Selesai
- Hanya update jika task secara langsung mempengaruhi fitur di EPICS.md

### Rule 5: CHANGELOG.md Hanya Saat User Minta

- JANGAN otomatis update CHANGELOG.md
- Hanya update saat user secara eksplisit meminta

## Smart Detection — Checklist Setelah Task Selesai

Sebelum mendeklarasikan task selesai, agent WAJIB cek item-item berikut:

| # | Deteksi | Aksi |
|---|---------|------|
| 1 | File baru dibuat | Tambah ke STATUS.md (Done Items + deskripsi singkat) |
| 2 | Route/page baru | Update di STATUS.md dengan nama route |
| 3 | Endpoint baru | Update di STATUS.md dengan method + path |
| 4 | Component/hook baru | Tambah ke daftar di STATUS.md |
| 5 | Library baru ditambahkan | Update di DECISIONS.md dengan alasan |
| 6 | Status fitur berubah | Update di STATUS.md + EPICS.md (emoji status) |
| 7 | Bug ditemukan dan fix | Update di STATUS.md (Done Items + deskripsi fix) |
| 8 | Arsitektur berubah | Update di DECISIONS.md + EPICS.md |
| 9 | Dependency berubah | Update di STATUS.md |

## Anti-Pattern — Yang TIDAK Boleh Dilakukan

- ❌ Membuat keputusan arsitektural tanpa cek DECISIONS.md
- ❌ Mengulang pekerjaan yang sudah di-log di PROGRESS.md
- ❌ Menambah fitur yang tidak ada di EPICS.md tanpa konfirmasi user
- ❌ Mengubah README.md untuk hal-hal yang bersifat temporary
- ❌ Lupa update STATUS.md setelah menyelesaikan fitur
- ❌ Menulis entry PROGRESS.md yang terlalu vague ("fix bug" tanpa konteks)
- ❌ Membuka ulang keputusan Final di DECISIONS.md
- ❌ Melewati Phase 5 (REGISTER) karena "nanti saja update docs"

## Session Recovery Protocol

Ketika memulai sesi baru (atau agent baru mulai bekerja):

1. Baca `STATUS.md` → pahami kondisi terkini
2. Baca `PROGRESS.md` → baca HANYA entry terakhir untuk konteks session sebelumnya
3. Baca `DECISIONS.md` → pahami keputusan yang sudah ada
4. Cek `EPICS.md` → pahami scope dan prioritas
5. **JANGAN** baca semua entry PROGRESS.md — hanya entry terakhir saja (token efficiency)
6. **JANGAN** mengulang pekerjaan yang sudah tercatat di STATUS.md Done Items

## Cross-Reference Integrity

Setiap kali update salah satu core file, cek apakah perlu update file lain:

| Jika mengupdate... | Cek juga... |
|---------------------|-------------|
| STATUS.md (Done Items) | PROGRESS.md (harus ada entry untuk task ini) |
| STATUS.md (Open Items) | EPICS.md (apakah ini fitur yang terdaftar?) |
| DECISIONS.md (keputusan baru) | STATUS.md (apakah ini mempengaruhi status?) |
| EPICS.md (fitur berubah status) | STATUS.md (Next Best Actions mungkin berubah) |
| PROGRESS.md (keputusan diambil) | DECISIONS.md (harus ada DEC-XXX entry) |

---

# SECTION 8: AI PROVIDER CONFIGURATION

## Fallback Chain

```
Priority 1: Google Gemini Flash (primary — gratis tier)
Priority 2: OpenRouter (fallback — gratis: Llama 3.1, Mistral, Qwen)
Priority 3: OpenAI GPT-4o-mini (fallback alternatif — murah)
```

## Rules

- NEVER hardcode provider/model — always read from `AI_FALLBACK_CHAIN` config
- NEVER skip fallback chain — always try all providers before giving up
- Fallback message when ALL providers fail: "Maaf, saat ini sistem sedang sibuk. Tim kami akan segera menghubungi Anda."
- Log provider failures for monitoring (but don't expose to user)

---

# SECTION 9: CHANNEL INTEGRATION RULES

## WhatsApp Business API

- Template messages required outside 24-hour window
- Free-form messages allowed within 24-hour window
- Validate webhook signature: `X-Hub-Signature-256`
- Always queue incoming webhooks → BullMQ → process async

## Instagram Messaging API

- Cannot initiate conversations — only reply to incoming DMs/story mentions
- Requires Instagram Business account linked to Facebook Page
- Same webhook validation as WhatsApp

## Facebook Messenger API

- Rate limits per user per time period
- Webhook validation required
- Queue before processing

## Universal Rules

- ALL webhook payloads → BullMQ queue FIRST, never process inline
- ALL media attachments → object storage (MinIO/R2), never store locally
- ALL outbound messages → check channel-specific rate limits
- Deduplication: same phone number across channels → single contact profile
