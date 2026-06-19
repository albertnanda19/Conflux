import { api } from '@/lib/api/client'
import type { KBDocument } from '@/types/ai'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

type BackendKbDoc = {
  id: string
  title: string
  category: string | null
  fileType: string | null
  fileSize: number | null
  chunkCount: number | null
  processingStatus: KBDocument['processingStatus']
  isActive: boolean
  aiAssistantId: string | null
  createdBy: string | null
  createdByName: string | null
  createdAt: string
}

type Paginated<T> = { data: T[]; meta: { total: number; page: number; limit: number; totalPages: number } }

function formatSize(bytes: number | null): string {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function toKbDoc(b: BackendKbDoc): KBDocument {
  return {
    id: b.id,
    title: b.title,
    category: b.category ?? '',
    fileType: (b.fileType as KBDocument['fileType']) ?? 'txt',
    fileSize: formatSize(b.fileSize),
    chunkCount: b.chunkCount ?? 0,
    processingStatus: b.processingStatus,
    isActive: b.isActive,
    createdBy: b.createdByName ?? '—',
    createdAt: b.createdAt,
    aiAssistantId: b.aiAssistantId,
  }
}

export type KbListParams = {
  search?: string
  category?: string
  status?: string
  scope?: 'global' | 'assistant'
  aiAssistantId?: string
}

export const knowledgeBaseApi = {
  list: async (params: KbListParams): Promise<KBDocument[]> => {
    const qs = new URLSearchParams()
    qs.set('limit', '100')
    if (params.search) qs.set('search', params.search)
    if (params.category && params.category !== 'Semua') qs.set('category', params.category)
    if (params.status) qs.set('status', params.status)
    if (params.scope) qs.set('scope', params.scope)
    if (params.aiAssistantId) qs.set('aiAssistantId', params.aiAssistantId)
    const res = await api.get<Paginated<BackendKbDoc>>(`/api/v1/knowledge-base?${qs.toString()}`)
    return res.data.map(toKbDoc)
  },
  get: async (id: string): Promise<KBDocument & { content: string | null }> => {
    const b = await api.get<BackendKbDoc & { content: string | null }>(`/api/v1/knowledge-base/${id}`)
    return { ...toKbDoc(b), content: b.content }
  },
  upload: async (input: { file: File; title: string; category: string; aiAssistantId?: string }): Promise<KBDocument> => {
    const form = new FormData()
    form.append('file', input.file)
    form.append('title', input.title)
    form.append('category', input.category)
    if (input.aiAssistantId) form.append('aiAssistantId', input.aiAssistantId)
    const token = (document.cookie.match(/(^| )access_token=([^;]+)/) || [])[2]
    const res = await fetch(`${API_BASE}/api/v1/knowledge-base`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${decodeURIComponent(token)}` } : {},
      body: form,
    })
    const json = await res.json()
    if (!res.ok || !json.success) throw new Error(json.message || 'Gagal mengunggah dokumen.')
    return toKbDoc(json.data)
  },
  update: async (id: string, patch: { title?: string; category?: string; isActive?: boolean; content?: string }): Promise<KBDocument> =>
    toKbDoc(await api.patch<BackendKbDoc>(`/api/v1/knowledge-base/${id}`, patch)),
  remove: (id: string) => api.del<{ id: string }>(`/api/v1/knowledge-base/${id}`),
}
