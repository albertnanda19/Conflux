import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { knowledgeBaseApi, type KbListParams } from '@/lib/api/knowledge-base'

const REFETCH_WHILE_PROCESSING = 4000

export function useKbDocuments(params: KbListParams) {
  return useQuery({
    queryKey: queryKeys.kbDocuments(params as Record<string, string | undefined>),
    queryFn: () => knowledgeBaseApi.list(params),
    placeholderData: keepPreviousData,
    refetchInterval: (query) => {
      const data = query.state.data
      const pending = data?.some((d) => d.processingStatus === 'pending' || d.processingStatus === 'processing')
      return pending ? REFETCH_WHILE_PROCESSING : false
    },
  })
}

export function useKbDocument(id: string | null) {
  return useQuery({
    queryKey: queryKeys.kbDocument(id ?? ''),
    queryFn: () => knowledgeBaseApi.get(id!),
    enabled: !!id,
  })
}

export function useKbMutations() {
  const qc = useQueryClient()
  const invalidate = () => qc.invalidateQueries({ queryKey: ['kbDocuments'] })

  const upload = useMutation({
    mutationFn: (input: { file: File; title: string; category: string; aiAssistantId?: string }) => knowledgeBaseApi.upload(input),
    onSuccess: invalidate,
  })
  const update = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: { title?: string; category?: string; isActive?: boolean; content?: string } }) => knowledgeBaseApi.update(id, patch),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: queryKeys.kbDocument(data.id) })
      invalidate()
    },
  })
  const remove = useMutation({
    mutationFn: (id: string) => knowledgeBaseApi.remove(id),
    onSuccess: invalidate,
  })

  return { upload, update, remove }
}
