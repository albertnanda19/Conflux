# PROGRESS.md

Log kerja harian berurutan waktu. Entry terbaru di ATAS.

---

## 2026-06-16 (lanjutan) — Architecture & Icon Decisions

### Yang Dikerjakan
- Update prd.md: tambah Section 7.3 Backend Code Architecture (feature-based)
- Update prd.md: tambah Icons row di frontend tech stack (itsHover + Lordicon)
- Update CLAUDE.md: tambah Icons row di tech stack table
- Update DESIGN.md: tambah section "Icons" (itsHover primary, Lordicon fallback, custom SVG)
- Log DEC-010 ke DECISIONS.md (Feature-Based Backend Architecture)
- Log DEC-009 sudah di-log sebelumnya (Document Extraction Pipeline)

### Keputusan yang Diambil
- Feature-based architecture (bukan layered, hexagonal, clean arch)
- 14 feature modules + 4 BullMQ workers + 6 shared lib utilities
- itsHover sebagai primary icon library (186 animated, Apache 2.0)
- Lordicon sebagai fallback icon library (43,900+)
- Custom SVG hanya untuk brand icons (WA/IG/FB logos)
- Lucide-react perlu dihapus dari frontend dependencies (conflict dengan icon rule)

### Yang Berhasil
- Arsitektur backend terdefinisi lengkap di PRD (Section 7.3)
- Icon strategy clear: itsHover → Lordicon → Custom SVG
- Semua core docs sinkron (PRD, CLAUDE.md, DESIGN.md, DECISIONS.md, STATUS.md)

### Yang Perlu Dikerjakan Selanjutnya
- Setup backend boilerplate (Elysia server + feature modules)
- Hapus lucide-react dari frontend dependencies
- Install itsHover + @lordicon/react di frontend

---

## 2026-06-16 — Frontend Project Initialization

### Yang Dikerjakan
- Inisialisasi monorepo dengan Bun workspaces (root package.json)
- Buat docker-compose.yml: PostgreSQL pgvector:pg16, Redis 7 Alpine, MinIO
- Buat .env dengan semua environment variables
- Scaffold Vite + React 19 + TypeScript 6 untuk apps/web
- Install semua dependencies PRD frontend:
  - UI: Tailwind CSS 3, tailwindcss-animate, shadcn/ui (17 Radix primitives)
  - State: Zustand (client), TanStack Query (server)
  - Form: React Hook Form + @hookform/resolvers + Zod
  - Charts: Apache ECharts + echarts-for-react
  - Rich Text: Tiptap + starter-kit + placeholder
  - Icons: motion, @lordicon/react, lucide-react
  - Routing: react-router-dom v7
  - Error Tracking: @sentry/react
  - Utilities: clsx, tailwind-merge, class-variance-authority
- Configure Vite: path aliases (@/), dev proxy (API + WS)
- Configure Tailwind: custom design tokens from DESIGN.md
- Buat CSS globals: DM Sans font, shadcn CSS variables, component classes
- Buat shared types (packages/shared/src/types.ts): User, Contact, Conversation, Message, etc.
- Buat app scaffolding:
  - providers.tsx: QueryClient + BrowserRouter
  - router.tsx: lazy-loaded pages, AppLayout wrapper
  - stores/ui.ts: useSidebarStore, useInboxStore
  - lib/api.ts: apiRequest utility, ApiError class
  - lib/constants.ts: channel types/colors, pipeline columns, roles
  - lib/utils.ts: cn(), formatDate(), formatRelativeTime()
- Buat layout: AppLayout, Sidebar (collapsible, nav items)
- Buat pages: Dashboard, Inbox, Contacts, Pipeline, Settings, 404
- Fix TypeScript 6 deprecation: remove baseUrl, use paths directly
- Fix unused imports (InboxPage, router)
- Verify build: TypeScript zero errors, Vite build success

### Keputusan yang Diambil
- Tailwind v3 (bukan v4) — lebih stable, lebih banyak plugin support
- Path alias @/ → ./src/* — clean imports
- Lazy-load semua pages — optimal bundle splitting
- DM Sans sebagai font utama (sesuai DESIGN.md)
- Placeholder branding "Acme PSC" — sesuai branding rules
- packages/shared/ types-first approach — shared types sebelum backend

### Yang Berhasil
- Frontend boilerplate lengkap, siap dikembangkan
- Build pipeline verified: tsc + vite build = clean
- 107KB gzip total bundle (termasuk React + Radix)
- Semua dependencies terinstall di monorepo root

### Yang Perlu Dikerjakan Selanjutnya
- Setup Elysia backend server boilerplate
- Setup database schema dengan Drizzle ORM
- Setup authentication flow (JWT + Refresh Token)
- Implementasi Modul 1 — Omnichannel Inbox

---

## 2026-06-15 (sore) — PRD Document Extraction Pipeline

### Yang Dikerjakan
- Update prd.md: tambah document processing pipeline untuk knowledge base
- 6 surgical edits ke section yang sudah ada (bukan tambah section baru)
- Tambah pdf-parse + mammoth ke tech stack backend
- Tambah Gemini text-embedding-004 embedding strategy (768 dim, batch)
- Tambah Document Worker Flow diagram (upload → extract → chunk → embed → store)
- Update kb_documents schema: tambah original_file_url, file_type, chunk_index, source_document_id, processing_status
- Tambah knowledge base file storage rules (kb/{doc-id}/{filename})

### Keputusan yang Diambil
- Worker-based async processing (BullMQ) — upload langsung return 202
- pdf-parse + mammoth — lightweight, zero-dependency (bukan puppeteer/playwright)
- Gemini text-embedding-004 — gratis, batch support, 768 dimensi
- Chunk strategy: 500 tokens, 100 overlap, recursive text splitter
- Max file size: 10MB

### Yang Berhasil
- PRD v1.1 — document extraction pipeline terdefinisi lengkap
- Flow end-to-end: upload → queue → extract → chunk → embed → store → search

### Yang Perlu Dikerjakan Selanjutnya
- Setup monorepo dengan Bun workspaces
- Setup Docker Compose
- Database schema
- Backend boilerplate
- Frontend boilerplate

---

## 2026-06-15 — Inisialisasi Project

### Yang Dikerjakan
- Analisa mendalam PRD (original_prd.md)
- Audit tech stack: Node.js → Bun, Fastify → Elysia, Prisma → Drizzle, Socket.IO → µWebSocket, LangChain → Vercel AI SDK, Recharts → Apache ECharts
- Hapus CDN + Load Balancer dari arsitektur (single-server MVP)
- Tambah multi-provider AI fallback chain (Gemini → OpenRouter → GPT-4o-mini)
- Hapus Grafana/Prometheus/Loki dari MVP, pindah ke production scope
- Bersihkan duplikasi PRD (2078 baris → 1200 baris final)
- Perbandingan Encore TS vs Fastify vs Hono vs Elysia → pilihan: Bun + Elysia
- Install 6 skills dari skills.sh (shadcn, frontend-design, vercel-react-best-practices, tdd, sentry-cli, webapp-testing)
- Buat CLAUDE.md dengan 6-phase workflow
- Buat core documentation files (STATUS.md, PROGRESS.md, DECISIONS.md, EPICS.md, README.md)

### Keputusan yang Diambil
- Bun sebagai runtime (bukan Node.js)
- Elysia sebagai framework (bukan Fastify/Hono/Encore)
- Drizzle ORM (bukan Prisma)
- Apache ECharts (bukan Recharts)
- Vercel AI SDK (bukan LangChain.js)
- Sentry Cloud free tier (bukan SigNoz local)
- Single-server architecture untuk MVP

### Yang Berhasil
- PRD final sudah valid 100%, tidak ada stale references
- Tech stack sudah sepenuhnya konsisten di seluruh dokumen

### Yang Perlu Dikerjakan Selanjutnya
- Setup monorepo dengan Bun workspaces
- Setup Docker Compose
- Database schema
- Backend boilerplate
- Frontend boilerplate

---

## 2026-06-15 (lanjutan) — CLAUDE.md Enhancement & Design System

### Yang Dikerjakan
- Update CLAUDE.md: hapus RANGKUMAN KERJA dan PHASE 6 (COMMIT) — AI agent langsung commit
- Tambah NON-NEGOTIABLE branding rule: tidak ada "Dibimbing" di code/UI/output (project testing only)
- Enhance Smart Memory System di CLAUDE.md — AI agents wajib update markdown files sebagai persistent memory
- Buat .gitignore — track AI agent files (CLAUDE.md, .agents/, .skills/), ignore code artifacts
- Buat core documentation files: STATUS.md, PROGRESS.md, DECISIONS.md, EPICS.md, CHANGELOG.md
- Modifikasi DESIGN.md — hapus semua MiniMax branding, gunakan sebagai panduan design system wajib
- Tambah reference DESIGN.md ke CLAUDE.md tech stack table

### Keputusan yang Diambil
- Design system diadaptasi dari MiniMax.io dengan token names yang generik
- Channel colors dipertahankan (coral→WhatsApp, magenta→Instagram, blue→Facebook, purple→AI Engine)
- DM Sans tetap sebagai font family utama
- Pill-shaped buttons (`rounded-full`) sebagai signature component pattern
- 2-tier card system: gradient cards (32px radius) vs white cards (16px radius)

### Yang Berhasil
- DESIGN.md sudah bersih dari semua MiniMax references (brand names, products, pricing, etc.)
- Semua design tokens, spacing, typography, component specs dipertahankan
- CLAUDE.md sudah referensikan DESIGN.md sebagai mandatory reading

### Yang Perlu Dikerjakan Selanjutnya
- Setup monorepo dengan Bun workspaces
- Setup Docker Compose
- Database schema
- Backend boilerplate
- Frontend boilerplate
