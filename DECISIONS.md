# DECISIONS.md

Log keputusan arsitektural & teknis. Setiap keputusan diberi kode DEC-XXX.

---

## DEC-001: Bun Runtime

**Status:** Final
**Tanggal:** 2026-06-15

**Keputusan:** Gunakan Bun sebagai runtime untuk backend.

**Alternatives:**
- Node.js (industry standard, ekosistem besar)
- Bun (4x lebih cepat, TypeScript native, hemat memory)

**Alasan:**
- 4x lebih cepat dari Node.js
- TypeScript native tanpa compile step
- Built-in SQLite, test runner, package manager
- hemat memory ~2x dibanding Node.js
- Semua dependencies compatible dengan Bun

**Impact:**
- Semua backend code menggunakan Bun APIs
- Development server: `bun run dev`
- Package manager: `bun install`

---

## DEC-002: Elysia Framework

**Status:** Final
**Tanggal:** 2026-06-15

**Keputusan:** Gunakan Elysia sebagai backend framework.

**Alternatives:**
- Fastify (mature, TypeScript support, plugin system)
- Hono (lightweight, multi-runtime, edge-ready)
- Elysia (2.4M req/s, built-in WebSocket, Eden type safety)

**Alasan:**
- Tercepat: 2.4M req/s (benchmark)
- Built-in WebSocket (µWebSocket) — tidak perlu Socket.IO
- Eden: end-to-end type safety antara backend dan frontend
- Native Bun optimization
- Plugin system yang ringan

**Impact:**
- WebSocket implementation menggunakan µWebSocket native
- Route definitions menggunakan Elysia conventions
- Eden client bisa digunakan untuk type-safe API calls

---

## DEC-003: Drizzle ORM

**Status:** Final
**Tanggal:** 2026-06-15

**Keputusan:** Gunakan Drizzle ORM sebagai database ORM.

**Alternatives:**
- Prisma (popular, migration system, type-safe)
- Drizzle (zero overhead, raw SQL natural, pgvector support)
- TypeORM (decorator-based, mature)

**Alasan:**
- Zero overhead — tidak ada runtime penalty
- Raw SQL natural untuk pgvector queries
- TypeScript-first dengan excellent type inference
- Migration system yang clean
- PostgreSQL native features support (JSONB, arrays, full-text search)
- Lebih ringan dari Prisma (2-3x)

**Impact:**
- Schema definitions dalam TypeScript
- Query builder alih-alih raw SQL untuk type safety
- Migration files generated dari schema
- pgvector queries bisa menggunakan raw SQL via Drizzle

---

## DEC-004: Vercel AI SDK

**Status:** Final
**Tanggal:** 2026-06-15

**Keputusan:** Gunakan Vercel AI SDK untuk multi-provider AI integration.

**Alternatives:**
- LangChain.js (popular, RAG support, complex)
- Vercel AI SDK (lightweight, multi-provider, streaming)
- Custom provider interface

**Alasan:**
- Multi-provider support: Gemini, OpenRouter, OpenAI, dll
- Streaming support built-in
- TypeScript-first dengan excellent types
- React hooks untuk frontend
- Lebih ringan dari LangChain.js
- Provider fallback chain mudah diimplementasi

**Impact:**
- Provider abstraction layer menggunakan AI SDK
- Streaming responses untuk real-time feedback
- React hooks untuk AI features di frontend

---

## DEC-005: Apache ECharts

**Status:** Final
**Tanggal:** 2026-06-15

**Keputusan:** Gunakan Apache ECharts untuk charting.

**Alternatives:**
- Recharts (React-native, mudah, ringan)
- ECharts (powerful, heatmap support, Canvas renderer)

**Alasan:**
- Native heatmap support (kebutuhan Modul 6)
- Canvas renderer: handle 100K+ data points
- Gauge chart untuk conversion rate
- Sangat customizable
- Better performance untuk large dataset

**Impact:**
- Chart components menggunakan ECharts config objects
- Bundle size ~300KB (tree-shaken) — lebih besar dari Recharts
- Dynamic import untuk lazy loading

---

## DEC-006: Single-Server MVP Architecture

**Status:** Final
**Tanggal:** 2026-06-15

**Keputusan:** Arsitektur single-server untuk MVP, tanpa CDN dan load balancer.

**Alternatives:**
- Multi-instance dengan load balancer (production-ready)
- Single-server (sederhana, MVP-friendly)

**Alasan:**
- MVP hanya perlu handle 10.000 pesan/hari (~17/min)
- Single Elysia instance mampu handle 100K+ req/s
- Docker Compose untuk development
- Scaling akan ditambahkan saat production

**Impact:**
- Semua services berjalan di satu server
- WebSocket, API, Webhook dalam satu process
- Redis untuk pub/sub (bukan multi-instance sync)
- Production deployment nanti akan upgrade ke multi-instance

---

## DEC-007: Sentry Cloud Free Tier

**Status:** Final
**Tanggal:** 2026-06-15

**Keputusan:** Gunakan Sentry Cloud free tier untuk error tracking.

**Alternatives:**
- Sentry Cloud (5K events/month gratis)
- SigNoz local (self-hosted, full observability)
- Console logs only (sederhana, gratis)

**Alasan:**
- Free tier cukup untuk MVP (5K events/bulan)
- Tidak perlu setup infrastructure tambahan
- Dashboard yang bagus untuk error tracking
- Alert ke Slack/Discord
- Nanti bisa upgrade ke paid plan jika perlu

**Impact:**
- Sentry SDK di frontend dan backend
- Source maps untuk better error traces
- Release tracking

---

## DEC-008: Monorepo with Bun Workspaces

**Status:** Final
**Tanggal:** 2026-06-15

**Keputusan:** Gunakan monorepo dengan Bun workspaces.

**Alternatives:**
- Multi-repo (terpisah per service)
- Monorepo (shared code, single install)

**Alasan:**
- Shared types antara frontend dan backend
- Single `bun install` untuk semua dependencies
- Code sharing: shared utilities, constants, types
- Lebih mudah maintain untuk tim kecil

**Impact:**
- Root `package.json` dengan workspaces config
- `packages/shared/` untuk shared code
- `apps/web/` dan `apps/server/` sebagai workspace packages

## DEC-009: Document Extraction Pipeline

**Status:** Final
**Tanggal:** 2026-06-15

**Keputusan:** Tambah document processing pipeline untuk knowledge base — async extraction dengan BullMQ worker, lightweight libraries, Gemini embedding.

**Alternatives:**
- Puppeteer/Playwright (heavy, ~300MB, browser-based) — overkill untuk text extraction
- pdf-parse + mammoth (lightweight, ~1MB total, zero-dependency) — dipilih
- Inline processing (synchronous) — blokir request, tidak scalable

**Alasan:**
- pdf-parse ~1MB, mammoth ~1MB — tidak tambah weight signifikan
- BullMQ worker-based — upload langsung return 202, process async
- Gemini text-embedding-004 — gratis, batch support, 768 dimensi
- Recursive text splitter 500 tokens / 100 overlap — balance granularity vs query speed
- Processing status tracking — user bisa monitor upload progress

**Impact:**
- Tambah dependencies: pdf-parse, mammoth
- Tambah BullMQ worker: document-processing-worker
- Update kb_documents schema: chunk_index, source_document_id, processing_status
- File storage: terpisah kb/{doc-id}/{filename} dari chat media

## DEC-010: Feature-Based Backend Architecture

**Status:** Final
**Tanggal:** 2026-06-15

**Keputusan:** Gunakan feature-based (vertical slice) architecture untuk backend code organization.

**Alternatives:**
- Feature-based (setiap module self-contained: routes + handlers + services + queries) — dipilih
- Layered (folder routes/, services/, repositories/, models/) — familiar tapi gampang god class
- Hexagonal (Ports & Adapters) — overkill untuk internal dashboard MVP
- Clean Architecture — too many abstraction layers untuk MVP
- Flat (no structure) — messy di 14+ modules

**Alasan:**
- Setiap fitur (auth, contacts, conversations, KB) self-contained module
- Easy to find — semua kode untuk "contacts" ada di satu folder
- Easy to delete — hapus folder module = hapus fitur
- Shared concerns (db, redis, auth, ai) di lib/ — tidak duplikasi
- BullMQ workers terpisah di workers/ — async processing concern
- Route layer thin — hanya wiring, tidak ada logic
- Scalable ke larger team — setiap orang kerja di module berbeda tanpa conflict

**Impact:**
- 14 feature modules di `modules/`
- 4 BullMQ workers di `workers/`
- 6 shared utilities di `lib/`
- Module structure: routes.ts → handlers.ts → services.ts → queries.ts → types.ts
