import { useNavigate } from 'react-router-dom'
import type { AgentProfile } from '@/mock/agents'
import { AgentAvatar } from './AgentAvatar'
import { AgentRoleBadge } from './AgentRoleBadge'
import { AgentStatusBadge } from './AgentStatusBadge'

interface AgentProfileHeaderProps {
  agent: AgentProfile
  onEdit: () => void
  onToggleStatus: () => void
}

export function AgentProfileHeader({ agent, onEdit, onToggleStatus }: AgentProfileHeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between mb-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate('/agents')}
          className="w-9 h-9 flex items-center justify-center text-steel hover:text-ink border border-hairline rounded-lg hover:bg-surface transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <AgentAvatar initials={agent.initials} status={agent.status} size="lg" />
        <div>
          <h1 className="text-xl font-semibold text-ink">{agent.name}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <AgentRoleBadge role={agent.role} />
            <AgentStatusBadge status={agent.status} />
            <span className="text-xs text-steel">
              bergabung {new Date(agent.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleStatus}
          className="h-9 px-4 text-sm font-medium text-steel hover:text-ink border border-hairline rounded-full hover:bg-surface transition-colors flex items-center gap-2"
        >
          <span className={`w-2 h-2 rounded-full ${agent.status === 'online' ? 'bg-emerald-500' : agent.status === 'busy' ? 'bg-amber-500' : 'bg-gray-400'}`} />
          Ganti Status
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="h-9 px-4 text-sm font-medium text-steel hover:text-ink border border-hairline rounded-full hover:bg-surface transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit
        </button>
      </div>
    </div>
  )
}
