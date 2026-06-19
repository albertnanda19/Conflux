export type AIAssistantStatus = 'active' | 'draft' | 'paused'

export interface PersonaConfig {
  name: string
  language: string
  tone: 'formal' | 'semi-formal' | 'casual'
  systemPrompt: string
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

export interface AIAssistant {
  id: string
  name: string
  description: string
  avatar: string
  status: AIAssistantStatus
  persona: PersonaConfig
  workingHours: WorkingHoursConfig
  handoffConfig: HandoffConfig
  knowledgeBaseScope: 'global' | 'custom'
  customKBDocumentIds: string[]
  assignedAgentId: string | null
  isDefault: boolean
  createdAt: string
  updatedAt: string
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
  aiAssistantId?: string | null
}

export interface AIProvider {
  id: string
  name: string
  model: string
  status: 'active' | 'fallback' | 'disabled' | 'error'
  priority: number
  maxTokens: number
  temperature: number
  isEnabled: boolean
  hasKey: boolean
}

export const KB_CATEGORIES = ['Semua', 'Program', 'Harga', 'Jadwal', 'Syarat', 'FAQ'] as const

export const DEFAULT_WORKING_HOURS: WorkingHoursConfig = {
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
    'Terima kasih telah menghubungi kami. Tim kami sedang di luar jam kerja dan akan membalas pesan Anda secepatnya.',
}

export const DEFAULT_CONVERSION_SIGNALS: ConversionSignal[] = [
  { id: 'cs-1', type: 'keyword', description: 'Kata kunci konversi: "daftar", "bayar", "beli"', enabled: true },
  { id: 'cs-2', type: 'keyword', description: 'Sebut budget atau minta nomor rekening', enabled: true },
  { id: 'cs-3', type: 'keyword', description: 'Minta jadwal demo / konsultasi', enabled: true },
  { id: 'cs-4', type: 'sentiment', description: 'Sentimen positif kuat + pertanyaan enrollment', enabled: false },
  { id: 'cs-5', type: 'behavior', description: 'User mengklik link pembayaran', enabled: true },
]

export const DEFAULT_HANDOFF_CONFIG: HandoffConfig = {
  triggerKeywords: ['daftar', 'bayar', 'mau beli', 'transfer ke mana', 'nomor rekening', 'jadwal demo', 'konsultasi'],
  conversionSignals: DEFAULT_CONVERSION_SIGNALS,
  handoffMessage:
    'Terima kasih atas ketertarikan Anda! Saya akan menghubungkan Anda dengan tim kami sebentar lagi untuk membantu proses pendaftaran.',
  maxAiMessages: 10,
  priorityNotification: true,
}

export const DEFAULT_PERSONA: PersonaConfig = {
  name: 'Asisten',
  language: 'Bahasa Indonesia',
  tone: 'semi-formal',
  systemPrompt: 'Anda adalah asisten virtual yang membantu calon pelanggan dengan ramah dan informatif.',
}
