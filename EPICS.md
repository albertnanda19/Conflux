# EPICS.md

Daftar fitur MVP per modul berdasarkan PRD Section 11.
Status: 🔴 Belum mulai | 🟡 Sedang dikerjakan | 🟢 Selesai

---

## Fase 1 — Foundation (Bulan 1–3)

**Target: MVP yang bisa digunakan tim sales untuk operasional harian**

### Minggu 1–2: Setup & Infrastruktur

- [ ] 🟢 Setup repository (monorepo Bun workspaces)
- [ ] 🟢 Setup Docker Compose (PostgreSQL pgvector, Redis, MinIO)
- [ ] 🟢 Setup database schema dengan Drizzle ORM
- [ ] 🟡 Setup environment (dev, staging, production) — .env created
- [ ] 🔴 Setup CI/CD pipeline (GitHub Actions)

### Minggu 3–6: Modul 1 — Omnichannel Inbox

- [ ] 🔴 Integrasi WhatsApp Business API
- [ ] 🔴 Integrasi Instagram Messaging API
- [ ] 🔴 Integrasi Facebook Messenger API
- [ ] 🟢 Dashboard inbox dasar — UI + **terintegrasi backend** (GET /conversations, no mock)
- [ ] 🟢 Assignment percakapan ke agent — UI + **API** (assign/transfer/useAgents) + **auto-assign round-robin (least-busy online)** saat pesan masuk baru (DEC-033)
- [ ] 🟢 Notifikasi real-time (WebSocket) — Backend `/ws` + Redis bridge + **FE WS client** + UI prefs (suara/browser push) + **persist per-user** (tabel notifications, GET/mark-read, targeting assigned/broadcast) (DEC-032)
- [ ] 🟢 Filter & search percakapan — channel/agent/label/search/sort/status **di backend**; filter tanggal + presence switcher UI ada (wiring pending)
- [ ] 🟢 UI Channel integration page (/channels) — 6 channel + connect modal (UI; CRUD asli pending)
- [ ] 🟢 Label & tag system — UI + **API CRUD** (/labels) + attach/detach ke conversation
- [ ] 🟢 Real-time chat panel — UI + **API** (messages cursor + send + WS append); media upload pending
- [ ] 🟢 Kelola Agent (UI mock — CRUD, role management, profile page, performance stats, cross-module sync)

### Minggu 7–10: Modul 2 — AI Auto-Reply Engine

- [x] 🟢 Knowledge base management (CRUD + upload dokumen + editor) — **backend + FE terintegrasi**: upload→pipeline async (extract→chunk→embedding pgvector 768d), list/filter/scope, editor simpan konten, toggle/delete cascade (DEC-035)
- [x] 🟢 Integrasi AI provider (Gemini Flash + fallback chain) — **backend**: 3-chain Gemini→OpenRouter→OpenAI DB-driven, key env-only; settings/ai UI terintegrasi (DEC-035); **timeout per-provider → failover cepat** (DEC-039)
- [x] 🟢 AI reply async (BullMQ `ai-queue`) — generasi AI dipindah dari sinkron ke worker async (non-blocking, concurrency 5), sesuai PRD §7.4; **kualitas:** RAG threshold relevansi + enrichment profil kontak + query expansion + anti-halusinasi. **LIVE-VERIFIED** Gemini asli (DEC-039)
- [x] 🟢 Logika aktivasi/deaktivasi AI — **LIVE di inbox**: AI balas saat aiEnabled + tak ada agen online (RAG); skip saat agen online; **di luar jam kerja → pesan OOO** (DEC-036/037)
- [x] 🟢 Handoff otomatis ke human agent — **LIVE di inbox**: keyword + **conversion signals** + **batas maxAiMessages** → pesan transisi + auto-assign agen + activity ai_handoff + notif + isAiHandling off (DEC-036/037). Sentiment ML = open item
- [x] 🟢 Pengaturan jam kerja — working hours per-assistant + **dipakai sebagai gate aktivasi + pesan OOO** (DEC-037)
- [x] 🟢 AI persona konfigurasi — persona (nama/tone/bahasa/system prompt) per-assistant terintegrasi + test-chat RAG real
- [x] 🟢 CRUD AI Assistant + assignment 1:1 ke agent — backend + FE terintegrasi penuh (DEC-035)
- [x] 🟢 Assign AI Assistant ke percakapan (manual takeover di inbox) — tombol "Assign AI" + "Ambil Alih", AI langsung balas (override penuh, agen dipertahankan) (DEC-038)

### Minggu 11–12: Modul 4 — CRM Dasar

- [ ] 🟢 Auto-create kontak dari pesan masuk — Backend ingest pipeline (message-worker, dedup + auto-create) done (Module 1 Phase 3)
- [ ] 🟢 Profil kontak dasar — UI Phase 5 done (profile page, info card, activity timeline, edit modal)
- [ ] 🟢 Pipeline Kanban sederhana (6 kolom default) — UI Phase 1-7 done + Column Management Phase 1-4 done (KanbanBoard, drag-drop, filters, column customize, rename/add/delete columns)
- [ ] 🟢 Daftar kontak (tabel, search, bulk actions) — UI Phase 4 done (ContactTable, ContactFilters, BulkActionBar, pagination)
- [ ] 🟢 Import kontak CSV/Excel — UI Phase 6 done (ImportContactsModal, drag-drop, validation, preview)
- [ ] 🟡 Deduplikasi kontak cross-channel — dedup per (channelType, identifier) done di ingest; merge lintas-channel ke satu profil belum

---

## Fase 2 — Enhancement (Bulan 4–6)

**Target: Tools yang mempercepat produktivitas tim dan visibilitas manajemen**

### Bulan 4: Modul 3 — Broadcast & Campaign

- [ ] 🟢 Pembuatan campaign — UI mock selesai (Phase 1-6: foundation + list + wizard + template + segment + detail)
- [ ] 🟢 Segmentasi kontak — UI mock selesai (Phase 4: SegmentBuilder + SegmentFilterChips + SegmentPreview)
- [ ] 🟢 Template pesan broadcast (WhatsApp template message) — UI mock selesai (Phase 1+3: foundation + template library page)
- [ ] 🟢 Penjadwalan broadcast — UI mock selesai (Phase 5: WizardStepSchedule with date/time pickers)
- [ ] 🟢 Laporan broadcast — UI mock selesai (Phase 6: CampaignDetailPage + ReportStats + ProgressBar + Timeline + RecipientList)

### Bulan 5: Modul 5 — Template & Quick Reply

- [ ] 🔴 Perpustakaan template
- [ ] 🔴 Quick reply shortcut (`/` di input chat)
- [ ] 🔴 Variabel dinamis dalam template
- [ ] 🔴 Modul 4 enhancement: segmentasi, notes, filter lanjutan

### Bulan 5: Modul 7 — AI Assistant Engine

- [ ] 🟢 Multiple AI Assistants — UI mock selesai (Phase 1-3: data layer + list page + detail page + 6 components)
- [ ] 🟢 Per-AI Assistant config (persona, working hours, handoff) — UI mock selesai (inline editing di detail page)
- [ ] 🟢 AI Assistant ↔ Agent assignment — UI mock selesai (AssignAIAssignmentModal + bidirectional sync)
- [ ] 🟢 Two-level Knowledge Base scope (global + per-assistant) — UI mock selesai (KB selector + scope filter di KnowledgeBasePage)
- [ ] 🟢 AI Assistant di AgentProfilePage + AgentTable — Phase 3 done (assignment card + badge + AI column)
- [ ] 🟢 SettingsPage AI tab rename — Phase 3 done ("System Default AI" + override note)
- [ ] 🔴 Backend API — CRUD endpoints + assignment + KB scope queries

### Bulan 6: Modul 6 — Laporan & Analitik

- [ ] 🟢 Dashboard ringkasan (lead, conversion, response time) — Phase 1-2 done (OverviewTab with 6 StatCards + 4 ECharts)
- [ ] 🟢 Laporan performa agent — Phase 3 done (sortable table + comparison chart)
- [ ] 🟢 Laporan sumber lead (per channel, per sumber) — Phase 4 done (LeadSourceTab with 4 charts: SourceBreakdown, OriginDistribution, ConversionByChannel, MultiChannelTrend)
- [ ] 🟢 Tren percakapan (harian/mingguan/bulanan) — Phase 5 done (VolumeChart with moving average, 30 hari)
- [ ] 🟢 Heatmap jam sibuk (Apache ECharts) — Phase 5 done (7×24 heatmap + peak hours top 10)
- [ ] 🟢 Laporan broadcast — Phase 6 done (BroadcastTab: 4 StatCards + CampaignFunnelChart + campaign table with status badges)
- [ ] 🟢 AI vs Human report — Phase 6 done (AiVsHumanTab: donut chart + topic chart + KB gaps list)
- [ ] 🔴 Export laporan

---

## Fase 3 — Nice to Have (Bulan 7+)

- [ ] 🔴 Live chat widget website
- [ ] 🟢 Integrasi Telegram — adapter REAL (Bot API) + polling worker + webhook route + FE (ikon/tab); verifikasi live pending (DEC-026)
- [ ] 🔴 Sequence / drip message
- [ ] 🔴 A/B testing template
- [ ] 🔴 AI lead qualification
- [ ] 🟡 AI persona kustomisasi (nama, gaya bahasa) — UI mock selesai per AI Assistant (Phase 2)
- [ ] 🔴 Training AI dari flagged conversations
- [ ] 🔴 Integrasi LMS perusahaan

---

## Legend

- 🔴 Belum mulai
- 🟡 Sedang dikerjakan
- 🟢 Selesai
- ⚪ Dihapus/ditunda
