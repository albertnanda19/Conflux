import { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAISettingsStore } from '@/stores/ai-settings'
import { useAIAssistantsStore } from '@/stores/ai-assistants'
import { KBDocumentList } from '@/components/knowledge-base/KBDocumentList'
import { KBUploadModal } from '@/components/knowledge-base/KBUploadModal'
import { KBDocumentEditor } from '@/components/knowledge-base/KBDocumentEditor'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { XIcon, UploadIcon } from '@/icons'
import type { KBDocument } from '@/mock/ai-settings'

const FILE_TYPE_ICONS: Record<string, { label: string; color: string }> = {
  pdf: { label: 'PDF', color: 'text-red-500 bg-red-50' },
  docx: { label: 'DOC', color: 'text-brand-blue bg-brand-blue-200' },
  txt: { label: 'TXT', color: 'text-steel bg-surface' },
  csv: { label: 'CSV', color: 'text-emerald-600 bg-emerald-50' },
  xlsx: { label: 'XLS', color: 'text-emerald-600 bg-emerald-50' },
}

const STATUS_CONFIG: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'default' }> = {
  completed: { label: 'Selesai', variant: 'success' },
  processing: { label: 'Memproses', variant: 'warning' },
  pending: { label: 'Menunggu', variant: 'default' },
  failed: { label: 'Gagal', variant: 'error' },
}

export function KnowledgeBasePage() {
  const navigate = useNavigate()
  const { kbDocuments } = useAISettingsStore()
  const assistants = useAIAssistantsStore((s) => s.assistants)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [viewingDoc, setViewingDoc] = useState<KBDocument | null>(null)
  const [editorContent, setEditorContent] = useState('')
  const [scope, setScope] = useState<'global' | 'assistant'>('global')
  const [selectedAssistantId, setSelectedAssistantId] = useState<string>('')

  const filteredDocs = useMemo(() => {
    if (scope === 'global') {
      return kbDocuments.filter((d) => !d.aiAssistantId)
    }
    if (selectedAssistantId) {
      return kbDocuments.filter((d) => d.aiAssistantId === selectedAssistantId)
    }
    return []
  }, [kbDocuments, scope, selectedAssistantId])

  const globalCount = useMemo(() => kbDocuments.filter((d) => !d.aiAssistantId).length, [kbDocuments])
  const completedCount = kbDocuments.filter((d) => d.processingStatus === 'completed').length
  const selectedAssistant = assistants.find((a) => a.id === selectedAssistantId)

  const handleView = useCallback((doc: KBDocument) => {
    setViewingDoc(doc)
    setEditorContent(doc.id)
  }, [])

  return (
    <div className="p-8 h-full">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-ink mb-2">Knowledge Base</h1>
          <p className="text-steel text-sm">
            Kelola dokumen yang digunakan AI untuk menjawab pertanyaan.{' '}
            <span className="text-ink font-medium">{completedCount}</span> dari{' '}
            <span className="text-ink font-medium">{kbDocuments.length}</span> dokumen aktif.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="primary" size="sm" onClick={() => setUploadOpen(true)}>
            <UploadIcon size={14} />
            Upload Dokumen
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex gap-1 p-1 bg-surface-soft rounded-full">
          <button
            onClick={() => setScope('global')}
            className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
              scope === 'global'
                ? 'bg-brand-blue-deep text-white shadow-sm'
                : 'text-steel hover:text-ink'
            }`}
          >
            Global KB
          </button>
          <button
            onClick={() => setScope('assistant')}
            className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
              scope === 'assistant'
                ? 'bg-brand-blue-deep text-white shadow-sm'
                : 'text-steel hover:text-ink'
            }`}
          >
            Per AI Assistant
          </button>
        </div>

        {scope === 'global' ? (
          <div className="flex items-center gap-1.5 text-xs text-steel">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{globalCount} dokumen global</span>
          </div>
        ) : (
          <div className="relative">
            <select
              value={selectedAssistantId}
              onChange={(e) => setSelectedAssistantId(e.target.value)}
              className="h-9 pl-3 pr-8 text-xs font-medium text-ink bg-canvas border border-hairline rounded-full appearance-none focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1"
            >
              <option value="">Pilih AI Assistant…</option>
              {assistants.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.avatar} {a.name} — {a.knowledgeBaseScope === 'global' ? 'Global' : 'Kustom'}
                </option>
              ))}
            </select>
            <svg className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-steel pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        )}
      </div>

      {scope === 'assistant' && selectedAssistant && (
        <div className="mb-6 p-4 rounded-xl bg-surface-soft border border-hairline-soft animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selectedAssistant.avatar}</span>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-ink">{selectedAssistant.name}</p>
                  <button
                    onClick={() => navigate(`/ai-assistants/${selectedAssistant.id}`)}
                    className="text-xs text-brand-blue-deep hover:underline"
                  >
                    Lihat detail →
                  </button>
                </div>
                <p className="text-xs text-steel mt-0.5">
                  KB Scope:{' '}
                  {selectedAssistant.knowledgeBaseScope === 'global' ? (
                    <span className="text-emerald-600 font-medium">Global (menggunakan KB global)</span>
                  ) : (
                    <span className="text-brand-blue-deep font-medium">Kustom ({selectedAssistant.customKBDocumentIds.length} dokumen dipilih)</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {scope === 'assistant' && !selectedAssistantId ? (
        <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
          <div className="w-14 h-14 rounded-full bg-surface flex items-center justify-center text-2xl mb-4">🤖</div>
          <p className="text-sm font-medium text-ink mb-1">Pilih AI Assistant</p>
          <p className="text-xs text-steel">Pilih AI Assistant dari dropdown untuk melihat dokumen Knowledge Base-nya.</p>
        </div>
      ) : (
        <KBDocumentList onView={handleView} documents={filteredDocs} />
      )}

      <KBUploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />

      {viewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setViewingDoc(null)} />
          <div className="relative bg-canvas rounded-2xl shadow-xl w-full max-w-2xl mx-4 border border-hairline overflow-hidden max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-hairline-soft flex-shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                {(() => {
                  const fi = FILE_TYPE_ICONS[viewingDoc.fileType] ?? FILE_TYPE_ICONS.txt
                  return (
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${fi.color}`}>
                      {fi.label}
                    </div>
                  )
                })()}
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-ink truncate">{viewingDoc.title}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-steel">{viewingDoc.category}</span>
                    <span className="text-xs text-stone">•</span>
                    <Badge variant={STATUS_CONFIG[viewingDoc.processingStatus]?.variant ?? 'default'} className="text-[10px] px-1.5 py-0">
                      {STATUS_CONFIG[viewingDoc.processingStatus]?.label ?? viewingDoc.processingStatus}
                    </Badge>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setViewingDoc(null)}
                className="p-1.5 rounded-lg text-stone hover:text-ink hover:bg-surface-soft transition-colors flex-shrink-0"
              >
                <XIcon size={16} />
              </button>
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <KBDocumentEditor
                content={editorContent}
                onChange={setEditorContent}
              />
            </div>

            {/* Info bar */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-hairline-soft bg-surface-soft/50 flex-shrink-0">
              <div className="flex items-center gap-4 text-xs text-steel">
                <span>{viewingDoc.fileSize}</span>
                <span>{viewingDoc.chunkCount} chunks</span>
                <span>Oleh {viewingDoc.createdBy}</span>
              </div>
              <button
                onClick={() => setViewingDoc(null)}
                className="px-4 py-1.5 rounded-full bg-brand-blue-deep text-white text-xs font-semibold hover:bg-brand-blue-700 transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
