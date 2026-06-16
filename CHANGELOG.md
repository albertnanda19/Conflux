# CHANGELOG.md

Log perubahan untuk user. Dalam Bahasa Indonesia, tanpa istilah teknis.

---

## [2026-06-15] — Inisialisasi Project [Development]

### Ditambahkan
• File PRD lengkap untuk platform sales communication Dibimbing.ID
• Konfigurasi tech stack: Bun, Elysia, Drizzle ORM, Vercel AI SDK, Apache ECharts
• Arsitektur single-server untuk tahap awal pengembangan
• Sistem fallback multi-AI provider (Gemini → OpenRouter → GPT-4o-mini)
• 6 skill AI agent dari skills.sh (shadcn, frontend-design, vercel-react-best-practices, tdd, sentry-cli, webapp-testing)
• CLAUDE.md dengan workflow 5-phase dan smart memory system
• Core documentation files: STATUS.md, PROGRESS.md, DECISIONS.md, EPICS.md

### Diubah
• Tech stack dari Node.js/Fastify/Prisma/Next.js ke Bun/Elysia/Drizzle/Vite+React
• Arsitektur dari multi-server dengan load balancer ke single-server untuk MVP
• Observability dari Grafana+Prometheus+Loki ke Sentry Cloud free tier untuk MVP
• Design system dari MiniMax branding ke generic token-based system (DESIGN.md)

### Dihapus
• Semua branding MiniMax dari DESIGN.md — sekarang menggunakan token names yang generik
• Section RANGKUMAN KERJA dari CLAUDE.md
• PHASE 6 (COMMIT) dari workflow CLAUDE.md — AI agent commit langsung tanpa approval terpisah

### Diperbaiki
• CLAUDE.md Smart Memory System diperkuat — AI agents wajib update markdown files sebagai persistent memory antar-session
• Rule branding: tidak ada "Dibimbing" di code/UI/output (project testing only)
