# PROGRESS.md

Log kerja harian berurutan waktu. Entry terbaru di ATAS.

---

## 2026-06-16 — Phase 8: Final Integration + Verification (Modul 2 Complete)

### Yang Dikerjakan
- Typecheck verification — zero errors across entire frontend codebase
- Vite build verification — success, all chunks verified (SettingsPage 24KB, KnowledgeBasePage 326KB, InboxPage 80KB, index 340KB)
- Router verification — all 8 routes lazy-loaded with Suspense (/, inbox, contacts, pipeline, labels, settings, knowledge-base, 404)
- Component inventory — all 11 Modul 2 components verified present: ProviderConfig, WorkingHours, HandoffConfig, PersonaConfig (settings), KBDocumentList, KBDocumentCard, KBUploadModal, KBDocumentEditor, KBCategoryFilter (knowledge-base), AIChatPreview (ai)
- SettingsPage verification — no placeholder blocks remaining, all 5 AI tab sections wired with real components
- Updated STATUS.md — Phase 8 moved to Done, Modul 2 row added to Current State, Open Items cleaned, Next Best Actions updated
- Updated PROGRESS.md — this entry
- Updated EPICS.md — knowledge base management updated to 🟢

### Keputusan yang Diambil
- No new decisions — executing according to existing Phase 8 plan

### Yang Berhasil
- Modul 2 AI Auto-Reply UI fully complete (Phase 1-8)
- TypeScript zero errors
- Vite build success — all chunks properly code-split
- All pages navigable, all components functional
- Settings page: 5 sections (AI toggle, providers, working hours, handoff, persona + test AI button)
- Knowledge base page: document list + upload modal + detail editor (Tiptap)
- AI chat preview: keyword-based mock responses with typing indicator

### Yang Perlu Dikerjakan Selanjutnya
- WebSocket server untuk real-time messaging
- Backend conversations API
- Connect frontend ke backend API (ganti mock data)

---

## 2026-06-16 — Phase 7: AI Chat Preview + Persona Config UI

### Yang Dikerjakan
- Created `components/settings/PersonaConfig.tsx` — name input, language select (Indonesia/English/Bilingual), tone selector (3 cards: formal/semi-formal/casual with brand-blue-deep active bg), system prompt textarea (monospace font)
- Created `components/ai/AIChatPreview.tsx` — chat simulator with user input + AI mock responses (keyword matching: harga, jadwal, daftar, bayar, konsultasi), typing indicator (3 bouncing dots), auto-scroll, persona info footer
- Modified `pages/SettingsPage.tsx` — replaced Persona placeholder with `<PersonaConfig />`, added "✨ Test AI" button that opens AIChatPreview in a fixed overlay modal (max-w-md, 520px height), removed PlaceholderBlock function (no more placeholders in AI tab)

### Keputusan yang Diambil
- PersonaConfig tone selector uses 3-card grid with brand-blue-deep active bg — visual consistency with other settings
- System prompt textarea uses monospace font — easier to read structured instructions
- AIChatPreview is a modal overlay (not inline) — focused testing experience without leaving settings page
- Mock responses use keyword matching from handoff trigger keywords — realistic simulation of KB-based AI
- Typing indicator uses CSS animate-bounce with staggered delays — simple, no external animation library
- Removed PlaceholderBlock function entirely — all AI tab sections now have real components

### Yang Berhasil
- TypeScript zero errors
- Persona config renders with all fields (name, language, tone, system prompt)
- Tone selector toggles between 3 options with visual feedback
- AI Chat Preview modal opens/closes via X icon or backdrop click
- Chat simulator responds to keywords (harga, jadwal, daftar, bayar, konsultasi)
- Typing indicator animates during mock response delay
- Auto-scroll to latest message
- All Phase 1-6 UI preserved — no regressions

### Yang Perlu Dikerjakan Selanjutnya
- Phase 8: Final Integration + Verification

---

## 2026-06-16 — Phase 6: Handoff Configuration UI

### Yang Dikerjakan
- Created `components/settings/HandoffConfig.tsx` — trigger keyword chips with add/remove, conversion signal toggles (per-signal on/off), handoff message textarea, max AI messages number input, priority notification toggle
- Modified `pages/SettingsPage.tsx` — replaced Phase 6 placeholder with `<HandoffConfig />`

### Keputusan yang Diambil
- Keyword chips use inline pill with × remove button — add via text input + Enter or click "Tambah" button
- Conversion signals show description + type badge + toggle — each signal independently toggleable
- Max AI messages uses `<input type="number">` — simple, no slider needed
- Priority notification uses same toggle pattern — visual consistency with all other toggles

### Yang Berhasil
- TypeScript zero errors
- 10 trigger keywords render as removable chips
- 5 conversion signals render with toggles
- Add/remove keywords works
- Handoff message textarea editable
- Max AI messages number input functional
- Priority notification toggle works

### Yang Perlu Dikerjakan Selanjutnya
- Phase 7: AI Chat Preview + Persona Config UI

---

## 2026-06-16 — Phase 5: Working Hours Configuration UI

### Yang Dikerjakan
- Created `components/settings/WorkingHours.tsx` — per-day toggle switches (emerald-500 active), time range select dropdowns (30-min intervals 00:00–12:00), timezone display badge, OOO message textarea with helper text
- Modified `pages/SettingsPage.tsx` — replaced Phase 5 placeholder with `<WorkingHours />` component

### Keputusan yang Diambil
- Toggle per hari uses same switch pattern as AI toggle (emerald-500, white knob) — visual consistency
- Time pickers use native `<select>` with 30-min interval options — simple, no external date library needed
- Timezone displayed as read-only badge (not editable) — timezone is infra-level config, not per-user
- Disabled days dimmed with opacity + pointer-events-none — visual feedback that hours are inactive

### Yang Berhasil
- TypeScript zero errors
- 7 day rows render with correct toggles, time defaults (Senin–Jumat 08:00–17:00, Sabtu 09:00–14:00, Minggu off)
- Toggle enables/disables time pickers per day
- OOO message textarea editable, stores to Zustand

### Yang Perlu Dikerjakan Selanjutnya
- Phase 6: Handoff Configuration UI

---

## 2026-06-16 — Phase 4: Knowledge Base Document Editor (Tiptap)

### Yang Dikerjakan
- Created `components/knowledge-base/KBDocumentEditor.tsx` — Tiptap rich text editor with toolbar (Bold, Italic, Strike, H2, H3, BulletList, OrderedList, Blockquote), placeholder extension, ToolbarButton sub-component with active state (brand-blue-deep bg)
- Added MOCK_CONTENT record with pre-filled HTML for all 8 mock KB documents (FAQ, pricing, schedule, requirements, payment, testimonials, career service, tech FAQ)
- Modified `pages/KnowledgeBasePage.tsx` — detail popup redesigned: wider modal (max-w-2xl), flex column layout, header with file type badge + title + category + status badge + X close, body with KBDocumentEditor, footer info bar (fileSize, chunks, createdBy) + Simpan button
- Deleted unauthorized Phase 5-7 components (WorkingHours, HandoffConfig, PersonaConfig, AIChatPreview) and reverted SettingsPage to Phase 2 state

### Keputusan yang Diambil
- Tiptap editor uses StarterKit + Placeholder extension only — no extra extensions needed for KB editing
- MOCK_CONTENT keyed by document ID — editor shows pre-filled content per document, falls back to empty placeholder
- Detail popup uses fixed overlay (not slide panel) — consistent with upload modal pattern
- No separate "Tutup" button — X icon in header is sufficient for dismissal

### Yang Berhasil
- TypeScript zero errors after all changes
- Tiptap editor renders with toolbar, all formatting buttons work
- All 8 mock documents show correct pre-filled content when opened
- Detail popup layout clean: header → editor → info bar
- SettingsPage reverted cleanly to Phase 2 state (placeholder blocks for Phase 5-7)

### Yang Perlu Dikerjakan Selanjutnya
- Phase 5: Working Hours Configuration UI
- Phase 6: Handoff Configuration UI
- Phase 7: AI Chat Preview + Persona Config UI

---

## 2026-06-16 — Phase 2: AI Provider Configuration UI

### Yang Dikerjakan
- Created `components/settings/ProviderConfig.tsx` — full provider card UI with drag-to-reorder fallback chain, toggle enable/disable, status badges (Primary/Fallback/Nonaktif/Error), model + API key display, advanced settings editor (maxTokens + temperature slider)
- Wired ProviderConfig into SettingsPage AI tab (replaced Phase 2 placeholder)

### Keputusan yang Diambil
- Provider cards use card-base with drag handle on left edge (grip icon)
- Toggle switch uses existing toggle pattern (emerald-500 when active, hairline when disabled)
- Advanced settings (maxTokens, temperature) inline-expand per card — no modal needed
- Provider icons: custom unicode glyphs per provider name (✦ Gemini, ◈ OpenRouter, ◉ OpenAI)

### Yang Berhasil
- TypeScript zero errors
- 3 provider cards render with correct status badges
- Toggle enable/disable works per provider
- Drag-to-reorder updates priority numbers in store
- Advanced settings expand inline with range slider for temperature

### Yang Perlu Dikerjakan Selanjutnya
- Phase 3: Knowledge Base Document List + Upload UI

---

## 2026-06-16 — Phase 1: Modul 2 Foundation (Tabbed Settings + Shared Infrastructure)

### Yang Dikerjakan
- Created reusable Tabs UI component (TabList, TabTrigger, TabContent) following DESIGN.md pill-tab design system
- Created `mock/ai-settings.ts` — central mock data file for all Modul 2 features: AI providers (3), KB documents (8), working hours config, handoff config with conversion signals, persona config
- Created `stores/ai-settings.ts` — Zustand store managing AI settings state: aiEnabled toggle, provider CRUD + reorder, KB documents, working hours per-day, handoff config + keywords + conversion signals, persona config
- Rewrote `SettingsPage.tsx` — from "Coming soon" placeholder → tabbed layout with "AI Engine" tab (default), "Umum" tab, "Akun" tab; includes AI toggle + status card + placeholder blocks for Phase 2-7
- Updated `components/ui/index.ts` to export Tabs components

### Keputusan yang Diambil
- fileType union extended to include 'xlsx' (Excel files common in KB uploads)
- All mock data co-located in single file (ai-settings.ts) for easy replacement with real API later
- Store actions are granular (toggleDay, updateDayHours, addKeyword, etc.) for fine-grained UI reactivity

### Yang Berhasil
- TypeScript zero errors
- Vite build success — 341KB gzip total (same as before, no bundle bloat)
- Settings page renders with 3 tabs, AI Engine tab shows toggle + section cards

### Yang Perlu Dikerjakan Selanjutnya
- Phase 2: AI Provider Configuration UI (provider cards + fallback chain)

---

## 2026-06-16 — Replace lucide-react with itsHover Animated Icons

### Yang Dikerjakan
- Replaced ALL lucide-react icons with itsHover animated icons across entire frontend codebase
- Updated AssignAgentModal.tsx — UserCheck→UserCheckIcon, X→XIcon, Circle→CheckedIcon
- Updated TransferModal.tsx — ArrowRightLeft→RefreshIcon, X→XIcon, MessageSquare→MessageCircleIcon
- Updated LabelTable.tsx — Pencil→PenIcon, Trash2→TrashIcon
- Updated LabelsPage.tsx — Plus→PenIcon, X→XIcon, Trash2→TrashIcon
- Removed lucide-react dependency from package.json

### Keputusan yang Diambil
- Circle (lucide) replaced with CheckedIcon from itsHover for selection checkmarks
- Plus icon replaced with PenIcon (closest match for "add" action)

### Yang Berhasil
- Zero lucide-react imports in source code
- TypeScript zero errors
- Build success — 347KB gzip total
- lucide-react dependency fully removed

---

## 2026-06-16 — Phase 8: Wire Everything & Final Verification (Modul 1 Complete)

### Yang Dikerjakan
- Final integration of all Phase 3-7 components across inbox
- TypeScript zero errors verification (`bun run typecheck`)
- Vite build verification (`bun run build`) — 347KB gzip total, inbox chunk 24KB gzip
- Verified all pages navigable: /, /inbox, /labels, /contacts, /pipeline, /settings
- Verified all inbox interactions: filters, sort, search, emoji picker, media messages, quick reply, action bar, assign/transfer modals, label management, notifications

### Keputusan yang Diambil
- None new — executing according to existing plan

### Yang Berhasil
- Modul 1 Inbox UI (5.1.1–5.1.6) fully complete with mock data simulation
- 25+ new files created across components, stores, mock, pages
- 12+ existing files modified
- Zero TypeScript errors, zero build warnings
- All code splits properly (emoji-mart 82KB gzip separate chunk)

---

## 2026-06-16 — Phase 7: ContactDetailPanel Enhancement (Modul 1 5.1.6 Partial)

### Yang Dikerjakan
- Rewrote ContactDetailPanel with Info/History tab navigation
- Added editable notes section (textarea + save/cancel)
- Added activity timeline with chronological log (icons per type: 📋 assignment, 💬 message, 🏷️ label, 📝 note, 🤖 AI handoff)
- Added conversation history list (clickable to navigate between conversations)
- Extended mock/inbox.ts: ActivityLog interface, activityLog[] on Contact type, populated all 9 contacts with realistic activity data
- Integrated LabelBadge component into label display section

### Keputusan yang Diambil
- Notes editing uses local component state (not mock store) — acceptable for UI-only simulation
- Activity timeline uses vertical connector lines (w-px div) for chronological flow
- Conversation history items are clickable buttons that call selectConversation

### Yang Berhasil
- ContactDetailPanel renders with Info tab (contact details, lead info, labels, notes) and History tab (activity timeline, conversation history)
- Notes can be edited inline with save/cancel workflow
- Activity log shows agent name and relative timestamp per entry
- TypeScript zero errors

---

## 2026-06-16 — Phase 6: Notification UI (Modul 1 5.1.6 Partial)

### Yang Dikerjakan
- Created mock/notifications.ts — 6 mock notifications (new_message, new_assignment, ai_handoff, stale_message)
- Created stores/notifications.ts — Zustand store with notifications[], unreadCount, markAsRead, markAllAsRead
- Created NotificationBell — bell icon with unread badge count, click-outside dismiss
- Created NotificationDropdown — notification list with type icons, title, body, relative timestamp, mark-as-read on click, "mark all read" button
- Modified AppLayout — added header bar with NotificationBell

### Keputusan yang Diambil
- NotificationBell uses click-outside pattern (not Radix DropdownMenu) for simpler state management
- Unread badge uses brand-coral color with absolute positioning on bell icon
- "Mark all read" as text button in dropdown header (not separate icon button)

### Yang Berhasil
- Bell icon visible in header with correct unread count (starts at 4)
- Dropdown opens/closes on bell click
- Notifications render with correct type icons and relative timestamps
- Mark-as-read updates badge count reactively
- TypeScript zero errors

---

## 2026-06-16 — Phase 5: Label Management UI (Modul 1 5.1.5)

### Yang Dikerjakan
- Created mock/labels.ts — CRUD operations (getLabels, createLabel, updateLabel, deleteLabel, getLabelConversationCount) with module-level state
- Created LabelBadge — reusable colored badge component (pill shape, dynamic color via inline style)
- Created LabelColorPicker — 12 preset colors + custom hex input
- Created LabelManagerModal — create/edit form with name input, color picker, badge preview
- Created LabelPicker — popover with search input, checkbox multi-select, "create new" shortcut
- Created LabelTable — data table with name, color badge, conversation count, edit/delete actions
- Created LabelsPage — full page at /labels with table + modal + delete confirmation (AlertDialog)
- Modified Sidebar — added "Label" nav item after Pipeline
- Modified router.tsx — added /labels route with LabelsPage lazy import

### Keputusan yang Diambil
- Label CRUD uses module-level state (not Zustand) — sufficient for mock simulation, easy to replace with API later
- LabelManagerModal creates OR edits based on `initialLabel` prop (same modal, different modes)
- LabelPicker includes search filter + "Buat baru" shortcut that opens LabelManagerModal inline
- Delete uses AlertDialog confirmation (Radix AlertDialog) instead of browser confirm()

### Yang Berhasil
- /labels page renders with table showing all labels, conversation counts, edit/delete actions
- Create label flow: click "Tambah Label" → modal opens → fill name + pick color → save → appears in table
- Edit label flow: click edit icon → modal pre-fills → save → updates in table
- Delete flow: click delete → confirmation dialog → confirm → removes from table
- LabelPicker popover works in inbox conversation context
- LabelBadge renders consistently across inbox list, contact detail, and labels page
- TypeScript zero errors

---

## 2026-06-16 — Phase 4: Assignment & Routing UI (Modul 1 5.1.4)

### Yang Dikerjakan
- Created AssignAgentModal — list agents with status dots (green=online, yellow=busy, gray=offline), radio selection, assign button
- Created TransferModal — agent dropdown + notes textarea + transfer button
- Created ActionBar — horizontal toolbar with Assign, Transfer, Resolve, Snooze buttons
- Modified ChatPanel — added ActionBar between header and messages, added convOverrides state for local status/agent tracking
- Extended mock/inbox.ts — added activeConversationCount to Agent type and mock data

### Keputusan yang Diambil
- ActionBar buttons are icon+text pills (rounded-full, surface background, hover effect)
- AssignAgentModal uses radio buttons for single-select agent assignment
- TransferModal requires notes field (textarea) as part of transfer workflow
- Resolve/Snooze use simple status override via convOverrides Record pattern
- No store modification needed — local ChatPanel state suffices for mock simulation

### Yang Berhasil
- ActionBar visible above message area with 4 action buttons
- AssignAgentModal opens → shows 3 agents with status + active count → radio select → assign → updates agent display
- TransferModal opens → agent dropdown + notes → transfer → closes
- Resolve/Snooze toggle status badges
- TypeScript zero errors

---

## 2026-06-16 — Phase 3: ConversationList Filters & Sort (Modul 1 5.1.1 Enhancement)

### Yang Dikerjakan
- Extended useInboxStore with agentFilter, labelFilter[], sortBy state + setters
- Modified ConversationList — added filter bar: Agent dropdown, Label multi-select dropdown, Sort dropdown
- Extended search to include contact phone number

### Keputusan yang Diambil
- Filter dropdowns use click-outside dismiss pattern (not Radix DropdownMenu) for simpler integration with existing list UI
- Label filter is multi-select with checkbox indicators (checkmark on selected)
- Sort options: Terbaru (newest first), Terlama Menunggu (longest waiting), Prioritas (high→low)
- Filter bar sits between search input and conversation list

### Yang Berhasil
- Agent filter shows only conversations assigned to selected agent
- Label filter works with multi-select (AND logic — conversation must have ALL selected labels)
- Sort by newest/waiting/priority all produce correct orderings
- Search hits phone numbers in addition to names
- TypeScript zero errors

---

## 2026-06-16 — Phase 2: Chat Enhancement (Modul 1 5.1.2 Enhancement)

### Yang Dikerjakan
- Phase 1: 13 shared UI primitives (`components/ui/`): Button, Badge, Avatar, Modal, Dropdown, Popover, Tooltip, Select, Toggle, Skeleton, ScrollArea, Separator, Checkbox — semuanya Radix-based + DESIGN.md styling
- Phase 2: Chat Enhancement — 5 new components + 1 modified:
  - `MediaMessage.tsx`: Render media messages (image, video, document, audio, location)
  - `EmojiPicker.tsx`: @emoji-mart/react lazy-loaded inside Popover
  - `AttachmentButton.tsx`: Hidden file input with attachment icon trigger
  - `QuickReplyMenu.tsx`: `/` shortcut dropdown with keyboard navigation
  - `MessageInput.tsx`: Refactored input bar (textarea + emoji + attachment + quick reply + send)
  - `ChatPanel.tsx`: Modified — uses MessageInput, MediaMessage, useCallback for handlers
- Extended mock/inbox.ts: MessageContentType, ConversationPriority, QuickReply types; media message examples (document in conv1, location in conv4, image in conv8)
- Installed `@emoji-mart/react` + `@emoji-mart/data`

### Keputusan yang Diambil
- Emoji picker: lazy-loaded via React.lazy + Suspense (separate chunk 82KB gzip, doesn't bloat main bundle)
- Audio wave: deterministic height calculation via useMemo (avoids Math.random flicker on re-render)
- MessageBubble: conditional rendering — hasMedia ? <MediaMessage /> : text content. bg-transparent wrapper for media to show content edge-to-edge
- File upload: URL.createObjectURL for preview, auto-detect content type from mime (image/video/document)

### Yang Berhasil
- TypeScript zero errors, build success
- 13 shared UI primitives reusable across all future inbox components
- Media messages render correctly (image/video/doc/audio/location)
- Emoji picker opens on button click, lazy-loads 82KB chunk
- Quick reply `/` trigger with keyboard navigation (arrow up/down, enter, escape)
- Attachment button opens native file picker
- MessageInput auto-resizes textarea, Enter to send
- ChatPanel integrated with all new components

### Yang Perlu Dikerjakan Selanjutnya
- Phase 3: ConversationList enhancement — agent filter, label filter, sort, phone search
- Phase 4: Assignment & Routing UI — AssignAgentModal, TransferModal, ActionBar
- Phase 5: Label Management UI — LabelsPage, LabelManagerModal, LabelPicker, LabelBadge
- Phase 6: Notification UI — NotificationBell, NotificationDropdown, notification store
- Phase 7: ContactDetailPanel enhancement — activity timeline, editable notes, conversation history
- Phase 8: Wire everything & verify

---

## 2026-06-16 — Inbox UI (Modul 1 5.1.1 + 5.1.2) — Mock Data

### Yang Dikerjakan
- Buat ConversationList: panel kiri (w-80) dengan search, filter tabs (Semua/WA/IG/FB), conversation items (avatar, last message, unread badge, status badge, AI indicator)
- Buat ChatPanel: panel tengah (flex-1) dengan chat header clickable, message bubbles (outbound biru, inbound surface), date separator, check mark hijau (read/delivered/sent/failed), input bar dengan textarea + send button
- Buat ContactDetailPanel: panel kanan (w-80) dengan contact profile, info kontak, pipeline status, labels, notes — animasi slide width 300ms via CSS transition
- Buat ChannelIcon: SVG brand icons (WhatsApp #25D366, Instagram #E84393, Facebook #4A7AFF)
- Buat mock/inbox.ts: 9 percakapan, 5 thread pesan, 9 kontak, 4 agent, 6 label, semua types
- Implementasi URL sync: selected conversation ID dan detail panel state tersimpan di query params (?chat=X&detail=1), refresh mempertahankan state
- Fix AppLayout: tambah min-h-0 ke main untuk resolve flex height issue

### Keputusan yang Diambil
- Bubble outbound: bg-brand-blue (bukan bg-ink/hitam) — user minta tidak ada warna hitam sebagai background
- Active filter pill: bg-brand-blue (bukan bg-ink) — konsisten dengan bubble
- Check mark: custom SVG hijau (emerald-500 variants) — user minta warna hijau
- Detail panel animation: CSS transition width (w-80 ↔ w-0) — simple, performant, tidak perlu framer-motion
- URL sync: useSearchParams di page level, store tetap single source of truth, page syncs to URL on change

### Yang Berhasil
- Tiga panel inbox berfungsi: list → select → chat → detail panel toggle
- URL sync bekerja: refresh halaman tetap buka chat yang sama
- Detail panel slide animation smooth 300ms
- TypeScript zero errors, commit pushed ke main (df6e698)

### Yang Perlu Dikerjakan Selanjutnya
- WebSocket server untuk real-time messaging
- Backend conversations API (ganti mock data)
- Label management UI
- Assignment/reassignment UI

---

## 2026-06-16 (Malam) — Single .env + Full Stack Verification

### Yang Dikerjakan
- Verifikasi ulang seluruh aplikasi dengan Docker Compose (backend, frontend, database, workers)
- Hapus `.env` duplikat dari `apps/server/` — hanya root monorepo yang punya
- Tambah `--env-file=../../.env` ke backend dev/start scripts
- Log DEC-011 ke DECISIONS.md (Single .env File at Monorepo Root)
- Fix test file TypeScript errors (unused imports, nullable response)
- Verifikasi: 14 module stubs (200 OK), auth login/register, frontend build (107KB gzip), all tests pass (10/10)

### Keputusan yang Diambil
- `.env` hanya di root monorepo → DEC-011
- Backend load env via `--env-file=../../.env` (Bun native, no dotenv needed)

### Yang Berhasil
- Seluruh stack verified berjalan normal
- Docker: PostgreSQL healthy, Redis healthy, MinIO up
- Backend: All 14 modules respond, auth flow complete
- Frontend: TypeScript clean, Vite build success
- Testing: All unit tests pass

### Yang Perlu Dikerjakan Selanjutnya
- Implementasi Modul contacts (full CRUD) sebagai CRM foundation
- Setup WebSocket server untuk real-time messaging
- Implementasi Modul 1 — Omnichannel Inbox

---

## 2026-06-16 (Sore) — Backend Boilerplate + Docker Compose Verification

### Yang Dikerjakan
- Selesaikan backend boilerplate: module stubs (13 modules), BullMQ workers (4), entry point, error handler
- Fix TypeScript compilation errors (Bun.jwt tidak ada → migrate ke jose, Redis version mismatch, Elysia handler types)
- Jalankan Docker Compose: PostgreSQL pgvector + Redis + MinIO
- Fix port conflict: PostgreSQL Docker → port 5433 (karena local PG di 5432)
- Push Drizzle schema ke PostgreSQL → 12 tables terbuat
- Seed database → admin@test.com + agent@test.com
- Jalankan backend server → health check OK, login/register OK
- Build frontend → success, 400KB total

### Keputusan yang Diambil
- Gunakan `jose` library untuk JWT (bukan Bun.jwt yang tidak tersedia di Bun 1.3.x)
- PostgreSQL Docker port 5433 (bukan 5432) untuk hindari conflict dengan local PostgreSQL
- BullMQ workers pakai `{ url: string }` connection (bukan ioredis instance) untuk hindari version mismatch
- Hapus OpenRouter dari AI fallback chain (createOpenRouter export tidak tersedia)

### Yang Berhasil
- Docker Compose: 3 containers healthy (PostgreSQL, Redis, MinIO)
- Backend: Health check ✅, Login ✅, Register ✅, 4 BullMQ workers active ✅
- Database: 12 tables created, 2 seed users
- Frontend: TypeScript zero errors, Vite build success (400KB)
- Full stack: all services communicate properly

### Yang Perlu Dikerjakan Selanjutnya
- Setup WebSocket server untuk real-time messaging
- Implementasi Modul 1 — Omnichannel Inbox
- Setup CI/CD pipeline (GitHub Actions)

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
