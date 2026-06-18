import { type CrmContact, getAgentById } from '@/mock/crm'
import { ChannelIcon } from '@/components/inbox/ChannelIcon'
import { LabelBadge } from '@/components/labels/LabelBadge'
import { formatRelativeTime } from '@/lib/utils'
import { useNavigate } from 'react-router-dom'

interface KanbanCardProps {
  contact: CrmContact
}

export function KanbanCard({ contact }: KanbanCardProps) {
  const navigate = useNavigate()
  const agent = contact.assignedAgentId ? getAgentById(contact.assignedAgentId) : null

  return (
    <button
      type="button"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', contact.id)
        e.dataTransfer.effectAllowed = 'move'
        e.currentTarget.style.opacity = '0.5'
      }}
      onDragEnd={(e) => {
        e.currentTarget.style.opacity = '1'
      }}
      onClick={() => navigate(`/contacts/${contact.id}`)}
      className="w-full text-left bg-canvas border border-hairline rounded-lg p-3 hover:border-brand-blue-200 hover:shadow-sm transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-full bg-surface flex items-center justify-center text-[11px] font-semibold text-ink flex-shrink-0">
            {contact.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <span className="text-sm font-medium text-ink truncate">{contact.name}</span>
        </div>
        <ChannelIcon channel={contact.source} size={14} />
      </div>

      <div className="text-xs text-steel mb-2">
        {contact.programInterest}
      </div>

      {contact.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {contact.labels.slice(0, 2).map((label) => (
            <LabelBadge key={label.id} name={label.name} color={label.color} size="sm" />
          ))}
          {contact.labels.length > 2 && (
            <span className="text-[10px] text-steel">+{contact.labels.length - 2}</span>
          )}
        </div>
      )}

      <div className="flex items-center justify-between pt-1 border-t border-hairline-soft">
        {agent ? (
          <div className="flex items-center gap-1.5">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-semibold text-white"
              style={{ backgroundColor: '#7C3AED' }}
            >
              {agent.initials}
            </div>
            <span className="text-[11px] text-steel">{agent.name.split(' ')[0]}</span>
          </div>
        ) : (
          <span className="text-[11px] text-steel italic">Belum ditugaskan</span>
        )}
        <span className="text-[11px] text-steel">{formatRelativeTime(contact.createdAt)}</span>
      </div>
    </button>
  )
}
