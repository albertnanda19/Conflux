import { create } from 'zustand'
import {
  MOCK_AI_PROVIDERS,
  MOCK_KB_DOCUMENTS,
  MOCK_WORKING_HOURS,
  MOCK_HANDOFF_CONFIG,
  MOCK_PERSONA,
  type AIProvider,
  type KBDocument,
  type WorkingHoursConfig,
  type HandoffConfig,
  type PersonaConfig,
} from '@/mock/ai-settings'

interface AISettingsState {
  aiEnabled: boolean
  providers: AIProvider[]
  kbDocuments: KBDocument[]
  workingHours: WorkingHoursConfig
  handoffConfig: HandoffConfig
  persona: PersonaConfig

  toggleAiEnabled: () => void
  updateProvider: (id: string, patch: Partial<AIProvider>) => void
  toggleProvider: (id: string) => void
  reorderProviders: (fromIndex: number, toIndex: number) => void

  addKBDocument: (doc: KBDocument) => void
  removeKBDocument: (id: string) => void
  toggleDocumentActive: (id: string) => void

  updateWorkingHours: (patch: Partial<WorkingHoursConfig>) => void
  toggleDay: (day: string) => void
  updateDayHours: (day: string, start: string, end: string) => void

  updateHandoffConfig: (patch: Partial<HandoffConfig>) => void
  addKeyword: (keyword: string) => void
  removeKeyword: (keyword: string) => void
  toggleConversionSignal: (id: string) => void

  updatePersona: (patch: Partial<PersonaConfig>) => void
}

export const useAISettingsStore = create<AISettingsState>((set) => ({
  aiEnabled: true,
  providers: [...MOCK_AI_PROVIDERS],
  kbDocuments: [...MOCK_KB_DOCUMENTS],
  workingHours: { ...MOCK_WORKING_HOURS, days: MOCK_WORKING_HOURS.days.map((d) => ({ ...d })) },
  handoffConfig: {
    ...MOCK_HANDOFF_CONFIG,
    triggerKeywords: [...MOCK_HANDOFF_CONFIG.triggerKeywords],
    conversionSignals: MOCK_HANDOFF_CONFIG.conversionSignals.map((s) => ({ ...s })),
  },
  persona: { ...MOCK_PERSONA },

  toggleAiEnabled: () => set((s) => ({ aiEnabled: !s.aiEnabled })),

  updateProvider: (id, patch) =>
    set((s) => ({
      providers: s.providers.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    })),

  toggleProvider: (id) =>
    set((s) => ({
      providers: s.providers.map((p) =>
        p.id === id
          ? { ...p, status: p.status === 'disabled' ? 'fallback' : 'disabled' }
          : p,
      ),
    })),

  reorderProviders: (fromIndex, toIndex) =>
    set((s) => {
      const next = [...s.providers]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return { providers: next.map((p, i) => ({ ...p, priority: i + 1 })) }
    }),

  addKBDocument: (doc) => set((s) => ({ kbDocuments: [...s.kbDocuments, doc] })),

  removeKBDocument: (id) =>
    set((s) => ({ kbDocuments: s.kbDocuments.filter((d) => d.id !== id) })),

  toggleDocumentActive: (id) =>
    set((s) => ({
      kbDocuments: s.kbDocuments.map((d) =>
        d.id === id ? { ...d, isActive: !d.isActive } : d,
      ),
    })),

  updateWorkingHours: (patch) =>
    set((s) => ({ workingHours: { ...s.workingHours, ...patch } })),

  toggleDay: (day) =>
    set((s) => ({
      workingHours: {
        ...s.workingHours,
        days: s.workingHours.days.map((d) =>
          d.day === day ? { ...d, enabled: !d.enabled } : d,
        ),
      },
    })),

  updateDayHours: (day, start, end) =>
    set((s) => ({
      workingHours: {
        ...s.workingHours,
        days: s.workingHours.days.map((d) =>
          d.day === day ? { ...d, start, end } : d,
        ),
      },
    })),

  updateHandoffConfig: (patch) =>
    set((s) => ({ handoffConfig: { ...s.handoffConfig, ...patch } })),

  addKeyword: (keyword) =>
    set((s) => ({
      handoffConfig: {
        ...s.handoffConfig,
        triggerKeywords: [...s.handoffConfig.triggerKeywords, keyword],
      },
    })),

  removeKeyword: (keyword) =>
    set((s) => ({
      handoffConfig: {
        ...s.handoffConfig,
        triggerKeywords: s.handoffConfig.triggerKeywords.filter((k) => k !== keyword),
      },
    })),

  toggleConversionSignal: (id) =>
    set((s) => ({
      handoffConfig: {
        ...s.handoffConfig,
        conversionSignals: s.handoffConfig.conversionSignals.map((cs) =>
          cs.id === id ? { ...cs, enabled: !cs.enabled } : cs,
        ),
      },
    })),

  updatePersona: (patch) =>
    set((s) => ({ persona: { ...s.persona, ...patch } })),
}))
