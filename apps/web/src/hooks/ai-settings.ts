import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { aiSettingsApi } from '@/lib/api/ai-settings'
import type { AIProvider } from '@/types/ai'

export function useAiSettings() {
  return useQuery({
    queryKey: queryKeys.aiSettings(),
    queryFn: () => aiSettingsApi.get(),
  })
}

export function useAiSettingsMutations() {
  const qc = useQueryClient()
  const invalidate = () => qc.invalidateQueries({ queryKey: queryKeys.aiSettings() })

  const setEnabled = useMutation({
    mutationFn: (aiEnabled: boolean) => aiSettingsApi.setEnabled(aiEnabled),
    onSuccess: invalidate,
  })
  const updateProvider = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Pick<AIProvider, 'model' | 'priority' | 'maxTokens' | 'temperature'>> & { isEnabled?: boolean } }) =>
      aiSettingsApi.updateProvider(id, patch),
    onSuccess: invalidate,
  })

  return { setEnabled, updateProvider }
}
