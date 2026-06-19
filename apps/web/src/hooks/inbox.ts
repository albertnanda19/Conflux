import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { inboxApi, type ConversationFilters } from '@/lib/api/inbox'
import { useAuthStore } from '@/stores/auth'
import type { ConversationStatus, Message } from '@/types/inbox'

type MessagesCache = { data: Message[]; nextCursor: string | null }

export function useConversations(filters: ConversationFilters) {
  return useQuery({
    queryKey: queryKeys.conversations(filters),
    queryFn: () => inboxApi.listConversations(filters),
    placeholderData: keepPreviousData,
  })
}

export function useConversation(id: string | null) {
  return useQuery({
    queryKey: queryKeys.conversation(id ?? ''),
    queryFn: () => inboxApi.getConversation(id!),
    enabled: !!id,
  })
}

export function useMessages(id: string | null) {
  return useQuery({
    queryKey: queryKeys.messages(id ?? ''),
    queryFn: () => inboxApi.listMessages(id!),
    enabled: !!id,
  })
}

export function useAgents() {
  return useQuery({ queryKey: queryKeys.agents(), queryFn: () => inboxApi.listAgents() })
}

export function useLabels() {
  return useQuery({ queryKey: queryKeys.labels(), queryFn: () => inboxApi.listLabels() })
}

export function useQuickReplies() {
  return useQuery({ queryKey: queryKeys.quickReplies(), queryFn: () => inboxApi.listQuickReplies() })
}

export function useContact(id: string | null) {
  return useQuery({
    queryKey: queryKeys.contact(id ?? ''),
    queryFn: () => inboxApi.getContact(id!),
    enabled: !!id,
  })
}

export function useConversationMutations(conversationId: string | null) {
  const qc = useQueryClient()
  const invalidateLists = () => qc.invalidateQueries({ queryKey: ['conversations'] })
  const invalidateDetail = () => {
    if (conversationId) qc.invalidateQueries({ queryKey: queryKeys.conversation(conversationId) })
  }

  const patchMessages = (fn: (prev: MessagesCache) => MessagesCache) => {
    if (!conversationId) return
    qc.setQueryData<MessagesCache>(queryKeys.messages(conversationId), (prev) =>
      prev ? fn(prev) : prev,
    )
  }

  const send = useMutation({
    mutationFn: (vars: { text: string; tempId: string }) =>
      inboxApi.sendMessage(conversationId!, { contentType: 'text', content: { text: vars.text } }),
    onMutate: (vars) => {
      const optimistic: Message = {
        id: vars.tempId,
        conversationId: conversationId!,
        direction: 'outbound',
        senderType: 'agent',
        senderName: useAuthStore.getState().user?.name,
        content: vars.text,
        contentType: 'text',
        status: 'sending',
        createdAt: new Date().toISOString(),
      }
      qc.setQueryData<MessagesCache>(queryKeys.messages(conversationId!), (prev) =>
        prev ? { ...prev, data: [...prev.data, optimistic] } : { data: [optimistic], nextCursor: null },
      )
    },
    onSuccess: (real, vars) => {
      patchMessages((prev) => {
        const withoutTemp = prev.data.filter((m) => m.id !== vars.tempId)
        if (withoutTemp.some((m) => m.id === real.id)) return { ...prev, data: withoutTemp }
        return { ...prev, data: [...withoutTemp, real] }
      })
      invalidateLists()
    },
    onError: (_err, vars) => {
      patchMessages((prev) => ({
        ...prev,
        data: prev.data.map((m) => (m.id === vars.tempId ? { ...m, status: 'failed' } : m)),
      }))
    },
  })

  const sendMedia = useMutation({
    mutationFn: async (vars: { file: File; tempId: string }) => {
      const uploaded = await inboxApi.uploadMedia(vars.file)
      const contentType = (['image', 'video', 'audio'].includes(uploaded.contentType) ? uploaded.contentType : 'document') as 'image' | 'video' | 'audio' | 'document'
      return inboxApi.sendMessage(conversationId!, {
        contentType,
        content: { mediaUrl: uploaded.url, fileName: uploaded.fileName, fileSize: uploaded.fileSize },
      })
    },
    onMutate: (vars) => {
      const isImage = vars.file.type.startsWith('image/')
      const optimistic: Message = {
        id: vars.tempId,
        conversationId: conversationId!,
        direction: 'outbound',
        senderType: 'agent',
        senderName: useAuthStore.getState().user?.name,
        content: vars.file.name,
        contentType: isImage ? 'image' : 'document',
        status: 'sending',
        createdAt: new Date().toISOString(),
        mediaUrl: isImage ? URL.createObjectURL(vars.file) : undefined,
        fileName: vars.file.name,
      }
      qc.setQueryData<MessagesCache>(queryKeys.messages(conversationId!), (prev) =>
        prev ? { ...prev, data: [...prev.data, optimistic] } : { data: [optimistic], nextCursor: null },
      )
    },
    onSuccess: (real, vars) => {
      patchMessages((prev) => {
        const withoutTemp = prev.data.filter((m) => m.id !== vars.tempId)
        if (withoutTemp.some((m) => m.id === real.id)) return { ...prev, data: withoutTemp }
        return { ...prev, data: [...withoutTemp, real] }
      })
      invalidateLists()
    },
    onError: (_err, vars) => {
      patchMessages((prev) => ({
        ...prev,
        data: prev.data.map((m) => (m.id === vars.tempId ? { ...m, status: 'failed' } : m)),
      }))
    },
  })

  const assign = useMutation({
    mutationFn: (agentId: string) => inboxApi.assign(conversationId!, agentId),
    onSuccess: () => { invalidateDetail(); invalidateLists() },
  })

  const transfer = useMutation({
    mutationFn: ({ agentId, note }: { agentId: string; note?: string }) =>
      inboxApi.transfer(conversationId!, agentId, note),
    onSuccess: () => { invalidateDetail(); invalidateLists() },
  })

  const setStatus = useMutation({
    mutationFn: (status: ConversationStatus) => inboxApi.updateStatus(conversationId!, status),
    onSuccess: () => { invalidateDetail(); invalidateLists() },
  })

  const markRead = useMutation({
    mutationFn: () => inboxApi.markRead(conversationId!),
    onSuccess: () => invalidateLists(),
  })

  const addLabel = useMutation({
    mutationFn: (labelId: string) => inboxApi.addLabel(conversationId!, labelId),
    onSuccess: () => { invalidateDetail(); invalidateLists() },
  })

  const removeLabel = useMutation({
    mutationFn: (labelId: string) => inboxApi.removeLabel(conversationId!, labelId),
    onSuccess: () => { invalidateDetail(); invalidateLists() },
  })

  const invalidateMessages = () => {
    if (conversationId) qc.invalidateQueries({ queryKey: queryKeys.messages(conversationId) })
  }

  const assignAi = useMutation({
    mutationFn: (aiAssistantId: string) => inboxApi.assignAi(conversationId!, aiAssistantId),
    onSuccess: () => { invalidateDetail(); invalidateLists(); invalidateMessages() },
  })

  const deactivateAi = useMutation({
    mutationFn: () => inboxApi.deactivateAi(conversationId!),
    onSuccess: () => { invalidateDetail(); invalidateLists() },
  })

  return { send, sendMedia, assign, transfer, setStatus, markRead, addLabel, removeLabel, assignAi, deactivateAi }
}

export function useChannels() {
  return useQuery({ queryKey: queryKeys.channels(), queryFn: () => inboxApi.listChannels() })
}

export function useChannelMutations() {
  const qc = useQueryClient()
  const invalidate = () => qc.invalidateQueries({ queryKey: queryKeys.channels() })
  const create = useMutation({
    mutationFn: (body: { name: string; type: string; provider: string; credentials?: Record<string, unknown> }) => inboxApi.createChannel(body),
    onSuccess: invalidate,
  })
  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: { name?: string; isActive?: boolean; credentials?: Record<string, unknown> } }) => inboxApi.updateChannel(id, body),
    onSuccess: invalidate,
  })
  const remove = useMutation({
    mutationFn: (id: string) => inboxApi.deleteChannel(id),
    onSuccess: invalidate,
  })
  return { create, update, remove }
}

export function useLabelMutations() {
  const qc = useQueryClient()
  const invalidate = () => qc.invalidateQueries({ queryKey: queryKeys.labels() })
  const create = useMutation({
    mutationFn: (body: { name: string; color: string }) => inboxApi.createLabel(body),
    onSuccess: invalidate,
  })
  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: { name?: string; color?: string } }) => inboxApi.updateLabel(id, body),
    onSuccess: invalidate,
  })
  const remove = useMutation({
    mutationFn: (id: string) => inboxApi.deleteLabel(id),
    onSuccess: invalidate,
  })
  return { create, update, remove }
}
