# DESIGN SYSTEM — DBB-PSC

> **Status:** Wajib diikuti untuk semua UI components.

## Overview

Design system ini menggunakan identity yang sophisticated dan clean — stark white canvas dengan deep-black typographic emphasis. Voice-nya confident, technical, hampir editorial. Setiap channel mendapat warna gradient sendiri sebagai identity card: WhatsApp dalam coral, Instagram dalam magenta, Facebook dalam blue, AI Engine dalam cyan. Gradient cards ini layaknya album covers yang menempel di homepage — masing-masing mendeklarasikan personality channel sendiri.

DM Sans anchors every surface dari oversized 80px hero displays hingga 12px micro labels. Geometric, slightly humanist character cocok untuk both dense documentation surfaces (dimana 14px body type carries 1.5 line-height untuk long-form prose) dan high-impact marketing displays (dimana -2px letter-spacing tightens 80px headlines). Buttons universally pill-shaped (`rounded-full`) dengan sharp two-tier system: black-pill primary (dominant CTA) dan outline-pill secondary. Cards split into two distinct families: vibrant gradient channel showcases (32px corner softening) dan quiet white documentation cards (16px corner softening).

**Key Characteristics:**
- Stark monochrome palette — black ({colors.primary}) dan white ({colors.canvas}) — dibuka oleh saturated brand-color gradient cards
- Distinct channel-color encoding: setiap channel punya vibrant brand color (coral WA, magenta IG, blue FB, cyan AI)
- DM Sans across the entire system; Inter as fallback
- Pill-shaped buttons ({rounded.full}) dan pill-shaped tabs everywhere; rectangular forms only inside data tables dan dense docs
- Hero typography uses tight 1.10 line-height dengan -2px letter-spacing untuk impact
- Dashboard surfaces use clean layout: sidebar nav, main content area, detail panel
- Black promo banners ({colors.primary}) above the nav untuk announcements

## Colors

### Brand & Accent
- **Brand Coral** ({colors.brand-coral}): Signature high-impact accent. Used pada WhatsApp channel card, promo CTA strips, dan "NEW" badges. Carries most attention-grabbing energy.
- **Brand Magenta** ({colors.brand-magenta}): Instagram channel identity — IG channel indicators, accent for visual elements.
- **Brand Blue** ({colors.brand-blue}): Facebook channel identity — FB channel indicators, primary blue accent.
- **Brand Blue Deep** ({colors.brand-blue-deep}): Form-control activation, link emphasis.
- **Brand Blue 700** ({colors.brand-blue-700}): Tag and reference text color.
- **Brand Cyan** ({colors.brand-cyan}): AI Engine identity — AI status indicators, auto-reply accents.
- **Brand Blue 200** ({colors.brand-blue-200}): Code badges, info-tag backgrounds.
- **Brand Purple** ({colors.brand-purple}): Premium features, gradient mate for magenta elements.

### Surface
- **Canvas White** ({colors.canvas}): Primary page background and card surface.
- **Surface** ({colors.surface}): Subtle section backgrounds, search-pill rest, sidebar-nav active state.
- **Surface Soft** ({colors.surface-soft}): Quieter section divisions.
- **Hairline** ({colors.hairline}): 1px input border and primary divider.
- **Hairline Soft** ({colors.hairline-soft}): Quieter table-row divider and secondary section break.

### Text
- **Ink** ({colors.ink}): Primary headline and CTA text — near-black anchor.
- **Ink Strong** ({colors.ink-strong}): Pure black for promo banners and hero displays — maximum contrast.
- **Charcoal** ({colors.charcoal}): Body text on light surfaces.
- **Slate** ({colors.slate}): Secondary text, metadata.
- **Steel** ({colors.steel}): Tertiary text, table headers, sidebar inactive items.
- **Stone** ({colors.stone}): Muted captions and tab inactive labels.
- **Muted** ({colors.muted}): Footer link text and de-emphasized labels.
- **On Dark** ({colors.on-dark}): Text on dark/colored backgrounds (white).

### Semantic
- **Success Background** ({colors.success-bg}): Pale-green wash untuk success badges dan confirmations.
- **Success Text** ({colors.success-text}): Deep-green ink untuk success badge labels.
- **Error** (#d45656): Red untuk input border error states (not extracted as a top-level system token).
- **Warning** ({colors.warning-bg}): Amber/yellow untuk warning states.
- **Info** ({colors.info-bg}): Blue untuk informational states.

## Typography

### Font Family
**DM Sans** (primary): Geometric variable sans-serif. Used across every surface, every role. Fallbacks: Inter, Helvetica Neue, Helvetica, Arial.

DM Sans was chosen for its dual fluency: it scales cleanly from 80px hero displays (where -2px letter-spacing creates magazine-grade tightness) down to 12px micro labels (where the slightly humanist counters maintain legibility). The face has no italic variant — emphasis comes from weight (500/600/700) instead.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.hero-display}` | 80px | 600 | 1.10 | -2px | Hero headlines |
| `{typography.display-lg}` | 56px | 600 | 1.10 | -1.5px | Section openers, major page heroes |
| `{typography.heading-lg}` | 40px | 600 | 1.20 | -1px | Sub-page headlines |
| `{typography.heading-md}` | 32px | 600 | 1.25 | -0.5px | Subsection headers |
| `{typography.heading-sm}` | 24px | 600 | 1.30 | 0 | Card titles, feature headers |
| `{typography.card-title}` | 20px | 600 | 1.40 | 0 | Channel-card titles, feature-tile headers |
| `{typography.subtitle}` | 18px | 500 | 1.50 | 0 | Section subtitles, lead body |
| `{typography.body-md}` | 16px | 400 | 1.50 | 0 | Primary body text |
| `{typography.body-md-bold}` | 16px | 700 | 1.50 | 0 | Body emphasis |
| `{typography.body-sm}` | 14px | 400 | 1.50 | 0 | Secondary body, table cells, navigation |
| `{typography.body-sm-medium}` | 14px | 500 | 1.50 | 0 | Active sidebar nav, button labels |
| `{typography.caption}` | 13px | 400 | 1.70 | 0 | Documentation captions, fine print |
| `{typography.caption-bold}` | 13px | 600 | 1.50 | 0 | Badge labels, table-header text |
| `{typography.micro}` | 12px | 400 | 1.50 | 0 | Footer microcopy, chip labels |
| `{typography.button-md}` | 14px | 600 | 1.40 | 0 | Pill button labels |

### Principles
- **Tight hero leading** (1.10) dan aggressive negative letter-spacing pada display sizes menciptakan magazine-quality typographic display.
- **Generous body leading** (1.50) menjaga long-form content comfortable; captions push ke 1.70 untuk scientific-paper-grade clarity.
- **Weight discipline:** 400 (body), 500 (medium emphasis), 600 (headings/buttons), 700 (strong inline emphasis). Heavier weights tidak digunakan.
- **Single typeface** strategy — never mix DM Sans dengan another sans-serif. Code samples use system monospace fallback, tapi tidak ada second typeface yang masuk design canvas.

## Icons

### Primary: itsHover
- **Package:** itsHover (via shadcn registry: `npx shadcn@latest add https://itshover.com/r/[icon-name].json`)
- **Dependency:** `motion` (motion/react) — animation engine
- **Count:** 186+ animated SVG icons
- **License:** Apache 2.0
- **Usage:** Animated icons untuk primary actions, navigation, status indicators
- **Style:** Motion-first — setiap icon dirancang dengan built-in hover animations

### Fallback: Lordicon
- **Package:** `@lordicon/react`
- **Count:** 43,900+ animated icons (Wired, System, Doodle families)
- **License:** Freemium (free icons tersedia)
- **Usage:** Fallback ketika icon tidak tersedia di itsHover
- **Trigger:** in, hover, morph, loop

### Absolute Fallback: Custom SVG
- **Hanya untuk:** Brand icons yang tidak ada di manapun (WhatsApp, Instagram, Facebook logos)
- **Format:** SVG inline dalam React component
- **Requirement:** Harus match brand guidelines masing-masing platform

### Rules (NON-NEGOTIABLE)
1. **WAJIB** cek itsHover duluan — jika ada, pakai itsHover
2. Jika tidak ada di itsHover → cek Lordicon
3. Jika tidak ada di Lordicon → custom SVG (hanya untuk brand logos)
4. **TIDAK BOLEH** pakai Lucide, Heroicons, Font Awesome, atau icon library lain
5. Icon size mengikuti spacing system: 16px (inline), 20px (button), 24px (navigation), 32px (feature)
6. Icon color mengikuti text color hierarchy — tidak boleh hardcoded warna sendiri

## Layout

### Spacing System
- **Base unit**: 4px (8px primary increment).
- **Tokens**: `{spacing.xxs}` (4px) · `{spacing.xs}` (8px) · `{spacing.sm}` (12px) · `{spacing.md}` (16px) · `{spacing.lg}` (20px) · `{spacing.xl}` (24px) · `{spacing.xxl}` (32px) · `{spacing.xxxl}` (40px) · `{spacing.section-sm}` (48px) · `{spacing.section}` (64px) · `{spacing.section-lg}` (80px) · `{spacing.hero}` (96px).
- **Section rhythm**: Marketing pages separate at `{spacing.hero}` (96px) above-fold, then `{spacing.section-lg}` (80px) below; dashboard tightens to `{spacing.section}` (64px); table rows compress to `{spacing.md}` (16px).
- **Card internal padding**: Vibrant channel cards use `{spacing.xxl}` (32px); documentation cards use `{spacing.lg}–{spacing.xl}` (20–24px); promo strips expand to `{spacing.section}` (64px).

### Grid & Container
- Marketing pages use a 1280px max-width dengan 32px gutters.
- Homepage channel matrix renders as a 4-column row of 32px-rounded gradient cards, each ~280–320px wide.
- Feature tiles below use a 4-column grid with 16px-rounded white cards.
- Dashboard uses full-width dengan collapsible sidebar.
- Inbox layout: conversation list (320px fixed) + main chat area (flex) + detail sidebar (320px fixed).
- Pipeline Kanban: 6-column horizontal scroll dengan drag-and-drop.
- Mobile: single-column stack, sidebar ke drawer.

### Whitespace Philosophy
Marketing pages give gradient cards generous breathing room — `{spacing.hero}` (96px) above-the-fold creates visual oxygen untuk 80px hero display. Inside dense views (inbox, kanban), whitespace tightens: section gaps drop ke `{spacing.xxl}` (32px), table rows pack down ke `{spacing.md}` (16px).

## Elevation & Depth

The system runs predominantly flat. Elevation reserved untuk sticky panels, dropdowns, dan floating elements.

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | No shadow; `{colors.hairline}` border | Default cards, table rows, form inputs |
| 1 (subtle) | `rgba(0, 0, 0, 0.04) 0px 1px 2px 0px` | Card-recommendation, hover-elevated tiles |
| 2 (card) | `rgba(0, 0, 0, 0.08) 0px 4px 6px 0px` | Standard feature cards, dropdowns |
| 3 (atmospheric) | `rgba(0, 0, 0, 0.08) 0px 0px 22px 0px` | Diffuse glow on featured channel cards |
| 4 (modal) | `rgba(36, 36, 36, 0.08) 0px 12px 16px -4px` | Modals, confirmation dialogs, sticky panels |

### Decorative Depth
- Vibrant gradient channel cards carry their own atmospheric depth via internal radial gradients — no shadow needed; the color does the work.
- Brand-tinted shadows (`rgba(44, 30, 116, 0.16) 0px 0px 15px`) appear under purple-themed cards untuk subtle ambient lift.
- Subtle textures occasionally appear as decoration; these are not formalized as system tokens.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 4px | Code chips, micro-controls |
| `{rounded.sm}` | 6px | Compact controls, table cells |
| `{rounded.md}` | 8px | Inputs, secondary buttons, search pill |
| `{rounded.lg}` | 12px | Documentation cards, recommendation tiles |
| `{rounded.xl}` | 16px | Standard feature cards, white channel tiles |
| `{rounded.xxl}` | 20px | Larger feature panels |
| `{rounded.xxxl}` | 24px | Feature tile variants |
| `{rounded.hero}` | 32px | Vibrant gradient channel cards, promo CTA strip |
| `{rounded.full}` | 9999px | All buttons, all pill tabs, badges |

### Photography Geometry
- Gradient channel cards use 32px corner softening — distinct dari 16px pada white cards. The doubled radius adalah visual signature of "this is a featured channel moment."
- Product imagery treated as photographic content tanpa rounded internal frames.
- Avatar circles are `{rounded.full}` — perfect circles.

## Components

> Per the no-hover policy, hover states are NOT documented. Default and pressed/active states only.

### Buttons

**`button-primary`** — Black pill primary CTA, the dominant action across all surfaces.
- Background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.button-md}`, padding `11px 24px`, rounded `{rounded.full}`.
- Pressed state `button-primary-pressed` lifts to `{colors.charcoal}`.
- Disabled state `button-primary-disabled` uses `{colors.hairline}` background dan `{colors.muted}` text.

**`button-secondary`** — Outlined pill secondary action, paired dengan primary dalam dual-CTA patterns.
- Background transparent, text `{colors.ink}`, border `1px solid {colors.ink}`, typography `{typography.button-md}`, padding `11px 24px`, rounded `{rounded.full}`.

**`button-tertiary`** — White-fill quieter pill, untuk tertiary nav dan informational CTAs.
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline}`, typography `{typography.button-md}`, padding `11px 24px`, rounded `{rounded.full}`.

**`button-link`** — Inline text link styled sebagai subtle button.
- Background transparent, text `{colors.ink}`, typography `{typography.body-sm-medium}`, padding `8px 0`. Underline appears on activation.

**`button-icon-circular`** — 36×36px circular utility button.
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline}`, rounded `{rounded.full}`.

### Channel Cards (Vibrant Gradient)

**`card-channel-coral`** — WhatsApp channel identity card.
- Background `{colors.brand-coral}`, text `{colors.on-dark}`, rounded `{rounded.hero}` (32px), padding `{spacing.xxl}`.
- Hosts channel icon dengan tagline dalam massive `{typography.display-lg}` dengan white tagline.

**`card-channel-magenta`** — Instagram channel identity card.
- Background `{colors.brand-magenta}`, text `{colors.on-dark}`, rounded `{rounded.hero}`, padding `{spacing.xxl}`.

**`card-channel-blue`** — Facebook channel identity card.
- Background `{colors.brand-blue}`, text `{colors.on-dark}`, rounded `{rounded.hero}`, padding `{spacing.xxl}`.

**`card-channel-purple`** — AI Engine channel identity card.
- Background `{colors.brand-purple}`, text `{colors.on-dark}`, rounded `{rounded.hero}`, padding `{spacing.xxl}`.

**`card-channel-dark`** — Dark overlay card (untuk featured elements).
- Background `{colors.primary}` (black dengan overlaid gradient), text `{colors.on-dark}`, rounded `{rounded.hero}`, padding `{spacing.xxl}`.

### Cards & Containers

**`card-base`** — Standard documentation/feature card.
- Background `{colors.canvas}`, rounded `{rounded.xl}`, padding `{spacing.xl}`, border `1px solid {colors.hairline}`.

**`card-feature`** — Quieter feature panel pada light gray.
- Background `{colors.surface}`, rounded `{rounded.xl}`, padding `{spacing.xxl}`.

**`card-recommendation`** — Recommendation tile dalam documentation footer.
- Background `{colors.canvas}`, rounded `{rounded.lg}`, padding `{spacing.lg}`, border `1px solid {colors.hairline}`.

**`promo-cta-card`** — Bright promo strip dengan embedded CTA pill.
- Background `{colors.brand-coral}`, text `{colors.on-dark}`, rounded `{rounded.hero}`, padding `{spacing.section}`. Embedded button uses `button-tertiary` (white pill on coral).

**`feature-tile`** — White card dalam feature grid.
- Background `{colors.canvas}`, rounded `{rounded.xxxl}`, padding `{spacing.xl}`, border `1px solid {colors.hairline}`. Carries icon/illustration top, title `{typography.card-title}`, description `{typography.body-sm}`.

### Inputs & Forms

**`text-input`** — Standard text field.
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline}`, rounded `{rounded.md}`, padding `{spacing.sm} {spacing.md}`, height 40px.

**`text-input-focused`** — Activated state.
- Border switches to `2px solid {colors.brand-blue-deep}`.

**`text-input-error`** — Validation error state.
- Border switches to `1px solid #d45656`; error label below dalam matching red `{typography.body-sm}`.

**`search-pill`** — Search field.
- Background `{colors.surface}`, text `{colors.steel}`, typography `{typography.body-sm}`, rounded `{rounded.md}`, height 36px, border `1px solid {colors.hairline}`.

### Tabs

**`segmented-tab`** + **`segmented-tab-active`** — Underline-style tab navigation.
- Inactive: text `{colors.steel}`, transparent background, padding `{spacing.md} {spacing.lg}`. Active: text shifts to `{colors.ink}`, 2px bottom border in `{colors.ink}`.

**`pill-tab`** + **`pill-tab-active`** — Pill-style tab nav.
- Inactive: background `{colors.canvas}`, text `{colors.steel}`, border `1px solid {colors.hairline}`, padding `{spacing.xs} {spacing.md}`, rounded `{rounded.full}`.
- Active: background `{colors.primary}`, text `{colors.on-primary}`, no border.

### Badges & Status

**`badge-success`** — Pale-green confirmation badge ("Active", "Online").
- Background `{colors.success-bg}`, text `{colors.success-text}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-new`** — Accent "NEW" / "Live" pill untuk fresh releases.
- Background `{colors.brand-coral}`, text `{colors.on-dark}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-info`** — Pale-blue informational pill.
- Background `{colors.brand-blue-200}`, text `{colors.brand-blue-deep}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-channel`** — Channel indicator badge (WA/IG/FB).
- Background: channel-specific color, text `{colors.on-dark}`, typography `{typography.caption-bold}`, rounded `{rounded.full}`, padding `4px 10px`.

**`badge-code`** — Inline code-style chip.
- Background `{colors.brand-blue-200}`, text `{colors.brand-blue-deep}`, typography `{typography.caption-bold}`, rounded `{rounded.sm}`, padding `2px 6px`.

**`announcement-banner`** — Sticky announcement strip above top nav.
- Background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.body-sm-medium}`, padding `{spacing.sm} {spacing.lg}`.

### Data Tables

**`data-table`** — Standard data table.
- Background `{colors.canvas}`, text `{colors.ink}`, typography `{typography.body-sm}`, rounded `{rounded.md}`, border `1px solid {colors.hairline}`.

**`data-table-header`** — Top header row.
- Background `{colors.surface}`, text `{colors.steel}`, typography `{typography.caption-bold}`, padding `{spacing.sm} {spacing.md}`.

**`data-table-row`** — Body rows.
- Background `{colors.canvas}`, text `{colors.ink}`, typography `{typography.body-sm}`, padding `{spacing.md}`, bottom border `1px solid {colors.hairline-soft}`.

### Navigation

**Top Navigation** — Sticky white bar dengan logo, link list, dan right-side CTAs.
- Background `{colors.canvas}`, height ~64px, bottom border `1px solid {colors.hairline-soft}`.
- Left: wordmark + horizontal link list.
- Right: black-pill CTA + outlined-pill secondary.

**`sidebar-nav-item`** + **`sidebar-nav-item-active`** — Left rail link entries.
- Inactive: background transparent, text `{colors.charcoal}`, typography `{typography.body-sm}`, rounded `{rounded.sm}`, padding `{spacing.xs} {spacing.md}`.
- Active: background `{colors.surface}`, text `{colors.ink}`, typography `{typography.body-sm-medium}`.

**`doc-toc-item`** — Right-rail table-of-contents links.
- Background transparent, text `{colors.steel}`, typography `{typography.body-sm}`, padding `{spacing.xs} 0`. Active item color shifts to `{colors.ink}`.

### Signature Components

**`hero-band`** — Centered hero dengan massive display + dual-CTA pair.
- Layout: centered headline in `{typography.hero-display}` ({colors.ink}), centered subtitle in `{typography.subtitle}` ({colors.steel}), centered button row (`button-primary` + `button-secondary`).

**`channel-matrix-grid`** — 4-column horizontal scroll of vibrant gradient channel cards.
- Each tile uses one of the `card-channel-*` variants (coral, magenta, blue, purple, dark).
- Card title in `{typography.display-lg}` or `{typography.heading-lg}`.
- Below title: thin tagline in `{typography.body-sm}` 80% white opacity.
- Optional badge top-right: `badge-new`.
- Card heights uniform (~360–400px); row scrolls horizontally on mobile.

**`feature-matrix`** — 4-column grid of white feature tiles below the channel matrix.
- Each tile is `feature-tile` chrome.
- Top: 100px-tall illustration zone (line-art icon or 3D mark).
- Below: title in `{typography.card-title}`, description in `{typography.body-sm}` `{colors.steel}`.

**`inbox-layout`** — Three-panel inbox interface.
- Left panel: conversation list (320px).
- Center: active chat area (flex).
- Right panel: contact detail sidebar (320px).

**`pipeline-kanban`** — Drag-and-drop pipeline board.
- 6-column horizontal scroll (New Lead → Contacted → Qualified → Proposal → Closed Won → Closed Lost).
- Cards use `card-base` chrome.
- Column headers show count badge.

**`dashboard-stat-row`** — Stats strip (total leads, conversion rate, response time, active conversations).
- Horizontal row of stat cells, each with large number in `{typography.heading-lg}` `{colors.ink}` and label below in `{typography.body-sm}` `{colors.steel}`.

**`docs-prose-block`** — Documentation main content area.
- Max-width ~720px, centered. Body in `{typography.body-md}` `{colors.charcoal}` line-height 1.6.
- Inline code in `{typography.body-md}` monospace fallback dengan `{colors.surface}` background dan `{rounded.xs}` corners.

**`footer`** — Dense footer.
- Background `{colors.footer-bg}`, padding `{spacing.section} {spacing.xxl}`.
- Top row: wordmark dan social icons.
- Body: multi-column link grid.
- Section headers in `{typography.body-sm-medium}` `{colors.on-dark}`.

**`footer-link`** — Individual link entry inside footer column.
- Background transparent, text `{colors.muted}`, typography `{typography.body-sm}`, padding `{spacing.xxs} 0`.

## Do's and Don'ts

### Do
- Use `{colors.primary}` (black) sebagai dominant CTA — it's the most recognizable interactive element.
- Reserve channel colors (coral, magenta, blue, cyan, purple) ONLY untuk channel-identity moments — never for general buttons.
- Pair `{rounded.hero}` (32px) gradient cards dengan `{rounded.xl}` (16px) white cards — the radius contrast is the visual signature.
- Apply `{rounded.full}` ke every button, every pill tab, every badge.
- Use `{typography.hero-display}` (80px) dengan -2px letter-spacing untuk hero displays — never compromise the leading or letter-spacing.
- Treat each channel as distinct color identity. WA is coral, IG is magenta, FB is blue. These are channel assignments, not free choices.

### Don't
- Don't use brand colors on body text or large surfaces — they lose meaning when overused.
- Don't soften corners on buttons (anything less than `{rounded.full}`) — the pill is a brand signature.
- Don't introduce a second display typeface; DM Sans handles every role.
- Don't reduce hero leading below 1.10 — the brand needs that breathing room on the 80px display.
- Don't apply heavy shadows on white cards; flat-with-borders is the documentation default.
- Don't put gradient backgrounds on standard buttons; gradients are reserved for channel-card identity moments.

## Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|---|---|---|
| Mobile (small) | < 480px | Single column. Hero drops to 40px. Nav collapses to hamburger. Channel matrix horizontal-scroll. Footer 1-column. |
| Mobile (large) | 480 – 767px | Same as small but feature matrix renders 2-up. |
| Tablet | 768 – 1023px | 2-column feature matrix. Sidebar collapses to drawer. |
| Desktop | 1024 – 1279px | Full 4-column channel matrix; 3-column dashboard (sidebar / content / detail). |
| Wide Desktop | ≥ 1280px | Wider hero gutters, fixed sidebar. |

### Touch Targets
- Pill buttons render at 38–40px effective height — bumps to 44px on mobile via padding override.
- Circular icon buttons: 36×36px desktop → 44×44px on mobile.
- Form inputs render at 40px height; bumps to 44px on mobile.
- Sidebar nav items render at ~32px tall — bumps to 44px on mobile drawers.

### Collapsing Strategy
- **Announcement banner** stays full-width; collapses to single line at < 480px.
- **Top nav** below 1024px collapses to hamburger.
- **Dashboard grid**: 3-column desktop → sidebar-drawer at < 1024px → single-column at < 768px.
- **Channel matrix**: 4-column desktop → horizontal-scroll at < 1024px.
- **Feature matrix**: 4-column → 2-column at tablet → 1-column at mobile.
- **Hero typography**: 80px → 56px at < 1024px → 40px at < 768px → 32px at < 480px.
- **Stats strip**: 4-column → 2×2 at < 768px → 1-column at < 480px.

## Iteration Guide

1. Focus on ONE component at a time. The system has high internal consistency.
2. Reference component names dan tokens directly (`{colors.primary}`, `{component-name}-pressed`, `{rounded.full}`) — do not paraphrase.
3. Add new variants sebagai separate entries (`-pressed`, `-disabled`, `-active`).
4. Default to `{typography.body-md}` untuk body dan `{typography.subtitle}` untuk emphasis. Headlines step down `hero-display → display-lg → heading-lg → heading-md → heading-sm`.
5. Keep channel colors (coral, magenta, blue, cyan, purple) confined to channel-card identity. If a brand color appears on a standard button or generic surface, ask whether it earned that surface.
6. Pill-shaped buttons (`{rounded.full}`) always — squared buttons signal "third-party widget" in this language.

## Known Gaps

- Dark-mode token values tidak yet surfaced — implement jika diperlukan.
- Animation/transition timings tidak extracted — recommend 150–200ms ease untuk hover/focus transitions.
- Form validation success state tidak explicitly captured — implement following standard green-border patterns.
- Code syntax highlighting palette belum formalized — documentation samples appear dengan system-default monospace dan minimal coloring.
