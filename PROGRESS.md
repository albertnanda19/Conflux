# PROGRESS.md

Log kerja harian berurutan waktu. Entry terbaru di ATAS.

## 2026-06-17 — Settings Page 2-Column Layout Redesign (Umum & Akun)

### Yang Dikerjakan
- Created `components/settings/SettingsLayout.tsx` — 2-column layout wrapper: left (flex-1, scrollable content) + right (w-64, sticky: title, separator, subtitle, actionButton)
- Created `components/settings/SettingsPillTabs.tsx` — Pill sub-tab switcher: flex gap-2, bg-surface rounded-xl, active: bg-canvas text-ink shadow-sm, inactive: text-steel hover:text-ink
- Created `components/settings/umum/UmumTab.tsx` — Sub-tab controller: 3 tabs (company/location/appearance), renders SettingsLayout + SettingsPillTabs + content switch
- Created `components/settings/umum/CompanyProfile.tsx` — Thin wrapper → `<OrganizationInfo />`
- Created `components/settings/umum/LocationTimezone.tsx` — Thin wrapper → `<PlatformPreferences />`
- Created `components/settings/umum/Appearance.tsx` — Thin wrapper → `<AppearanceSettings />`
- Created `components/settings/akun/AkunTab.tsx` — Sub-tab controller: 3 tabs (profile/security/notifications), renders SettingsLayout + SettingsPillTabs + content switch
- Created `components/settings/akun/MyProfile.tsx` — Avatar (useAuthStore initials) + name/email/phone + role badge (colored per role) + bio + joined date + save button + validation (name min 2, phone regex)
- Created `components/settings/akun/Security.tsx` — Password change (local useState, strength indicator 4-bar, validation) + active sessions list (revoke button, current badge) + login history table (grid-based, status badge)
- Created `components/settings/akun/Notifications.tsx` — Personal notification ToggleRow × 5 (email, desktop, sound, new message, assignment) + digest frequency select (none/daily/weekly)
- Modified `mock/account-settings.ts` — Extended PersonalPreferences: +5 fields (desktopNotifications, notificationSound, notifyOnNewMessage, notifyOnAssignment, digestFrequency)
- Modified `pages/SettingsPage.tsx` — Replaced old full-width card sections with `<UmumTab />` and `<AkunTab />`, removed old component imports

### Keputusan yang Diambil
- Reuse existing Phase 2 components (OrganizationInfo, PlatformPreferences, AppearanceSettings) — they render without card wrappers, composable inside SettingsLayout left column
- Custom pill tabs (SettingsPillTabs) instead of Radix Tabs — design calls for pill toggle buttons in sticky right column
- Password fields use local `useState` — transient form values should not persist in Zustand (security)
- `SettingsLayout` is stateless — pill tab state lives in parent (UmumTab/AkunTab)
- `AkunNotifications` not `Notifications` — avoids name collision with existing NotificationPrefs

### Yang Berhasil
- 10 new files created, 2 modified, zero TypeScript errors, build success
- Settings page now renders 2-column layout: content scrolls on left, sticky title/subtitle on right
- Umum tab: 3 sub-tabs (Profil Perusahaan, Lokasi & Zona Waktu, Tampilan)
- Akun tab: 3 sub-tabs (Profil Saya, Keamanan, Notifikasi)
- Security: password strength indicator, session management, login history table
- Notifications: 5 toggle triggers + digest frequency
- PersonalPreferences type extended with 10 fields total

### Yang Perlu Dikerjakan Selanjutnya
- Backend API Settings — CRUD endpoints for org, preferences, notifications, appearance
- Connect Settings UI ke backend API (ganti mock data)
- WebSocket — Real-time messaging foundation

## 2026-06-17 — Settings Page Phase 1: Foundation (Umum & Akun Tabs)

### Yang Dikerjakan
- Created `components/settings/toast.tsx` — Minimal toast system: Zustand store (addToast/dismissToast), ToastContainer renders fixed bottom-right, auto-dismiss 3s, 3 variants (success/error/info) with colored borders, slideUp animation
- Created `components/settings/FormField.tsx` — Reusable form field wrapper: label + required marker + children slot (input/select/textarea) + error text (red) + hint text (stone)
- Created `components/settings/ToggleRow.tsx` — Reusable toggle row: label + description + Radix SwitchPrimitive.Root toggle, styled with bg-canvas border-hairline-soft, checked=brand-blue-deep
- Created `mock/general-settings.ts` — Types: OrganizationInfo (7 fields), PlatformPreferences (6 fields), NotificationSettings (7 fields), AppearanceSettings (4 fields). Mock data: Acme Learning Indonesia, WIB timezone, IDR currency. Option arrays: TIMEZONE_OPTIONS, LANGUAGE_OPTIONS, DATE_FORMAT_OPTIONS, CURRENCY_OPTIONS, TIME_FORMAT_OPTIONS, WEEK_START_OPTIONS, INDUSTRY_OPTIONS, ACCENT_COLORS
- Created `mock/account-settings.ts` — Types: UserProfile (8 fields), ActiveSession (6 fields), LoginHistoryEntry (7 fields), PersonalPreferences (5 fields). Mock data: Admin Utama, 3 sessions, 5 login history entries, AUTO_LOGOUT_OPTIONS
- Created `stores/general-settings.ts` — Zustand store: 4 sub-objects (organization, preferences, notifications, appearance) + _hasChanges flag + update* methods + saveAll() with toast + resetChanges()
- Created `stores/account-settings.ts` — Zustand store: profile, sessions[], loginHistory[], personalPreferences + _hasChanges flag + update*/revoke/save methods + changePassword() (mock: validates against 'password')

### Keputusan yang Diambil
- No new dependencies — toast built in (~50 lines), ToggleRow wraps existing Radix SwitchPrimitive
- Native `<select>` for dropdowns (matches PersonaConfig/WorkingHours pattern)
- Mock changePassword accepts 'password' as current password for demo purposes

### Yang Berhasil
- All 7 files created, zero TypeScript errors, build success
- Toast system: addToast auto-dismisses after 3s, ToastContainer renders at fixed bottom-right
- FormField handles all states: label, required marker, error text, hint text
- ToggleRow renders with label + description + Radix toggle switch
- Both stores initialize from mock data, update methods set _hasChanges flag
- SettingsPage unchanged — phases 2+ will wire components in

## 2026-06-17 — Kelola Agent UI: Phase 1-6 Complete (FULL)

### Yang Dikerjakan
- Created `mock/agents.ts` — AgentProfile type (17 fields), 6 mock agents with realistic data, CRUD functions (getAgents, getAgentById, createAgent, updateAgent, deleteAgent, toggleAgentStatus)
- Created `stores/agents.ts` — Zustand store: agents[], searchQuery, roleFilter, statusFilter, sortBy, actions (setSearchQuery, setRoleFilter, setStatusFilter, setSortBy, addAgent, editAgent, removeAgent, cycleStatus)
- Created `AgentAvatar.tsx` — Circle initials with 6-brand-color rotation, status dot (emerald pulse for online, amber for busy, gray for offline), 3 sizes (sm/md/lg), group-hover:scale-105
- Created `AgentStatusBadge.tsx` — Online (emerald), Busy (amber), Offline (gray) with animated pulse dot on online, 2 sizes
- Created `AgentRoleBadge.tsx` — Super Admin (coral), Admin (blue), Supervisor (purple), Agent (gray)
- Created `AgentFilters.tsx` — Search bar + Role dropdown + Status dropdown + Sort dropdown, reads/writes Zustand store directly
- Created `AgentStatsOverview.tsx` — 4 StatCards (Total Agent, Online Saat Ini, Avg Response Time, Avg Konversi), reuses StatCard from reports module
- Created `AgentTable.tsx` — Full table (avatar+name+email, role badge, status badge, capacity active/max, conversion %, Edit/Hapus actions), row click navigates to /agents/:id
- Created `AgentFormModal.tsx` — Single modal for create+edit, 8 form fields, live avatar preview, initials auto-generate from name, validation (name min 2, email format+uniqueness, maxConversations 1-50)
- Created `AgentProfilePage.tsx` — Profile page: finds agent by useParams id, 2-column grid (PerformanceCard + ActivityTimeline), ConversationList below, 404 handling, toggle status, edit button
- Created `AgentProfileHeader.tsx` — Back button → /agents, large avatar, name, role badge, status badge, join date, "Ganti Status" + "Edit" buttons
- Created `AgentPerformanceCard.tsx` — 2×2 grid with AnimatedNumber (Total Percakapan, Diselesaikan, Avg Response Time, Conversion Rate), staggered 50ms animation
- Created `AgentActivityTimeline.tsx` — 6 mock activities, vertical timeline with colored icons, relative timestamps, staggered 80ms animation
- Created `AgentConversationList.tsx` — 5 mock conversations with contact name, channel badge, last message, status, relative time
- Created `AgentDeleteConfirm.tsx` — Backdrop blur + warning icon + active conversation blocking (Hapus disabled when activeConversationCount > 0)
- Created `AgentPage.tsx` (evolved) — Composes StatsOverview + Filters + Table + FormModal + DeleteConfirm, empty state when no agents match
- Modified `router.tsx` — Added /agents/new → AgentsPage, /agents/:id → AgentProfilePage, /agents → AgentsPage (lazy-loaded)
- Modified `Sidebar.tsx` — Added "Kelola Agent" nav item (👥) after "Kontak"
- Modified `mock/inbox.ts` — MOCK_AGENTS now derives from mock/agents.ts via getAgents() for cross-module data sync

### Keputusan yang Diambil
- AgentProfile type is NEW — does NOT replace existing Agent type in mock/inbox.ts
- Cross-module data sync: mock/inbox.ts derives MOCK_AGENTS from mock/agents.ts via getAgents() — Inbox/CRM/Contact modules auto-reflect agent changes
- Single modal for create+edit (same pattern as LabelManagerModal) — editingAgent prop determines mode
- Form uses local useState (not react-hook-form) — consistent with LabelManagerModal and ContactEditModal patterns
- Profile page uses agents.find() instead of getAgent() for proper Zustand reactivity (getAgent is stable ref, wouldn't trigger re-render)
- Route ordering: /agents/new before /agents/:id before /agents (same pattern as /campaigns)
- AgentAvatar uses brand colors rotation (6 colors), matching existing brand palette
- Delete blocked when agent has active conversations (same pattern as DeleteColumnConfirm)

### Yang Berhasil
- Typecheck zero errors
- Vite build success — AgentsPage 11.87 kB, AgentProfilePage 9.96 kB (both under 15KB target)
- 6 agents render in table with correct avatars, badges, data
- Search filters by name/email, role filter, status filter, sort all work
- StatCards show correct aggregated data
- "Tambah Agent" button opens modal in create mode
- Edit button opens modal in edit mode with pre-filled data
- Save creates new agent / updates existing agent
- Row click navigates to /agents/:id
- Profile page shows performance card, activity timeline, conversation list
- Toggle Status cycles online→busy→offline with visual feedback
- Delete confirmation with active conversation blocking
- Empty state when no agents match filters
- Cross-module sync: changes in Kelola Agent reflected in Inbox agent filter
- All routes verified: /agents, /agents/new, /agents/:id
- All animations smooth: staggered fade-in, animate-pulse on online dots, hover scale on avatars, backdrop blur on delete confirm

### Yang Perlu Dikerjakan Selanjutnya
- WebSocket real-time messaging foundation
- Backend conversations API (CRUD conversations + messages)
- Connect frontend ke backend API (ganti mock data)

---

## 2026-06-17 — Modul 6 Laporan & Analitik: Phase 6 Broadcast + AI vs Human (FINAL)

### Yang Dikerjakan
- Created `components/reports/charts/CampaignFunnelChart.tsx` — ECharts funnel chart: sent → delivered → read → replied with gradient colors (brand-blue → cyan → purple → coral)
- Created `components/reports/charts/AiVsHumanDonutChart.tsx` — ECharts donut chart: AI 62.3% (cyan), Human 24.8% (blue), Handoff 12.9% (coral), center label shows AI %
- Created `components/reports/charts/AiTopicChart.tsx` — horizontal bar chart: top 6 AI topics by count, gradient cyan→blue bars, satisfaction rate in tooltip
- Created `components/reports/BroadcastTab.tsx` — 4 StatCards (Total Terkirim, Dibaca, Avg Reply Rate, Avg Conversion), CampaignFunnelChart, campaign table with 7 rows, color-coded status badges (draft/scheduled/running/completed/cancelled)
- Created `components/reports/AiVsHumanTab.tsx` — 3 StatCards (AI Handled, Human Handled, Avg AI Confidence), 2-col chart grid, KnowledgeBaseGaps list with unanswered count and suggested actions
- Updated `components/reports/LazyChart.tsx` — added 3 lazy exports (CampaignFunnelChart, AiVsHumanDonutChart, AiTopicChart)
- Updated `pages/ReportsPage.tsx` — replaced both "Coming in Phase 6" placeholders with BroadcastTab and AiVsHumanTab
- Updated `mock/analytics.ts` — added CampaignFunnel interface for type safety

### Keputusan yang Diambil
- AiVsHumanDonutChart reuses OriginDistributionChart donut pattern (center label, bottom legend, padAngle)
- Broadcast tab table uses inline status badge with dot + colored background matching each status
- KnowledgeBaseGaps section uses simple card list instead of chart — data is text-heavy, better as list
- CampaignFunnelChart uses ECharts funnel type (built-in) rather than custom implementation

### Yang Berhasil
- Typecheck zero errors
- Vite build success (877ms)
- ReportsPage chunk: 25.20 kB (gzip 5.57 kB)
- 3 new chart chunks lazy-loaded
- All 6 tabs now complete and wired
- All Phase 1-5 changes preserved intact
- Modul 6 Laporan & Analitik UI — COMPLETE

### Yang Perlu Dikerjakan Selanjutnya
- WebSocket real-time messaging foundation
- Backend conversations API (CRUD conversations + messages)
- Connect frontend ke backend API (ganti mock data)

---

## 2026-06-17 — Modul 6 Laporan & Analitik: Phase 5 Conversation Trends

### Yang Dikerjakan
- Created `components/reports/charts/ConversationVolumeChart.tsx` — area chart (30 hari) + 7-day moving average dashed line overlay
- Created `components/reports/charts/HeatmapChart.tsx` — ECharts heatmap 7 days × 24 hours with visualMap color scale
- Created `components/reports/charts/PeakHoursChart.tsx` — horizontal bar top 10 jam sibuk, coral→brand-blue gradient
- Created `components/reports/ConversationTrendsTab.tsx` — 3 StatCards + VolumeChart + Heatmap/PeakHours 3-col grid
- Updated `components/reports/LazyChart.tsx` — added 3 lazy exports (ConversationVolumeChart, HeatmapChart, PeakHoursChart)
- Updated `pages/ReportsPage.tsx` — replaced "Coming in Phase 5" placeholder with ConversationTrendsTab

### Keputusan yang Diambil
- HeatmapChart uses ECharts visualMap (show: false) for color mapping without visible legend
- ConversationVolumeChart computes 7-day moving average inline, returns null for first 6 days
- PeakHoursChart data aggregated from MOCK_HEATMAP_DATA by hour, sorted descending, take top 10, re-sorted by hour

### Yang Berhasil
- Typecheck zero errors
- Vite build success (871ms)
- All Phase 1-4 changes preserved intact

---

## 2026-06-17 — Modul 6 Laporan & Analitik: Phase 4 Lead Source Report

### Yang Dikerjakan
- Created `components/reports/charts/SourceBreakdownChart.tsx` — horizontal grouped bar chart comparing Total Lead vs Converted per channel (WA/IG/FB)
- Created `components/reports/charts/OriginDistributionChart.tsx` — donut chart showing 6 lead origins with center label total
- Created `components/reports/charts/ConversionByChannelChart.tsx` — vertical grouped bar chart (programs × channels)
- Created `components/reports/charts/MultiChannelTrendChart.tsx` — stacked area chart (6 months × 3 channels with gradient fills)
- Created `components/reports/LeadSourceTab.tsx` — tab component with 3 summary stat cards + 4 lazy-loaded charts in 2×2 grid
- Updated `components/reports/LazyChart.tsx` — added 3 new lazy exports (SourceBreakdownChart, OriginDistributionChart, MultiChannelTrendChart)
- Updated `pages/ReportsPage.tsx` — replaced "Coming in Phase 4" placeholder with LeadSourceTab

### Keputusan yang Diambil
- Reused existing `ConversionByProgramChart` instead of creating duplicate `ConversionByChannelChart` — same data, same chart type
- SourceBreakdownChart uses per-item color via `itemStyle.color` on each data point (avoids ECharts callback type issues)
- OriginDistributionChart uses 6-color palette (brand-blue, magenta, purple, coral, cyan, emerald) matching brand aesthetic
- MultiChannelTrendChart gradient fills use hex + alpha suffix (`#FF6B5A40`) instead of rgba for simpler code

### Yang Berhasil
- Typecheck zero errors
- Vite build success (930ms)
- ReportsPage chunk: 17.56 kB (gzip 4.18 kB)
- 3 new chart chunks lazy-loaded (SourceBreakdown 1.35 kB, OriginDistribution 1.39 kB, MultiChannelTrend 1.39 kB)
- All Phase 1-3 changes preserved intact

### Yang Perlu Dikerjakan Selanjutnya
- Phase 5: Conversation Trends & Heatmap (VolumeChart, HeatmapChart, PeakHoursChart)

---

## 2026-06-17 — Modul 6 Laporan & Analitik: Phase 3 Agent Performance Report

### Yang Dikerjakan
- Created `components/reports/AgentPerformanceTab.tsx` — main tab component with 3 summary stat cards (Total Agent, Avg Response Time, Avg Conversion Rate), sortable agent table (6 columns: Agent, Ditangani, Diselesaikan, Response Time, Conversion, Online), expandable agent row detail, and comparison chart
- Created `components/reports/AgentRow.tsx` — table row component with colored avatar, agent name, conversation counts, color-coded response time badge, conversion rate, online hours, expandable detail row
- Created `components/reports/charts/AgentComparisonChart.tsx` — ECharts horizontal grouped bar chart comparing 6 agents across 3 metrics
- Updated `components/reports/LazyChart.tsx` — added AgentComparisonChart lazy export
- Updated `pages/ReportsPage.tsx` — replaced Phase 3 placeholder with AgentPerformanceTab

### Keputusan yang Diambil
- SortIcon defined as inline component inside AgentPerformanceTab (↗/↘ arrows)
- Expandable row shows: Resolve Rate, Online Minggu Ini, Total Ditangani in 3-column grid
- Agent comparison chart uses 3 distinct colors: brand-blue (Ditangani), brand-cyan (Diselesaikan), emerald (Conversion %)

### Yang Berhasil
- Typecheck zero errors
- Vite build success
- ReportsPage chunk: 15.79 kB (gzip 3.93 kB)
- AgentComparisonChart lazy-loaded (1.44 kB gzip 0.67 kB)
- All Phase 1 + 2 changes preserved intact

### Yang Perlu Dikerjakan Selanjutnya
- Phase 4: Lead Source Report (ChannelBreakdownChart, SourceAnalysisChart, ConversionByChannelChart, MultiChannelTrendChart)

---

## 2026-06-17 — Modul 6 Laporan & Analitik: Phase 2 Analytics Overview Dashboard

### Yang Dikerjakan
- Created `pages/ReportsPage.tsx` — main analytics page with header, ReportFilters bar, 6-tab navigation (Ringkasan, Performa Agent, Sumber Lead, Tren Percakapan, Broadcast, AI vs Human)
- Created `components/reports/OverviewTab.tsx` — 6 StatCards (total leads, conversion rate, response time, active conversations, agents online, AI handle rate) + 4 ECharts charts in 2×2 grid
- Created `components/reports/LazyChart.tsx` — ChartSuspense wrapper + lazy re-exports for all 4 chart components (code-split ECharts)
- Created `components/reports/charts/LeadTrendChart.tsx` — ECharts area/line chart (30-day lead trend, smooth curve, brand-blue gradient fill)
- Created `components/reports/charts/ChannelDistributionChart.tsx` — ECharts donut chart (WA/IG/FB distribution, channel colors, center label total)
- Created `components/reports/charts/ConversionByProgramChart.tsx` — ECharts grouped bar chart (programs × channels, color-coded bars)
- Created `components/reports/charts/TopAgentChart.tsx` — ECharts horizontal bar chart (agent rankings, gradient bars)
- Updated `router.tsx` — `/reports` route now points to `ReportsPage` (was placeholder `ContactsPage`)

### Keputusan yang Diambil
- ECharts code-split via `React.lazy` + `ChartSuspense` — ReportsPage chunk 1,058 kB → 9.16 kB, ECharts core lazy-loaded only on first chart render
- Tab navigation uses existing `Tabs`/`TabList`/`TabTrigger`/`TabContent` from `components/ui/tabs.tsx` (underline-style, consistent with SettingsPage)
- Placeholder tabs for Phase 3-6 show "Coming in Phase X" message

### Yang Berhasil
- Typecheck zero errors
- Vite build success (806ms)
- ReportsPage chunk: 9.16 kB (gzip 2.74 kB)
- ECharts lazy chunk: 1,042 kB (gzip 341 kB) — only loaded on first chart render
- All 4 charts render with brand colors (no black backgrounds)
- SVG renderer for crisp rendering

### Yang Perlu Dikerjakan Selanjutnya
- Phase 3: Agent Performance Report (sortable table + comparison chart)

## 2026-06-17 — Modul 6 Laporan & Analitik: Phase 1 Foundation

### Yang Dikerjakan
- Created `mock/analytics.ts` — 11 interfaces + 12 mock data exports (AnalyticsOverview, AgentPerformance[], LeadSourceChannel[], LeadSourceOrigin[], LeadSourceByProgram[], LeadSourceMonthlyTrend[], ConversationTrendDay[], HeatmapCell[], BroadcastCampaignRow[], AiVsHumanStats, CampaignFunnel)
- Created `stores/reports.ts` — Zustand store with dateRangePreset (7d/30d/90d), dateRange, selectedAgent, selectedChannel, setter actions
- Created `components/reports/AnimatedNumber.tsx` — requestAnimationFrame-based counter with easing, locale formatting
- Created `components/reports/StatCard.tsx` — stat card with icon, animated number, change % indicator, uses animate-fade-in
- Created `components/reports/ChartCard.tsx` — chart wrapper card with title, subtitle, actions slot, card-base styling
- Created `components/reports/DateRangePicker.tsx` — pill-style preset selector (7/30/90 Hari) with ink active state
- Created `components/reports/ReportFilters.tsx` — combined filter bar (DateRangePicker + agent dropdown + channel dropdown)
- Created `components/reports/EmptyState.tsx` — empty data placeholder with icon + message

### Keputusan yang Diambil
- Heatmap data: 7×24 matrix with randomized but realistic peak patterns (weekday mornings/evenings high, weekends low)
- Conversation trends: 30-day array with weekend/weekday variance
- No ECharts in Phase 1 — chart components come in Phase 2+

### Yang Berhasil
- Typecheck zero errors
- Vite build success (678ms)
- All mock data structured for easy backend replacement later

### Yang Perlu Dikerjakan Selanjutnya
- Phase 2: Analytics Overview Dashboard (ReportsPage + OverviewTab + 4 ECharts components)

## 2026-06-17 — Pipeline Column Management Phase 4: Hapus Kolom

### Yang Dikerjakan
- Created `DeleteColumnConfirm` confirmation dialog — red warning icon, column name display, contact count validation, last-column validation
- Wired "Hapus Kolom" menu item in `KanbanColumnHeader` to open `DeleteColumnConfirm`
- Delete validation: blocks if contacts exist in column (shows count), blocks if last column remaining
- Store `removeColumn(columnId)` returns boolean — false on validation failure, true on success
- Added `deleteOpen` state + import `DeleteColumnConfirm` to KanbanColumnHeader

### Keputusan yang Diambil
- DeleteColumnConfirm shows validation errors BEFORE user clicks Hapus — prevents dead-end UX
- "Hapus" button disabled when validation fails (contacts in column or last column)
- ColumnCustomizeModal delete already wired to store from Phase 2 — no changes needed there
- Validation happens in the confirm dialog (not in store) — store's removeColumn has the same validation as a safety net

### Yang Berhasil
- "Hapus Kolom" menu item opens DeleteColumnConfirm
- Delete blocked when column has contacts — shows warning with count
- Delete blocked when only 1 column remains — shows warning
- Delete succeeds when column is empty and not last — column removed from KanbanBoard + all consumers
- Pipeline Column Management 4/4 phases COMPLETE
- typecheck zero errors, build success (776 modules, 688ms)

---

## 2026-06-17 — Pipeline Column Management Phase 3: Tambah Kolom

### Yang Dikerjakan
- Created `AddColumnModal` component — name input + color picker (8 presets) + live preview + Enter to submit
- Wired "Tambah Kolom" menu item in `KanbanColumnHeader` to open `AddColumnModal`
- Modal dispatches `addColumn(name, color)` to Zustand store, closes on success
- ColumnCustomizeModal already wired to store (renamed from local state to store in Phase 2)

### Keputusan yang Diambil
- AddColumnModal is a standalone modal component (not inline in KanbanColumnHeader) — follows existing pattern (ColumnCustomizeModal, ImportContactsModal, SegmentSaveModal)
- Modal closes automatically after successful add — no need for success feedback
- Enter key triggers add — matches UX pattern from rename (Phase 2)

### Yang Berhasil
- "Tambah Kolom" menu item opens AddColumnModal
- New column appears in KanbanBoard after modal submit
- New column available in ContactFilters status dropdown
- typecheck zero errors, build success (775 modules, 753ms)

---

## 2026-06-17 — Pipeline Column Management Phase 1: Dynamic Column State

### Yang Dikerjakan
- Added `PipelineColumn` type and `DEFAULT_PIPELINE_COLUMNS` to `mock/crm.ts` — defines `{ id, name, color }` structure
- Extended `stores/crm.ts` with `columns: PipelineColumn[]` state (initialized from defaults) + `renameColumn(columnId, newName)`, `addColumn(name, color)`, `removeColumn(columnId) → boolean` actions with validation (min 1 column, no contacts in column)
- Rewired `KanbanBoard.tsx` — reads `columns` from store instead of hardcoded `PIPELINE_COLUMNS`
- Rewired `ContactFilters.tsx` — status dropdown reads from store `columns`
- Rewired `ContactTable.tsx` — `StatusBadge` receives `columns` as prop, reads from store
- Rewired `ContactEditModal.tsx` — status select reads from store `columns`
- Rewired `ContactInfoCard.tsx` — status badge lookup from store `columns`
- Rewired `ContactProfileHeader.tsx` — status badge lookup from store `columns`
- Hardcoded `PIPELINE_COLUMNS` from `lib/constants.ts` no longer used by any CRM consumer

### Keputusan yang Diambil
- `PipelineColumn` type lives in `mock/crm.ts` (not `constants.ts`) because it's tightly coupled to CRM domain
- `DEFAULT_PIPELINE_COLUMNS` exported from `mock/crm.ts` as source of truth for initial store state
- `removeColumn` returns `boolean` — `false` if validation fails (min 1 column or column not empty), `true` if success
- Store action `renameColumn` only updates name (not id/color) — simple and safe
- Column state is dynamic (Zustand store) — enables Phase 2-4 (rename/add/delete) to just wire UI

### Yang Berhasil
- KanbanBoard renders 6 columns from store (same visual result as before)
- ContactFilters status dropdown shows dynamic column names
- ContactTable, ContactEditModal, ContactInfoCard, ContactProfileHeader all read from store
- Typecheck zero errors, Vite build success (759ms)

### Yang Perlu Dikerjakan Selanjutnya
- Phase 2: Ubah Nama Kolom (inline edit in KanbanColumnHeader)
- Phase 3: Tambah Kolom (AddColumnModal)
- Phase 4: Hapus Kolom (confirmation + validation)

---

## 2026-06-17 — Modul 4 Phase 6: Segment Management + CSV Import

### Yang Dikerjakan
- Created `components/contacts/SegmentManager.tsx` — Saved filter presets dropdown with click-outside-to-close (useRef), active segment highlight, "Tampilkan Semua" to clear, delete segment on hover-reveal X button, dropdown lists saved segments with name and select/delete
- Created `components/contacts/SegmentSaveModal.tsx` — Modal to name + save current filters as a segment, shows active filter summary (search, status, source, agent), disabled save when name empty, Enter key submits
- Created `components/contacts/ImportContactsModal.tsx` — CSV upload with drag-drop zone, client-side CSV parsing (auto-detects header row by looking for 'nama'/'name'/'phone'/'email'), validation (name required, phone or email required), preview table (50 rows max), valid/invalid counts, "Pilih Ulang" to re-upload, import button shows count
- Rewrote `pages/ContactsPage.tsx` — Integrated Phase 6 components: segment state (savedSegments + activeSegmentId), import modal state, save modal state, handleSaveSegment (creates SavedSegment from current filters), handleSelectSegment (loads segment filters into state), handleDeleteSegment, handleExport (exports filtered contacts as CSV download), handleImport (adds imported contacts to front of list with defaults), filter change handlers clear activeSegmentId, SegmentManager + "Simpan sebagai Segmen" button above filters, SegmentSaveModal + ImportContactsModal at end of JSX

### Keputusan yang Diambil
- SegmentManager uses useRef click-outside pattern (not Radix Dropdown) for simplicity — consistent with dropdown patterns elsewhere
- SegmentSaveModal shows filter summary as a read-only preview so user knows what they're saving
- ImportContactsModal handles CSV parsing client-side — no backend needed for mock data phase
- Export generates CSV from current filtered contacts (not all contacts) — respects active filters
- handleImport prepends imported contacts to front of list with default values (new_lead status, whatsapp source, no agent, no labels)
- Filter change handlers clear activeSegmentId so manually changing a filter deselects the active segment
- SegmentManager appears to the left of "Simpan Segmen" button for logical grouping

### Yang Berhasil
- SegmentManager dropdown shows saved segments with active highlight
- Selecting a segment loads its filters into the filter state
- "Tampilkan Semua" clears all filters and deselects segment
- Delete segment removes from list, clears if active
- "Simpan sebagai Segmen" button appears when filters active + no segment selected
- Saving a segment adds it to the list and marks it active
- Import CSV button opens modal, drag-drop or click to upload
- CSV parsed with auto-detect header, validated, preview shown
- Import adds valid rows to contacts list
- Export downloads filtered contacts as CSV file
- All previous phase functionality preserved (filters, table, pagination, profile navigation)
- Typecheck zero errors, Vite build success

### Yang Perlu Dikerjakan Selanjutnya
- Phase 7: Integration + Polish + Verification

---

## 2026-06-17 — Modul 4 Phase 5: Contact Profile Page

### Yang Dikerjakan
- Created `components/contacts/ContactProfileHeader.tsx` — Back button, avatar initials, name, pipeline status badge, created date, Edit button, navigate to /contacts
- Created `components/contacts/ContactInfoCard.tsx` — 2-column grid info card: phone, email, channel, channel identifiers, pipeline status, program interest, value, agent (with avatar), labels (LabelBadge), notes section
- Created `components/contacts/ContactActivityTimeline.tsx` — Sorted activity log (newest first) with type-specific emoji icons, relative timestamps, agent attribution, vertical timeline line
- Created `components/contacts/ContactEditModal.tsx` — Full edit modal: name, phone, email, pipeline status (select), program interest, agent (select from MOCK_AGENTS), notes (textarea), save/cancel. Uses local useState initialized from contact props.
- Created `pages/ContactProfilePage.tsx` — Profile page: finds contact by useParams id, renders ContactProfileHeader + 2-column grid (ContactInfoCard left, ContactActivityTimeline right), ContactEditModal, 404 fallback with back-to-contacts button
- Modified `pages/ContactsPage.tsx` — Added useNavigate, wired onSelectContact to navigate(`/contacts/${id}`)
- Modified `router.tsx` — Added /contacts/:id route with lazy-loaded ContactProfilePage

### Keputusan yang Diambil
- ContactProfilePage manages edit state locally (useState for modal open/close)
- ContactEditModal initializes form state from props (not controlled by parent) — each open resets to current values
- Profile layout uses 2-column grid: info card (1fr) + timeline (340px fixed)
- Activity timeline sorts by createdAt descending (newest first)
- 404 handling built into profile page (returns centered message with back button)
- No Zustand store needed — page is self-contained with mock data lookup

### Yang Berhasil
- `/contacts/crm1` shows full profile with back button, avatar, name, status badge
- Info card displays all contact fields in 2-column grid
- Labels render as colored badges
- Activity timeline shows all events with icons, timestamps, agent names
- Edit button opens modal, can change all fields, save updates local state
- Back button navigates to /contacts list
- Clicking a row in ContactsPage table navigates to /contacts/:id
- 404 handling for invalid IDs
- Typecheck zero errors, Vite build success

### Yang Perlu Dikerjakan Selanjutnya
- Phase 6: Segment Management + CSV Import

---

## 2026-06-17 — Modul 4 Phase 4: Contacts List Page

### Yang Dikerjakan
- Created `components/contacts/ContactTable.tsx` — 11-column table (checkbox, avatar+name, phone, email, channel icon, status badge, labels, agent, value, date, actions dropdown), reusable StatusBadge with PIPELINE_COLUMNS color
- Created `components/contacts/ContactFilters.tsx` — Search bar + 3 filter dropdowns (Status, Source, Agent) + result count, reads from MOCK_AGENTS and SOURCE_OPTIONS
- Created `components/contacts/BulkActionBar.tsx` — Appears when contacts selected: count badge + bulk action buttons (Ubah Agent, Ubah Status, Tambah Label, Hapus) + clear selection
- Rewrote `pages/ContactsPage.tsx` — Full contacts list page: ContactFilters + ContactTable + BulkActionBar + pagination (PAGE_SIZE=10) + Import CSV / Export buttons, local filter state with useMemo
- Removed duplicate channelFilter prop (was redundant with sourceFilter), fixed LabelBadge props to match existing component signature (name+color instead of label object)

### Keputusan yang Diambil
- ContactFilters uses native `<select>` elements (same pattern as PipelineFilters)
- ContactTable uses Radix Checkbox for row selection + Radix Dropdown for row actions
- Pagination is client-side (PAGE_SIZE=10) since all data is mock; server-side pagination comes with backend
- ContactsPage manages all filter/selection state locally (not via Zustand) — each filter is independent state
- Bulk action buttons are placeholder (no-op handlers) — actual bulk operations come with backend

### Yang Berhasil
- `/contacts` shows full table with 18 CRM contacts
- Search filters by name, phone, email
- Status, Source, Agent dropdowns filter correctly
- Checkbox select all/one works, BulkActionBar appears with correct count
- Pagination renders correctly (10 per page, page 2 shows remaining 8)
- Row click navigates to detail (placeholder)
- Import CSV and Export buttons present in header
- Typecheck zero errors, Vite build success

### Yang Perlu Dikerjakan Selanjutnya
- Phase 5: Contact Profile Page (/contacts/:id)

---

## 2026-06-17 — Modul 4 Phase 3: Pipeline Filters + Column Customization

### Yang Dikerjakan
- Created `components/contacts/PipelineFilters.tsx` — Filter bar with 3 select dropdowns (Agent, Program, Source) + active filter indicator + reset button
- Created `components/contacts/ColumnCustomizeModal.tsx` — Modal: list all columns with rename input, add new column (name + color picker with 8 presets), delete column, inline edit via pencil icon
- Updated `pages/PipelinePage.tsx` — Integrated PipelineFilters + "Kustomisasi Kolom" button in header + ColumnCustomizeModal
- All Phase 1 + Phase 2 components remain untouched

### Keputusan yang Diambil
- PipelineFilters reads/writes filters via useCrmStore (agentFilter, programFilter, sourceFilter)
- ColumnCustomizeModal uses local state for column list (not persisted — mock UI, persistence comes with backend)
- Modal uses 8 preset colors for simplicity
- PipelineFilters sits between page header and KanbanBoard

### Yang Berhasil
- `/pipeline` shows filter bar with Agent/Program/Source selects
- Filter applies to kanban board — only matching contacts shown per column
- Reset button clears all filters
- "Kustomisasi Kolom" button opens modal with column list
- Can rename, add (with color), delete columns in modal
- Typecheck zero errors, Vite build success (PipelinePage chunk 29.07KB)

### Yang Perlu Dikerjakan Selanjutnya
- Phase 4: Contacts List Page (table, search, bulk actions)

---

## 2026-06-17 — Modul 4 Phase 2: Kanban Column Header + Drag Feedback

### Yang Dikerjakan
- Created `components/contacts/KanbanColumnHeader.tsx` — Column header with color dot + name + count badge + total value + 3-dot menu (Ubah Nama, Tambah Kolom, Hapus Kolom)
- Updated `components/contacts/KanbanBoard.tsx` — Ref-based drag highlight (ring-2 + bg-brand-blue-50, zero re-render), id attributes on columns, empty column dashed border

### Keputusan yang Diambil
- KanbanColumnHeader uses click-outside-to-close pattern via useRef + mousedown listener
- Drag highlight uses DOM manipulation via refs (not state) to avoid unnecessary re-renders during drag
- Empty columns show dashed border for visual distinction

### Yang Berhasil
- Column headers show color dot, name, count, total value
- 3-dot menu opens with 3 column actions
- Drag-drop highlights target column with ring + background
- No re-render flicker during drag operations
- Typecheck zero errors, Vite build success (PipelinePage chunk 18.93KB)

---

## 2026-06-17 — Modul 4 Phase 1: CRM Pipeline Kanban Foundation

### Yang Dikerjakan
- Created `mock/crm.ts` — 18 mock leads (CrmContact type extending Contact with programInterest, assignedAgentId, programValue), 3 program options, 3 source options, helper functions (getAgentById, getContactsByStatus, getContactCountByStatus, getTotalValueByStatus, formatCurrency)
- Created `stores/crm.ts` — Zustand store: contacts, selectedContactId, agentFilter, programFilter, sourceFilter, moveContact (pipeline status change), getFilteredContacts
- Created `components/contacts/KanbanCard.tsx` — Lead card with avatar initials, name, source channel icon, program + value, label pills (max 2 + overflow), assigned agent avatar, time ago, draggable
- Created `components/contacts/KanbanBoard.tsx` — 6-column horizontal scrollable kanban board, each column with color dot + name + count badge + total value, drag-drop between columns with visual feedback (bg-blue highlight on dragover), empty state per column
- Rewrote `pages/PipelinePage.tsx` — replaced placeholder with KanbanBoard integration, page header + description

### Keputusan yang Diambil
- CrmContact extends existing Contact type from inbox.ts (not separate type) for maximum reuse
- Store getFilteredContacts() as getter function (not derived state) — call pattern: `const contacts = getFilteredContacts()`
- KanbanCard uses HTML5 native drag-and-drop (no library) for MVP simplicity

### Yang Berhasil
- `/pipeline` renders 6 kanban columns with 18 lead cards distributed across statuses
- Drag-drop between columns works with visual feedback
- Each column shows lead count and total program value
- Cards show name, channel icon, program, agent, labels, time
- Typecheck zero errors, Vite build success (PipelinePage chunk 15.78KB)

### Yang Perlu Dikerjakan Selanjutnya
- Phase 2: Kanban drag & drop enhancement + KanbanColumnHeader extraction
- Phase 3: Pipeline filters + column customization

---

## 2026-06-16 — Modul 3 Phase 6: Campaign Detail + Broadcast Report

### Yang Dikerjakan
- Created CampaignProgressBar.tsx — stacked horizontal bar showing delivered/read/replied/failed proportions with color-coded legend and percentage labels
- Created CampaignReportStats.tsx — 4 stat cards (Terkirim, Dibaca, Dibalas, Gagal) with icons, large numbers, percentages, and distinct background colors
- Created CampaignTimeline.tsx — vertical event timeline with auto-detected icons per event type, timestamps formatted in Indonesian locale, batch count badges
- Created CampaignRecipientList.tsx — searchable/filterable recipient table with 5 status filter tabs, name/phone search, 12 mock recipients, 10-per-page pagination, failed reason display
- Created CampaignDetailPage.tsx — full detail page composing all 4 components above, plus campaign info cards (channel, template, goal, segment summary, dates), back navigation, status badge
- Updated router.tsx — added CampaignDetailPage lazy import, wired /campaigns/:id route (between /campaigns/new and /campaigns for correct matching)
- Typecheck verification — zero errors after fixing unused useParams destructuring
- Build verification — Vite build success, CampaignDetailPage chunk 15KB lazy-loaded, all prior phase chunks intact

### Keputusan yang Diambil
- CampaignRecipientList manages its own filter/search/pagination state internally (self-contained pattern)
- CampaignDetailPage uses `params.id` from useParams instead of destructuring to avoid unused variable error
- Timeline event icons use helper function getEventIcon with lookup table + fallback
- Report stats use distinct bgColor per stat type for visual differentiation

### Yang Berhasil
- /campaigns/:id route fully functional with 4 report components
- CampaignProgressBar renders stacked bar with correct proportions
- CampaignReportStats shows 4 stat cards with large numbers and percentages
- CampaignTimeline displays 5 events with icons and batch counts
- CampaignRecipientList supports filtering, search, and pagination across 12 recipients
- CampaignDetailPage composes all components with campaign info header
- All 5 Phase 6 components independently compilable with self-contained mock data
- All prior phase files (Phase 1-5) remain untouched and functional
- **MODUL 3 Broadcast & Campaign UI fully complete (Phase 1-6)**

### Yang Perlu Dikerjakan Selanjutnya
- Next module or feature per EPICS.md priority

---

## 2026-06-16 — Modul 3 Phase 3: Template Library Page

### Yang Dikerjakan
- Created TemplateCategoryFilter.tsx — self-contained category filter pills with mock data (7 categories with counts)
- Created TemplateCard.tsx — self-contained template card component with toggle, edit/preview/delete actions, content preview, variable chips
- Created TemplateCreateModal.tsx — full create/edit template form modal with Nama, Kategori select, Tipe radio pills, Content textarea, Variable insertion buttons, CTA config (for interactive type), file upload area, preview link, and save actions (Draft / Simpan & Aktifkan)
- Created TemplatePreviewModal.tsx — phone-frame WhatsApp-style template preview mockup with variable replacement, CTA button rendering, and responsive phone frame
- Created TemplatesPage.tsx — main page composing TemplateCategoryFilter + TemplateCard in 2-column grid, search, category filter, create button, 6 mock templates with all categories represented
- Updated router.tsx — added TemplatesPage lazy import, wired /templates route to TemplatesPage (replaced ContactsPage placeholder)
- Typecheck verification — zero errors across all new files
- Build verification — Vite build success, TemplatesPage chunk 19KB, all prior phase files intact

### Keputusan yang Diambil
- TemplatePreviewModal uses explicit TemplatePreviewData interface (not typeof MOCK_TEMPLATE) to allow optional buttonText from callers
- TemplateCreateModal uses internal state for form fields (not controlled by parent) — saves via callback
- Category filter pills use the same pill-button pattern as Phase 2's CampaignStatusFilter for visual consistency

### Yang Berhasil
- /templates route fully functional with 6 mock templates across all categories
- TemplateCreateModal includes live variable extraction from content (regex-based {xxx} detection)
- TemplatePreviewModal renders WhatsApp phone-frame with variable substitution using placeholder values
- All Phase 3 components independently compilable with self-contained mock data
- All prior phase files (Phase 1-2) remain untouched and functional

### Yang Perlu Dikerjakan Selanjutnya
- Phase 4: Segment Builder Component (SegmentBuilder, SegmentFilterChips, SegmentPreview)

---

## 2026-06-16 — Modul 3 Phase 4: Segment Builder Component

### Yang Dikerjakan
- Created SegmentFilterChips.tsx — self-contained removable pill chips for active segment filters, with XIcon remove buttons and "Hapus semua" clear-all action
- Created SegmentPreview.tsx — self-contained segment preview card with total count display, per-channel breakdown bars, per-pipeline stats, and 5 sample contacts with avatars/status badges
- Created SegmentBuilder.tsx — full segment builder component with dynamic filter row add/remove, dropdown selects for 6 filter types (Program, Sumber Lead, Status Pipeline, Label, Rentang Tanggal, Belum Dibalas), date range picker for date filters, integration with SegmentFilterChips and SegmentPreview
- Typecheck verification — zero errors after fixing PIPELINE_COLORS unquoted object keys
- Build verification — Vite build success, all prior phase files untouched

### Keputusan yang Diambil
- PIPELINE_COLORS object keys with spaces require quotes: `'New Lead'`, `'Contacted'`, `'Proposal Sent'`
- Removed unused `getLabelForType` function (labels are computed inline in handleAddFilter)
- SegmentBuilder uses local state for filter management (not Zustand store) per self-contained pattern

### Yang Berhasil
- SegmentBuilder supports 6 filter types with appropriate input controls
- SegmentFilterChips renders active filters as removable blue pills
- SegmentPreview shows mock breakdown data with progress bars and sample contacts
- All 3 Phase 4 components independently compilable with self-contained mock data
- All prior phase files (Phase 1-3) remain untouched and functional

### Yang Perlu Dikerjakan Selanjutnya
- Phase 5: Campaign Creation Wizard (CampaignWizard, 5 wizard step components)

---

## 2026-06-16 — Modul 3 Phase 5: Campaign Creation Wizard

### Yang Dikerjakan
- Created WizardStepBasic.tsx — step 1 form with Nama, Deskripsi, Tujuan (select), Channel (WhatsApp pre-selected/disabled)
- Created WizardStepSegment.tsx — step 2 composing SegmentBuilder from Phase 4 + estimated contact count display
- Created WizardStepTemplate.tsx — step 3 template selection with 6 mock template cards, click-to-select, "Buat Template Baru" link to TemplateCreateModal, EyeIcon preview per template
- Created WizardStepSchedule.tsx — step 4 schedule mode toggle (Kirim Sekarang / Jadwalkan), date/time pickers, WIB timezone badge, confirmation message
- Created WizardStepReview.tsx — review summary showing all selections (name, description, goal, channel, template, estimated count, schedule) with zero-count warning
- Created CampaignWizard.tsx — orchestrator with 4-step horizontal indicator (checked/completed/active/inactive), state management across steps, navigation (Prev/Next/Simpan Draft/Finish), StepKey type removed (unused)
- Created CreateCampaignPage.tsx — page wrapper with header, CampaignWizard composition, navigate-to-campaigns on finish/cancel
- Updated router.tsx — added CreateCampaignPage lazy import, wired /campaigns/new route (before /campaigns for correct matching)
- Typecheck verification — zero errors after fixing WizardBasicData export and removing unused StepKey
- Build verification — Vite build success, CreateCampaignPage chunk 27KB lazy-loaded, all prior phase chunks intact

### Keputusan yang Diambil
- WizardStepBasic uses exported WizardBasicData interface so CampaignWizard can import and manage state
- CampaignWizard manages all wizard state locally (not Zustand) — passes data down to steps via props
- Step 4 combines Schedule + Review in same step panel (plan said "Jadwal & Review" as one step)
- TemplateStep has "Buat Template Baru" button that opens TemplateCreateModal inline (no navigation away)
- CampaignWizard shows "Simpan Draft" on every step (bottom-right), "Selanjutnya" for non-final steps, "Kirim Sekarang" / "Jadwalkan" for final step

### Yang Berhasil
- Full 4-step wizard with step indicator, progress tracking, and back/forward navigation
- Template selection with card grid, live preview via TemplatePreviewModal, and "create new" flow
- Schedule mode toggle with date/time pickers and WIB timezone confirmation
- Review step shows complete campaign summary with warning if estimated count is zero
- /campaigns/new route functional, navigable from CampaignsPage "+ Buat Campaign" button
- All 7 Phase 5 files independently compilable with proper type exports
- All prior phase files (Phase 1-4) remain untouched and functional

### Yang Perlu Dikerjakan Selanjutnya
- Phase 6: Campaign Detail Page + Broadcast Report (CampaignDetailPage, CampaignProgressBar, CampaignReportStats, CampaignTimeline, CampaignRecipientList)

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
