# STATUS.md

**Last updated:** 2026-06-17 (Pipeline Column Management Phase 4: Hapus Kolom)

## Current State

| Category | Status |
|----------|--------|
| **Project Phase** | 🔨 Foundation — Ready for Modul 5 |
| **PRD** | ✅ Final (v1.2) — Document Extraction + Feature-Based Architecture |
| **Tech Stack** | ✅ Finalized (Bun + Elysia + Drizzle + Vercel AI SDK) |
| **Backend Architecture** | ✅ Feature-based (DEC-010) — 14 modules + 4 workers + shared lib |
| **Env Config** | ✅ Single `.env` at root (DEC-011) |
| **Icons** | ✅ itsHover (primary) + Lordicon (fallback) + Custom SVG (brand only) |
| **Skills Installed** | ✅ 6/6 (shadcn, frontend-design, vercel-react-best-practices, tdd, sentry-cli, webapp-testing) |
| **Core Docs** | ✅ Created (CLAUDE.md, STATUS.md, PROGRESS.md, DECISIONS.md, EPICS.md, CHANGELOG.md) |
| **Project Setup** | ✅ Monorepo with Bun workspaces |
| **Docker Compose** | ✅ PostgreSQL pgvector (port 5433), Redis, MinIO |
| **Frontend Boilerplate** | ✅ Vite + React + Tailwind + shadcn/ui + Router + Zustand + TanStack Query |
| **Backend Boilerplate** | ✅ Elysia + Drizzle ORM + BullMQ + Auth (JWT) + Vercel AI SDK |
| **Database Schema** | ✅ Drizzle ORM schema (12 tables), seeded |
| **Testing** | ✅ Vitest (backend+frontend) + Playwright (E2E config) |
| **Modul 1 Inbox UI** | ✅ Complete (Phase 1-8) — All 5.1.1–5.1.6 with mock data |
| **Modul 2 AI Auto-Reply UI** | ✅ Complete (Phase 1-8) — Settings + Knowledge Base + AI Chat Preview |
| **Modul 3 Broadcast & Campaign UI** | 🟢 Complete (Phase 1-6) — Foundation, Campaigns List, Template Library, Segment Builder, Campaign Wizard, Campaign Detail + Report |
| **Modul 4 CRM & Pipeline Lead UI** | 🟢 Complete (Phase 1-7) — Kanban + Filters + Column Customize + Contacts List + Contact Profile + Segment Management + CSV Import + Integration Polish |

## Open Items

- [ ] Setup WebSocket server untuk real-time messaging
- [ ] Integrasi WhatsApp Business API
- [ ] Backend API Modul 1 — conversations, contacts, messages endpoints
- [ ] Connect inbox UI ke backend API (ganti mock data)

## Blocked Items

_(None)_

## Next Best Actions

1. **Modul 5** — Template & Quick Reply
2. **WebSocket** — Real-time messaging foundation
3. **WebSocket** — Real-time messaging foundation
4. **Backend conversations API** — CRUD conversations + messages
5. **Connect frontend ke backend API** — ganti mock data

## Done Items

- [x] Pipeline Column Management Phase 4: Hapus Kolom — DeleteColumnConfirm (validation: contacts in column blocks delete, last column blocks delete, warning message with contact count), KanbanColumnHeader wired "Hapus Kolom" menu item, ColumnCustomizeModal delete already wired to store, typecheck zero errors, build success
- [x] Pipeline Column Management Phase 3: Tambah Kolom — AddColumnModal (name input + color picker with 8 presets + live preview + Enter to submit + dispatch addColumn), KanbanColumnHeader wired "Tambah Kolom" menu item to open modal, typecheck zero errors, build success
- [x] Pipeline Column Management Phase 2: Ubah Nama Kolom — KanbanColumnHeader inline rename (editing state, input field, Enter/Escape/blur handlers, renameColumn dispatch), KanbanBoard pass columnId prop, ColumnCustomizeModal wired to store (was disconnected local state), typecheck zero errors, build success
- [x] Pipeline Column Management Phase 1: Dynamic Column State — Added PipelineColumn type + DEFAULT_PIPELINE_COLUMNS to mock/crm.ts, added columns state + renameColumn/addColumn/removeColumn actions to stores/crm.ts, rewire 5 consumers (KanbanBoard, ContactTable, ContactFilters, ContactEditModal, ContactInfoCard, ContactProfileHeader) from hardcoded PIPELINE_COLUMNS to store.columns, typecheck zero errors, build success
- [x] Modul 4 Phase 7: Integration + Polish + Verification — KanbanCard now navigates to /contacts/:id profile page (replaced Zustand selectContact with useNavigate), ContactProfilePage fixed dead setContacts state (now tracks single contact with useState), Removed dead selectedContactId + selectContact from crm.ts store, All 18 CRM files verified (2104 lines total), typecheck zero errors, build success
- [x] Modul 4 Phase 6: Segment Management + CSV Import — SegmentManager (saved filter presets dropdown, click-outside-to-close, active segment highlight, delete segment), SegmentSaveModal (name + save current filters, filter summary display), ImportContactsModal (CSV drag-drop upload, auto-detect header, validation: name + phone/email required, preview table 50 rows, valid/invalid counts), ContactsPage integrated (segment state, import modal, export as CSV, "Simpan sebagai Segmen" button when filters active, segment select loads filters)
- [x] Modul 4 Phase 5: Contact Profile Page — ContactProfileHeader (avatar, name, status badge, created date, back button, edit button), ContactInfoCard (2-column grid: phone, email, channel, identifiers, status, program, value, agent, labels, notes), ContactActivityTimeline (sorted activity log with type icons + relative time + agent name), ContactEditModal (name, phone, email, status, program, agent, notes — save to local state), ContactProfilePage (grid layout, 404 handling), ContactsPage wired to navigate(/contacts/:id), /contacts/:id route added
- [x] Modul 4 Phase 4: Contacts List Page — ContactTable (11-column table: checkbox, avatar+name, phone, email, channel icon, status badge, labels, agent, value, date, actions), ContactFilters (search + status/source/agent filters), BulkActionBar (selected count + bulk actions), ContactsPage rewrite (pagination, filter logic, Import/Export buttons)
- [x] Modul 4 Phase 2: Kanban Column Header + Drag Feedback — KanbanColumnHeader (color dot, name, count, total value, 3-dot column menu with edit/add/delete actions), KanbanBoard ref-based drag highlight (ring-2 + bg-brand-blue-50, zero re-render), KanbanCard draggable with opacity feedback, empty column dashed border
- [x] Modul 4 Phase 1: CRM Pipeline Kanban Foundation — mock/crm.ts (18 leads, 3 programs, agents), stores/crm.ts (filter + moveContact), KanbanBoard (6 columns, drag-drop ready, total value), KanbanCard (name, channel, program, agent, labels, time), PipelinePage rewrite
- [x] Modul 2 Phase 8: Final Integration + Verification — Typecheck zero errors, Vite build success (all chunks verified), all pages navigable, all components verified present
- [x] Modul 3 Phase 6: Campaign Detail + Broadcast Report — CampaignDetailPage (/campaigns/:id route), CampaignReportStats (4 stat cards with percentages), CampaignProgressBar (stacked horizontal bar), CampaignTimeline (vertical event timeline), CampaignRecipientList (searchable/filterable table with pagination)
- [x] Modul 3 Phase 5: Campaign Creation Wizard — CampaignWizard (4-step wizard), WizardStepBasic (name/desc/goal/channel), WizardStepSegment (reuses SegmentBuilder), WizardStepTemplate (template card grid + preview), WizardStepSchedule (now/scheduled picker + WIB timezone), WizardStepReview (full summary), CreateCampaignPage (/campaigns/new route)
- [x] Modul 3 Phase 4: Segment Builder — SegmentBuilder (dynamic filter add/remove), SegmentFilterChips (removable pills), SegmentPreview (channel/pipeline breakdown + sample contacts)
- [x] Modul 3 Phase 3: Template Library Page — TemplatesPage, TemplateCategoryFilter, TemplateCard, TemplateCreateModal (full CRUD form with variable insertion), TemplatePreviewModal (phone-frame WhatsApp mockup), /templates route wired
- [x] Modul 2 Phase 7: AI Chat Preview + Persona Config UI — PersonaConfig (name, language, tone selector, system prompt), AIChatPreview (chat simulator with mock responses), "Test AI" button in Persona section
- [x] Modul 2 Phase 6: Handoff Configuration UI — HandoffConfig component with trigger keywords (add/remove chips), conversion signal toggles, handoff message editor, max AI messages input, priority notification toggle
- [x] Modul 2 Phase 5: Working Hours Configuration UI — WorkingHours component with per-day toggles, time pickers, timezone display, OOO message textarea
- [x] Modul 2 Phase 4: Knowledge Base Document Editor — KBDocumentEditor (Tiptap), KnowledgeBasePage detail popup with toolbar, mock content for all 8 documents
- [x] Modul 2 Phase 3: Knowledge Base Document List + Upload — KBDocumentList, KBDocumentCard, KBUploadModal, KBCategoryFilter, /knowledge-base route
- [x] Modul 2 Phase 2: AI Provider Configuration — ProviderConfig (3 provider cards, drag-to-reorder, toggle, status badges, advanced settings)
- [x] Modul 2 Phase 1: Foundation — Tabbed Settings + Shared Infrastructure (pill-tab, mock/ai-settings.ts, stores/ai-settings.ts, SettingsPage rewrite)
- [x] Modul 2 AI Auto-Reply UI COMPLETE (Phase 1-8) — Full settings page with all 5 sections (AI toggle, providers, working hours, handoff, persona) + knowledge base page (list, upload, editor) + AI chat preview
- [x] Modul 1 Inbox UI Complete (Phases 1-8) — Full 5.1.1–5.1.6 UI with mock data simulation, zero TS errors, build success
- [x] Phase 8: Wire & verify — typecheck zero errors, build success (347KB gzip total), all pages navigable
- [x] Phase 7: ContactDetailPanel — Info/History tabs, editable notes, activity timeline, conversation history, LabelBadge integration
- [x] Phase 6: Notification UI — NotificationBell + badge, NotificationDropdown, useNotificationStore (Zustand), 6 mock notifications, AppLayout header
- [x] Phase 5: Label Management — LabelBadge, LabelColorPicker, LabelManagerModal, LabelPicker, LabelTable, LabelsPage (/labels route), Sidebar nav
- [x] Phase 4: Assignment & Routing — AssignAgentModal, TransferModal, ActionBar (Assign/Transfer/Resolve/Snooze), ChatPanel integration
- [x] Phase 3: Filters & Sort — Agent filter dropdown, Label multi-select filter, Sort dropdown (newest/waiting/priority), phone number search
- [x] Phase 2: Chat Enhancement — MediaMessage (image/video/doc/audio/location), EmojiPicker (@emoji-mart/react lazy-loaded), AttachmentButton, QuickReplyMenu (/ shortcut), MessageInput (refactored input bar), ChatPanel modified
- [x] Phase 1: Shared UI Primitives — 13 components: Button, Badge, Avatar, Modal, Dropdown, Popover, Tooltip, Select, Toggle, Skeleton, ScrollArea, Separator, Checkbox
- [x] Mock data extended — MessageContentType, ConversationPriority, QuickReply types; media message examples; labels+priority on all conversations; ActivityLog; agent activeConversationCount; 6 notification mocks; label CRUD mock
- [x] Backend entry point — Elysia server, CORS, error handler, health check, graceful shutdown
- [x] Backend lib — db.ts (Drizzle + postgres.js), redis.ts (ioredis), auth.ts (JWT + Bun.password), ai.ts (multi-provider fallback), storage.ts (MinIO), webhook.ts (Meta signature), errors.ts (AppError hierarchy + Indonesian messages), schema.ts (12+ tables), seed.ts
- [x] Auth module — Login, Register, Refresh Token (complete 4-layer: types→queries→services→handlers→routes)
- [x] Module stubs — 13 modules (contacts, conversations, channels, messages, knowledge-base, pipeline, broadcast, analytics, notifications, users, reports, search, settings) with routes + placeholders
- [x] BullMQ workers — 4 workers (message, ai, document, broadcast) with start/shutdown lifecycle
- [x] Middleware — Error handler (AppError → Indonesian JSON responses)
- [x] Route composition — src/routes/index.ts (14 modules under /api/v1)
- [x] Drizzle config — drizzle.config.ts for migrations
- [x] Server build verified — TypeScript zero errors
- [x] Monorepo root — package.json (Bun workspaces), docker-compose.yml, .env
- [x] Docker Compose — PostgreSQL pgvector:pg16, Redis 7 Alpine, MinIO
- [x] Frontend scaffold — Vite + React 19 + TypeScript 6
- [x] Tailwind CSS 3 + postcss + autoprefixer + tailwindcss-animate
- [x] shadcn/ui Radix dependencies — 17 primitives installed
- [x] UI libraries — Zustand (client state), TanStack Query (server state), React Hook Form + Zod
- [x] Rich text — Tiptap (knowledge base editor)
- [x] Charts — Apache ECharts + echarts-for-react
- [x] Icons — itsHover (17 animated icons) + Lordicon (fallback) + custom SVG (brand only). lucide-react REMOVED.
- [x] Sentry — @sentry/react
- [x] Design system — CSS tokens from DESIGN.md, pill-button/card/badge classes
- [x] Layout — AppLayout + Sidebar (collapsible, nav items + Label nav item)
- [x] Router — React Router v7, lazy-loaded pages + /labels route
- [x] Stores — Zustand: useSidebarStore, useInboxStore (filters+sort), useNotificationStore
- [x] API client — apiRequest utility, ApiError class
- [x] Constants — Channel types/colors, pipeline columns, user roles
- [x] Shared types — packages/shared/src/types.ts
- [x] Pages — Dashboard, Inbox, Contacts, Pipeline, Settings, Labels, 404
- [x] Path aliases — @/ mapped to ./src/*
- [x] Vite config — React plugin, path alias, dev proxy (API + WS)
- [x] Build verified — TypeScript zero errors, Vite build success (347KB gzip)
