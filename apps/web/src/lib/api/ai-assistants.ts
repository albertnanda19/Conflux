import { api } from '@/lib/api/client'
import type { AIAssistant } from '@/types/ai'
import { DEFAULT_WORKING_HOURS, DEFAULT_HANDOFF_CONFIG, DEFAULT_PERSONA } from '@/types/ai'

type BackendAssistant = {
  id: string
  name: string
  description: string | null
  avatar: string | null
  status: AIAssistant['status']
  personaName: string | null
  personaLanguage: string | null
  personaTone: AIAssistant['persona']['tone']
  systemPrompt: string | null
  workingHours: AIAssistant['workingHours'] | null
  handoffConfig: AIAssistant['handoffConfig'] | null
  kbScope: 'global' | 'custom'
  customKbDocumentIds: string[] | null
  assignedAgentId: string | null
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

type Paginated<T> = { data: T[]; meta: { total: number; page: number; limit: number; totalPages: number } }

function toAssistant(b: BackendAssistant): AIAssistant {
  return {
    id: b.id,
    name: b.name,
    description: b.description ?? '',
    avatar: b.avatar ?? '🤖',
    status: b.status,
    persona: {
      name: b.personaName ?? b.name,
      language: b.personaLanguage ?? DEFAULT_PERSONA.language,
      tone: b.personaTone ?? 'semi-formal',
      systemPrompt: b.systemPrompt ?? '',
    },
    workingHours: b.workingHours ?? DEFAULT_WORKING_HOURS,
    handoffConfig: b.handoffConfig ?? DEFAULT_HANDOFF_CONFIG,
    knowledgeBaseScope: b.kbScope,
    customKBDocumentIds: b.customKbDocumentIds ?? [],
    assignedAgentId: b.assignedAgentId,
    isDefault: b.isDefault,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
  }
}

export type AssistantWritePatch = Partial<
  Pick<AIAssistant, 'name' | 'description' | 'avatar' | 'status' | 'persona' | 'workingHours' | 'handoffConfig' | 'knowledgeBaseScope' | 'customKBDocumentIds'>
>

function toBackendBody(patch: AssistantWritePatch): Record<string, unknown> {
  const body: Record<string, unknown> = {}
  if (patch.name !== undefined) body.name = patch.name
  if (patch.description !== undefined) body.description = patch.description
  if (patch.avatar !== undefined) body.avatar = patch.avatar
  if (patch.status !== undefined) body.status = patch.status
  if (patch.persona) {
    body.personaName = patch.persona.name
    body.personaLanguage = patch.persona.language
    body.personaTone = patch.persona.tone
    body.systemPrompt = patch.persona.systemPrompt
  }
  if (patch.workingHours !== undefined) body.workingHours = patch.workingHours
  if (patch.handoffConfig !== undefined) body.handoffConfig = patch.handoffConfig
  if (patch.knowledgeBaseScope !== undefined) body.kbScope = patch.knowledgeBaseScope
  if (patch.customKBDocumentIds !== undefined) body.customKbDocumentIds = patch.customKBDocumentIds
  return body
}

export const aiAssistantsApi = {
  list: async (params: { search?: string; status?: string }): Promise<AIAssistant[]> => {
    const qs = new URLSearchParams()
    if (params.search) qs.set('search', params.search)
    if (params.status && params.status !== 'all') qs.set('status', params.status)
    const res = await api.get<Paginated<BackendAssistant>>(`/api/v1/ai-assistants?${qs.toString()}`)
    return res.data.map(toAssistant)
  },
  get: async (id: string): Promise<AIAssistant> => toAssistant(await api.get<BackendAssistant>(`/api/v1/ai-assistants/${id}`)),
  create: async (patch: AssistantWritePatch): Promise<AIAssistant> =>
    toAssistant(await api.post<BackendAssistant>('/api/v1/ai-assistants', toBackendBody(patch))),
  update: async (id: string, patch: AssistantWritePatch): Promise<AIAssistant> =>
    toAssistant(await api.put<BackendAssistant>(`/api/v1/ai-assistants/${id}`, toBackendBody(patch))),
  remove: (id: string) => api.del<{ id: string }>(`/api/v1/ai-assistants/${id}`),
  cycleStatus: async (id: string): Promise<AIAssistant> => toAssistant(await api.patch<BackendAssistant>(`/api/v1/ai-assistants/${id}/status`)),
  assign: async (id: string, agentId: string | null): Promise<AIAssistant> =>
    toAssistant(await api.post<BackendAssistant>(`/api/v1/ai-assistants/${id}/assign`, { agentId })),
  testChat: (id: string, messages: { role: 'user' | 'assistant'; content: string }[]) =>
    api.post<{ response: string; handoffDetected: boolean }>(`/api/v1/ai-assistants/${id}/test-chat`, { messages }),
}
