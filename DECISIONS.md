# DECISIONS.md

Log keputusan arsitektural & teknis. Setiap keputusan diberi kode DEC-XXX.

---

## DEC-039: AI Reply Async via BullMQ `ai-queue` + Peningkatan Kualitas/Kecepatan RAG

**Status:** Final
**Tanggal:** 2026-06-19

**Keputusan:** Generasi balasan AI dipindah dari **sinkron** (inline di `ingest.ts → maybeAutoReply`) ke **async queue** terpisah sesuai PRD §7.4, plus peningkatan kualitas & kecepatan balasan.

1. **Async queue:** `lib/queues.ts` tambah `aiQueue` (`ai-queue`, job `ai-reply`). `ingest.ts` dan `triggerAiReply` kini **enqueue** job (cepat, non-blocking) alih-alih memanggil LLM inline. `ai-worker.ts` (dulu stub mati) ditulis ulang jadi consumer nyata: `concurrency: 5`, panggil `maybeAutoReply`. Worker ingest tidak lagi terblok latensi LLM.
2. **`attempts: 1` (bukan 3):** channel `sendMessage` non-idempotent — retry job bisa kirim balasan dobel. `maybeAutoReply` sudah punya try/catch internal.
3. **Timeout per-provider:** `generateWithFallback` pakai `AbortSignal.timeout(AI_REQUEST_TIMEOUT_MS, default 12s)` → provider hang langsung failover, tidak menggantung.
4. **RAG threshold relevansi:** `searchChunks` kembalikan jarak cosine, ambil 8 kandidat, **filter `distance ≤ KB_MAX_DISTANCE` (default 0.6)** + dedupe konten + cap context 6000 char. Chunk tak relevan tak lagi mencemari prompt → bila kosong, guard "belum punya info" jujur aktif (anti-halusinasi).
5. **Enrichment + query expansion:** system prompt disuntik profil kontak (`fullName, pipelineStatus, source, notes`) + tanggal hari ini + instruksi ringkas/anti-halusinasi. Retrieval meng-embed **2–3 giliran user terakhir** (bukan hanya pesan terakhir) agar pertanyaan lanjutan tetap relevan. `buildHistory` buang pesan `system`.

**Alternatives:**
- Tetap sinkron (dipakai sebelumnya) — sederhana tapi memblok ingest & menyimpang dari PRD §7.4. Ditolak.
- Retry job > 1 — risiko balasan dobel pada channel non-idempotent. Ditolak.

**Impact:**
- Backend: `lib/queues.ts` (+`aiQueue`), `workers/ai-worker.ts` (rewrite), `modules/messages/ingest.ts` + `ai-reply.ts` (enqueue + buildHistory + inject kontak), `lib/ai.ts` (timeout), `modules/knowledge-base/queries.ts` (`searchChunks` threshold), `modules/ai-assistant/services.ts` (`buildSystemPrompt`/`generateRagReply` enrichment + query expansion).
- Env baru (opsional): `AI_REQUEST_TIMEOUT_MS`, `KB_MAX_DISTANCE`.
- Test: **135 unit + 67 integration hijau**. Live-verified (Gemini asli): RAG threshold→jawaban jujur tanpa info, handoff terdeteksi, multi-turn query expansion, async `ai-queue` worker mengonsumsi job & menyimpan balasan.

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

---

## DEC-011: Single .env File at Monorepo Root

**Status:** Final
**Tanggal:** 2026-06-16

**Keputusan:** Hanya ada satu file `.env` di root monorepo. Backend memuat env dari root pakai `--env-file=../../.env` pada script dev/start.

**Alternatives:**
- Duplikat `.env` per app (apps/server/.env, apps/web/.env) — mudah tapi risk terhadap drift
- Single `.env` di root + `--env-file` flag — dipilih
- dotenv library — tidak perlu, Bun support native `--env-file`

**Alasan:**
- Single source of truth — tidak ada risk `.env` beda antar apps
- Bun native support `--env-file` — tidak perlu install dotenv
- Lebih mudah maintain — ubah sekali di root, semua terpengaruh
- `apps/server/.env` sering terlupakan di `.gitignore` dan bocor ke repo

**Impact:**
- `.env` hanya di root monorepo
- `apps/server/package.json` dev/start script pakai `--env-file=../../.env`
- `.gitignore` root harus include `.env`

---

## DEC-012: Pipeline Columns — Dynamic State in Zustand

**Status:** Final
**Tanggal:** 2026-06-17

**Keputusan:** Pipeline columns diubah dari hardcoded constant (`PIPELINE_COLUMNS` di `lib/constants.ts`) menjadi dynamic state di Zustand store (`useCrmStore.columns`). `DEFAULT_PIPELINE_COLUMNS` di `mock/crm.ts` sebagai source of truth untuk initial value.

**Alternatives:**
- Dynamic Zustand state (dipilih) — columns bisa ditambah/diubah/dihapus runtime
- Local component state — tidak bisa share across KanbanBoard + ContactsList + Profile
- React Context — overkill untuk ini, Zustand sudah ada

**Alasan:**
- Kolom harus bisa diubah user (Phase 2-4: rename, add, delete)
- 5 consumer components perlu baca columns dari satu source
- Zustand sudah dipakai untuk CRM state (contacts, filters)
- `DEFAULT_PIPELINE_COLUMNS` tetap di `mock/crm.ts` sebagai initial value + type `PipelineColumn` di sana juga

**Impact:**
- `lib/constants.ts PIPELINE_COLUMNS` tidak lagi dipakai oleh CRM components
- Semua consumer component (KanbanBoard, ContactTable, ContactFilters, ContactEditModal, ContactInfoCard, ContactProfileHeader) baca dari store
- Phase 2-4 tinggal tambah UI + dispatch store actions (renameColumn, addColumn, removeColumn)
- `apps/web/` (Vite) baca `VITE_*` dari root `.env` via Vite's built-in support

---

## DEC-013: Cross-Module Agent Data Bridge

**Status:** Final
**Tanggal:** 2026-06-17

**Keputusan:** `mock/inbox.ts` mendeclare `MOCK_AGENTS` sebagai derived data dari `mock/agents.ts` via `getAgents()`, bukan hardcoded array terpisah.

**Alternatives:**
- Derived data via getAgents() (dipilih) — single source of truth, perubahan di Kelola Agent otomatis terreflect ke Inbox/CRM
- Hardcoded array terpisah di mock/inbox.ts — simple tapi data duplikat, risk drift
- Shared Zustand store — overkill untuk mock data, couples modules unnaturally

**Alasan:**
- Agent data harus konsisten di seluruh modul (Inbox agent filter, CRM contact assignment, ContactProfile agent display)
- `getAgents()` adalah stable reference — setiap call return snapshot terkini
- Tidak perlu import AgentProfile type ke inbox.ts — cukup map ke Agent[] subset (id, name, initials, status, activeConversationCount)
- Zero coupling antar module — agents.ts tidak tahu inbox.ts exist

**Impact:**
- Perubahan agent (tambah/edit/hapus/status) di Kelola Agent langsung terreflect di Inbox agent filter dan CRM assignment dropdown
- `mock/inbox.ts` import `getAgents` dari `mock/agents.ts` — satu import baru
- `MOCK_AGENTS` di inbox.ts menjadi `const` yang di-initialize dari getAgents() (module-level)

---

## DEC-014: Per-AI Assistant Config Architecture

**Status:** Final
**Tanggal:** 2026-06-17

**Keputusan:** Setiap AI Assistant mendapat config independen (persona, workingHours, handoffConfig, KB scope), bukan shared global state.

**Alternatives:**
- Per-AI Assistant config (dipilih) — maximum flexibility, sesuai PRD v1.3, memungkinkan override per assistant
- Shared global + per-assistant overrides — lebih kompleks, cascade logic sulit di-maintain
- Single global config — tidak mendukung multiple assistants

**Alasan:**
- PRD v1.3 menetapkan multiple configurable AI Assistants, masing-masing bisa di-assign ke agent berbeda
- Setiap assistant mungkin punya karakter berbeda (formal untuk support, casual untuk marketing)
- Working hours berbeda per team/timezone (support 24/7, sales jam kantor)
- KB scope berbeda: support bot butuh docs produk, marketing bot butuh docs campaign

**Impact:**
- Store `ai-assistants.ts` CRUD operasi langsung edit full object (bukan partial override)
- AI Assistant detail page punya 6 config sections yang masing-masing save independently
- System Default AI Assistant (fallback) juga punya config sendiri, bukan shared global state

---

## DEC-015: Two-Level Knowledge Base Scope

**Status:** Final
**Tanggal:** 2026-06-17

**Keputusan:** KB scope dua level — Global (system-wide) + Per-AI Assistant (custom override). Custom KB mengoverride KB global.

**Alternatives:**
- Two-level scope: Global + Per-Assistant Custom (dipilih) — sesuai PRD v1.3, clear priority chain
- Flat per-assistant KB — setiap assistant punya KB sendiri, tanpa global fallback — redundant docs
- Global-only KB — tidak mendukung per-assistant specialization

**Alasan:**
- Global KB = base knowledge yang semua assistant butuh (info perusahaan, FAQ umum)
- Custom KB = specialized knowledge per assistant (produk spesifik, campaign detail)
- Override behavior: jika assistant punya custom KB, ia pakai custom SAJA (bukan merge)
- Mengurangi duplikasi — common docs cukup di-global, hanya yang spesifik yang di-custom

**Impact:**
- `KBDocument.aiAssistantId` field: `undefined` = global, `string` = per-assistant
- `AIAssistant.knowledgeBaseScope`: 'global' | 'custom' + `customKBDocumentIds: string[]`
- KB selector UI: toggle global/custom + checkbox list untuk custom scope

---

## DEC-016: Bidirectional AI Assistant ↔ Agent Assignment Sync

**Status:** Final
**Tanggal:** 2026-06-17

**Keputusan:** Assignment disimpan di DUA tempat — `agent.aiAssistantId` DAN `assistant.assignedAgentId`. Setiap perubahan assignment harus update kedua sisi.

**Alternatives:**
- Bidirectional sync (dipilih) — query mudah dari kedua sisi (agent page → assistant, assistant page → agent), no JOIN needed
- Single-sided reference (agent → assistant only) — simpler tapi agent profile page butuh lookup assistants[] untuk resolve
- Shared junction table — overkill untuk mock data 1:1 relationship

**Alasan:**
- AgentProfilePage perlu resolve assignedAssistant dari agent.aiAssistantId
- AIAssistantDetailPage perlu resolve assignedAgent dari assistant.assignedAgentId
- Bidirectional sync memungkinkan O(1) lookup dari kedua sisi
- Backend nanti bisa normalize ke junction table tanpa mengubah UI logic

**Impact:**
- Assign handler di AgentProfilePage: `editAssistant(id, { assignedAgentId })` + `editAgent(agentId, { aiAssistantId })`
- Assign handler di AIAssistantDetailPage: `editAssistant(id, { assignedAgentId })` + `editAgent(agentId, { aiAssistantId })`
- AssignAgentModal: shows warning when target agent already assigned to different assistant

---

## DEC-017: Reverse Modal Pattern for Agent→Assistant Assignment

**Status:** Final
**Tanggal:** 2026-06-17

**Keputusan:** AgentProfilePage menggunakan `AssignAIAssistantModal` (select assistant dari dropdown), bukan reuse `AssignAgentModal` (select agent dari dropdown).

**Alternatives:**
- Separate modal per direction (dipilih) — clear UX, correct labels, no prop confusion
- Single generic "AssignmentModal" with direction prop — over-abstracted for 2 use cases
- Inline dropdown instead of modal — breaks card-based design pattern

**Alasan:**
- AssignAgentModal: context = "which agent to assign this AI Assistant to?" → lists agents
- AssignAIAssistantModal: context = "which AI Assistant to give this agent?" → lists assistants
- Different props, different data, different empty states — a single generic modal would need many conditional branches
- 2 small focused components beat 1 complex generic one (KISS)

**Impact:**
- New file: `components/ai-assistants/AssignAIAssistantModal.tsx`
- Reuses same visual pattern (zoom-in-95 animation, card grid, confirm/cancel)
- No changes to existing AssignAgentModal

---

## DEC-018: Module 1 Inbox — Schema Extensions, Channel Provider, Denormalisasi

**Status:** Final
**Tanggal:** 2026-06-18

**Keputusan:** Memperluas schema untuk backend Omnichannel Inbox sesuai kontrak data frontend (`mock/inbox.ts`):
- `conversations`: tambah `priority`, `unread_count`, `last_message_preview` (denormalisasi)
- `channels`: tambah `provider` (whatsapp_cloud | whatsapp_fonnte | telegram_bot | instagram | facebook | livechat) + index `provider`/`type`
- Tabel baru `contact_activities` (activity log per kontak — dibutuhkan ContactDetailPanel)
- Tabel baru `quick_replies` (shortcut `/` di input chat — dibutuhkan inbox)

**Alternatives:**
- Denormalisasi `last_message_preview`+`unread_count` di conversations (dipilih) — list inbox 1 query, tanpa N+1 ambil last message per percakapan
- Hitung last message & unread on-the-fly via subquery per row — N+1 / subquery mahal di list ribuan percakapan
- `quick_replies` reuse tabel `templates` — ditolak: templates tak punya `shortcut`, beda use case (Module 5 vs inbox)
- `contact_activities` simpan sebagai JSONB di contacts — ditolak: tak bisa diindeks/paginate per tipe

**Alasan:**
- Performa: target list percakapan < 300ms untuk ribuan baris → preview & unread tersimpan, diupdate saat insert/baca pesan
- `provider` memisahkan kanal logis (whatsapp) dari implementasi (cloud official vs Fonnte unofficial) → mendukung official + unofficial tanpa ubah `type`
- `messages.content` tetap JSONB `{text?, mediaUrl?, fileName?, fileSize?, location?}` → handler flatten ke shape frontend

**Impact:**
- `lib/schema.ts` +3 kolom conversations, +1 kolom + 2 index channels, +2 tabel baru
- Migration `drizzle/0000_pretty_ultimates.sql` (DB kosong → single fresh migration, applied)
- `lib/seed.ts` diperluas: demo inbox realistis (4 channel incl. WA official + Fonnte, 5 kontak, 5 percakapan, 9 pesan, activities, quick replies)
- `drizzle.config.ts` load root `.env` sendiri (`process.cwd()` + parse manual) karena `drizzle-kit` tak mewarisi `--env-file`; `db:seed` pakai `bun --env-file`. Standard `bun run db:migrate/push/studio/seed` kini berfungsi.

---

## DEC-019: Module 1 Inbox — Lib Foundation (Channel Adapter, Realtime, Auth Plugin)

**Status:** Final
**Tanggal:** 2026-06-18

**Keputusan:** Pondasi cross-module Phase 1:
- **Channel adapter abstraction**: interface `ChannelAdapter { sendMessage, verifyWebhook, parseInbound }` + `NormalizedInbound`/`MessageContent` (`adapter.ts`). 6 provider stub (`createStubAdapter` → `sendMessage`/`parseInbound` lempar `NotImplementedError` 501) + `simulatorAdapter` fungsional. Registry: `getAdapter(provider)` (real) vs `getEffectiveAdapter(provider)` → simulator bila `CHANNEL_SIMULATE !== "false"` (default ON).
- **Realtime pub/sub**: single Redis channel `realtime:events`, payload `{ rooms[], type, data }`. `publishRealtime()` (koneksi utama) + `startRealtimeSubscriber()` (koneksi terpisah via `createRedisConnection`).
- **WS room registry** (`ws.ts`): in-memory `Map<room, Set<client>>` + reverse map; `joinRoom/leaveRoom/registerClient/unregisterClient/broadcast`. Room: `inbox` (global), `agent:{id}`, `conversation:{id}`. Broadcast union-dedup antar room, auto-unregister bila `send` gagal.
- **Auth plugin** (`auth-plugin.ts`): `.derive({as:'scoped'})` inject `auth: JwtPayload | null` dari header Bearer. Enforcement via `requireAuth(auth)`/`requireRole(auth,...)` di handler (re-export dari `lib/auth`).

**Alternatives:**
- Effective-adapter pola simulator (dipilih) — outbound bisa diuji lokal tanpa API asli; flip ke real cukup set `CHANNEL_SIMULATE=false`. Alternatif "channel provider=simulator di DB" ditolak: seed pakai provider asli, lebih natural toggle via env.
- Realtime 1 channel + room di payload (dipilih) — sederhana, 1 subscriber. Alternatif channel Redis per-room → ledakan subscribe/unsubscribe, lebih kompleks.
- Auth derive-only + enforce di handler (dipilih) — **macro v2 Elysia 1.3 gagal typecheck** (return lifecycle object dianggap perlu InputSchema). Konsisten dgn pola handler existing (`requireAuth`).

**Alasan:**
- Adapter = SSOT pengiriman/parsing per provider → tambah provider baru (mis. WA unofficial lain) = 1 file + 1 entry registry, tanpa sentuh service
- Simulator memenuhi keinginan user "mudah testing" tanpa integrasi
- WS in-memory cukup single-server (DEC-006); horizontal scaling pakai Redis pub/sub yang sudah ada sebagai jembatan

**Impact:**
- File baru: `lib/pubsub.ts`, `lib/ws.ts`, `lib/auth-plugin.ts`, `modules/channels/adapter.ts`, `modules/channels/registry.ts`, `modules/channels/providers/{whatsapp-cloud,whatsapp-fonnte,telegram,instagram,facebook,livechat,simulator}.ts`
- Env baru opsional: `CHANNEL_SIMULATE` (default true)
- typecheck bersih; smoke test runtime lulus (registry resolve, simulator send/parse, stub throw 501, ws broadcast+cleanup)

---

## DEC-020: Module 1 Inbox — API Modules (Phase 2)

**Status:** Final
**Tanggal:** 2026-06-18

**Keputusan:** Implementasi 7 modul REST 4-layer + 2 helper lib:
- `lib/validation.ts` — `parseSafe<S extends z.ZodTypeAny>(schema, data): z.output<S>` (generic atas ZodType menghindari masalah variance input≠output saat `.default()`/`.transform()`/`.refine()`)
- `lib/queues.ts` — BullMQ `messageQueue`; koneksi via `parseRedisConnection(REDIS_URL)` → `{host,port,...}` (hindari bentrok tipe dua versi ioredis: dep 5.11 vs bundel BullMQ 5.10)
- **labels** & **quick-replies** = modul BARU (sebelumnya tak ada) → didaftarkan di `routes/index.ts`
- **conversations**: list 1 query (innerJoin contacts+channels, leftJoin users) + filter (channel/status/agent/search/labelIds via subquery `inArray`) + sort (newest/waiting/priority via CASE rank) + pagination; label di-batch 1 query terpisah (`listLabelsForConversations`) lalu di-map → hindari N+1 & json_agg
- **messages**: list cursor `createdAt < cursor` desc (limit 30) lalu reverse + `nextCursor`; nama agen di-batch (`getAgentNames` `inArray`); `content` JSONB → flatten ke shape FE; send → insert + `getEffectiveAdapter().sendMessage` + update preview/lastMessageAt + `isAiHandling=false` + publish realtime
- **channels**: CRUD (admin) + `POST /:id/simulate-inbound` → `simulatorAdapter.parseInbound` (validasi) → enqueue `messageQueue` job `inbound` (`jobId = externalMessageId` untuk dedup)
- **contacts**: lengkapi services/handlers; detail = base + `channelIdentifiers` + `activityLog`; +`findContactByChannelIdentifier` (dedup) & `createContactActivity`
- **users**: `GET /users/agents` → agen + `activeConversationCount` (count filtered di SQL, 1 query group by)

**Enforcement auth:** tiap routes `.use(authPlugin)`; handler panggil `requireAuth(auth)` (+`requireRole` utk admin: channels/labels/quick-replies CRUD). Mengikuti DEC-019 (macro v2 ditolak).

**Alternatives:**
- Label list percakapan: batched query + map (dipilih) vs `json_agg` di query utama (lebih sulit di-type Drizzle, kurang fleksibel)
- Embedded `assignedAgent.activeConversationCount` di list percakapan di-set 0 (bukan dihitung per-baris) → hindari N+1; angka asli via `/users/agents`
- messages routes pakai prefix `/conversations` (`/:id/messages`) — RESTful, FE-friendly; 2 instance Elysia prefix sama (conversations + messages) dimount terpisah

**Impact:**
- File baru: `lib/validation.ts`, `lib/queues.ts`; modul `labels/*`, `quick-replies/*` (5 file each); `users/{queries,services,handlers}`, `contacts/{services,handlers}`, `messages/{types,queries,services,handlers}`, `conversations/{types,queries,services,handlers}`, `channels/{types,queries,services,handlers}`; semua `routes.ts` terkait diisi; `routes/index.ts` +2 modul
- `contacts/queries.ts`: hapus import mati `like` (membereskan error pre-existing) + tambah dedup/activity query
- Verified live: login→JWT, 401 tanpa token, agents+count, list percakapan (sort priority, label batched), messages (cursor, senderName), send (preview+aiHandling flip), assign/read/label, simulate-inbound→worker terima job, validation error field-level

---

## DEC-021: Module 1 Inbox — Inbound Ingest Pipeline (Phase 3)

**Status:** Final
**Tanggal:** 2026-06-18

**Keputusan:** `message-worker` memproses job `inbound` via `modules/messages/ingest.ts → ingestInbound(channelId, inbound)`:
1. **Dedup kontak** — `findContactByChannelIdentifier(channelType, identifier)`; bila tak ada → `createContact` (pipelineStatus `new_lead`, source=channelType, `phoneNumber` diisi bila WA) + `createContactChannel` (`onConflictDoNothing`, unique `(channelType, identifier)`) + activity `message_sent`
2. **Find/create conversation** — `findReusableConversation` (status ∈ open/pending/snoozed, terbaru); bila tak ada → `createConversation` (open). Conversation `resolved` TIDAK dipakai ulang → buat thread baru
3. **Insert message** inbound (senderType `contact`, status `delivered`, simpan `externalMessageId`)
4. **Update conversation** — `applyInbound`: preview + lastMessageAt + `unreadCount = unreadCount + 1` (SQL increment), reopen `snoozed→open`
5. **Publish realtime** `message:new` + `conversation:updated` (rooms: conversation + inbox + agent bila assigned)

Worker thin (route by `job.name`); business logic di service → testable Phase 5.

**Alternatives:**
- Reuse conversation non-resolved + reopen snoozed (dipilih) — thread berlanjut natural; resolved=tutup → thread baru (audit jelas). Alternatif selalu 1 conversation per contact-channel ditolak (riwayat resolved tercampur)
- `unreadCount` SQL increment (dipilih) vs read-modify-write (race condition)
- Idempoten via BullMQ `jobId = externalMessageId` (set di Phase 2 enqueue) → pesan sama tak diproses dua kali

**Race condition:** dua inbound kontak-baru bersamaan → unique index `contact_channels` tolak insert kedua → job retry (attempts 3, backoff) → `findContactByChannelIdentifier` sudah menemukan. Acceptable.

**Impact:**
- File baru: `modules/messages/ingest.ts`
- `conversations/queries.ts` +`findReusableConversation`/`createConversation`/`applyInbound`
- `contacts/queries.ts` +`createContactChannel`
- `workers/message-worker.ts` panggil `ingestInbound` (pakai `queueConnection` dari `lib/queues`)
- Live-verified: inbound baru → kontak+percakapan baru (unread=1, preview); inbound ke-2 nomor sama → reuse (total convs tetap, unread→2, 2 pesan inbound), worker log tanpa "(kontak baru)"

---

## DEC-022: Module 1 Inbox — WebSocket + Realtime Wiring (Phase 4)

**Status:** Final
**Tanggal:** 2026-06-18

**Keputusan:** Wire realtime di `index.ts`:
- Endpoint Elysia `.ws("/ws")` (Bun native µWebSocket). **Auth via query token** (`?token=`) di `open` → `verifyToken`; gagal → `ws.close()`
- Client registry pakai `ws.raw` (Bun ServerWebSocket, identity stabil lintas open/message/close) sebagai `WsClient`
- `open` → `registerClient(client, [INBOX_ROOM, agentRoom(sub)])` (tiap agen auto-join inbox global + room pribadi)
- `message` → `{action:"subscribe"|"unsubscribe", conversationId}` → join/leave `conversationRoom(id)` (subscribe saat buka thread, unsubscribe saat tutup)
- `close` → `unregisterClient`
- `startRealtimeSubscriber((event) => broadcast(event.rooms, {type, data}))` jembatani Redis pub/sub → WS room broadcast. `stopRealtimeSubscriber` di graceful shutdown

**Alternatives:**
- Auth via query token (dipilih) — WebSocket browser tak bisa set header Authorization; token di query standar untuk WS. Alternatif subprotocol header lebih ribet di FE
- `ws.raw` sebagai key registry (dipilih) — wrapper Elysia `ws` bisa beda instance per event; raw socket stabil
- Bridge Redis→WS (dipilih, DEC-019) — siap horizontal scaling; broadcast in-memory cukup single-server

**Impact:**
- `index.ts`: +`.ws("/ws")` + `parseWsMessage` + `startRealtimeSubscriber` + shutdown `stopRealtimeSubscriber`
- Live-verified: WS connect+auth, subscribe conv, simulate-inbound → terima `message:new` + `conversation:updated` (payload benar); token kosong/salah → koneksi ditutup
- Catatan: client-side reconnect logic = tanggung jawab FE (Phase connect FE nanti)

---

## DEC-023: Module 1 Inbox — Testing Strategy (Phase 5)

**Status:** Final
**Tanggal:** 2026-06-18

**Keputusan:** Unit test Vitest tanpa infra (DB/Redis tidak dipakai): mock query module + `@/lib/pubsub` via `vi.mock`. 68 test / 11 file:
- Pure: `lib/ws` (room registry/broadcast/dedup/cleanup), `lib/validation` (parseSafe), `channels/adapter` (stub 501 + simulator normalize/validasi), `channels/registry` (resolve + effective simulator toggle env), Zod (`messages/types`, `conversations/types`)
- Service (mock queries+pubsub): `users/services` (initials+map), `messages/services` (preview, list cursor/reverse/senderName, send→insert+simulator+update+emit), `conversations/services` (map+label group, NotFound, assign emit+activity), `messages/ingest` (new-contact + dedup/reopen path)

**Alternatives:**
- Unit + mock (dipilih) — cepat (~290ms), deterministik, jalan tanpa Postgres/Redis di CI
- Integration test (DB nyata) handlers/queries — **ditunda**: butuh test DB terisolasi + Redis; akan ditambah saat setup CI test-db. Pengganti sementara: smoke test live end-to-end tiap fase (terdokumentasi di PROGRESS)

**Impact:**
- 11 file `*.test.ts` baru; `bun run test` hijau (68/68), `bunx tsc --noEmit` bersih
- Gap diketahui: handlers (integration HTTP 200/400/401/404) & queries (integration DB) belum ber-unit-test → coverage threshold `test:coverage` (services/handlers/queries) belum dijamin sampai test-db CI ada
- 2 bug data di test sendiri diperbaiki (mock insertMessage tipis, ekspektasi nextCursor) — bukan bug kode produksi

---

## DEC-024: Module 1 Inbox — Integration Test Infrastructure

**Status:** Final
**Tanggal:** 2026-06-18

**Keputusan:** Integration test pakai Postgres + Redis lokal nyata, DB terisolasi `dbb_psc_test`:
- Config terpisah `vitest.config.integration.ts` (include `*.integration.test.ts`, `pool: forks`, `maxWorkers/minWorkers: 1`, `fileParallelism: false` → serial, hindari tabrakan state DB). Unit config `vitest.config.ts` meng-exclude `*.integration.test.ts`
- `globalSetup` (`src/test/global-setup.ts`) — `CREATE DATABASE dbb_psc_test` bila belum ada (connect ke db `postgres`), lalu `migrate()` (drizzle migrator) ke test DB
- `setupFiles` (`src/test/setup-env.ts`) — set `process.env.DATABASE_URL` ke test DB + `CHANNEL_SIMULATE=true` SEBELUM `lib/db` di-import (per worker)
- `src/test/env.ts` — `loadRootEnv()` parse `../../.env` manual (drizzle-kit/vitest tak warisi `--env-file`) + `testDatabaseUrl()` (swap nama db → `_test`)
- `src/test/helpers.ts` — `testApp` (Elysia `apiRoutes`+errorHandler, dipanggil via `app.handle(new Request(...))` tanpa `.listen`), `apiRequest()`, `token()` (signAccessToken), `resetDb()` (TRUNCATE ... RESTART IDENTITY CASCADE), seed helpers (user/channel/contact/contactChannel/conversation/label)
- Script `test:integration`

**Alternatives:**
- DB test terpisah `dbb_psc_test` (dipilih) — isolasi penuh dari data dev; auto-create+migrate di globalSetup. Alternatif transaksi rollback per test ditolak (Elysia handler pakai koneksi pool sendiri, sulit bungkus 1 transaksi)
- `app.handle(Request)` (dipilih) — uji HTTP penuh (routing+auth plugin+validation+error handler) tanpa buka port; cepat & paralel-safe
- `TRUNCATE CASCADE` per `beforeEach` (dipilih) — sederhana, deterministik

**Impact:**
- File baru: `vitest.config.integration.ts`, `src/test/{env,setup-env,global-setup,helpers}.ts`, 4 file `*.integration.test.ts` (contacts queries, conversations/messages/channels handlers)
- 21 integration test: HTTP 200/401/403/404/422, list+detail join, status/read/label, send+list pesan, simulate-inbound enqueue, role guard admin; + queries DB (CRUD, dedup, activities, filter/paginate)
- Total test repo: **89** (68 unit + 21 integration), `tsc` bersih. Butuh Postgres+Redis lokal jalan (akan jadi service di CI nanti)

---

## DEC-025: Module 1 Inbox — Frontend ↔ Backend Integration

**Status:** Final
**Tanggal:** 2026-06-18

**Keputusan:** Hubungkan FE Module 1 ke API + WS, hapus data dummy (scope Module 1 saja).
- **Tipe** dipindah ke `src/types/inbox.ts`; `mock/inbox.ts` re-export tipe (array mock tetap → Module 4 aman)
- **Data layer**: `lib/api/client.ts` (unwrap envelope `.data`, 401→refresh sekali→logout), `lib/api/inbox.ts` (fungsi typed + tipe respons Api*), `lib/queryKeys.ts`, `hooks/inbox.ts` (TanStack Query + mutations), `hooks/useInboxRealtime.ts` (WS)
- **Realtime**: WS `${WS_URL}/ws?token=`; `message:new`→append cache (dedup by id)+invalidate list; `conversation:updated|assigned`→invalidate; derive notifikasi ke `useNotificationStore` (init `[]`, bukan mock)
- **Filter/sort/search di backend** (query params) via `useInboxStore` (+`searchQuery`,`channelTab`); hapus filter client-side
- **Komponen**: ConversationList/ChatPanel/ContactDetailPanel/AssignAgentModal/TransferModal/QuickReplyMenu/LabelPicker/LabelsPage/LabelTable + notifications store → API hooks
- **Backend tambahan kecil**: filter `contactId` di `GET /conversations` (riwayat kontak), `conversationCount` di `GET /labels`

**Alternatives:**
- Tipe respons API terpisah (`ConversationListItem`, `ContactDetail`) vs paksa pakai tipe mock penuh — dipilih terpisah karena `contact` di list = subset (hindari refactor tipe Module 4)
- Notifikasi derive WS client-side (non-persist) vs backend baru — derive (sesuai keputusan user)
- Token WS via query param (browser WS tak bisa set header)

**Catatan:**
- **Media upload belum didukung** (tak ada endpoint storage) → tombol file di chat di-noop sementara
- `lib/api/client.ts` pakai `document.cookie` → hanya jalan di browser (verifikasi penuh = manual browser / Playwright)

**Impact:**
- File FE baru: `types/inbox.ts`, `lib/queryKeys.ts`, `lib/api/{client,inbox}.ts`, `hooks/inbox.ts`, `hooks/useInboxRealtime.ts`
- File FE diubah: InboxPage, ConversationList, ChatPanel, ContactDetailPanel, AssignAgentModal, TransferModal, QuickReplyMenu, LabelPicker, LabelsPage, LabelTable, LabelManagerModal, stores/{ui,notifications}, mock/inbox.ts
- Backend: `conversations/{types,queries}` (+contactId), `labels/queries` (+count), test (+2 case) → **69 unit + 22 integration hijau**
- FE `tsc -p tsconfig.app.json` bersih + `bun run build` sukses; semua endpoint FE-consumed diverifikasi shape-nya live (labels count, contacts detail, contactId filter, notes PUT); WS realtime sudah terbukti (DEC-022)
- Module 1 (komponen inbox + /labels) **bebas data dummy** (mock array tetap utk modul lain)

---

## DEC-026: Channel Integration #1 — Telegram (REAL, bukan mock)

**Status:** Final
**Tanggal:** 2026-06-18

**Keputusan:** Integrasi Telegram nyata via Bot API, dukung polling (dev/testing) + webhook (produksi).
- **Adapter** `providers/telegram.ts` (real): `sendMessage` (sendMessage/sendPhoto/sendDocument/sendLocation ke `api.telegram.org/bot{token}`), `parseInbound` (Telegram Update → NormalizedInbound, text/photo/document/location), `verifyWebhook`. `telegramCall` helper. Token dari `channel.credentials.botToken`.
- **Inbound polling**: `workers/telegram-poller.ts` long-poll `getUpdates` (timeout 20) per channel `provider=telegram_bot` aktif & `credentials.mode!=='webhook'`; offset di Redis `telegram:offset:{channelId}`; enqueue ke `messageQueue` (`inbound`, jobId `tg_{channel}_{update_id}` idempoten) → reuse ingest. `deleteWebhook` saat mulai. Start/stop di `workers/index.ts`.
- **Inbound webhook** (produksi): route PUBLIK `POST /webhooks/telegram/:channelId` di `index.ts` (di luar authPlugin) → `handleTelegramWebhook` verifikasi `x-telegram-bot-api-secret-token` vs `credentials.webhookSecret` → parseInbound → enqueue.
- **Registry**: hapus `getEffectiveAdapter`/`isSimulateMode` (override simulator global). `messages/services.sendMessage` pakai `getAdapter(provider)` langsung. Simulator kini cuma provider eksplisit (`provider='simulator'`) + path `simulate-inbound`. Konsekuensi: kirim ke channel stub (whatsapp_cloud/fonnte/ig/fb) lempar 501 (jujur — belum diintegrasi); testing kirim pakai channel `simulator` atau `telegram`.
- **FE**: `ChannelType` +`telegram`, `ChannelIcon` ikon TG, tab "TG" di ConversationList, `ChannelTab` di store.

**Alternatives:**
- Polling + webhook keduanya (dipilih, "ideal testing+prod") — polling tanpa URL publik utk dev, webhook utk prod
- Token via channel.credentials (user buat channel sendiri via curl) — token tak masuk context; plaintext sementara (enkripsi AES = utang teknis)
- Inbound media: simpan caption/placeholder (resolusi file Telegram perlu getFile+token, di luar `parseInbound` murni) — text/lokasi penuh, media best-effort

**Impact:**
- File baru: `providers/telegram.ts` (+test), `workers/telegram-poller.ts`, `modules/channels/telegram-webhook.ts`; `channels/queries` +`listActiveTelegramChannels`; `index.ts` +webhook route; `workers/index.ts` +poller; registry/messages disesuaikan; FE ChannelIcon/ConversationList/types/ui
- Test: 73 unit (+5 telegram) + 22 integration hijau; BE & FE `tsc` bersih; server boot OK (poller idle tanpa channel, webhook route balas)
- **Bugfix saat verifikasi live**: outbound `to` semula = `conversation.contactId` (UUID internal) → Telegram "chat not found". Fix: `getContactChannelIdentifier(contactId, channelType)` ambil identifier kanal asli (Telegram chat_id) sbg `to` (+regression test). 
- **LIVE VERIFIED** (bot @conflux_psc_bot): inbound `/start`+pesan → auto kontak "Albert Mangiri" + percakapan + unread; outbound dari API → terkirim ke Telegram (`message_id` numeric, tanpa error). Inbound+outbound nyata 2 arah berfungsi.

---

## DEC-027: Enkripsi Credentials Channel (AES-256-GCM)

**Status:** Final
**Tanggal:** 2026-06-18

**Keputusan:** Credentials channel (token bot dll) dienkripsi at-rest (PRD 10.3).
- `lib/crypto.ts` — AES-256-GCM, key 32 byte dari `ENCRYPTION_KEY` (base64) di `.env`. `encrypt/decrypt` (format `ivB64:tagB64:cipherB64`), `encryptCredentials(obj)→{_enc}`, `decryptCredentials(stored)` (deteksi `_enc`; **backward-compat**: object plaintext / null diteruskan apa adanya)
- **Tulis** (encrypt): `channels/services` create+update bungkus `input.credentials` → `{_enc}`
- **Baca** (decrypt) di titik pakai: `messages/services.sendMessage` (→ adapter), `workers/telegram-poller`, `channels/telegram-webhook`
- `listChannels`/`createChannel` respons pakai `publicColumns` (TANPA credentials) → token tak pernah keluar ke FE
- Migrasi: re-encrypt 1 channel telegram yang sudah ada (script one-off)

**Alternatives:**
- GCM (dipilih) — authenticated (deteksi tamper) vs CBC (tanpa integritas)
- Simpan `{_enc}` di kolom `credentials` jsonb (dipilih) — tanpa migrasi schema; vs kolom text terpisah
- Backward-compat read (dipilih) — tak meledak saat ketemu data lama plaintext; aman saat rollout

**Impact:**
- File baru `lib/crypto.ts` (+test 6 case: roundtrip, IV acak, tamper→throw, wrap/unwrap, plaintext passthrough, null)
- `ENCRYPTION_KEY` WAJIB di env (server + test setup-env pakai key dummy). Prod harus set key kuat & rahasia
- Verified: DB simpan `{_enc:...}` (cek `LIKE '%token%'` = 0), poller decrypt→polling jalan, outbound decrypt→terkirim (`message_id` numeric). 79 unit + 22 integration hijau, tsc bersih
- Utang: rotasi key belum ada

---

## DEC-028: Channel #2 WhatsApp Fonnte + Token via .env (resolver)

**Status:** Final
**Tanggal:** 2026-06-18

**Keputusan:** Integrasi WhatsApp Fonnte (unofficial, real) + **token channel disimpan di `.env`** (permintaan user), bukan di DB.
- **Token di env**: `TELEGRAM_BOT_TOKEN`, `FONNTE_TOKEN` di `.env`. Resolver `modules/channels/credentials.ts → resolveCredentials(provider, stored)`: decrypt config DB (mode/webhookSecret) lalu **inject token dari env** by provider (`telegram_bot→botToken`, `whatsapp_fonnte→apiToken`); env menang atas DB. Single titik resolusi dipakai sendMessage + telegram-poller + telegram/fonnte webhook.
- **Fonnte adapter** `providers/whatsapp-fonnte.ts` (real): `sendMessage` (POST `api.fonnte.com/send`, `Authorization: token`, target+message / url media / location), `parseInbound` (webhook fields `sender/name/message/url/extension/location`). Tipe channel `whatsapp`, provider `whatsapp_fonnte` → tampil di tab WA + ikon WA (tanpa perubahan FE).
- **Inbound Fonnte = webhook only** (Fonnte tak ada polling API): route publik `POST /webhooks/fonnte/:channelId` → parseInbound → ingest. Butuh URL publik + set di dashboard Fonnte.
- Telegram channel DB token di-strip (`{mode}` saja) → token Telegram kini env-only juga. DB token leak = 0.

**Alternatives:**
- Token di env + resolver (dipilih, permintaan user) — secret tak di DB; DB cuma config non-rahasia. Enkripsi DB (DEC-027) tetap berlaku utk secret DB lain (webhookSecret) + backward-compat
- Fonnte webhook-only inbound (dipilih) — sesuai kemampuan Fonnte; outbound jalan tanpa URL publik

**Impact:**
- File baru: `credentials.ts`, `providers/whatsapp-fonnte.ts` (real, +test), `fonnte-webhook.ts`; route fonnte di `index.ts`; read-points pakai `resolveCredentials`
- Test 87 unit (+8: fonnte parseInbound, resolveCredentials) + 22 integration hijau, tsc bersih
- Verified: token Fonnte valid (device "Jual Mobilmu", **device_status disconnect**); channel Fonnte dibuat (tanpa token di body); **inbound webhook Fonnte → ingest → kontak+percakapan WA** (live-simulated handler); Telegram tetap jalan via env token (outbound `message_id 7`); DB token leak 0
- **Live Fonnte pending user**: (1) connect device WA (scan QR dashboard Fonnte), (2) set webhook Fonnte ke `https://<publik>/webhooks/fonnte/<channelId>`

---

## DEC-029: Sinkronisasi Status Pesan (sent/delivered/read) + Centang Realtime

**Status:** Final
**Tanggal:** 2026-06-18

**Keputusan:** Status pesan keluar disinkronkan & centang di bubble realtime — **bergantung kemampuan channel**.
- **On send**: insert `status:'sent'`; sukses kirim → tetap **`'sent'`** (hanya tahu "diterima platform", BUKAN sampai device); gagal → `'failed'`. `delivered`/`read` HANYA dari status report nyata.
- **Update lanjut (delivered/read)**: `applyMessageStatus(externalMessageId, status)` → update DB + broadcast WS event baru `message:status` `{id, conversationId, status}`.
- **Fonnte**: webhook (`/webhooks/fonnte/:id`) bercabang — `{status,id}` tanpa `sender/message` = **status report** → `applyMessageStatus` (delivered/read/failed). `sender+message` = pesan masuk → ingest.
- **Telegram**: Bot API **tak ada delivery/read receipt sama sekali** → outbound **mentok `'sent'`** (centang 1). `message_id` cuma = "diterima server Telegram" (walau HP penerima offline) → TIDAK boleh ditandai delivered. (Koreksi atas asumsi awal yang salah men-set `delivered` saat accept.)
- **FE**: `useInboxRealtime` tangani `message:status` → patch status bubble di cache → centang berubah tanpa refresh.

**Alternatives:**
- Status via webhook report (Fonnte) + delivered-on-accept (dipilih) — akurat sesuai platform
- Telegram read: ditolak (mustahil di Bot API) — hanya delivered

**Impact:**
- `pubsub` +`message:status`; `messages/queries` `setMessageDelivery`+`updateMessageStatusByExternalId` (ganti `setMessageExternalId`); `messages/services` `applyMessageStatus` + delivered/failed on send; `fonnte-webhook` cabang status; FE `useInboxRealtime` patch status
- Test: 87 unit + 25 integration (+3 fonnte-webhook: status report→read, inbound, reject non-fonnte). BE+FE tsc bersih
- Verified live: Telegram send → `status: sent` (centang 1; jujur — tak ada delivered/read utk bot Telegram)

---

## DEC-030: Optimistic Send + Status "sending"/"failed" + Retry

**Status:** Final
**Tanggal:** 2026-06-18

**Keputusan:** Kirim pesan terasa instan via optimistic update.
- Status `'sending'` ditambah ke `MessageStatus` (FE).
- `useConversationMutations.send` kini `mutate({text, tempId})`: `onMutate` append bubble optimistic (`status:'sending'`, id `temp_*`) ke cache; `onSuccess` ganti temp dgn pesan asli (dedup vs WS echo by id); `onError` tandai temp `'failed'`.
- `ChatPanel.MessageBubble`: ikon jam (sending), retry "Gagal terkirim · Coba lagi" (failed) → `onRetry` hapus bubble gagal + kirim ulang (tempId baru).
- Dedup aman dgn WS `message:new` (by id) bila echo datang sebelum/sesudah onSuccess.

**Klarifikasi (laporan user "online tapi centang 1"):** untuk **Telegram itu memang ceiling** — Bot API tak punya delivery/read receipt. Bukan bug. Centang >1 hanya untuk channel dgn status report (Fonnte/WA).

**Impact:**
- FE: `types/inbox` (+`sending`), `hooks/inbox` (optimistic send), `ChatPanel` (retry + sending/failed UI). FE tsc bersih, e2e inbox 3/3 hijau (tanpa spam Telegram)
- Tanpa perubahan BE

---

## DEC-031: Integrasi UI Baru Module 1 ke Backend (filter/presence/media/channels)

**Status:** Final
**Tanggal:** 2026-06-18

**Keputusan:** Sambungkan UI baru Module 1 ke backend; semua filter/search/sort di SQL; hapus dummy.
- **Filter tanggal**: `listConversationsQuerySchema` +`datePreset` (today/7d/30d); query `gte(lastMessageAt, since)` di SQL. FE kirim param.
- **Presence**: `PATCH /users/me/status` (`updateUserStatus` → `users.status`) + publish WS `presence:changed` ke INBOX_ROOM; FE `PresenceSwitcher` panggil API, `useInboxRealtime` invalidate `agents` query saat event.
- **Media upload**: modul `media` `POST /media/upload` (multipart, requireAuth, validasi tipe image/video/audio/doc + max 10MB) → `storage.uploadFile` (MinIO) → `{url,fileName,fileSize,contentType}`. `ensureBucket` saat start (graceful bila MinIO down). FE `uploadMedia` (FormData) + `sendMedia` optimistic (upload → sendMessage mediaUrl).
- **Channels page**: katalog provider **statis** (config, bukan dummy) + merge instance dari `GET /channels` real; `ChannelConnectModal` create/update/delete via `useChannelMutations`. Token tetap env-first (DEC-028) → modal kasih note "token via env".
- **Notif prefs**: `soundEnabled`/`browserPushEnabled` persist ke `localStorage` (preferensi UI per-browser, bukan data domain).

**Alternatives:**
- datePreset (dipilih) vs dateFrom/dateTo ISO — preset cocok UI dropdown, hitung rentang di server
- Katalog statis + instance API (dipilih) vs full dari DB — katalog = daftar provider didukung (config), instance = channel terhubung nyata
- Notif prefs localStorage (dipilih) vs tabel user_preferences — murni UI, hindari tabel baru

**Impact:**
- BE baru: `modules/media/*`, `users` (+status update/handler/types/test), `conversations` (+datePreset), `pubsub` (+presence:changed), `index.ts` (+ensureBucket), `routes/index` (+media). 93 unit + 28 integration hijau (+datePreset, +presence integration, +media validasi unit)
- FE: `lib/api/inbox` (+channels/presence/uploadMedia/datePreset), `hooks/inbox` (+useChannels/useChannelMutations/sendMedia), `ChannelsPage`+`ChannelConnectModal` (API), `ConversationList` (datePreset), `PresenceSwitcher` (API), `useInboxRealtime` (presence), `ChatPanel` (media send), `stores/notifications` (localStorage). FE tsc bersih, build sukses, e2e 3/3
- **Batasan dev**: media butuh MinIO running (docker/colima); outbound media ke Telegram butuh MinIO URL publik (localhost tak reachable Telegram). Validasi + DB tetap benar.
- Module 1 FE **bebas dummy** (katalog provider = config statis, bukan data)
- **E2E LIVE-VERIFIED (MinIO up via colima)**: upload PNG → MinIO (`localhost:9000/dbb-psc-media/chat/...`, public fetch 200); browser flow chat: attach→preview→`POST /media/upload`→`POST messages` image; presence PATCH dari header; datePreset=7d & status=open jadi query param; channels page dari `GET /channels` + badge "Terhubung". Outbound media ke Telegram → `failed` (localhost url ditolak Telegram, sesuai batasan dev). 93 unit + 28 integration + 3 e2e hijau.

---

## DEC-032: Notif Persist (5.1.6) + Hardening Media URL (5.1.2)

**Status:** Final
**Tanggal:** 2026-06-18

**Keputusan:**
- **Notif persist**: tabel `notifications` (user_id FK, type, title, body, conversation_id?, is_read; index (user,created) & (user,read)). Modul `notifications` 4-layer: `GET /notifications?unreadOnly`, `POST /:id/read`, `POST /read-all` (scope `auth.sub`). Service `notifyUsers(userIds, payload)` = bulk insert + publish WS `notification:new` ke `agentRoom(userId)` per user (dedup). `resolveRecipients`: assigned → `[agentId]`; unassigned → `listUserIdsByRoles(agent/supervisor/admin/super_admin)` (broadcast antrian).
- **Sumber notif**: ingest pesan masuk → `new_message`; assign/transfer → `new_assignment` ke agent tujuan. (handoff/stale skema siap, fitur belum ada.)
- **FE**: store `loadFromServer` (GET awal) + `notification:new` WS append; `markAsRead`/`markAllAsRead` panggil API (optimistic). **Hapus derive client-side** (hindari notif ganda + targeting per-user benar). Suara/push tetap.
- **Media hardening**: `storage.buildPublicUrl(key)` — `MEDIA_PUBLIC_BASE_URL` (deploy R2/CDN/https) bila di-set, else `http(s)://endpoint:port/bucket/key` (scheme benar via `MINIO_USE_SSL`). Perbaiki akar bug "wrong HTTP URL". FE pakai `data.url` apa adanya.

**Impact:**
- BE: tabel `notifications` + migrasi `0001`; modul `notifications/*`; `users.listUserIdsByRoles`; `pubsub` +`notification:new`; hook `messages/ingest` + `conversations/services`; `storage.buildPublicUrl`
- FE: `lib/api/inbox` (+notifications API), `stores/notifications` (setAll/loadFromServer/API mark), `useInboxRealtime` (notification:new + load awal, hapus derive)
- Test: 101 unit + 32 integration hijau; FE tsc+build; e2e 6/6
- **Live-verified**: inbound unassigned → 4 user dapat notif (DB 4 rows), admin unread=1; read-all → 0; media URL kini `http://...` (scheme benar)
- Media delivery nyata nunggu URL publik saat deploy (`MEDIA_PUBLIC_BASE_URL`); sosmed lain di-hold

---

## DEC-033: Auto-Assign Round-Robin (least-busy) — PRD 5.1.4

**Status:** Final
**Tanggal:** 2026-06-18

**Keputusan:** Percakapan **baru** auto-assign ke agent saat ingest.
- **Strategi least-busy**: `findLeastBusyOnlineAgent()` (`users/queries`) — agent `role='agent' AND status='online'`, urut `count(open/pending) asc, fullName asc`, limit 1. Praktis round-robin yang adil + self-heal (tanpa cursor). Available = **online saja**.
- **Service** `conversations/auto-assign.ts` `autoAssign(convId, contactId, contactName?)`: skip bila `AUTO_ASSIGN_ENABLED==='false'`; pilih agent; tak ada → null (unassigned/antrian). Bila ada: `assignAgent` + activity `assignment` + WS `conversation:assigned` + `notifyUsers([agent],'new_assignment')`. Panggil primitif langsung (bukan `assignConversation` service) — hindari findConversationDetail ekstra.
- **Hook** `messages/ingest.ts`: hanya saat `createConversation` (conversation BARU); set `conversation.agentId` hasil auto-assign SEBELUM `resolveRecipients` → notif `new_message` tepat ke agent terpilih (bukan broadcast). Conversation reuse TIDAK di-assign ulang.
- **Toggle** env `AUTO_ASSIGN_ENABLED` (default true bila tak `'false'`).

**Alternatives:** least-busy (dipilih) vs strict RR cursor (Redis) — least-busy lebih adil + tanpa state. Online-only vs +busy — online-only sesuai PRD.

**Impact:**
- BE: `users/queries.findLeastBusyOnlineAgent`, `conversations/auto-assign.ts`, hook ingest. FE TANPA perubahan (sudah render assignedAgent + realtime).
- Test: 104 unit (+autoAssign) + 36 integration (+findLeastBusyOnlineAgent, +ingest auto-assign assigned/unassigned) hijau; e2e 7/7 (badge test di-deterministik-kan via self-assign sari, lepas dari routing auto-assign)
- **Live-verified**: sari online → simulate-inbound baru → conversation auto-assign ke Sari Dewi; tak ada agent online → unassigned (broadcast lama)
- **Race** 2 inbound bersamaan bisa pilih agent sama (count belum update) — acceptable MVP; presence manual (belum heartbeat); cabang AI alur 4.1 belum (AI di-hold)

---

## DEC-034: Race Auto-Assign — Postgres Advisory Lock

**Status:** Final
**Tanggal:** 2026-06-19

**Keputusan:** Cegah dua auto-assign bersamaan memilih agent yang sama (stale read) via **transaction-scoped advisory lock**.
- `autoAssign` bungkus bagian kritis (pilih least-busy + `assignAgent`) dalam `db.transaction` + `pg_advisory_xact_lock(AUTO_ASSIGN_LOCK_KEY=482917365)`. Dua transaksi serial di DB → pick ke-2 melihat assignment pick-1 (count ter-update) → agent berbeda. Benar lintas worker-concurrency >1 / multi-instance.
- Side-effect (activity, WS `conversation:assigned`, notif) **di luar transaksi** → lock pendek.
- `findLeastBusyOnlineAgent(exec?)` + `assignAgent(id, agentId, exec?)` terima executor opsional (`DbExecutor` tipe baru di `lib/db`) agar jalan dalam tx yang sama.
- Catatan: BullMQ `message-worker` default concurrency 1 → saat ini sudah serial di single-instance; lock = jaminan untuk scaling.

**Klarifikasi perilaku:** least-busy + tie-break nama bisa **legitimately** pilih agent sama berturut-turut bila agent itu memang paling sepi / seri (deterministik). Itu distribusi benar, **bukan** race. Lock hanya menjamin pick-2 tak membaca count basah (stale).

**Impact:**
- `lib/db` +`DbExecutor`; `users/queries.findLeastBusyOnlineAgent(exec)`; `conversations/queries.assignAgent(...,exec)`; `auto-assign.ts` tx+lock
- Test: 104 unit (autoAssign mock `db.transaction`) + 37 integration (**+RACE test: 2 ingest paralel, 2 agent mulai 0 → agent berbeda**) hijau
- Live-verified: lock aktif (pick-2 lihat count ter-update); integration buktikan distinct saat beban seri-awal

---

## DEC-035: Module 2 AI Assistant Engine — pgvector RAG, provider key env-only, single-column assignment

**Status:** Final
**Tanggal:** 2026-06-19

**Keputusan:** Bangun backend Module 2 (AI Assistant Engine) + integrasi FE penuh dengan keputusan arsitektural berikut:

1. **Knowledge Base = full RAG dengan pgvector.** `kb_documents.embedding` jadi `vector(768)` (Gemini `text-embedding-004`), hnsw cosine index. Pipeline async (BullMQ `document-queue`): upload→MinIO→extract (pdf-parse/mammoth/utf8)→chunk (recursive ~2000 char/400 overlap)→embed→insert chunk rows (`sourceDocumentId`+`chunkIndex`)→status. Parent row simpan metadata + status; chunk rows simpan embedding. Retrieval cosine `<=>` (test-chat + nanti auto-reply).
   - *Alternatif ditolak:* keyword/full-text saja (kurang akurat untuk RAG); embedding di kolom text+parse JS (lambat, tak terindeks).
2. **Provider API key env-only.** `ai_providers` simpan config non-rahasia (model/priority/temperature/maxTokens/isEnabled/envKeyName); key dari `process.env[envKeyName]`, TAK PERNAH di DB/response. Konsisten dgn token channel Module 1 (env-first). Fallback chain 3-level Gemini→OpenRouter→OpenAI, skip provider tanpa key.
   - *Alternatif ditolak:* key encrypted di DB (lebih sesuai teks PRD tapi nambah permukaan rahasia; sandbox tak perlu).
3. **Assignment AI↔agent via satu kolom** `ai_assistants.assignedAgentId` (UNIQUE, FK users, nullable). Bukan junction table. "AI milik agent" = `where assignedAgentId=userId`. Reassign otomatis clear assistant lama pada agent itu (transaction). 1 agent = 1 AI Assistant enforced by UNIQUE.
   - *Alternatif ditolak:* tabel `agent_ai_assignments` (over-engineered untuk relasi 1:1).
4. **FE pakai shape nested existing** (`persona.tone`, `knowledgeBaseScope`) — API layer (`lib/api/ai-assistants`) memetakan ke/dari shape flat backend. Komponen UI tak diubah strukturnya (surgical). Edit per-field debounced via `useAssistantDraft` → PUT.

**Scope round ini:** CRUD + config + KB pipeline + test-chat playground (RAG real). **Di luar scope (round berikutnya):** live AI auto-reply + handoff di inbox Module 1.

**Impact:**
- Backend: +3 tabel + alter kb_documents (migration 0002); modul `ai-assistant`/`knowledge-base`/`settings`; `lib/ai` embeddings+chain; `lib/extract`+`lib/text-splitter`+`document-worker`. Dep dipakai: pdf-parse, mammoth, @ai-sdk/openai-compatible (sudah ada).
- FE: `types/ai`, 3 api + 3 hooks + `useAssistantDraft`; hapus mock/ai-assistants, mock/ai-settings, stores/ai-settings (zero dummy Module 2).
- Test: 123 unit + 54 integration hijau. Live-verified.
- Catatan: tanpa GEMINI_API_KEY, upload→status `failed` (graceful) & test-chat→fallback message. Set key untuk fungsi penuh.

---

## DEC-036: Live AI Auto-Reply + Handoff di Inbox (Module 1)

**Status:** Final
**Tanggal:** 2026-06-19

**Keputusan:** AI Assistant membalas pesan masuk nyata + handoff otomatis ke agen, di-hook ke ingest pipeline Module 1.

1. **Titik hook:** `maybeAutoReply(conversationId, inboundText, contactName)` dipanggil di akhir `ingestInbound` (setelah message insert + notif), dibungkus try/catch agar kegagalan AI tak merusak ingest. Berjalan dalam message-worker (async, di luar request).
2. **Aktivasi (round ini = ketersediaan agen, BUKAN jam kerja):** AI aktif bila `ai_settings.aiEnabled` true DAN tak ada agen online yang memegang percakapan. Bila `conversation.agentId` ada & status agen `online` → human handle, AI skip. Bila tak ada agen / agen offline-busy → AI handle.
   - *Alasan:* auto-assign (DEC-033/034) sudah menugaskan percakapan baru ke agen online bila ada; jadi `agentId=null` ⇒ memang tak ada agen online ⇒ giliran AI. Jam kerja + OOO message ditunda (open item) agar scope terjaga.
3. **Pemilihan assistant:** assistant milik agen ter-assign (`assignedAgentId`) bila ada & active → else default assistant (`isDefault` + active). Bila tak ada assistant active → skip.
4. **Balas = RAG** via `generateRagReply` (embed pesan terakhir → vector search KB sesuai scope → `generateWithFallback`). History 10 pesan terakhir. Kirim via channel adapter (senderType `ai`), `isAiHandling=true`.
5. **Handoff = keyword-only round ini.** `detectHandoff` cocokkan `handoffConfig.triggerKeywords` pada teks masuk → kirim `handoffMessage` → assign ke `assignedAgentId` (atau `findLeastBusyOnlineAgent`) → activity `ai_handoff` + WS `conversation:assigned` + notif + `isAiHandling=false`. Threshold max-AI-messages & sinyal sentiment/behavior ditunda (open items).
6. **Reuse:** `detectHandoff` + `generateRagReply` di-export dari `ai-assistant/services` (dipakai test-chat & auto-reply) — single source of truth logika AI.

**Impact:**
- Backend: `modules/messages/ai-reply.ts` (baru); hook di `ingest.ts`; +`getUserStatusById`, +`findAssistantByAgentId`/`findDefaultAssistant`; refactor `ai-assistant/services` (export 2 fungsi).
- Test: +5 integration (`ai-reply.integration.test.ts`) → 123 unit + 59 integration hijau. Live-verified via simulate-inbound (balas grounded, skip saat agen online, handoff assign agen).
- Tak ada perubahan FE (sudah render senderType `ai` + realtime + isAiHandling badge dari Module 1).
- Catatan: balas AI ke nomor dummy berstatus `failed` di channel (wajar); logika AI tetap jalan. Butuh agen `online` sebagai target handoff bila assistant tanpa `assignedAgentId`.

---

## DEC-037: Jam Kerja (gate + OOO) & Handoff Threshold/Signals

**Status:** Final
**Tanggal:** 2026-06-19

**Keputusan:** Lengkapi aktivasi AI & handoff sesuai PRD 5.2.6/5.2.7.

1. **Jam kerja assistant = gate.** `lib/working-hours.isWithinWorkingHours(workingHours, now)` tz-aware (`Intl.DateTimeFormat`, hourCycle h23, parse IANA tz dari string `"Asia/Jakarta (WIB...)"`, cek `day.enabled` + `start`≤now≤`end`, string compare HH:MM zero-padded). Di `maybeAutoReply`: jika **di luar jam kerja** → kirim **pesan OOO** (`oooMessage`) dan set isAiHandling=true, TANPA RAG/handoff. Tanpa config jam → dianggap selalu aktif.
   - *Semantik:* "Jam Aktif AI" di UI = jam assistant aktif menjawab penuh; di luar itu hanya OOO. (Berbeda dari interpretasi "AI aktif di luar jam agen" — dipilih yang konsisten dgn label UI.)
2. **Handoff threshold.** `handoffConfig.maxAiMessages` (>0) → bila `countAiMessages(conversation) ≥ batas` → handoff paksa sebelum balas lagi. Mencegah AI berputar tanpa resolusi.
3. **Conversion signals fungsional.** `detectHandoff` = triggerKeywords ATAU, untuk tiap `conversionSignals` yang `enabled`, cocokkan pola builtin per `type`: `keyword` (daftar/bayar/beli), `behavior` (rekening/transfer/link), `sentiment` (budget/jadwal demo/konsultasi/siap daftar). Toggle signal di UI kini benar-benar berpengaruh.
   - *Batas:* "sentiment" = keyword-proxy, bukan analisis ML; "behavior klik link" via keyword pesan, bukan event tracking. Keduanya open item.

**Impact:**
- Backend: `lib/working-hours.ts` (baru); `maybeAutoReply` (+OOO +threshold); `detectHandoff` (+signals); `msgQ.countAiMessages`.
- Test: +6 unit (working-hours) +4 unit (detectHandoff signals) +2 integration (OOO, threshold) → **133 unit + 61 integration hijau**. Live-verified: luar jam → OOO; threshold → pesan handoff.
- Tak ada perubahan FE (config jam kerja & handoff sudah bisa diedit dari Module 2 detail/settings).

---

## DEC-038: Assign AI Assistant ke Percakapan (Manual Takeover di Inbox)

**Status:** Final
**Tanggal:** 2026-06-19

**Keputusan:** Agen bisa menugaskan AI Assistant ke satu percakapan (sejajar assign agen) agar AI **langsung menjawab** pengguna tersebut, di luar aturan aktivasi otomatis.

1. **Kolom penanda:** `conversations.aiAssistantId` (FK ai_assistants, `set null`) menandai AI yang menangani percakapan secara manual; dipakai bersama `isAiHandling`.
2. **Override penuh (keputusan user):** saat `isAiHandling && aiAssistantId` → `maybeAutoReply` melewati gate `aiEnabled`, agen-online, dan jam kerja/OOO. AI tetap balas. (Intent eksplisit > aturan otomatis.)
3. **Agen dipertahankan (keputusan user):** assign AI tak melepas agen. AI nonaktif saat agen membalas (sudah ada: `sendMessage` set `isAiHandling=false`) atau klik **"Ambil Alih dari AI"** (`POST /deactivate-ai`).
4. **Balas segera:** `assignAiAssistant` set kolom → emit → `triggerAiReply` (ambil inbound terakhir → `maybeAutoReply`) sehingga AI langsung membalas pesan terakhir.
5. **Validasi:** assistant harus `status='active'` (else 400). `resolveAssistant` prioritaskan `conversation.aiAssistantId` sebelum jalur otomatis (assistant agen / default).

**Impact:**
- Backend: `conversations` (`setConversationAi`, `assignAiAssistant`/`deactivateAi`, handlers, routes `assign-ai`/`deactivate-ai`, `assignAiSchema`); `messages/ai-reply` (manual override + `triggerAiReply`); `getConversationWithChannel`+fields. Import lintas-modul `conversations/services` → `messages/ai-reply` (tak siklik: ai-reply pakai conversations/queries).
- FE: `types/inbox`+`lib/api/inbox` (`assignAi`/`deactivateAi`); hook `useConversationMutations`; `AssignAIModal`; ActionBar tombol "Assign AI" + chip "Ambil Alih"; ChatPanel wiring.
- Test: +3 conversations integration +2 ai-reply integration → **133 unit + 66 integration hijau**. Live-verified override + deactivate.
