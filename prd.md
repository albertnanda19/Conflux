# PRD — Platform Sales Communication Internal

> **Untuk AI Agent / Developer yang membaca dokumen ini:**
> Dokumen ini adalah Product Requirements Document (PRD) lengkap untuk membangun platform komunikasi sales & marketing internal perusahaan dari nol. Platform ini menggantikan kebutuhan tools pihak ketiga. Baca seluruh dokumen ini sebelum menulis satu baris kode pun. Setiap keputusan arsitektur, stack, dan fitur dalam dokumen ini sudah dipertimbangkan untuk konteks spesifik — skala, tim, dan kebutuhan bisnis mereka.

---

## Daftar Isi

1. [Latar Belakang & Konteks Bisnis](#1-latar-belakang--konteks-bisnis)
2. [Tujuan Platform](#2-tujuan-platform)
3. [Pengguna & Peran](#3-pengguna--peran)
4. [Alur Kerja Utama](#4-alur-kerja-utama)
5. [Modul & Fitur Lengkap](#5-modul--fitur-lengkap)
6. [Rekomendasi Tech Stack](#6-rekomendasi-tech-stack)
7. [Arsitektur Sistem](#7-arsitektur-sistem)
8. [Skema Database](#8-skema-database)
9. [Integrasi Eksternal](#9-integrasi-eksternal)
10. [Non-Functional Requirements](#10-non-functional-requirements)
11. [Fase Pengembangan & Prioritas](#11-fase-pengembangan--prioritas)
12. [Glossary](#12-glossary)

---

## 1. Latar Belakang & Konteks Bisnis

**Perusahaan** adalah platform edukasi yang menawarkan berbagai program pelatihan/bootcamp. Tim sales & marketing mereka menerima ribuan pesan masuk per hari dari calon peserta melalui berbagai channel (WhatsApp, Instagram, Facebook, dan website).

### Masalah yang Dihadapi Saat Ini

- Tim sales/marketing harus membuka aplikasi yang terpisah-pisah (WhatsApp Business, Instagram DM, Facebook Messenger) untuk membalas pesan
- Volume pesan masuk (ribuan per hari) jauh melampaui kapasitas respons manual tim
- Tidak ada sistem terpusat untuk melacak status lead dari pertama masuk hingga konversi
- Tidak ada visibilitas data performa tim atau channel mana yang paling efektif
- Banyak pesan yang tidak terjawab atau terlambat direspons, menyebabkan hilangnya potensi konversi

### Solusi

Membangun platform internal yang:
1. Menyatukan semua channel komunikasi dalam satu inbox (omnichannel)
2. Menggunakan AI Assistant yang bisa dikustomisasi per agent sebagai "penjaga" saat agent offline
3. Memungkinkan agent manusia fokus hanya pada lead yang sudah siap konversi
4. Menyediakan tools CRM ringan untuk tracking pipeline lead
5. Memberikan laporan dan analitik untuk pengambilan keputusan

---

## 2. Tujuan Platform

| Tujuan | Metrik Keberhasilan |
|---|---|
| Tidak ada pesan yang tidak terjawab | Response rate 100% dalam 5 menit pertama |
| Kurangi beban manual agent | AI menangani ≥60% chat tanpa intervensi manusia |
| Sentralisasi komunikasi | 0 perpindahan antar aplikasi untuk agent |
| Visibilitas pipeline lead | Conversion rate terlacak real-time |
| Skalabilitas | Mampu menangani ribuan chat/hari tanpa degradasi performa |

---

## 3. Pengguna & Peran

### 3.1 Role Hierarchy

```
Super Admin (IT / Manajemen)
    └── Admin (Kepala Sales / Marketing Manager)
            └── Supervisor (Team Lead)
                    └── Agent (Sales / Marketing Staff)
```

### 3.2 Deskripsi Per Role

**Super Admin**
- Akses penuh ke seluruh sistem
- Manajemen integrasi channel (WhatsApp, IG, FB)
- Manajemen AI Assistant (buat, edit, hapus, assign ke agent)
- Konfigurasi global AI (provider, fallback chain, model defaults)
- Manajemen user dan role
- Akses semua laporan

**Admin**
- Manajemen agent dalam tim
- Konfigurasi broadcast & campaign
- Akses laporan performa tim
- Manajemen template pesan
- Lihat semua percakapan

**Supervisor**
- Monitor percakapan agent dalam tim mereka
- Assignment/reassignment percakapan
- Approve template sebelum digunakan
- Laporan performa tim

**Agent (Sales / Marketing Staff)**
- Balas percakapan yang di-assign ke mereka
- Gunakan template & quick reply
- Input catatan di profil lead
- Update status pipeline lead
- Lihat percakapan milik sendiri

---

## 4. Alur Kerja Utama

### 4.1 Alur Pesan Masuk (Happy Path)

```
Pesan masuk dari WA/IG/FB
        │
        ▼
Webhook diterima server
        │
        ▼
Sistem cek: apakah kontak sudah ada?
    ├── BELUM → Auto-create kontak baru
    └── SUDAH → Load profil & history kontak
        │
        ▼
Sistem cek: apakah ada agent yang sedang handle kontak ini?
    ├── ADA → Route ke agent tersebut + notifikasi
    └── TIDAK ADA → Masuk ke antrian
        │
        ▼
Sistem cek: apakah ada agent online & available?
    ├── ADA → Auto-assign ke agent (round-robin) + notifikasi
    └── TIDAK ADA → Lanjut ke AI Assistant routing
        │
        ▼
Sistem mencari AI Assistant yang di-assign ke agent yang handle
    ├── ADA → Route ke AI Assistant spesifik agent tersebut
    └── TIDAK ADA → Route ke AI Assistant default (system-wide)
        │
        ▼
AI Assistant membalas berdasarkan persona + knowledge base yang dikonfigurasi
        │
        ▼
AI mendeteksi sinyal konversi (lead siap beli)?
    ├── YA → Trigger handoff ke human agent + notifikasi priority
    └── TIDAK → AI lanjut menjawab
        │
        ▼
Agent manusia take over percakapan
        │
        ▼
Percakapan selesai → Update status pipeline
```

### 4.2 Alur Broadcast Campaign

```
Admin buat campaign baru
        │
        ▼
Pilih segmen kontak (filter by program, status, sumber, dll)
        │
        ▼
Pilih / buat template pesan (teks, gambar, CTA button)
        │
        ▼
Set jadwal pengiriman (sekarang / terjadwal)
        │
        ▼
Preview & konfirmasi jumlah penerima
        │
        ▼
Broadcast dikirim via WhatsApp Business API
        │
        ▼
Sistem tracking: terkirim → dibaca → dibalas
        │
        ▼
Laporan performa campaign tersedia real-time
```

---

## 5. Modul & Fitur Lengkap

---

### MODUL 1 — Omnichannel Inbox

**Tujuan:** Menyatukan semua komunikasi dari berbagai channel dalam satu dashboard terpusat.

#### 5.1.1 Dashboard Percakapan

- Inbox terpusat menampilkan semua percakapan aktif dari semua channel
- Filter percakapan berdasarkan: channel, status (open/pending/resolved), agent yang handle, label/tag, tanggal
- Pencarian percakapan berdasarkan nama kontak, nomor, atau isi pesan
- Indikator channel asal di setiap percakapan (ikon WA/IG/FB)
- Badge notifikasi jumlah pesan belum dibaca
- Sort percakapan berdasarkan: terbaru, terlama menunggu, prioritas

#### 5.1.2 Panel Percakapan

- Tampilan chat bubble seperti aplikasi messaging pada umumnya
- Tampilkan history percakapan lengkap dengan timestamp
- Indikator status pesan: terkirim, delivered, dibaca
- Support tipe pesan: teks, gambar, video, dokumen, audio, sticker, location
- Input area dengan emoji picker, attachment upload, template shortcut
- Tombol "Assign to Agent", "Add Label", "Resolve", "Snooze"
- Panel info kontak di sidebar kanan (nama, channel, label, notes, history)

#### 5.1.3 Integrasi Channel

**WhatsApp Business API (Wajib)**
- Koneksi via WhatsApp Business API (Meta Cloud API atau BSP seperti Wati/Twilio)
- Support pesan teks, media, template message, interactive message (button, list)
- Webhook untuk pesan masuk real-time
- Status delivery tracking (sent, delivered, read)
- Support multi-number WhatsApp jika diperlukan

**Instagram Messaging API (Wajib)**
- Koneksi via Meta Instagram Messaging API
- Support DM (Direct Message) dan Story Mention reply
- Bisa balas pesan teks, gambar, sticker, reaction
- Memerlukan akun Instagram Business yang terhubung ke Facebook Page

**Facebook Messenger API (Wajib)**
- Koneksi via Meta Messenger Platform
- Support pesan teks, gambar, file, quick reply, button template
- Webhook untuk pesan masuk real-time

**Live Chat Widget Website (Nice to Have)**
- JavaScript snippet yang bisa di-embed di website perusahaan
- Tampilan chat bubble di pojok bawah halaman
- Semua chat dari widget masuk ke inbox yang sama
- Support offline message (jika agent offline, pesan tetap tersimpan)
- Customizable warna & logo sesuai branding perusahaan

**Telegram (Nice to Have)**
- Koneksi via Telegram Bot API
- Support pesan teks, gambar, file, inline button

#### 5.1.4 Assignment & Routing

- Auto-assign percakapan baru ke agent yang available (round-robin)
- Manual assign / reassign oleh supervisor atau admin
- Notifikasi ke agent saat percakapan baru di-assign
- Lihat daftar agent beserta status (online/busy/offline) dan jumlah percakapan aktif
- Transfer percakapan antar agent dengan catatan serah terima

#### 5.1.5 Label & Tag

- Buat label kustom (contoh: "Minat Data Science", "Dari IG Ads", "Follow Up")
- Assign satu atau banyak label ke satu percakapan
- Filter inbox berdasarkan label
- Warna label bisa dikustomisasi

#### 5.1.6 Notifikasi Real-Time

- Notifikasi browser (push notification) untuk pesan baru
- Notifikasi dalam aplikasi (bell icon + dropdown)
- Sound notification (bisa dimatikan)
- Notifikasi khusus untuk: pesan baru, assignment baru, handoff dari AI, pesan yang menunggu terlalu lama

---

### MODUL 2 — AI Assistant Engine

**Tujuan:** Memastikan setiap pesan masuk direspons secara otomatis oleh AI Assistant yang sudah dikustomisasi per agent, sehingga tidak ada lead yang dibiarkan tanpa respons — bahkan saat agent manusia offline.

#### 5.2.1 AI Assistant — Konsep & Terminology

Istilah dalam modul ini:
- **Agent** = Manusia (sales/marketing staff) — pengguna platform
- **AI Assistant** = Bot AI yang dikonfigurasi dan di-assign ke agent tertentu

Setiap AI Assistant adalah entitas mandiri dengan konfigurasi tersendiri:
- Nama dan deskripsi
- Persona & tone
- Knowledge base yang terpisah
- Handoff rules yang bisa berbeda
- Working hours yang bisa berbeda

#### 5.2.2 Manajemen AI Assistant

**Fitur CRUD (Create, Read, Update, Delete):**

Admin (ke atas) bisa membuat dan mengelola AI Assistant:
- **Nama AI Assistant** — contoh: "Asisten Sari", "Asisten Closing", "Asisten Support"
- **Deskripsi** — penjelasan singkat tentang kegunaan AI Assistant ini
- **Avatar** — foto atau ikon untuk identifikasi visual
- **Status** — active / inactive

**Konfigurasi per AI Assistant:**

| Section | Config | Penjelasan |
|---|---|---|
| Persona | Nama, tone, bahasa, system prompt | Karakter AI saat berbicara dengan lead |
| Knowledge Base | Dokumen & Q&A yang terkait | Apa yang AI ketahui untuk menjawab |
| Working Hours | Jam aktif per hari | Kapan AI Assistant ini aktif |
| Handoff Rules | Keyword triggers, sinyal konversi | Kapan AI menyerahkan ke human agent |
| Fallback Behavior | Pesan fallback jika AI tidak bisa jawab | Apa yang dikatakan AI saat buntu |

**Template AI Assistant:**

Admin bisa membuat AI Assistant dari template:
- "Asisten Ramah" — tone santai, general knowledge, cocok untuk lead baru
- "Asisten Teknis" — tone profesional, pengetahuan mendalam tentang program
- "Asisten Closing" — agresif tapi sopan, fokus ke konversi
- "Asisten 24/7" — selalu aktif, jawaban umum, handoff ke agent saat agent online

Admin juga bisa membuat AI Assistant dari nol (custom template).

#### 5.2.3 Assignment — AI Assistant ke Agent

Admin meng-assign AI Assistant ke agent menggunakan UI **AssignAgentModal** di halaman `/agents`:

- Buka profil agent → klik "Assign AI Assistant"
- Pilih AI Assistant dari dropdown (yang sudah dibuat sebelumnya)
- **1 agent = 1 AI Assistant** — setiap agent hanya punya satu AI Assistant
- Bisa diganti kapan saja oleh admin
- Jika agent belum di-assign AI Assistant, menggunakan **AI Assistant Default** (system-wide)

**Alur Assignment:**

```
Admin buat AI Assistant "Asisten Ramah"
    │
    ▼
Admin assign "Asisten Ramah" ke Agent Sari
    │
    ▼
Agent Sari sedang OFFLINE
    │
    ▼
Pesan masuk untuk Sari
    │
    ▼
Sistem cek: Sari punya AI Assistant?
    ├── YA → "Asisten Ramah" handle chat Sari
    └── TIDAK ADA → AI Assistant Default handle
```

#### 5.2.4 Knowledge Base Kustom

Knowledge base bisa dibagi per AI Assistant:

**Level 1: Global Knowledge Base (system-wide)**
- Berlaku untuk semua AI Assistant
- Info umum: profil perusahaan, FAQ umum, kontak support
- Diupload oleh Super Admin di Settings → Knowledge Base

**Level 2: Per-AI Assistant Knowledge Base (opsional)**
- Khusus untuk AI Assistant tertentu
- Contoh: "Asisten Closing" punya KB khusus tentang harga, promo, cara bayar
- Diupload saat konfigurasi AI Assistant

**Prioritas:** KB per-AI Assistant > KB global. Jika per-AI Assistant punya jawaban, gunakan itu. Jika tidak, fallback ke KB global.

**Fitur Knowledge Base:**
- Upload dokumen: PDF, DOCX, TXT, CSV → async extraction
- Input manual via rich text editor (Q&A format)
- Organisasi knowledge base per kategori (Program, Harga, Jadwal, Syarat, dll)
- Update knowledge base tanpa perlu restart sistem
- Versioning knowledge base (bisa rollback ke versi sebelumnya)
- AI menjawab **hanya** berdasarkan knowledge base yang tersedia — tidak mengarang
- **Document Processing Pipeline:**
  - Upload dokumen: PDF, DOCX, TXT, CSV → async extraction
  - Max file size: 10MB, worker-based processing (BullMQ)
  - Status tracking: pending → processing → completed/failed

#### 5.2.5 Kondisi Aktivasi AI Assistant

AI Assistant aktif secara otomatis ketika:
- Agent yang di-assign berstatus busy atau offline
- Di luar jam kerja AI Assistant yang dikonfigurasi
- Volume chat melebihi kapasitas agent yang available

AI Assistant tidak aktif / di-override ketika:
- Agent manusia secara manual take over percakapan
- Agent klik tombol "Take Over from AI"
- Percakapan sudah di-assign ke agent tertentu yang sedang online

#### 5.2.6 Handoff Otomatis ke Human Agent

AI Assistant mendeteksi sinyal berikut sebagai tanda lead siap konversi dan trigger handoff:
- Kata kunci konversi: "daftar", "bayar", "mau beli", "berapa cara daftar", "transfer ke mana"
- Lead menyebut budget atau meminta nomor rekening
- Lead meminta jadwal demo / konsultasi
- Sentimen positif yang kuat + pertanyaan spesifik tentang enrollment

Saat handoff terjadi:
- Notifikasi priority dikirim ke **agent yang di-assign AI Assistant tersebut** (bukan random agent)
- AI Assistant memberi pesan transisi kepada user: "Saya akan hubungkan Anda dengan tim kami sebentar lagi"
- Percakapan auto-assign ke agent yang di-assign ke AI Assistant tersebut
- Ringkasan percakapan AI disiapkan untuk agent (konteks cepat)

**Handoff Rules Bisa Dibedakan per AI Assistant:**
- "Asisten Ramah" — handoff hanya saat lead menyebut "daftar" atau "bayar"
- "Asisten Closing" — handoff lebih sensitif, termasuk saat lead bertanya harga

#### 5.2.7 Pengaturan Jam Aktif

**Per-AI Assistant (bisa berbeda):**
- Konfigurasi jam kerja per hari (Senin–Minggu) — setiap AI Assistant bisa punya jam berbeda
- AI Assistant aktif otomatis di luar jam kerja yang dikonfigurasi
- Pesan OOO (Out of Office) kustom saat di luar jam kerja

**Global:**
- Override manual: aktifkan/nonaktifkan AI Assistant kapan saja
- Timezone: WIB (UTC+7) sebagai default

**Contoh:**
- "Asisten Sari" aktif: Senin–Jumat 09.00–18.00 WIB
- "Asisten 24/7" aktif: 24 jam, 7 hari

#### 5.2.8 Provider AI (Multi-Provider Fallback)

Sistem mendukung **multi-provider fallback** menggunakan Vercel AI SDK. Jika provider utama gagal, sistem otomatis beralih ke provider berikutnya tanpa intervensi manual.

**Fallback Chain (Priority Order):**

| Priority | Provider | Model | Keterangan |
|---|---|---|---|
| 1 (Primary) | Google Gemini | Gemini 1.5 Flash | Gratis tier, latency rendah |
| 2 (Fallback) | OpenRouter | Llama 3.1 / Mistral / Qwen | Aggregator, banyak model gratis |
| 3 (Fallback) | OpenAI | GPT-4o-mini | Murah, reliable, last resort |

**Konfigurasi AI per environment:**
- API Key management (tersimpan encrypted) — setiap provider punya API key sendiri
- Fallback chain bisa dikonfigurasi (order, model, timeout)
- Set max token per respons
- Set temperature (kreativitas AI)
- Otomatis fallback jika provider gagal atau timeout

**Kenapa Multi-Provider:**
- **Cost optimization** — Primary pakai Gemini Flash (gratis), hanya bayar jika fallback ke OpenAI
- **Reliability** — Jika satu provider down, tetap ada respons
- **Flexibility** — Bisa ganti/gabung provider tanpa ubah core logic

#### 5.2.9 Kualifikasi Lead oleh AI (Nice to Have)

AI Assistant secara proaktif menggali informasi berikut dari lead:
- Program apa yang diminati?
- Background pendidikan/pekerjaan saat ini?
- Target waktu mulai belajar?
- Budget yang disiapkan?

Data kualifikasi ini otomatis tersimpan di profil kontak.

#### 5.2.10 Training & Koreksi AI (Nice to Have)

- Agent bisa flag percakapan AI Assistant yang jawabannya salah/kurang tepat
- Dari flagged conversation, admin bisa tambahkan ke knowledge base
- Review queue: daftar percakapan yang perlu dikoreksi
- Tracking: berapa banyak koreksi per AI Assistant per bulan (indikator kualitas)

#### 5.2.8 Training & Koreksi AI (Nice to Have)

- Agent bisa flag percakapan AI yang jawabannya salah/kurang tepat
- Dari flagged conversation, admin bisa tambahkan ke knowledge base
- Review queue: daftar percakapan yang perlu dikoreksi
- Tracking: berapa banyak koreksi per bulan (indikator kualitas AI)

---

### MODUL 3 — Broadcast & Campaign

**Tujuan:** Mengirim pesan massal yang relevan ke segmen kontak tertentu untuk nurturing lead dan promosi program.

#### 5.3.1 Pembuatan Campaign

- Nama campaign, deskripsi, dan tujuan
- Pilih channel pengiriman (saat ini: WhatsApp)
- Pilih segmen penerima (manual atau berdasarkan filter)
- Pilih atau buat template pesan
- Set jadwal pengiriman

#### 5.3.2 Segmentasi Kontak

Filter kontak untuk menentukan penerima broadcast berdasarkan:
- Program yang diminati
- Sumber lead (dari WA, IG, FB, website)
- Status pipeline (New Lead, Contacted, Qualified, dll)
- Label/tag yang dimiliki
- Tanggal pertama kontak (rentang waktu)
- Belum pernah dibalas oleh agent

#### 5.3.3 Template Pesan Broadcast

- Tipe konten: teks saja, teks + gambar, teks + dokumen, interactive (button CTA)
- Variabel dinamis: `{nama}`, `{program}`, `{harga}`, `{tanggal_batch}`, dll
- Preview template sebelum kirim
- Simpan template untuk digunakan ulang
- Semua template WhatsApp harus menggunakan format yang sudah diapprove Meta (template message)

#### 5.3.4 Penjadwalan Broadcast

- Kirim sekarang
- Kirim di tanggal & jam tertentu
- Timezone: WIB
- Cancel / reschedule sebelum broadcast terkirim

#### 5.3.5 Laporan Broadcast

Per campaign, tampilkan:
- Total kontak yang ditargetkan
- Jumlah berhasil terkirim / gagal
- Jumlah pesan yang dibuka (read)
- Jumlah yang membalas (reply rate)
- Timeline pengiriman (kapan mulai, kapan selesai)
- Daftar kontak yang gagal dikirim + alasan

#### 5.3.6 Sequence / Drip Message (Nice to Have)

- Buat sequence follow-up otomatis: H+1, H+3, H+7 setelah kontak pertama
- Stop sequence otomatis jika kontak sudah membalas
- Visualisasi flow sequence (node-based sederhana)

#### 5.3.7 A/B Testing Template (Nice to Have)

- Bagi penerima menjadi 2 grup (50/50 atau custom)
- Kirim template berbeda ke masing-masing grup
- Bandingkan performa (open rate, reply rate) antar template
- Tentukan "winner" secara manual atau otomatis

---

### MODUL 4 — CRM & Pipeline Lead

**Tujuan:** Memberikan visibilitas penuh terhadap status setiap lead dan memastikan tidak ada yang terlewat dalam proses konversi.

#### 5.4.1 Pipeline Kanban

Tampilan Kanban board dengan kolom default:
1. **New Lead** — Baru masuk, belum ada kontak dari agent
2. **Contacted** — Sudah dihubungi, menunggu respons
3. **Qualified** — Lead sudah memenuhi kriteria (budget, minat, waktu)
4. **Proposal Sent** — Sudah dikirim informasi lengkap / penawaran
5. **Closed Won** — Berhasil daftar / bayar
6. **Closed Lost** — Tidak jadi, dengan alasan

Fitur Kanban:
- Drag & drop kartu lead antar kolom
- Filter pipeline per agent, per program, per sumber
- Tampilkan jumlah lead dan total nilai per kolom
- Kolom bisa dikustomisasi (tambah/hapus/rename)

#### 5.4.2 Profil Kontak Lead

Setiap kontak memiliki halaman profil dengan:

**Informasi Dasar**
- Nama, foto profil (dari channel)
- Nomor WhatsApp / username IG / username FB
- Channel asal pertama kali kontak
- Tanggal pertama kontak

**Informasi Lead**
- Program yang diminati
- Status pipeline saat ini
- Agent yang handle
- Label/tag yang dimiliki
- Sumber lead (WA organik, IG Ads, FB Ads, referral, dll)

**History Aktivitas**
- Semua percakapan dari semua channel (chronological)
- Log perubahan status pipeline
- Log assignment ke agent
- Catatan internal yang pernah dibuat

**Catatan Internal (Notes)**
- Agent bisa tambah catatan internal yang tidak terlihat oleh lead
- Notes bisa berisi: hasil telepon, preferensi, info tambahan
- Notes disertai timestamp dan nama agent yang buat

#### 5.4.3 Segmentasi & Filter Kontak

- Filter berdasarkan: program, channel, status pipeline, label, agent, tanggal, sumber
- Simpan filter sebagai "Saved Segment" untuk digunakan ulang
- Bulk action: assign massal, add label massal, export massal

#### 5.4.4 Import Kontak

- Upload file CSV atau Excel
- Mapping kolom file ke field sistem (drag & drop mapping)
- Preview data sebelum import
- Validasi: deteksi duplikat berdasarkan nomor WA / email
- Report hasil import (berhasil, duplikat, gagal)

#### 5.4.5 Auto-Create Kontak

- Setiap pesan masuk pertama dari nomor/akun baru otomatis membuat kontak baru
- Data yang otomatis terisi: nama, channel, timestamp, status = New Lead
- Deduplication: jika nomor WA yang sama mengirim dari channel berbeda, digabung ke profil yang sama

---

### MODUL 5 — Template & Quick Reply

**Tujuan:** Mempercepat respons agent dengan template pesan yang bisa digunakan ulang.

#### 5.5.1 Perpustakaan Template

- Daftar semua template yang tersedia
- Kategori template: Sapaan, Info Program, Harga, Jadwal, Follow Up, Closing
- Search template berdasarkan nama atau isi
- Siapa yang bisa buat template: Admin ke atas (agent hanya bisa gunakan)
- Status template: Draft, Active, Archived

#### 5.5.2 Quick Reply Shortcut

- Saat mengetik di input chat, ketik `/` untuk memunculkan daftar template
- Ketik nama atau kata kunci setelah `/` untuk filter template
- Klik atau tekan Enter untuk pilih template
- Template otomatis ter-paste di input area, bisa diedit sebelum kirim

#### 5.5.3 Variabel Dinamis

Template bisa mengandung variabel yang otomatis diganti dengan data kontak:
- `{nama}` → Nama kontak
- `{program}` → Program yang diminati lead
- `{harga}` → Harga program
- `{agent_nama}` → Nama agent yang sedang handle
- `{tanggal}` → Tanggal hari ini

Jika variabel tidak ada datanya, sistem akan highlight agar agent mengisi manual sebelum kirim.

#### 5.5.4 Template Media (Nice to Have)

- Template bisa menyertakan gambar, file PDF, atau link
- Thumbnail preview gambar/file di perpustakaan template
- Validasi ukuran file sesuai batas WhatsApp API

---

### MODUL 6 — Laporan & Analitik

**Tujuan:** Memberikan visibilitas data kepada manajemen untuk pengambilan keputusan berbasis data.

#### 5.6.1 Dashboard Ringkasan

Tampilan overview dengan metric utama:
- Total lead masuk (hari ini / minggu ini / bulan ini)
- Conversion rate (Closed Won / Total Lead)
- Average response time (waktu rata-rata pertama kali dibalas)
- Total percakapan aktif saat ini
- Jumlah agent online saat ini
- % chat yang diselesaikan AI vs human

Semua metric bisa di-filter berdasarkan rentang waktu.

#### 5.6.2 Laporan Performa Agent

Per agent, tampilkan:
- Jumlah percakapan yang ditangani
- Average response time
- Jumlah percakapan yang di-resolve
- Conversion rate (lead yang di-handle berhasil closed won)
- Waktu online per hari

Bisa di-filter: per agent, per tim, per rentang waktu.

#### 5.6.3 Laporan Sumber Lead

- Breakdown jumlah lead per channel (WA vs IG vs FB)
- Breakdown per sumber (organik vs berbayar)
- Conversion rate per channel/sumber
- Grafik tren per bulan

#### 5.6.4 Tren Percakapan

- Grafik volume percakapan harian / mingguan / bulanan
- Heatmap: jam berapa paling banyak chat masuk
- Peak hours analysis

#### 5.6.5 Laporan Broadcast

- Daftar semua campaign yang pernah dibuat
- Per campaign: sent, delivered, read, replied, conversion
- Perbandingan performa antar campaign

#### 5.6.6 Export Laporan (Nice to Have)

- Export ke CSV untuk semua laporan
- Export ke PDF untuk laporan ringkasan bulanan
- Jadwalkan laporan otomatis dikirim via email per minggu/bulan

#### 5.6.7 Laporan AI vs Human (Nice to Have)

- % percakapan yang sepenuhnya ditangani AI
- % percakapan yang di-handoff ke human
- Topik terbanyak yang ditangani AI
- Pertanyaan yang paling sering tidak bisa dijawab AI (indikator knowledge base gap)

---

## 6. Rekomendasi Tech Stack

> **Catatan untuk Developer:** Stack ini dipilih berdasarkan pertimbangan: (1) skalabilitas untuk ribuan chat per hari, (2) ketersediaan developer di Indonesia, (3) ekosistem yang matang untuk integrasi real-time dan webhook, (4) kemudahan deployment dan maintenance.

### 6.1 Frontend

| Komponen | Teknologi | Alasan |
|---|---|---|
| Framework | **Vite + React + React Router** | Ringan, cepat, tanpa SSR overhead — cocok untuk dashboard internal |
| UI Components | **shadcn/ui + Tailwind CSS** | Fleksibel, tidak opinionated, mudah dikustomisasi, accessible |
| Icons | **itsHover + @lordicon/react** | itsHover primary (186 animated). Lordicon fallback (43,900+). Custom SVG hanya untuk brand icons |
| State Management | **Zustand** | Ringan (~1KB), cocok untuk UI state (inbox, filter, sidebar) |
| Server State | **TanStack Query (React Query)** | Caching, background refetch, optimistic updates untuk data server |
| Real-time Client | **Native WebSocket** | Koneksi WebSocket untuk notifikasi & pesan real-time |
| Form | **React Hook Form + Zod** | Performa form yang baik, validasi TypeScript-first |
| Charts | **Apache ECharts** | Performa tinggi, support heatmap, large dataset |
| Rich Text Editor | **Tiptap (Community)** | Untuk knowledge base editor, gratis |

### 6.2 Backend

| Komponen | Teknologi | Alasan |
|---|---|---|
| Runtime | **Bun** | 4x lebih cepat dari Node.js, hemat memory, TypeScript native |
| Framework | **Elysia** | 2.4M req/s, built-in WebSocket (µWebSocket), end-to-end type safety |
| WebSocket | **Bun native WebSocket** | Lebih cepat dari Socket.IO, native µWebSocket |
| Job Queue | **BullMQ + Redis (ioredis)** | Background jobs: broadcast, AI processing, notifikasi |
| ORM | **Drizzle ORM** | Zero overhead, raw SQL natural untuk pgvector queries |
| Validasi | **Zod** | Schema validation yang konsisten FE-BE |
| Auth | **Elysia JWT plugin** | Built-in JWT support, Stateless auth |
| Document Parser | **pdf-parse + mammoth** | Lightweight, zero-dependency PDF/DOCX extraction |

### 6.3 Database

| Komponen | Teknologi | Alasan |
|---|---|---|
| Primary Database | **PostgreSQL** | Relational, ACID compliant, JSON support |
| Cache & Queue | **Redis** | Session, rate limiting, BullMQ, pub/sub |
| Vector Database | **pgvector (PostgreSQL extension)** | Untuk semantic search knowledge base AI |
| File Storage | **MinIO (self-hosted) atau Cloudflare R2** | Simpan media attachment dari chat |

### 6.4 AI Integration

```
Vercel AI SDK (multi-provider support)
    ├── Google Gemini (primary — gratis tier)
    ├── OpenRouter (fallback — akses banyak model gratis)
    ├── OpenAI GPT-4o-mini (fallback alternatif)
    └── (mudah tambah provider baru via AI SDK)
```

Komponen AI:
- **Vercel AI SDK** — Multi-provider support, streaming built-in, TypeScript-first, React hooks
- **pgvector** — Simpan dan cari embedding knowledge base via Drizzle ORM
- **Fallback Chain** — Provider otomatis fallback jika provider utama gagal/down

**Embedding Strategy:**
- Model: Gemini text-embedding-004 (gratis, batch support)
- Dimension: 768
- Chunking: 500 tokens, 100 overlap, recursive text splitter

**Multi-Provider Fallback Strategy:**
```
Request AI Response
    │
    ▼
Coba Provider 1: Google Gemini Flash (gratis tier)
    ├── Berhasil → return response
    └── Gagal/Timeout → lanjut
    │
    ▼
Coba Provider 2: OpenRouter (model gratis: Llama 3.1, Mistral, Qwen)
    ├── Berhasil → return response
    └── Gagal/Timeout → lanjut
    │
    ▼
Coba Provider 3: OpenAI GPT-4o-mini (murah, reliable)
    ├── Berhasil → return response
    └── Gagal → return fallback message manual
```

**Kenapa Multi-Provider Strategy:**
- **Cost optimization** — Gemini Flash gratis tier paling murah
- **Reliability** — Jika satu provider down, tetap ada fallback
- **Flexibility** — Bisa ganti/gabung provider tanpa ubah core logic
- **Indonesia context** — Google services umumnya lebih stabil di Indonesia dibanding OpenAI

### 6.5 Infrastructure & DevOps

| Komponen | Teknologi | Alasan |
|---|---|---|
| Containerization | **Docker + Docker Compose (oven/bun image)** | Konsistensi environment dev-staging-prod |
| CI/CD | **GitHub Actions** | Gratis untuk repo private, mudah dikonfigurasi |
| Error Tracking | **Sentry** | Track error di FE dan BE secara real-time |

> **Catatan untuk Production:** Kubernetes (auto-scaling), Nginx (load balancer + SSL termination), Cloudflare (CDN + DDoS protection), Grafana + Prometheus (monitoring), dan Loki (centralized logging) akan ditambahkan saat masuk fase deployment production.

### 6.6 Development Setup (Bun + Elysia)

**Prerequisites:**
```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Verify installation
bun --version  # harus >= 1.1.x
```

**Project Structure:**
```
dbb-psc/
├── apps/
│   ├── web/                    # Frontend (Vite + React)
│   │   ├── src/
│   │   │   ├── components/     # shadcn/ui components
│   │   │   ├── pages/          # React Router pages
│   │   │   ├── stores/         # Zustand stores
│   │   │   ├── hooks/          # Custom hooks
│   │   │   └── lib/            # Utilities
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── server/                 # Backend (Elysia + Bun)
│       ├── src/
│       │   ├── routes/         # API routes (file-based)
│       │   ├── services/       # Business logic
│       │   ├── workers/        # BullMQ workers
│       │   ├── ai/             # AI provider layer
│       │   ├── channels/       # WhatsApp, IG, FB integrations
│       │   ├── middleware/      # Auth, rate limit, etc
│       │   └── lib/            # Utilities, DB client, Redis
│       ├── drizzle/            # Database migrations
│       ├── package.json
│       └── bunfig.toml
│
├── packages/
│   └── shared/                 # Shared types & utilities
│       └── src/
│           ├── types/          # Shared TypeScript types
│           └── constants/      # Shared constants
│
├── docker-compose.yml          # PostgreSQL, Redis, MinIO
├── package.json                # Monorepo root (bun workspaces)
└── bun.lockb                   # Bun lockfile
```

**Docker Compose (Development):**
```yaml
# docker-compose.yml
services:
  postgres:
    image: pgvector/pgvector:pg16
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: dbb_psc
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  minio:
    image: minio/minio
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    command: server /data --console-address ":9001"
    volumes:
      - minio_data:/data

volumes:
  postgres_data:
  redis_data:
  minio_data:
```

**Quick Start Commands:**
```bash
# Install semua dependencies
bun install

# Jalankan database migrations
bun run db:migrate

# Seed database
bun run db:seed

# Jalankan development server (backend)
bun run dev:server

# Jalankan development server (frontend)
bun run dev:web

# Jalankan semua sekaligus
bun run dev
```

---

## 7. Arsitektur Sistem

### 7.1 Overview Arsitektur

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  Browser (Vite + React)  ──────────────  Mobile Browser           │
└─────────────────────┬───────────────────────────────────────────┘
                      │ HTTPS / WSS
┌─────────────────────▼───────────────────────────────────────────┐
│                    APPLICATION SERVER                             │
│                                                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐      │
│  │  API Server │  │ WebSocket    │  │  Webhook          │      │
│  │  (Elysia)   │  │ Server       │  │  Handler          │      │
│  │             │  │ (µWebSocket) │  │  (WA/IG/FB)       │      │
│  └──────┬──────┘  └──────┬───────┘  └─────────┬─────────┘      │
│         │                │                     │                │
│  ┌──────▼──────┐  ┌──────▼───────┐  ┌─────────▼─────────┐     │
│  │  Message    │  │  AI Engine   │  │  Broadcast        │     │
│  │  Service    │  │  Service     │  │  Service          │     │
│  └──────┬──────┘  └──────┬───────┘  └─────────┬─────────┘     │
│         │                │                     │                │
│  ┌──────▼──────┐  ┌──────▼───────┐  ┌─────────▼─────────┐     │
│  │  Contact    │  │  Knowledge   │  │  Notification     │     │
│  │  Service    │  │  Base Service│  │  Service          │     │
│  └─────────────┘  └──────────────┘  └───────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
       │                │                     │
┌──────▼──────┐  ┌──────▼───────┐  ┌─────────▼─────────┐
│ PostgreSQL  │  │    Redis     │  │     MinIO /       │
│ (Primary)   │  │  (Cache +    │  │   Cloudflare R2   │
│ + pgvector  │  │   BullMQ +   │  │  (File Storage)   │
│             │  │   Pub/Sub)   │  │                   │
└─────────────┘  └──────────────┘  └───────────────────┘
```

> **Catatan:** Arsitektur ini dirancang untuk tahap awal pengembangan (single-server). CDN, load balancer, dan auto-scaling akan ditambahkan saat masuk fase production/deployment.

### 7.2 Design untuk Tahap Pengembangan (Single-Server)

> **Catatan:** Konfigurasi ini untuk tahap awal/development. Scaling & HA akan ditambahkan saat production.

**Database**
- PostgreSQL single instance dengan **pgvector extension**
- Backup harian otomatis
- Untuk production: upgrade ke Primary + Read Replicas dengan managed service (Supabase / AWS RDS)

**Application Server**
- Satu instance **Elysia (Bun)** yang menjalankan API server + WebSocket + Webhook handler
- Health check endpoint di `/health`
- Graceful shutdown: request yang sedang diproses selesai sebelum server mati

**WebSocket Server**
- Bun native WebSocket (µWebSocket) berjalan di server yang sama
- Room-based routing untuk per-agent (implementasi manual via Redis Pub/Sub)
- Reconnect otomatis dari client jika koneksi terputus

**Redis**
- Redis single instance untuk BullMQ, cache, dan session
- Persistent storage (AOF + RDB snapshot)
- Untuk production: upgrade ke Redis Sentinel atau Redis Cluster

**Webhook Handling**
- Webhook handler berjalan di server yang sama (route terpisah)
- Setiap webhook yang masuk langsung masuk ke **BullMQ queue** (tidak diproses inline)
- Worker berjalan di process yang sama dengan server
- Retry otomatis jika worker gagal (max 3x dengan exponential backoff)
- Dead letter queue untuk pesan yang gagal setelah max retry

### 7.3 Backend Code Architecture (Feature-Based)

```
apps/server/src/
├── modules/                  ← Feature-based grouping
│   ├── auth/                 → login, register, JWT, refresh token, middleware
│   ├── contacts/             → CRUD kontak, search, tags
│   ├── conversations/        → inbox, assignment, status, WebSocket events
│   ├── channels/             → WA/IG/FB webhook + channel integration
│   ├── messages/             → send, receive, templates, media handling
│   ├── knowledge-base/       → upload, search, document processing
│   ├── pipeline/             → kanban, stages, lead scoring
│   ├── broadcast/            → campaign, scheduling, bulk send
│   ├── analytics/            → dashboard stats, charts, reports
│   ├── notifications/        → in-app notifications, real-time alerts
│   ├── users/                → agent management, roles, online status
│   ├── reports/              → reports + CSV/PDF exports
│   ├── search/               → global search (contacts, conversations, KB)
│   └── settings/             → AI config, channel management, billing
├── workers/                  ← BullMQ workers (async processing)
│   ├── message-worker.ts     → process incoming webhooks
│   ├── ai-worker.ts          → AI response generation + handoff
│   ├── document-worker.ts    → document extraction + embedding
│   └── broadcast-worker.ts   → bulk message sending
├── lib/                      ← Shared utilities (cross-module)
│   ├── db.ts                 → Drizzle ORM connection + schema
│   ├── redis.ts              → Redis connection (BullMQ, pub/sub, cache)
│   ├── auth.ts               → JWT verify, role check, middleware
│   ├── ai.ts                 → Vercel AI SDK + fallback chain
│   ├── storage.ts            → MinIO/R2 file upload/download
│   └── webhook.ts            → Webhook signature validation (Meta X-Hub-Signature-256)
├── routes/                   ← Route composition (thin — just wiring)
│   └── index.ts              → Mount all module routes
└── index.ts                  → Server entry point
```

**Module structure (setiap feature module):**
```
modules/contacts/
├── routes.ts       → Elysia route definitions (thin, validation only)
├── handlers.ts     → Request handlers (validate → call service → respond)
├── services.ts     → Business logic (pure, no framework dependency)
├── queries.ts      → Database queries (Drizzle ORM)
└── types.ts        → Request/response schemas (Zod)
```

**Rules:**
- Route layer THIN — hanya compose handlers, tidak ada business logic
- Service layer berisi business logic — pure functions, no framework coupling
- Query layer berisi database access — Drizzle ORM, SELECT specific columns
- Shared concerns di `lib/` — tidak boleh duplikasi antar modules
- Workers terpisah dari modules — async processing concern, bukan feature

### 7.4 Alur Real-Time Messaging

```
Webhook masuk (WA/IG/FB)
        │
        ▼
Webhook Handler (validasi signature)
        │
        ▼
Push ke BullMQ Queue (Redis)
        │
        ▼
Message Worker (async processing)
    ├── Simpan pesan ke PostgreSQL
    ├── Update last_message di conversation
    ├── Trigger AI jika tidak ada agent
    └── Publish event ke Redis Pub/Sub
        │
        ▼
Elysia WebSocket Server (subscribe Redis Pub/Sub)
        │
        ▼
Broadcast event ke semua connected clients
        │
        ▼
Push ke browser agent yang sedang online
        │
        ▼
UI update real-time tanpa reload
```

### 7.4 AI Processing Flow

```
Pesan masuk + kondisi AI aktif
        │
        ▼
Push ke AI Queue (BullMQ)
        │
        ▼
AI Worker
    ├── Ambil history percakapan (last 10 messages untuk konteks)
    ├── Ambil profil kontak (program minat, status, dll)
    ├── Semantic search ke knowledge base (pgvector)
    │       └── Embedding query → cari dokumen relevan
    ├── Bangun prompt: system prompt + konteks + history + knowledge
    ├── Call AI Provider API (Gemini / OpenRouter / GPT-4o-mini)
    ├── Parse respons AI
    ├── Cek sinyal handoff (keyword matching + AI classification)
    │       ├── Handoff terdeteksi → trigger handoff flow
    │       └── Tidak → kirim balasan ke channel
    └── Simpan pesan AI ke database
```

### Document Worker Flow

```
Upload Dokumen ke Knowledge Base
    │
    ▼
Validasi file (type, size)
    ├── Invalid → return error
    └── Valid → upload ke MinIO/R2
    │
    ▼
Queue ke BullMQ → Document Processing Worker
    │
    ▼
Document Worker
    ├── Download file dari storage
    ├── Extract text (pdf-parse untuk PDF, mammoth untuk DOCX, plain untuk TXT/CSV)
    ├── Chunk text (500 tokens, 100 overlap)
    ├── Generate embeddings (Gemini text-embedding-004, batch)
    ├── Simpan chunks ke kb_documents (embedding vector)
    ├── Update status: completed
    └── Error → retry 3x, lalu status: failed
```

---

## 8. Skema Database

> **Catatan:** Ini adalah skema konseptual utama. Detail kolom lengkap (index, constraint) harus didefinisikan dalam file migration Drizzle ORM.

### Tabel Utama

```sql
-- Users (Agent, Admin, dll)
users
  id, email, password_hash, full_name, role,
  status (online/busy/offline), avatar_url,
  created_at, updated_at

-- Channels (WA, IG, FB account yang terhubung)
channels
  id, name, type (whatsapp/instagram/facebook/telegram/livechat),
  credentials (encrypted JSON), is_active,
  created_at, updated_at

-- Contacts (Lead / Calon Peserta)
contacts
  id, full_name, avatar_url, phone_number,
  email, notes, pipeline_status,
  source (channel asal), source_channel_id,
  assigned_agent_id, created_at, updated_at

-- Contact Channel Identifiers (satu kontak bisa punya banyak channel)
contact_channels
  id, contact_id, channel_type, channel_identifier,
  is_primary, created_at

-- Conversations (satu thread percakapan)
conversations
  id, contact_id, channel_id, agent_id,
  ai_assistant_id (opsional — siapa yang handle saat AI aktif),
  status (open/pending/resolved/snoozed),
  is_ai_handling (boolean),
  last_message_at, created_at, updated_at

-- Messages
messages
  id, conversation_id, direction (inbound/outbound),
  sender_type (contact/agent/ai/system),
  sender_id, content_type (text/image/video/audio/file/location),
  content (JSONB), status (sent/delivered/read/failed),
  external_message_id, created_at

-- Labels
labels
  id, name, color, created_by, created_at

-- Conversation Labels (many-to-many)
conversation_labels
  conversation_id, label_id, created_at

-- AI Assistants (konfigurasi per agent)
ai_assistants
  id, name, description, avatar_url, status (active/inactive),
  persona_name, persona_tone (formal/semi-formal/santai),
  persona_language, system_prompt (text),
  handoff_keywords (JSONB array), handoff_max_ai_messages (int),
  handoff_priority_notification (boolean),
  working_hours (JSONB — per-day config),
  ooo_message (text),
  created_by, created_at, updated_at

-- Agent–AI Assignment (satu agent = satu AI Assistant)
agent_ai_assignments
  id, user_id (FK → users), ai_assistant_id (FK → ai_assistants),
  assigned_by, assigned_at,
  UNIQUE(user_id) — satu agent hanya bisa punya satu AI Assistant

-- AI Knowledge Base Documents (extends kb_documents)
-- Level 1: Global — ai_assistant_id = NULL
-- Level 2: Per-AI Assistant — ai_assistant_id = id AI Assistant
kb_documents
  id, title, category, content (text),
  embedding (vector), is_active,
  ai_assistant_id (opsional — NULL = global),
  original_file_url, file_type,
  chunk_index, source_document_id,
  processing_status (pending/processing/completed/failed),
  created_by, created_at, updated_at

-- Broadcast Campaigns
campaigns
  id, name, status (draft/scheduled/running/completed/cancelled),
  channel_id, template_id, scheduled_at,
  total_recipients, sent_count, delivered_count,
  read_count, replied_count, created_by, created_at

-- Message Templates
templates
  id, name, category, content (JSONB with variables),
  media_url, is_active, created_by, created_at

-- Pipeline Columns (kustom)
pipeline_columns
  id, name, order_index, color, created_at
```

> **Catatan:** Tabel `ai_assistants` dan `agent_ai_assignments` adalah tambahan baru untuk mendukung multiple AI Assistants. Kolom `ai_assistant_id` di `conversations` dan `kb_documents` juga baru.

---

## 9. Integrasi Eksternal

### 9.1 Meta (WhatsApp, Instagram, Facebook)

**Setup yang Diperlukan:**
- Meta Business Account
- Verifikasi bisnis di Meta
- Akses Meta for Developers
- Untuk WhatsApp: nomor telepon yang dedicated (bukan nomor personal)

**Alur Webhook:**
1. Daftarkan webhook URL di Meta App Dashboard
2. Verifikasi webhook dengan challenge-response
3. Subscribe ke events yang diperlukan
4. Validasi setiap webhook dengan `X-Hub-Signature-256` header

**Batasan yang Perlu Diperhatikan:**
- WhatsApp: hanya bisa mengirim pesan template di luar 24 jam window; dalam window bisa kirim pesan bebas
- Instagram: tidak bisa inisiasi percakapan baru (hanya bisa balas pesan/story mention masuk)
- Facebook: rate limit per user per periode waktu

### 9.2 AI Provider (Multi-Provider Fallback)

Menggunakan **Vercel AI SDK** dengan multi-provider fallback. Setiap provider terintegrasi langsung tanpa custom abstraction layer.

```typescript
// Contoh konfigurasi fallback chain
const AI_FALLBACK_CHAIN = [
  { provider: 'google', model: 'gemini-1.5-flash' },       // Primary — gratis
  { provider: 'openrouter', model: 'meta-llama/llama-3.1' }, // Fallback 1 — gratis
  { provider: 'openai', model: 'gpt-4o-mini' },             // Fallback 2 — murah
];
```

**Flow Multi-Provider:**
```typescript
async function generateWithFallback(params: AIGenerateParams): Promise<string> {
  for (const provider of AI_FALLBACK_CHAIN) {
    try {
      return await aiGenerate({
        provider: provider.provider,
        model: provider.model,
        ...params,
      });
    } catch (error) {
      console.warn(`Provider ${provider.provider} failed, trying next...`);
      continue;
    }
  }
  // Semua provider gagal — return manual fallback message
  return "Maaf, saat ini sistem sedang sibuk. Tim kami akan segera menghubungi Anda.";
}
```

**Setup yang Diperlukan:**
- Google AI Studio API Key (gratis) — primary provider
- OpenRouter API Key (gratis) — aggregator multi-model
- OpenAI API Key (opsional) — fallback alternatif

Ganti provider atau tambah provider baru cukup ubah `AI_FALLBACK_CHAIN` di config.

### 9.3 File Storage

- Semua media attachment (gambar, video, dokumen) dari chat disimpan ke object storage
- URL file yang dikirim ke WhatsApp API harus publicly accessible
- Durasi URL: gunakan pre-signed URL jika menggunakan MinIO
- Cloudflare R2 direkomendasikan untuk biaya lebih hemat daripada AWS S3
- **Knowledge Base Files:**
  - Knowledge base files disimpan terpisah dari chat media
  - Naming convention: `kb/{doc-id}/{original-filename}`
  - Max file size: 10MB
  - Supported: PDF, DOCX, TXT, CSV

---

## 10. Non-Functional Requirements

### 10.1 Performa

| Metric | Target |
|---|---|
| API Response Time (P95) | < 300ms |
| Pesan masuk → tampil di UI | < 2 detik |
| AI Response Time | < 10 detik |
| Dashboard load time | < 2 detik |
| Broadcast 10.000 pesan | < 30 menit |

### 10.2 Skalabilitas

- Mampu handle **10.000 pesan masuk per hari**
- Mampu support **200 agent concurrent** tanpa degradasi
- Database query optimized dengan indexing yang tepat
- Connection pooling untuk database (PgBouncer)

### 10.3 Keamanan

- Semua komunikasi via HTTPS/WSS
- JWT dengan expiry pendek (15 menit) + Refresh Token (7 hari)
- Rate limiting di semua endpoint public
- Validasi signature pada semua webhook Meta
- Enkripsi credentials channel di database (AES-256)
- Row-level security: agent hanya bisa akses data yang di-authorize
- Audit log untuk semua aksi sensitif (hapus kontak, export data, dll)
- OWASP Top 10 compliance

### 10.4 Ketersediaan

- Target uptime: **99.5%** (downtime maksimum ~43 jam/tahun)
- Maintenance window: Minggu dini hari 01.00–04.00 WIB
- Automated health check setiap 30 detik
- Alert otomatis ke tim dev jika service down > 1 menit
- Disaster recovery: RTO (Recovery Time Objective) < 1 jam, RPO < 24 jam

### 10.5 Observability

**MVP (Saat Ini):**
- **Error Tracking:** Sentry — track error di FE dan BE secara real-time
- **Logging:** Structured JSON logs ke console, file rotation via Docker
- **Health Check:** Endpoint `/health` untuk monitoring dasar
- **Basic Metrics:** Request count, error rate via simple counter di application level

**Production (Nanti):**
- **Metrics:** CPU, memory, request rate, error rate, queue depth (Prometheus + Grafana)
- **Logging:** Centralized logging (Loki + Grafana)
- **Tracing:** Request tracing untuk debugging performance (OpenTelemetry)
- **Alerting:** PagerDuty / Telegram bot untuk alert critical

---

## 11. Fase Pengembangan & Prioritas

### Fase 1 — Foundation (Bulan 1–3)

**Target: MVP yang bisa digunakan tim sales untuk operasional harian**

Minggu 1–2: Setup & Infrastruktur
- Setup repository (monorepo atau multi-repo)
- Setup Docker, CI/CD pipeline
- Setup database dan schema awal
- Setup environment (dev, staging, production)

Minggu 3–6: Modul 1 — Omnichannel Inbox
- Integrasi WhatsApp Business API
- Integrasi Instagram Messaging API
- Integrasi Facebook Messenger API
- Dashboard inbox dasar
- Assignment percakapan ke agent
- Notifikasi real-time

Minggu 7–10: Modul 2 — AI Assistant Engine
- Manajemen AI Assistant (CRUD, assignment ke agent)
- Knowledge base management (global + per-AI Assistant)
- Integrasi AI provider (mulai dengan Gemini Flash)
- Logika aktivasi/deaktivasi AI Assistant
- Handoff ke human agent
- Pengaturan jam kerja per AI Assistant

Minggu 11–12: Modul 4 — CRM Dasar
- Auto-create kontak
- Profil kontak dasar
- Pipeline Kanban sederhana
- Import kontak CSV

### Fase 2 — Enhancement (Bulan 4–6)

**Target: Tools yang mempercepat produktivitas tim dan visibilitas manajemen**

Bulan 4:
- Modul 3 — Broadcast & Campaign (fitur wajib)
- Template pesan WhatsApp

Bulan 5:
- Modul 5 — Template & Quick Reply
- Modul 4 enhancement — Segmentasi, notes, filter lanjutan

Bulan 6:
- Modul 6 — Laporan & Analitik
- Export laporan
- Dashboard performa agent dan AI

### Fase 3 — Nice to Have (Bulan 7+)

- Live chat widget website
- Integrasi Telegram
- Sequence / drip message
- A/B testing template
- AI lead qualification (proaktif menggali data lead)
- Training AI dari flagged conversations
- Integrasi LMS perusahaan

---

## 12. Glossary

| Term | Definisi |
|---|---|
| **Agent** | Manusia — anggota tim sales atau marketing yang menggunakan platform |
| **AI Assistant** | Bot AI yang dikustomisasi dan di-assign ke agent tertentu. Berfungsi sebagai "penjaga" saat agent offline. |
| **Lead** | Calon peserta didik / calon klien perusahaan |
| **Handoff** | Proses serah terima percakapan dari AI Assistant ke human agent |
| **Knowledge Base** | Kumpulan dokumen dan FAQ yang digunakan AI Assistant untuk menjawab pertanyaan |
| **Channel** | Platform komunikasi yang terhubung (WA, IG, FB, dll) |
| **Conversation** | Satu thread percakapan antara satu kontak dengan platform |
| **Message** | Satu pesan dalam sebuah conversation |
| **Pipeline** | Alur status lead dari pertama masuk hingga konversi |
| **Broadcast** | Pengiriman pesan massal ke banyak kontak sekaligus |
| **Template** | Pesan yang sudah dibuat sebelumnya dan bisa digunakan ulang |
| **Quick Reply** | Shortcut untuk memilih template langsung dari input chat |
| **RAG** | Retrieval Augmented Generation — teknik AI yang menggabungkan pencarian dokumen dengan generasi teks |
| **Webhook** | HTTP callback yang dikirim oleh Meta/platform lain saat ada event baru (pesan masuk, dll) |
| **BSP** | Business Solution Provider — pihak ketiga yang menyediakan akses WhatsApp Business API |
| **Round-robin** | Metode distribusi percakapan ke agent secara bergiliran |
| **Dead Letter Queue** | Antrian untuk pesan yang gagal diproses setelah maksimum percobaan ulang |

---

*Dokumen ini dibuat untuk internal perusahaan. Versi: 1.3. Terakhir diperbarui: Juni 2026.*
