import { useState } from 'react'
import { useAiSettings, useAiSettingsMutations } from '@/hooks/ai-settings'
import { Badge } from '@/components/ui/badge'
import { CheckedIcon } from '@/icons'
import { cn } from '@/lib/utils'
import type { AIProvider } from '@/types/ai'

const PROVIDER_ICONS: Record<string, string> = {
  'Google Gemini': '✦',
  OpenRouter: '◈',
  OpenAI: '◉',
}

const STATUS_BADGE: Record<AIProvider['status'], { label: string; variant: string }> = {
  active: { label: 'Primary', variant: 'success' },
  fallback: { label: 'Fallback', variant: 'info' },
  disabled: { label: 'Nonaktif', variant: 'default' },
  error: { label: 'Tanpa API Key', variant: 'error' },
}

export function ProviderConfig() {
  const { data, isLoading } = useAiSettings()
  const { updateProvider } = useAiSettingsMutations()
  const [editingId, setEditingId] = useState<string | null>(null)

  if (isLoading || !data) {
    return <div className="h-24 rounded-xl bg-surface-soft animate-pulse" />
  }

  const sorted = [...data.providers].sort((a, b) => a.priority - b.priority)

  return (
    <div className="space-y-4">
      <p className="text-xs text-stone font-medium uppercase tracking-wider mb-2">
        Fallback Chain — dicoba berurutan sesuai prioritas
      </p>

      {sorted.map((provider) => {
        const statusInfo = STATUS_BADGE[provider.status]
        const isEditing = editingId === provider.id
        const icon = PROVIDER_ICONS[provider.name] ?? '●'

        return (
          <div key={provider.id} className="card-base p-0">
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
                      <span className="text-[10px] text-stone">Prioritas {provider.priority}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => updateProvider.mutate({ id: provider.id, patch: { isEnabled: !provider.isEnabled } })}
                  className={cn(
                    'relative w-10 h-6 rounded-full transition-colors flex-shrink-0',
                    !provider.isEnabled ? 'bg-hairline' : 'bg-emerald-500',
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform',
                      !provider.isEnabled ? 'translate-x-0' : 'translate-x-4',
                    )}
                  />
                </button>
              </div>

              <div className="flex items-center gap-3 text-xs text-steel mb-3">
                <span className="font-mono bg-surface rounded px-1.5 py-0.5">{provider.model}</span>
                <span className={cn('font-mono rounded px-1.5 py-0.5', provider.hasKey ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500')}>
                  {provider.hasKey ? 'API Key terpasang' : 'API Key belum diset (env)'}
                </span>
              </div>

              {isEditing ? (
                <div className="space-y-3 pt-3 border-t border-hairline-soft">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-medium text-steel mb-1 block">Prioritas</label>
                      <input
                        type="number"
                        min={1}
                        max={99}
                        defaultValue={provider.priority}
                        onBlur={(e) => updateProvider.mutate({ id: provider.id, patch: { priority: Number(e.target.value) } })}
                        className="w-full h-8 rounded-md border border-hairline bg-canvas px-2.5 text-sm text-ink focus:outline-none focus:border-2 focus:border-brand-blue-deep"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-steel mb-1 block">Max Tokens</label>
                      <input
                        type="number"
                        defaultValue={provider.maxTokens}
                        onBlur={(e) => updateProvider.mutate({ id: provider.id, patch: { maxTokens: Number(e.target.value) } })}
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
                        defaultValue={provider.temperature}
                        onChange={(e) => updateProvider.mutate({ id: provider.id, patch: { temperature: Number(e.target.value) } })}
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
            </div>
          </div>
        )
      })}
    </div>
  )
}
