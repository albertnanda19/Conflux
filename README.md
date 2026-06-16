# DBB-PSC — Platform Sales Communication

Platform komunikasi sales & marketing internal berbasis omnichannel. Menyatukan WhatsApp, Instagram, Facebook, dan channel lain dalam satu dashboard dengan AI auto-reply, CRM pipeline, dan analitik.

---

## Daftar Isi

1. [Arsitektur](#arsitektur)
2. [Tech Stack](#tech-stack)
3. [Prasyarat](#prasyarat)
4. [Instalasi](#instalasi)
5. [Konfigurasi Environment](#konfigurasi-environment)
6. [Menjalankan Aplikasi](#menjalankan-aplikasi)
7. [Manajemen Database](#manajemen-database)
8. [Testing](#testing)
9. [Daftar Script](#daftar-script)
10. [Struktur Project](#struktur-project)
11. [Kredensial Default](#kredensial-default)
12. [Troubleshooting](#troubleshooting)

---

## Arsitektur

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│  Frontend   │────▶│   Backend   │────▶│  PostgreSQL   │
│  (Vite +    │     │  (Elysia +  │     │  + pgvector   │
│   React)    │     │     Bun)    │     │  Port: 5433   │
│  Port: 5173 │     │  Port: 3000 │     └──────────────┘
└─────────────┘     │             │     ┌──────────────┐
                    │             │────▶│    Redis 7    │
                    │             │     │  Port: 6379   │
                    │             │     └──────────────┘
                    │             │     ┌──────────────┐
                    │             │────▶│    MinIO      │
                    └─────────────┘     │  Port: 9000/1 │
                                        └──────────────┘
```

**Monorepo** dengan Bun workspaces:
- `apps/web/` — Frontend (SPA)
- `apps/server/` — Backend (REST API + WebSocket + BullMQ workers)
- `packages/shared/` — Shared types & utilities

---

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Runtime | Bun |
| Frontend | Vite + React 19 + TypeScript 6 |
| UI Components | shadcn/ui + Tailwind CSS 3 |
| State Management | Zustand (client) + TanStack Query (server) |
| Form | React Hook Form + Zod |
| Backend Framework | Elysia |
| ORM | Drizzle ORM |
| Database | PostgreSQL 16 + pgvector |
| Cache & Queue | Redis 7 + BullMQ |
| Object Storage | MinIO (dev) |
| AI | Vercel AI SDK (Gemini + OpenAI) |
| Unit Test | Vitest |
| E2E Test | Playwright |

---

## Prasyarat

| Software | Versi Minimum | Cek Versi |
|----------|---------------|-----------|
| Bun | 1.3+ | `bun --version` |
| Docker | 24+ | `docker --version` |
| Docker Compose | v2+ | `docker compose version` |
| Git | 2.40+ | `git --version` |

---

## Instalasi

```bash
# 1. Clone repository
git clone git@github.com:albertnanda19/Conflux.git
cd Conflux

# 2. Install semua dependencies (monorepo)
bun install

# 3. Jalankan infrastruktur (PostgreSQL, Redis, MinIO)
docker compose up -d

# 4. Buat file .env dari template (lihat bagian Konfigurasi)
cp .env.example .env
# Edit .env sesuai kebutuhan

# 5. Buat database tables
bun run db:push

# 6. Isi data awal (admin + agent user)
bun run db:seed

# 7. Jalankan aplikasi (frontend + backend secara bersamaan)
bun run dev
```

Setelah langkah 7, akses:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **Backend Health Check:** http://localhost:3000/health
- **MinIO Console:** http://localhost:9001

---

## Konfigurasi Environment

Satu file `.env` di root monorepo. Backend memuat file ini via flag `--env-file=../../.env`.

### Struktur `.env`

```bash
# ─── Database ────────────────────────────────────────────
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/dbb_psc

# ─── Redis ───────────────────────────────────────────────
REDIS_URL=redis://localhost:6379

# ─── MinIO (Object Storage) ──────────────────────────────
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=dbb-psc-media

# ─── JWT (Autentikasi) ──────────────────────────────────
JWT_SECRET=ganti-dengan-secret-yang-panjang-dan-acak
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# ─── AI Providers (opsional untuk tahap awal) ───────────
GEMINI_API_KEY=
OPENAI_API_KEY=

# ─── Sentry (opsional) ──────────────────────────────────
SENTRY_DSN=
VITE_SENTRY_DSN=

# ─── Frontend ───────────────────────────────────────────
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

### Penjelasan Tiap Variabel

| Variabel | Wajib | Keterangan |
|----------|-------|------------|
| `DATABASE_URL` | Ya | Koneksi PostgreSQL. Port **5433** (bukan 5432) karena Docker mapping |
| `REDIS_URL` | Ya | Koneksi Redis untuk cache, queue, dan pub/sub |
| `MINIO_ENDPOINT` | Ya | Alamat MinIO untuk file storage (foto, dokumen) |
| `MINIO_PORT` | Ya | Port MinIO API (9000) dan Console (9001) |
| `MINIO_ACCESS_KEY` | Ya | Username MinIO |
| `MINIO_SECRET_KEY` | Ya | Password MinIO |
| `MINIO_BUCKET` | Ya | Nama bucket untuk menyimpan media |
| `JWT_SECRET` | Ya | Secret key untuk enkripsi token JWT. **Ganti di production** |
| `JWT_EXPIRES_IN` | Tidak | Durasi access token (default: 15 menit) |
| `JWT_REFRESH_EXPIRES_IN` | Tidak | Durasi refresh token (default: 7 hari) |
| `GEMINI_API_KEY` | Tidak | API key Google Gemini untuk AI auto-reply |
| `OPENAI_API_KEY` | Tidak | API key OpenAI sebagai fallback AI |
| `SENTRY_DSN` | Tidak | DSN Sentry untuk error tracking backend |
| `VITE_SENTRY_DSN` | Tidak | DSN Sentry untuk error tracking frontend |
| `VITE_API_URL` | Ya | URL backend API untuk frontend |
| `VITE_WS_URL` | Ya | URL WebSocket untuk real-time messaging |

---

## Menjalankan Aplikasi

### Development Mode

```bash
# Jalankan semua sekaligus (frontend + backend)
bun run dev

# Atau jalankan secara terpisah
bun run dev:server    # Backend only → http://localhost:3000
bun run dev:web       # Frontend only → http://localhost:5173
```

### Production Build

```bash
# Build frontend + backend
bun run build

# Jalankan backend production
cd apps/server
bun run start
```

### Mengelola Infrastructure (Docker)

```bash
# Jalankan semua container di background
docker compose up -d

# Hentikan semua container
docker compose down

# Hentikan dan hapus semua data (database, cache, files)
docker compose down -v

# Lihat status container
docker compose ps

# Lihat log secara real-time
docker compose logs -f

# Lihat log container tertentu
docker compose logs -f postgres
docker compose logs -f redis
docker compose logs -f minio

# Restart container tertentu
docker compose restart postgres
docker compose restart redis
docker compose restart minio

# Restart semua container
docker compose restart

# Rebuild container (jika ada perubahan image)
docker compose up -d --build
```

### Port yang Digunakan

| Service | Port | Keterangan |
|---------|------|------------|
| Frontend (Vite) | 5173 | Development server |
| Backend (Elysia) | 3000 | REST API + WebSocket |
| PostgreSQL | 5433 | Docker mapping dari 5432 |
| Redis | 6379 | Cache + Queue |
| MinIO API | 9000 | S3-compatible API |
| MinIO Console | 9001 | Web admin panel |

---

## Manajemen Database

```bash
# Push schema ke database (tanpa migration file — untuk development)
bun run db:push

# Generate migration file (untuk production)
cd apps/server
bun run db:generate

# Jalankan migration
bun run db:migrate

# Buka Drizzle Studio (web UI untuk lihat data)
bun run db:studio

# Isi data awal (admin + agent user)
bun run db:seed
```

### Akses Database Langsung (psql)

```bash
psql -U postgres -h localhost -p 5433 -d dbb_psc

# Lihat semua tabel
\dt

# Lihat struktur tabel
\d contacts

# Query data
SELECT * FROM users LIMIT 10;

# Keluar
\q
```

---

## Testing

### Menjalankan Test

```bash
# Semua unit test (backend + frontend)
bun run test

# Test backend saja
bun run test:server

# Test frontend saja
bun run test:web

# Test dengan coverage report
bun run test:coverage

# Test dalam mode watch (auto-rerun saat file berubah)
cd apps/server && bun run test:watch
cd apps/web && bun run test:watch

# E2E test (perlu backend + frontend running)
bun run test:e2e
```

### Type Check

```bash
# Cek TypeScript error di semua apps
bun run typecheck
```

### Struktur Test

```
apps/server/src/
├── lib/
│   └── errors.test.ts           # Unit test: error classes
└── modules/
    └── {module}/
        ├── types.test.ts        # Unit test: Zod validation
        ├── services.test.ts     # Unit test: business logic
        ├── queries.test.ts      # Integration test: database queries
        └── handlers.test.ts     # Integration test: HTTP handlers

apps/web/src/
├── lib/
│   └── utils.test.ts            # Unit test: utility functions
└── components/
    └── *.test.tsx               # Integration test: React components

apps/web/e2e/
├── auth.spec.ts                 # E2E: login flow
└── inbox.spec.ts                # E2E: inbox flow
```

---

## Daftar Script

### Root Monorepo

| Script | Keterangan |
|--------|------------|
| `bun run dev` | Jalankan frontend + backend bersamaan |
| `bun run dev:server` | Jalankan backend saja |
| `bun run dev:web` | Jalankan frontend saja |
| `bun run build` | Build frontend + backend untuk production |
| `bun run test` | Jalankan semua unit test |
| `bun run test:server` | Jalankan test backend saja |
| `bun run test:web` | Jalankan test frontend saja |
| `bun run test:e2e` | Jalankan E2E test (Playwright) |
| `bun run test:coverage` | Jalankan test dengan coverage report |
| `bun run typecheck` | Cek TypeScript error |
| `bun run lint` | Jalankan ESLint |
| `bun run db:push` | Push schema Drizzle ke database |
| `bun run db:seed` | Isi data awal |

### Backend (`apps/server/`)

| Script | Keterangan |
|--------|------------|
| `bun run dev` | Development server dengan hot-reload |
| `bun run start` | Production server |
| `bun run build` | Build ke `dist/` |
| `bun run db:generate` | Generate migration file |
| `bun run db:migrate` | Jalankan migration |
| `bun run db:push` | Push schema langsung |
| `bun run db:studio` | Buka Drizzle Studio |
| `bun run db:seed` | Isi data awal |
| `bun run test` | Jalankan unit test |
| `bun run test:watch` | Test mode watch |
| `bun run test:coverage` | Test dengan coverage |
| `bun run typecheck` | Cek TypeScript |

### Frontend (`apps/web/`)

| Script | Keterangan |
|--------|------------|
| `bun run dev` | Development server (Vite) |
| `bun run build` | Build untuk production |
| `bun run preview` | Preview build production |
| `bun run test` | Jalankan unit test |
| `bun run test:watch` | Test mode watch |
| `bun run test:coverage` | Test dengan coverage |
| `bun run typecheck` | Cek TypeScript |
| `bun run lint` | Jalankan ESLint |

---

## Struktur Project

```
dbb-psc/
├── CLAUDE.md                 # Panduan AI agent (development guidelines)
├── STATUS.md                 # Status terkini project
├── PROGRESS.md               # Log kerja harian
├── DECISIONS.md              # Keputusan arsitektural & teknis
├── EPICS.md                  # Daftar fitur MVP
├── CHANGELOG.md              # Log perubahan untuk user
├── prd.md                    # Product Requirements Document
├── .env                      # Environment variables (satu file di root)
├── docker-compose.yml        # Infrastructure (PostgreSQL, Redis, MinIO)
├── playwright.config.ts      # Konfigurasi E2E testing
│
├── apps/
│   ├── web/                  # Frontend
│   │   ├── src/
│   │   │   ├── components/   # React components
│   │   │   ├── pages/        # Halaman (lazy-loaded)
│   │   │   ├── stores/       # Zustand stores
│   │   │   ├── hooks/        # Custom React hooks
│   │   │   ├── lib/          # Utilities (api, constants, utils)
│   │   │   ├── providers/    # Context providers
│   │   │   ├── router.tsx    # React Router config
│   │   │   └── test/         # Test setup
│   │   ├── e2e/              # Playwright E2E tests
│   │   └── package.json
│   │
│   └── server/               # Backend
│       ├── src/
│       │   ├── lib/          # Shared utilities (db, redis, auth, ai, errors, schema)
│       │   ├── modules/      # Feature modules (14 modules)
│       │   │   ├── auth/         # Autentikasi (reference implementation)
│       │   │   ├── contacts/     # CRM contacts
│       │   │   ├── conversations/# Percakapan
│       │   │   ├── channels/     # Channel integrasi
│       │   │   ├── messages/     # Pesan
│       │   │   ├── knowledge-base/ # Basis pengetahuan AI
│       │   │   ├── pipeline/     # Pipeline penjualan
│       │   │   ├── broadcast/    # Broadcast & campaign
│       │   │   ├── analytics/    # Analitik
│       │   │   ├── notifications/# Notifikasi
│       │   │   ├── users/        # Manajemen pengguna
│       │   │   ├── reports/      # Laporan
│       │   │   ├── search/       # Pencarian
│       │   │   └── settings/     # Pengaturan
│       │   ├── workers/      # BullMQ workers (4 workers)
│       │   ├── middleware/   # Error handler
│       │   ├── routes/index.ts # Route composition
│       │   └── index.ts      # Entry point
│       └── package.json
│
└── packages/
    └── shared/               # Shared types & utilities
```

### Struktur Module Backend

Setiap module mengikuti pola 5 layer:

```
modules/{module}/
├── types.ts      # Zod schemas + TypeScript types
├── queries.ts    # Drizzle database queries
├── services.ts   # Business logic
├── handlers.ts   # HTTP request/response handlers
└── routes.ts     # Elysia route definitions
```

---

## Kredensial Default

### Pengguna (setelah `bun run db:seed`)

| Email | Password | Role |
|-------|----------|------|
| admin@test.com | password123 | super_admin |
| agent@test.com | password123 | agent |

### MinIO

| Field | Nilai |
|-------|-------|
| Console URL | http://localhost:9001 |
| Username | minioadmin |
| Password | minioadmin |

### PostgreSQL

| Field | Nilai |
|-------|-------|
| Host | localhost |
| Port | 5433 |
| Database | dbb_psc |
| Username | postgres |
| Password | postgres |

### Redis

| Field | Nilai |
|-------|-------|
| Host | localhost |
| Port | 6379 |

---

## API Endpoints

Base URL: `http://localhost:3000/api/v1`

### Autentikasi

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| POST | `/api/v1/auth/login` | Masuk ke sistem |
| POST | `/api/v1/auth/register` | Buat akun baru |
| POST | `/api/v1/auth/refresh` | Perbarui token |

### Module Lainnya (sedang dalam pengembangan)

| Prefix | Module |
|--------|--------|
| `/api/v1/contacts` | CRM Contacts |
| `/api/v1/conversations` | Percakapan |
| `/api/v1/channels` | Channel integrasi |
| `/api/v1/messages` | Pesan |
| `/api/v1/knowledge-base` | Basis pengetahuan |
| `/api/v1/pipeline` | Pipeline penjualan |
| `/api/v1/broadcast` | Broadcast & campaign |
| `/api/v1/analytics` | Analitik |
| `/api/v1/notifications` | Notifikasi |
| `/api/v1/users` | Manajemen pengguna |
| `/api/v1/reports` | Laporan |
| `/api/v1/search` | Pencarian |
| `/api/v1/settings` | Pengaturan |

---

## Troubleshooting

### Port sudah digunakan

```bash
# Cari proses yang menggunakan port
lsof -i :3000
lsof -i :5173

# Matikan proses di port tersebut
kill $(lsof -ti:3000)
kill $(lsof -ti:5173)
```

### Database connection failed

```bash
# Pastikan PostgreSQL container berjalan
docker compose ps

# Restart PostgreSQL
docker compose restart postgres

# Cek log PostgreSQL
docker compose logs postgres
```

### Password authentication failed (PostgreSQL)

```bash
# Masuk ke container dan reload config
docker exec dbb-psc-postgres psql -U postgres -c "SELECT pg_reload_conf();"

# Atau restart container
docker compose restart postgres
```

### Redis eviction policy warning

Warning `IMPORTANT! Eviction policy is allkeys-lru` muncul karena Redis Docker default menggunakan `allkeys-lru`. Untuk MVP ini aman diabaikan. Untuk production, tambahkan konfigurasi:

```yaml
# docker-compose.yml → redis service
command: redis-server --maxmemory-policy noeviction
```

### Frontend tidak bisa koneksi ke backend

```bash
# Pastikan backend running
curl http://localhost:3000/health

# Cek VITE_API_URL di .env
grep VITE_API_URL .env
# Harus: VITE_API_URL=http://localhost:3000
```

### Dependencies bermasalah

```bash
# Install ulang semua dependencies
rm -rf node_modules apps/*/node_modules packages/*/node_modules
bun install
```

### Database tidak sinkron dengan schema

```bash
# Push ulang schema ke database
bun run db:push

# Atau reset sepenuhnya
docker compose down -v
docker compose up -d
bun run db:push
bun run db:seed
```

### Hapus semua data dan mulai dari awal

```bash
# Hentikan container + hapus semua volumes
docker compose down -v

# Jalankan ulang
docker compose up -d

# Push schema + seed
bun run db:push
bun run db:seed
```
