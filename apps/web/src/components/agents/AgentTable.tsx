import { useNavigate } from 'react-router-dom'
import { PenIcon, TrashIcon } from '@/icons'
import type { AgentProfile } from '@/mock/agents'
import { AgentAvatar } from './AgentAvatar'
import { AgentStatusBadge } from './AgentStatusBadge'
import { AgentRoleBadge } from './AgentRoleBadge'

interface AgentTableProps {
  agents: AgentProfile[]
  onEdit: (agent: AgentProfile) => void
  onDelete: (agent: AgentProfile) => void
}

export function AgentTable({ agents, onEdit, onDelete }: AgentTableProps) {
  const navigate = useNavigate()

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-hairline">
            <th className="py-3 px-4 text-[11px] font-semibold text-steel uppercase tracking-wide">Agent</th>
            <th className="py-3 px-4 text-[11px] font-semibold text-steel uppercase tracking-wide">Role</th>
            <th className="py-3 px-4 text-[11px] font-semibold text-steel uppercase tracking-wide">Status</th>
            <th className="py-3 px-4 text-[11px] font-semibold text-steel uppercase tracking-wide text-right">Percakapan Aktif</th>
            <th className="py-3 px-4 text-[11px] font-semibold text-steel uppercase tracking-wide text-right">Konversi</th>
            <th className="py-3 px-4 text-[11px] font-semibold text-steel uppercase tracking-wide text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent, idx) => (
            <tr
              key={agent.id}
              className="border-b border-hairline-soft hover:bg-surface-soft transition-colors cursor-pointer animate-fade-in"
              onClick={() => navigate(`/agents/${agent.id}`)}
            >
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <AgentAvatar initials={agent.initials} status={agent.status} colorIndex={idx} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{agent.name}</p>
                    <p className="text-[11px] text-steel truncate">{agent.email}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <AgentRoleBadge role={agent.role} />
              </td>
              <td className="py-3 px-4">
                <AgentStatusBadge status={agent.status} />
              </td>
              <td className="py-3 px-4 text-sm text-ink text-right font-medium">
                {agent.activeConversationCount}
                <span className="text-steel font-normal"> / {agent.maxConversations}</span>
              </td>
              <td className="py-3 px-4 text-sm text-right">
                <span className={`font-semibold ${agent.conversionRate >= 30 ? 'text-emerald-600' : agent.conversionRate >= 20 ? 'text-amber-600' : 'text-steel'}`}>
                  {agent.conversionRate}%
                </span>
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onEdit(agent)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-medium text-steel border border-hairline rounded-full hover:bg-surface hover:text-ink transition-colors"
                  >
                    <PenIcon size={12} />
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(agent)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-medium text-red-500 border border-red-200 rounded-full hover:bg-red-50 hover:text-red-700 transition-colors"
                  >
                    <TrashIcon size={12} />
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {agents.length === 0 && (
            <tr>
              <td colSpan={6} className="py-10 text-center text-sm text-steel">
                Tidak ada agent yang cocok dengan filter
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
