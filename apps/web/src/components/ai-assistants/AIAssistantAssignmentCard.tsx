import type { AIAssistant } from '@/types/ai'
import { Badge } from '@/components/ui/badge'

const STATUS_CONFIG: Record<AIAssistant['status'], { label: string; variant: 'success' | 'warning' | 'default' }> = {
  active: { label: 'Aktif', variant: 'success' },
  draft: { label: 'Draft', variant: 'default' },
  paused: { label: 'Jeda', variant: 'warning' },
}

interface AIAssistantAssignmentCardProps {
  assistant: AIAssistant | null
  onAssign: () => void
}

export function AIAssistantAssignmentCard({ assistant, onAssign }: AIAssistantAssignmentCardProps) {
  return (
    <div className="card-base p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-ink">AI Assistant</h3>
        <button
          onClick={onAssign}
          className="text-xs font-medium text-brand-blue-deep hover:underline transition-colors"
        >
          {assistant ? 'Ganti' : 'Assign'}
        </button>
      </div>

      {assistant ? (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-soft border border-hairline-soft animate-fade-in">
          <span className="text-2xl">{assistant.avatar}</span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-ink truncate">{assistant.name}</p>
              <Badge variant={STATUS_CONFIG[assistant.status].variant}>
                {STATUS_CONFIG[assistant.status].label}
              </Badge>
            </div>
            <p className="text-xs text-steel mt-0.5">
              {assistant.persona.tone === 'formal' ? 'Formal' : assistant.persona.tone === 'semi-formal' ? 'Semi-Formal' : 'Casual'} · {assistant.persona.language}
            </p>
          </div>
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${assistant.status === 'active' ? 'bg-emerald-500 animate-pulse' : assistant.status === 'paused' ? 'bg-amber-500' : 'bg-stone'}`} />
        </div>
      ) : (
        <div className="flex flex-col items-center py-6 text-center animate-fade-in">
          <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-xl mb-3">
            🤖
          </div>
          <p className="text-sm text-steel mb-1">Belum ada AI Assistant</p>
          <p className="text-xs text-stone mb-3">Assign AI Assistant untuk menangani chat saat agent offline.</p>
          <button
            onClick={onAssign}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-brand-blue-deep rounded-full hover:bg-brand-blue-700 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Assign AI Assistant
          </button>
        </div>
      )}
    </div>
  )
}
