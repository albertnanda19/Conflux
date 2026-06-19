import { useState, useCallback } from 'react'
import type { AIAssistant } from '@/types/ai'
import { Badge } from '@/components/ui/badge'

const STATUS_CONFIG: Record<AIAssistant['status'], { label: string; variant: 'success' | 'warning' | 'default' }> = {
  active: { label: 'Aktif', variant: 'success' },
  draft: { label: 'Draft', variant: 'default' },
  paused: { label: 'Jeda', variant: 'warning' },
}

interface AssignAIAssistantModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentAssistantId: string | null
  assistants: AIAssistant[]
  onAssign: (assistantId: string) => void
  onUnassign: () => void
}

export function AssignAIAssistantModal({ open, onOpenChange, currentAssistantId, assistants, onAssign, onUnassign }: AssignAIAssistantModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(currentAssistantId)

  const currentAssistant = currentAssistantId
    ? assistants.find((a) => a.id === currentAssistantId)
    : null

  const availableAssistants = assistants.filter(
    (a) => a.status !== 'draft' && a.id !== currentAssistantId,
  )

  const handleConfirm = useCallback(() => {
    if (selectedId && selectedId !== currentAssistantId) {
      onAssign(selectedId)
      onOpenChange(false)
    }
  }, [selectedId, currentAssistantId, onAssign, onOpenChange])

  const handleUnassign = useCallback(() => {
    setSelectedId(null)
    onUnassign()
    onOpenChange(false)
  }, [onUnassign, onOpenChange])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={() => onOpenChange(false)} />
      <div className="relative bg-canvas rounded-2xl shadow-xl w-full max-w-md mx-4 border border-hairline overflow-hidden animate-in zoom-in-95 fade-in duration-200">
        <div className="px-6 py-4 border-b border-hairline-soft">
          <h2 className="text-base font-semibold text-ink">Assign AI Assistant</h2>
          <p className="text-xs text-steel mt-0.5">Pilih AI Assistant untuk menangani chat saat agent offline/busy.</p>
        </div>

        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
          {currentAssistant && (
            <div className="mb-4">
              <p className="text-xs font-medium text-steel uppercase tracking-wider mb-2">Saat ini di-assign</p>
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-soft border border-hairline-soft">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{currentAssistant.avatar}</span>
                  <div>
                    <p className="text-sm font-medium text-ink">{currentAssistant.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Badge variant={STATUS_CONFIG[currentAssistant.status].variant}>
                        {STATUS_CONFIG[currentAssistant.status].label}
                      </Badge>
                      <span className="text-xs text-steel">
                        {currentAssistant.persona.tone === 'formal' ? 'Formal' : currentAssistant.persona.tone === 'semi-formal' ? 'Semi-Formal' : 'Casual'}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleUnassign}
                  className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
                >
                  Lepas
                </button>
              </div>
            </div>
          )}

          <div>
            <p className="text-xs font-medium text-steel uppercase tracking-wider mb-2">
              {currentAssistant ? 'Ganti ke AI Assistant lain' : 'Pilih AI Assistant'}
            </p>
            {availableAssistants.length === 0 ? (
              <p className="text-sm text-stone text-center py-6">Tidak ada AI Assistant yang tersedia.</p>
            ) : (
              <div className="space-y-2">
                {availableAssistants.map((assistant) => (
                  <button
                    key={assistant.id}
                    onClick={() => setSelectedId(assistant.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      selectedId === assistant.id
                        ? 'border-brand-blue-deep bg-brand-blue-50 ring-1 ring-brand-blue-deep'
                        : 'border-hairline-soft hover:border-brand-blue-200'
                    }`}
                  >
                    <span className="text-2xl">{assistant.avatar}</span>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-ink">{assistant.name}</p>
                        <Badge variant={STATUS_CONFIG[assistant.status].variant} className="text-[10px]">
                          {STATUS_CONFIG[assistant.status].label}
                        </Badge>
                      </div>
                      <p className="text-xs text-steel mt-0.5">
                        {assistant.persona.tone === 'formal' ? 'Formal' : assistant.persona.tone === 'semi-formal' ? 'Semi-Formal' : 'Casual'} · {assistant.persona.language}
                      </p>
                    </div>
                    {selectedId === assistant.id && (
                      <svg className="w-5 h-5 text-brand-blue-deep flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-hairline-soft bg-surface-soft/30">
          <button
            onClick={() => onOpenChange(false)}
            className="h-9 px-4 text-sm font-medium text-steel hover:text-ink rounded-full hover:bg-surface transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedId || selectedId === currentAssistantId}
            className="h-9 px-5 text-sm font-semibold text-white bg-brand-blue-deep rounded-full hover:bg-brand-blue-700 transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            {selectedId === currentAssistantId ? 'Sudah di-assign' : 'Assign'}
          </button>
        </div>
      </div>
    </div>
  )
}
