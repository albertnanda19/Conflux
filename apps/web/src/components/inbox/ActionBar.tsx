import { useState } from 'react'
import { UserPlusIcon, UserIcon, CheckedIcon, ClockIcon, RefreshIcon } from '@/icons'
import { type Agent, type ConversationStatus } from '@/mock/inbox'
import { cn } from '@/lib/utils'
import { AssignAgentModal } from './AssignAgentModal'
import { TransferModal } from './TransferModal'

interface ActionBarProps {
  contactName: string
  assignedAgent?: Agent
  status: ConversationStatus
  onAssignAgent: (agentId: string) => void
  onTransfer: (agentId: string, notes: string) => void
  onResolve: () => void
  onSnooze: () => void
}

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  open: { label: 'Open', color: 'text-blue-600 bg-blue-50', dot: 'bg-blue-500' },
  pending: { label: 'Pending', color: 'text-amber-600 bg-amber-50', dot: 'bg-amber-500' },
  resolved: { label: 'Resolved', color: 'text-emerald-600 bg-emerald-50', dot: 'bg-emerald-500' },
  snoozed: { label: 'Snoozed', color: 'text-purple-600 bg-purple-50', dot: 'bg-purple-500' },
}

export function ActionBar({
  contactName,
  assignedAgent,
  status,
  onAssignAgent,
  onTransfer,
  onResolve,
  onSnooze,
}: ActionBarProps) {
  const [showAssign, setShowAssign] = useState(false)
  const [showTransfer, setShowTransfer] = useState(false)
  const isResolved = status === 'resolved'
  const isSnoozed = status === 'snoozed'
  const st = STATUS_CONFIG[status] ?? STATUS_CONFIG.open

  return (
    <>
      <div className="px-3 py-2 flex items-center gap-1.5 border-b border-hairline-soft flex-shrink-0">
        <button
          onClick={() => setShowAssign(true)}
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium rounded-lg transition-colors',
            assignedAgent
              ? 'text-brand-blue-deep bg-brand-blue-200/50 hover:bg-brand-blue-200'
              : 'text-steel border border-dashed border-hairline hover:bg-surface-soft hover:text-ink',
          )}
        >
          {assignedAgent ? <UserIcon size={14} /> : <UserPlusIcon size={14} />}
          {assignedAgent ? assignedAgent.name : 'Assign'}
        </button>

        {assignedAgent && (
          <button
            onClick={() => setShowTransfer(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-steel border border-hairline rounded-lg hover:bg-surface-soft hover:text-ink transition-colors"
          >
            <RefreshIcon size={14} />
            Transfer
          </button>
        )}

        <button
          onClick={onResolve}
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium rounded-lg transition-colors',
            isResolved
              ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
              : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100',
          )}
        >
          <CheckedIcon size={14} />
          {isResolved ? 'Reopen' : 'Resolve'}
        </button>

        <button
          onClick={onSnooze}
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium rounded-lg transition-colors',
            isSnoozed
              ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
              : 'text-purple-600 bg-purple-50 hover:bg-purple-100',
          )}
        >
          <ClockIcon size={14} />
          {isSnoozed ? 'Unsnooze' : 'Snooze'}
        </button>

        <div className="ml-auto">
          <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium', st.color)}>
            <span className={cn('w-1.5 h-1.5 rounded-full', st.dot)} />
            {st.label}
          </span>
        </div>
      </div>

      <AssignAgentModal
        open={showAssign}
        onClose={() => setShowAssign(false)}
        onAssign={onAssignAgent}
        currentAgentId={assignedAgent?.id}
        conversationContactName={contactName}
      />
      <TransferModal
        open={showTransfer}
        onClose={() => setShowTransfer(false)}
        onTransfer={onTransfer}
        currentAgentName={assignedAgent?.name}
        conversationContactName={contactName}
      />
    </>
  )
}
