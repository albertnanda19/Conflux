import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { aiAssistantsApi, type AssistantWritePatch } from '@/lib/api/ai-assistants'

export function useAIAssistants(filters: { search?: string; status?: string }) {
  return useQuery({
    queryKey: queryKeys.aiAssistants(filters),
    queryFn: () => aiAssistantsApi.list(filters),
    placeholderData: keepPreviousData,
  })
}

export function useAIAssistant(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.aiAssistant(id ?? ''),
    queryFn: () => aiAssistantsApi.get(id!),
    enabled: !!id,
  })
}

export function useAIAssistantMutations() {
  const qc = useQueryClient()
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['aiAssistants'] })
  }
  const invalidateOne = (id: string) => {
    qc.invalidateQueries({ queryKey: queryKeys.aiAssistant(id) })
    invalidate()
  }

  const create = useMutation({
    mutationFn: (patch: AssistantWritePatch) => aiAssistantsApi.create(patch),
    onSuccess: invalidate,
  })
  const update = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: AssistantWritePatch }) => aiAssistantsApi.update(id, patch),
    onSuccess: (data) => invalidateOne(data.id),
  })
  const remove = useMutation({
    mutationFn: (id: string) => aiAssistantsApi.remove(id),
    onSuccess: invalidate,
  })
  const cycleStatus = useMutation({
    mutationFn: (id: string) => aiAssistantsApi.cycleStatus(id),
    onSuccess: (data) => invalidateOne(data.id),
  })
  const assign = useMutation({
    mutationFn: ({ id, agentId }: { id: string; agentId: string | null }) => aiAssistantsApi.assign(id, agentId),
    onSuccess: (data) => invalidateOne(data.id),
  })

  return { create, update, remove, cycleStatus, assign }
}
