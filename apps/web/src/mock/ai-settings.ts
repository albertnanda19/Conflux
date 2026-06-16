export interface AIProvider {
  id: string
  name: string
  model: string
  apiKey: string
  status: 'active' | 'fallback' | 'disabled' | 'error'
  priority: number
  maxTokens: number
  temperature: number
  description: string
}

export interface KBDocument {
  id: string
  title: string
  category: string
  fileType: 'pdf' | 'docx' | 'txt' | 'csv' | 'xlsx'
  fileSize: string
  chunkCount: number
  processingStatus: 'pending' | 'processing' | 'completed' | 'failed'
  isActive: boolean
  createdBy: string
  createdAt: string
}

export interface WorkingHoursDay {
  day: string
  dayLabel: string
  enabled: boolean
  start: string
  end: string
}

export interface WorkingHoursConfig {
  timezone: string
  days: WorkingHoursDay[]
  oooMessage: string
}

export interface ConversionSignal {
  id: string
  type: string
  description: string
  enabled: boolean
}

export interface HandoffConfig {
  triggerKeywords: string[]
  conversionSignals: ConversionSignal[]
  handoffMessage: string
  maxAiMessages: number
  priorityNotification: boolean
}

export interface PersonaConfig {
  name: string
  language: string
  tone: 'formal' | 'semi-formal' | 'casual'
  systemPrompt: string
}

const now = new Date()
const daysAgo = (d: number) => new Date(now.getTime() - d * 86_400_000).toISOString()
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3_600_000).toISOString()

export const MOCK_AI_PROVIDERS: AIProvider[] = [
  {
    id: 'prov-1',
    name: 'Google Gemini',
    model: 'gemini-1.5-flash',
    apiKey: 'AIzaSy...xK9m',
    status: 'active',
    priority: 1,
    maxTokens: 2048,
    temperature: 0.7,
    description: 'Primary — Gratis tier, latency rendah',
  },
  {
    id: 'prov-2',
    name: 'OpenRouter',
    model: 'meta-llama/llama-3.1',
    apiKey: 'sk-or-...8f3a',
    status: 'fallback',
    priority: 2,
    maxTokens: 4096,
    temperature: 0.7,
    description: 'Fallback 1 — Aggregator, banyak model gratis',
  },
  {
    id: 'prov-3',
    name: 'OpenAI',
    model: 'gpt-4o-mini',
    apiKey: 'sk-proj-...9d2e',
    status: 'disabled',
    priority: 3,
    maxTokens: 2048,
    temperature: 0.7,
    description: 'Fallback 2 — Murah, reliable, last resort',
  },
]

export const MOCK_KB_DOCUMENTS: KBDocument[] = [
  {
    id: 'kb-1',
    title: 'FAQ Program Data Science',
    category: 'Program',
    fileType: 'pdf',
    fileSize: '2.4 MB',
    chunkCount: 18,
    processingStatus: 'completed',
    isActive: true,
    createdBy: 'Admin User',
    createdAt: daysAgo(30),
  },
  {
    id: 'kb-2',
    title: 'Daftar Harga & Promo 2026',
    category: 'Harga',
    fileType: 'xlsx',
    fileSize: '156 KB',
    chunkCount: 6,
    processingStatus: 'completed',
    isActive: true,
    createdBy: 'Admin User',
    createdAt: daysAgo(25),
  },
  {
    id: 'kb-3',
    title: 'Jadwal Batch Juli–Desember 2026',
    category: 'Jadwal',
    fileType: 'pdf',
    fileSize: '890 KB',
    chunkCount: 4,
    processingStatus: 'completed',
    isActive: true,
    createdBy: 'Sari Dewi',
    createdAt: daysAgo(20),
  },
  {
    id: 'kb-4',
    title: 'Syarat & Ketentuan Pendaftaran',
    category: 'Syarat',
    fileType: 'docx',
    fileSize: '1.1 MB',
    chunkCount: 12,
    processingStatus: 'completed',
    isActive: true,
    createdBy: 'Admin User',
    createdAt: daysAgo(18),
  },
  {
    id: 'kb-5',
    title: 'Cara Pembayaran & Transfer',
    category: 'Harga',
    fileType: 'pdf',
    fileSize: '540 KB',
    chunkCount: 5,
    processingStatus: 'completed',
    isActive: true,
    createdBy: 'Rizki Pratama',
    createdAt: daysAgo(14),
  },
  {
    id: 'kb-6',
    title: 'Testimoni Alumni 2025',
    category: 'Program',
    fileType: 'pdf',
    fileSize: '3.8 MB',
    chunkCount: 24,
    processingStatus: 'processing',
    isActive: false,
    createdBy: 'Admin User',
    createdAt: daysAgo(2),
  },
  {
    id: 'kb-7',
    title: 'Panduan Career Service',
    category: 'Syarat',
    fileType: 'docx',
    fileSize: '2.1 MB',
    chunkCount: 0,
    processingStatus: 'failed',
    isActive: false,
    createdBy: 'Nina Kusuma',
    createdAt: daysAgo(1),
  },
  {
    id: 'kb-8',
    title: 'FAQ Teknis & Troubleshooting',
    category: 'FAQ',
    fileType: 'txt',
    fileSize: '68 KB',
    chunkCount: 8,
    processingStatus: 'completed',
    isActive: true,
    createdBy: 'Admin User',
    createdAt: hoursAgo(6),
  },
]

export const KB_CATEGORIES = ['Semua', 'Program', 'Harga', 'Jadwal', 'Syarat', 'FAQ'] as const

export const MOCK_WORKING_HOURS: WorkingHoursConfig = {
  timezone: 'Asia/Jakarta (WIB, UTC+7)',
  days: [
    { day: 'monday', dayLabel: 'Senin', enabled: true, start: '08:00', end: '17:00' },
    { day: 'tuesday', dayLabel: 'Selasa', enabled: true, start: '08:00', end: '17:00' },
    { day: 'wednesday', dayLabel: 'Rabu', enabled: true, start: '08:00', end: '17:00' },
    { day: 'thursday', dayLabel: 'Kamis', enabled: true, start: '08:00', end: '17:00' },
    { day: 'friday', dayLabel: 'Jumat', enabled: true, start: '08:00', end: '17:00' },
    { day: 'saturday', dayLabel: 'Sabtu', enabled: true, start: '09:00', end: '14:00' },
    { day: 'sunday', dayLabel: 'Minggu', enabled: false, start: '09:00', end: '14:00' },
  ],
  oooMessage:
    'Halo! Terima kasih telah menghubungi kami. Kami sedang tidak beroperasi. Jam kerja kami: Senin–Jumat 08.00–17.00 WIB, Sabtu 09.00–14.00 WIB. Tim kami akan segera membalas pesan Anda saat kembali online. 😊',
}

export const MOCK_CONVERSION_SIGNALS: ConversionSignal[] = [
  { id: 'cs-1', type: 'keyword', description: 'Kata kunci konversi: "daftar", "bayar", "beli"', enabled: true },
  { id: 'cs-2', type: 'keyword', description: 'Sebut budget atau minta nomor rekening', enabled: true },
  { id: 'cs-3', type: 'keyword', description: 'Minta jadwal demo / konsultasi', enabled: true },
  { id: 'cs-4', type: 'sentiment', description: 'Sentimen positif kuat + pertanyaan enrollment', enabled: false },
  { id: 'cs-5', type: 'behavior', description: 'User mengklik link pembayaran', enabled: true },
]

export const MOCK_HANDOFF_CONFIG: HandoffConfig = {
  triggerKeywords: [
    'daftar',
    'bayar',
    'mau beli',
    'berapa cara daftar',
    'transfer ke mana',
    'nomor rekening',
    'jadwal demo',
    'konsultasi',
    'harga berapa',
    'mulai kapan',
  ],
  conversionSignals: MOCK_CONVERSION_SIGNALS,
  handoffMessage:
    'Terima kasih atas ketertarikan Anda! Saya akan menghubungkan Anda dengan tim kami sebentar lagi untuk membantu proses pendaftaran. Mohon tunggu sebentar ya 😊',
  maxAiMessages: 10,
  priorityNotification: true,
}

export const MOCK_PERSONA: PersonaConfig = {
  name: 'Asisten PSC',
  language: 'Bahasa Indonesia',
  tone: 'semi-formal',
  systemPrompt:
    'Anda adalah asisten virtual dari Acme Learning. Tugas Anda adalah membantu calon peserta yang menanyakan informasi seputar program pelatihan. Jawab berdasarkan knowledge base yang tersedia. Gunakan bahasa Indonesia yang ramah dan profesional. Jika pertanyaan di luar pengetahuan Anda, sarankan untuk berbicara dengan tim kami.',
}
