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
- [ ] 🟢 Dashboard inbox dasar (UI mock selesai, perlu connect ke backend)
- [ ] 🟢 Assignment percakapan ke agent (UI mock — AssignAgentModal, TransferModal, ActionBar)
- [ ] 🔴 Notifikasi real-time (WebSocket)
- [ ] 🟢 Filter & search percakapan (UI mock — agent filter, label filter, sort, phone search)
- [ ] 🟢 Label & tag system (UI mock — CRUD /labels page, assign ke conversations)
- [ ] 🟢 Real-time chat panel (UI mock — media messages, emoji, quick reply, send)

### Minggu 7–10: Modul 2 — AI Auto-Reply Engine

- [ ] 🟢 Knowledge base management (CRUD + upload dokumen + editor) — UI mock selesai (Phase 1-4)
- [ ] 🟢 Integrasi AI provider (Gemini Flash + fallback chain) — UI mock selesai (Phase 1-2)
- [ ] 🟢 Logika aktivasi/deaktivasi AI — UI mock selesai (toggle ready)
- [ ] 🟢 Handoff otomatis ke human agent — UI mock selesai (Phase 6)
- [ ] 🟢 Pengaturan jam kerja — UI mock selesai (Phase 5)
- [ ] 🟢 AI persona konfigurasi — UI mock selesai (Phase 7)

### Minggu 11–12: Modul 4 — CRM Dasar

- [ ] 🔴 Auto-create kontak dari pesan masuk
- [ ] 🟢 Profil kontak dasar — UI Phase 5 done (profile page, info card, activity timeline, edit modal)
- [ ] 🟢 Pipeline Kanban sederhana (6 kolom default) — UI Phase 1-7 done + Column Management Phase 1-4 done (KanbanBoard, drag-drop, filters, column customize, rename/add/delete columns)
- [ ] 🟢 Daftar kontak (tabel, search, bulk actions) — UI Phase 4 done (ContactTable, ContactFilters, BulkActionBar, pagination)
- [ ] 🟢 Import kontak CSV/Excel — UI Phase 6 done (ImportContactsModal, drag-drop, validation, preview)
- [ ] 🔴 Deduplikasi kontak cross-channel

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

### Bulan 6: Modul 6 — Laporan & Analitik

- [ ] 🔴 Dashboard ringkasan (lead, conversion, response time)
- [ ] 🔴 Laporan performa agent
- [ ] 🔴 Laporan sumber lead (per channel, per sumber)
- [ ] 🔴 Tren percakapan (harian/mingguan/bulanan)
- [ ] 🔴 Heatmap jam sibuk (Apache ECharts)
- [ ] 🔴 Export laporan

---

## Fase 3 — Nice to Have (Bulan 7+)

- [ ] 🔴 Live chat widget website
- [ ] 🔴 Integrasi Telegram
- [ ] 🔴 Sequence / drip message
- [ ] 🔴 A/B testing template
- [ ] 🔴 AI lead qualification
- [ ] 🔴 AI persona kustomisasi (nama, gaya bahasa)
- [ ] 🔴 Training AI dari flagged conversations
- [ ] 🔴 Integrasi LMS perusahaan

---

## Legend

- 🔴 Belum mulai
- 🟡 Sedang dikerjakan
- 🟢 Selesai
- ⚪ Dihapus/ditunda
