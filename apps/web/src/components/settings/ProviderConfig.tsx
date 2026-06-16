import { useState, useCallback, useRef } from 'react'
import { useAISettingsStore } from '@/stores/ai-settings'
import { Badge } from '@/components/ui/badge'
import { CheckedIcon } from '@/icons'
import { cn } from '@/lib/utils'
import type { AIProvider } from '@/mock/ai-settings'

const PROVIDER_ICONS: Record<string, string> = {
  'Google Gemini': '✦',
  OpenRouter: '◈',
  OpenAI: '◉',
}

const STATUS_BADGE: Record<AIProvider['status'], { label: string; variant: string }> = {
  active: { label: 'Primary', variant: 'success' },
  fallback: { label: 'Fallback', variant: 'info' },
  disabled: { label: 'Nonaktif', variant: 'default' },
  error: { label: 'Error', variant: 'error' },
}

export function ProviderConfig() {
  const { providers, toggleProvider, reorderProviders, updateProvider } = useAISettingsStore()
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const dragRef = useRef<HTMLDivElement>(null)

  const sorted = [...providers].sort((a, b) => a.priority - b.priority)

  const handleDragStart = useCallback((index: number) => {
    setDragIndex(index)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    setOverIndex(index)
  }, [])

  const handleDrop = useCallback(
    (dropIndex: number) => {
      if (dragIndex !== null && dragIndex !== dropIndex) {
        reorderProviders(dragIndex, dropIndex)
      }
      setDragIndex(null)
      setOverIndex(null)
    },
    [dragIndex, reorderProviders],
  )

  const handleDragEnd = useCallback(() => {
    setDragIndex(null)
    setOverIndex(null)
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-stone font-medium uppercase tracking-wider">
          Fallback Chain — Drag untuk ubah urutan
        </p>
      </div>

      {sorted.map((provider, index) => {
        const statusInfo = STATUS_BADGE[provider.status]
        const isEditing = editingId === provider.id
        const isDragging = dragIndex === index
        const isOver = overIndex === index && dragIndex !== null && dragIndex !== index
        const icon = PROVIDER_ICONS[provider.name] ?? '●'

        return (
          <div
            key={provider.id}
            ref={dragRef}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDrop={() => handleDrop(index)}
            onDragEnd={handleDragEnd}
            className={cn(
              'card-base p-0 transition-all',
              isDragging && 'opacity-50 scale-[0.98]',
              isOver && 'ring-2 ring-brand-blue-deep ring-offset-2',
            )}
          >
            <div className="flex items-stretch">
              <div className="w-10 flex items-center justify-center text-stone cursor-grab active:cursor-grabbing border-r border-hairline-soft flex-shrink-0 select-none">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </div>

              <div className="flex-1 p-4 min-w-0">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-ink">{provider.name}</span>
                        <Badge variant={statusInfo.variant as 'success' | 'info' | 'default' | 'error'}>
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-steel mt-0.5">{provider.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleProvider(provider.id)}
                    className={cn(
                      'relative w-10 h-6 rounded-full transition-colors flex-shrink-0',
                      provider.status === 'disabled' ? 'bg-hairline' : 'bg-emerald-500',
                    )}
                  >
                    <span
                      className={cn(
                        'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
                        provider.status === 'disabled' ? 'translate-x-0' : 'translate-x-4',
                      )}
                    />
                  </button>
                </div>

                {provider.status !== 'disabled' && (
                  <>
                    <div className="flex items-center gap-3 text-xs text-steel mb-3">
                      <span className="font-mono bg-surface rounded px-1.5 py-0.5">{provider.model}</span>
                      <span className="font-mono bg-surface rounded px-1.5 py-0.5">{provider.apiKey}</span>
                    </div>

                    {isEditing ? (
                      <div className="space-y-3 pt-3 border-t border-hairline-soft">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium text-steel mb-1 block">Max Tokens</label>
                            <input
                              type="number"
                              value={provider.maxTokens}
                              onChange={(e) =>
                                updateProvider(provider.id, { maxTokens: Number(e.target.value) })
                              }
                              className="w-full h-8 rounded-md border border-hairline bg-canvas px-2.5 text-sm text-ink focus:outline-none focus:border-2 focus:border-brand-blue-deep"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-steel mb-1 block">
                              Temperature: {provider.temperature.toFixed(1)}
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="2"
                              step="0.1"
                              value={provider.temperature}
                              onChange={(e) =>
                                updateProvider(provider.id, { temperature: Number(e.target.value) })
                              }
                              className="w-full mt-1.5 accent-brand-blue-deep"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => setEditingId(null)}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                        >
                          <CheckedIcon size={14} color="currentColor" />
                          Selesai
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setEditingId(provider.id)}
                        className="text-xs text-brand-blue-deep hover:underline"
                      >
                        Pengaturan lanjutan →
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
