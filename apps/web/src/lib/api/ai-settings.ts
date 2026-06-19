import { api } from '@/lib/api/client'
import type { AIProvider } from '@/types/ai'

export type AiSettings = {
  aiEnabled: boolean
  providers: AIProvider[]
}

export const aiSettingsApi = {
  get: () => api.get<AiSettings>('/api/v1/settings/ai'),
  setEnabled: (aiEnabled: boolean) => api.patch<{ aiEnabled: boolean }>('/api/v1/settings/ai', { aiEnabled }),
  updateProvider: (id: string, patch: Partial<Pick<AIProvider, 'model' | 'priority' | 'maxTokens' | 'temperature'>> & { isEnabled?: boolean }) =>
    api.patch<AIProvider>(`/api/v1/settings/ai/providers/${id}`, patch),
}
