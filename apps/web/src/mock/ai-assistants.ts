import type { WorkingHoursConfig, HandoffConfig, PersonaConfig } from './ai-settings'
import { MOCK_WORKING_HOURS, MOCK_HANDOFF_CONFIG, MOCK_PERSONA } from './ai-settings'

export type AIAssistantStatus = 'active' | 'draft' | 'paused'

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
  createdAt: string
  updatedAt: string
}

const now = new Date()
const daysAgo = (d: number) => new Date(now.getTime() - d * 86_400_000).toISOString()

let nextId = 5
let localAssistants: AIAssistant[] = [
  {
    id: 'ai-1',
    name: 'Sari Bot',
    description: 'AI Assistant untuk tim Sales, fokus menjawab pertanyaan program dan membantu proses pendaftaran.',
    avatar: '🤖',
    status: 'active',
    persona: {
      name: 'Sari',
      language: 'Bahasa Indonesia',
      tone: 'semi-formal',
      systemPrompt:
        'Anda adalah Sari, asisten virtual dari Acme Learning. Tugas Anda adalah membantu calon peserta yang menanyakan informasi seputar program pelatihan. Jawab berdasarkan knowledge base yang tersedia. Gunakan bahasa Indonesia yang ramah dan profesional. Jika pertanyaan di luar pengetahuan Anda, sarankan untuk berbicara dengan tim kami.',
    },
    workingHours: {
      ...MOCK_WORKING_HOURS,
      days: MOCK_WORKING_HOURS.days.map((d) => ({ ...d })),
    },
    handoffConfig: {
      ...MOCK_HANDOFF_CONFIG,
      triggerKeywords: [...MOCK_HANDOFF_CONFIG.triggerKeywords],
      conversionSignals: MOCK_HANDOFF_CONFIG.conversionSignals.map((s) => ({ ...s })),
    },
    knowledgeBaseScope: 'global',
    customKBDocumentIds: [],
    assignedAgentId: 'a1',
    createdAt: daysAgo(60),
    updatedAt: daysAgo(5),
  },
  {
    id: 'ai-2',
    name: 'Support Bot',
    description: 'AI Assistant untuk tim Support, fokus menangani keluhan dan troubleshooting teknis.',
    avatar: '🛠️',
    status: 'active',
    persona: {
      name: 'Support Bot',
      language: 'Bahasa Indonesia',
      tone: 'formal',
      systemPrompt:
        'Anda adalah Support Bot dari Acme Learning. Tugas Anda adalah membantu menangani keluhan dan pertanyaan teknis dari peserta. Berikan solusi yang jelas dan terstruktur. Jika masalah tidak dapat diselesaikan oleh AI, segera lakukan handoff ke agent manusia.',
    },
    workingHours: {
      ...MOCK_WORKING_HOURS,
      days: MOCK_WORKING_HOURS.days.map((d) => ({ ...d })),
      oooMessage:
        'Terima kasih telah menghubungi tim support Acme Learning. Kami sedang di luar jam kerja. Tim kami akan segera merespons pesan Anda pada hari kerja berikutnya.',
    },
    handoffConfig: {
      ...MOCK_HANDOFF_CONFIG,
      triggerKeywords: [...MOCK_HANDOFF_CONFIG.triggerKeywords, 'tidak bisa', 'error', 'bug', 'masalah'],
      conversionSignals: MOCK_HANDOFF_CONFIG.conversionSignals.map((s) => ({ ...s })),
      maxAiMessages: 5,
      priorityNotification: true,
    },
    knowledgeBaseScope: 'custom',
    customKBDocumentIds: ['kb-7', 'kb-8'],
    assignedAgentId: 'a3',
    createdAt: daysAgo(45),
    updatedAt: daysAgo(3),
  },
  {
    id: 'ai-3',
    name: 'Marketing Bot',
    description: 'AI Assistant untuk tim Marketing, fokus promosi dan informasi event.',
    avatar: '📣',
    status: 'draft',
    persona: {
      name: 'Marketing Bot',
      language: 'Bahasa Indonesia',
      tone: 'casual',
      systemPrompt:
        'Anda adalah Marketing Bot dari Acme Learning. Tugas Anda adalah memberikan informasi promosi, event, dan program terbaru. Gunakan bahasa yang santai dan friendly. Tunjukkan antusiasme dalam menjelaskan program-program yang tersedia.',
    },
    workingHours: {
      ...MOCK_WORKING_HOURS,
      days: MOCK_WORKING_HOURS.days.map((d) => ({ ...d })),
    },
    handoffConfig: {
      ...MOCK_HANDOFF_CONFIG,
      triggerKeywords: [...MOCK_HANDOFF_CONFIG.triggerKeywords],
      conversionSignals: MOCK_HANDOFF_CONFIG.conversionSignals.map((s) => ({ ...s })),
      handoffMessage:
        'Wah, sepertinya kamu tertarik untuk daftar! Saya akan hubungkan kamu dengan tim marketing kami ya untuk info lebih lanjut 😊',
    },
    knowledgeBaseScope: 'global',
    customKBDocumentIds: [],
    assignedAgentId: null,
    createdAt: daysAgo(10),
    updatedAt: daysAgo(1),
  },
  {
    id: 'ai-4',
    name: 'System Default',
    description: 'AI Assistant default yang digunakan sebagai fallback ketika agent belum memiliki AI Assistant yang di-assign.',
    avatar: '⚡',
    status: 'active',
    persona: { ...MOCK_PERSONA },
    workingHours: {
      ...MOCK_WORKING_HOURS,
      days: MOCK_WORKING_HOURS.days.map((d) => ({ ...d })),
    },
    handoffConfig: {
      ...MOCK_HANDOFF_CONFIG,
      triggerKeywords: [...MOCK_HANDOFF_CONFIG.triggerKeywords],
      conversionSignals: MOCK_HANDOFF_CONFIG.conversionSignals.map((s) => ({ ...s })),
    },
    knowledgeBaseScope: 'global',
    customKBDocumentIds: [],
    assignedAgentId: null,
    createdAt: daysAgo(90),
    updatedAt: daysAgo(2),
  },
]

export function getAIAssistants(): AIAssistant[] {
  return [...localAssistants]
}

export function getAIAssistantById(id: string): AIAssistant | undefined {
  return localAssistants.find((a) => a.id === id)
}

export function createAIAssistant(
  data: Omit<AIAssistant, 'id' | 'createdAt' | 'updatedAt'>,
): AIAssistant {
  const assistant: AIAssistant = {
    ...data,
    id: `ai-${nextId++}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  localAssistants.push(assistant)
  return assistant
}

export function updateAIAssistant(
  id: string,
  data: Partial<Omit<AIAssistant, 'id' | 'createdAt'>>,
): AIAssistant | undefined {
  const idx = localAssistants.findIndex((a) => a.id === id)
  if (idx === -1) return undefined
  localAssistants[idx] = {
    ...localAssistants[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  }
  return localAssistants[idx]
}

export function deleteAIAssistant(id: string): boolean {
  const idx = localAssistants.findIndex((a) => a.id === id)
  if (idx === -1) return false
  localAssistants.splice(idx, 1)
  return true
}

export function toggleAIAssistantStatus(id: string): AIAssistant | undefined {
  const idx = localAssistants.findIndex((a) => a.id === id)
  if (idx === -1) return undefined
  const cycle: Record<AIAssistantStatus, AIAssistantStatus> = {
    active: 'paused',
    paused: 'draft',
    draft: 'active',
  }
  localAssistants[idx] = {
    ...localAssistants[idx],
    status: cycle[localAssistants[idx].status],
    updatedAt: new Date().toISOString(),
  }
  return localAssistants[idx]
}
