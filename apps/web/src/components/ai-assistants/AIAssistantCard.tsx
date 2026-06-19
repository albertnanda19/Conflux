import { useNavigate } from 'react-router-dom'
import type { AIAssistant } from '@/types/ai'
import { Badge } from '@/components/ui/badge'
import { useAgentsStore } from '@/stores/agents'

const STATUS_CONFIG: Record<AIAssistant['status'], { label: string; variant: 'success' | 'warning' | 'default'; dotColor: string }> = {
  active: { label: 'Aktif', variant: 'success', dotColor: 'bg-emerald-500' },
  draft: { label: 'Draft', variant: 'default', dotColor: 'bg-stone' },
  paused: { label: 'Jeda', variant: 'warning', dotColor: 'bg-amber-500' },
}

const TONE_LABELS: Record<string, string> = {
  formal: 'Formal',
  'semi-formal': 'Semi-Formal',
  casual: 'Casual',
}

interface AIAssistantCardProps {
  assistant: AIAssistant
  onEdit: (assistant: AIAssistant) => void
  onDelete: (assistant: AIAssistant) => void
  index?: number
}

export function AIAssistantCard({ assistant, onEdit, onDelete, index = 0 }: AIAssistantCardProps) {
  const navigate = useNavigate()
  const agents = useAgentsStore((s) => s.agents)
  const statusInfo = STATUS_CONFIG[assistant.status]
  const assignedAgent = assistant.assignedAgentId
    ? agents.find((a) => a.id === assistant.assignedAgentId)
    : null

  return (
    <div
      className="card-base p-0 overflow-hidden cursor-pointer group transition-all duration-200 hover:shadow-lg hover:shadow-slate-200/50 hover:scale-[1.01] animate-fade-in border-l-4"
      style={{
        animationDelay: `${index * 50}ms`,
        borderLeftColor: assistant.status === 'active' ? '#10b981' : assistant.status === 'paused' ? '#f59e0b' : '#a8a29e',
      }}
      onClick={() => navigate(`/ai-assistants/${assistant.id}`)}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl transition-transform duration-200 group-hover:scale-110 group-hover:rotate-6">
              {assistant.avatar}
            </span>
            <div>
              <h3 className="text-sm font-semibold text-ink">{assistant.name}</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotColor} ${assistant.status === 'active' ? 'animate-pulse' : ''}`} />
                <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(assistant) }}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-steel hover:text-ink hover:bg-surface-soft transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(assistant) }}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-steel hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <p className="text-xs text-steel leading-relaxed mb-4 line-clamp-2">{assistant.description}</p>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-stone">Gaya:</span>
            <span className="text-ink font-medium">{TONE_LABELS[assistant.persona.tone] ?? assistant.persona.tone}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {assignedAgent ? (
              <>
                <div className="w-5 h-5 rounded-full bg-brand-blue text-white flex items-center justify-center text-[8px] font-bold">
                  {assignedAgent.initials}
                </div>
                <span className="text-ink font-medium">{assignedAgent.name}</span>
              </>
            ) : (
              <span className="text-stone italic">Belum di-assign</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
