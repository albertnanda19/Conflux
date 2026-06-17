import { useState } from 'react'
import { useAISettingsStore } from '@/stores/ai-settings'

interface AIAssistantKBSelectorProps {
  scope: 'global' | 'custom'
  customDocumentIds: string[]
  onScopeChange: (scope: 'global' | 'custom') => void
  onCustomDocsChange: (ids: string[]) => void
}

export function AIAssistantKBSelector({
  scope,
  customDocumentIds,
  onScopeChange,
  onCustomDocsChange,
}: AIAssistantKBSelectorProps) {
  const { kbDocuments } = useAISettingsStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredDocs = kbDocuments.filter((doc) =>
    doc.processingStatus === 'completed' &&
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const toggleDoc = (docId: string) => {
    if (customDocumentIds.includes(docId)) {
      onCustomDocsChange(customDocumentIds.filter((id) => id !== docId))
    } else {
      onCustomDocsChange([...customDocumentIds, docId])
    }
  }

  const completedGlobalCount = kbDocuments.filter((d) => d.processingStatus === 'completed').length

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={() => onScopeChange('global')}
          className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            scope === 'global'
              ? 'bg-brand-blue-deep text-white shadow-md'
              : 'bg-canvas border border-hairline-soft text-steel hover:border-brand-blue-200'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span>🌍</span>
            <span>KB Global</span>
          </div>
          <p className={`text-xs mt-1 ${scope === 'global' ? 'text-white/70' : 'text-stone'}`}>
            {completedGlobalCount} dokumen aktif
          </p>
        </button>
        <button
          onClick={() => onScopeChange('custom')}
          className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
            scope === 'custom'
              ? 'bg-brand-blue-deep text-white shadow-md'
              : 'bg-canvas border border-hairline-soft text-steel hover:border-brand-blue-200'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span>🎯</span>
            <span>KB Kustom</span>
          </div>
          <p className={`text-xs mt-1 ${scope === 'custom' ? 'text-white/70' : 'text-stone'}`}>
            {customDocumentIds.length} dokumen dipilih
          </p>
        </button>
      </div>

      {scope === 'custom' && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-xl">
            <span className="text-xs">💡</span>
            <p className="text-xs text-amber-700">KB kustom mengoverride KB global. Hanya dokumen yang dipilih yang akan digunakan.</p>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari dokumen..."
            className="w-full text-sm text-ink bg-canvas border border-hairline-soft rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1 placeholder:text-stone"
          />

          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {filteredDocs.map((doc) => {
              const isSelected = customDocumentIds.includes(doc.id)
              return (
                <button
                  key={doc.id}
                  onClick={() => toggleDoc(doc.id)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-brand-blue-50 border border-brand-blue-200'
                      : 'border border-transparent hover:bg-surface-soft'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSelected ? 'bg-brand-blue-deep border-brand-blue-deep' : 'border-hairline'
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-ink truncate">{doc.title}</p>
                    <p className="text-xs text-steel">{doc.category} · {doc.fileType.toUpperCase()}</p>
                  </div>
                </button>
              )
            })}
          </div>

          {filteredDocs.length === 0 && (
            <p className="text-sm text-stone text-center py-4">Tidak ada dokumen ditemukan.</p>
          )}
        </div>
      )}

      {scope === 'global' && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 animate-fade-in">
          <p className="text-sm text-emerald-700">
            ✅ Menggunakan KB global — {completedGlobalCount} dokumen aktif akan digunakan oleh AI Assistant ini.
          </p>
        </div>
      )}
    </div>
  )
}
