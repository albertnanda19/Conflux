# CHANGELOG.md

Log perubahan untuk user. Dalam Bahasa Indonesia, tanpa istilah teknis.

---

## [2026-06-19] — Tugaskan AI Assistant ke Percakapan (Inbox) [Development]

### Ditambahkan
• Tombol "Assign AI" di kotak masuk untuk menugaskan AI Assistant menangani satu percakapan secara langsung
• AI langsung membalas pesan terakhir pelanggan begitu ditugaskan — meski ada agen online, di luar jam kerja, atau AI global sedang nonaktif
• Tombol "Ambil Alih" untuk menghentikan AI dan melanjutkan percakapan secara manual

### Diubah
• Agen yang sudah ditugaskan tetap dipertahankan saat AI diaktifkan; AI otomatis berhenti begitu agen mengirim balasan

---

## [2026-06-19] — AI Balas Otomatis & Serah-Terima ke Agen (Modul 2) [Development]

### Ditambahkan
• AI Assistant kini membalas pesan pelanggan secara otomatis di kotak masuk saat tidak ada agen yang online — jawaban diambil dari dokumen Knowledge Base
• Serah-terima otomatis ke agen: saat pelanggan menunjukkan niat mendaftar/membayar (kata kunci atau sinyal konversi), AI mengirim pesan transisi lalu percakapan diteruskan ke agen
• Pengaturan jam kerja AI kini berfungsi: di luar jam kerja, AI mengirim pesan otomatis "di luar jam operasional" (OOO)
• Batas jumlah pesan AI: setelah AI membalas sekian kali tanpa penyelesaian, percakapan otomatis diserahkan ke agen
• Sinyal konversi (kata kunci, minta nomor rekening/transfer, tanya jadwal/konsultasi) kini benar-benar memicu serah-terima sesuai pengaturan yang diaktifkan

### Diubah
• Saat agen membalas percakapan yang sedang ditangani AI, AI otomatis berhenti (agen mengambil alih)

### Diperbaiki
• AI hanya aktif ketika memang dibutuhkan (agen sedang tidak tersedia) sehingga tidak mengganggu percakapan yang sudah dipegang agen online

---

## [2026-06-19] — AI Assistant Engine (Modul 2) [Development]

### Ditambahkan
• Halaman AI Assistant: buat, ubah, hapus, dan atur banyak asisten AI dengan persona masing-masing
• Pengaturan karakter asisten: nama, gaya bahasa (formal/semi-formal/santai), bahasa, dan instruksi sistem
• Pengaturan jam aktif asisten per hari beserta pesan otomatis di luar jam kerja
• Pengaturan handoff: kata kunci pemicu, sinyal konversi, pesan serah-terima, dan batas pesan sebelum diserahkan ke agen
• Penugasan satu asisten AI ke satu agen (otomatis lepas dari agen sebelumnya saat dipindah)
• Knowledge Base: unggah dokumen (PDF, DOCX, TXT, CSV) yang otomatis diproses agar bisa dipahami AI
• Lingkup Knowledge Base: global untuk semua asisten atau khusus per asisten
• Uji coba chat (Test AI) langsung di halaman asisten — AI menjawab berdasarkan dokumen yang diunggah
• Pengaturan provider AI dan urutan cadangan (Gemini → OpenRouter → OpenAI) di halaman Pengaturan

### Diubah
• Seluruh halaman Modul 2 (AI Assistant, Knowledge Base, Pengaturan AI) kini terhubung ke sistem nyata — tidak ada lagi data contoh
• Tombol dan formulir di Modul 2 sekarang benar-benar berfungsi (termasuk simpan konten dokumen)

### Diperbaiki
• Asisten AI kini menjawab hanya berdasarkan dokumen Knowledge Base, tidak mengarang jawaban
• Deteksi otomatis saat calon pelanggan siap mendaftar (handoff ke agen)

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
