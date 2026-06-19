import { useState, useCallback } from 'react'
import { UserCheckIcon, XIcon, CheckedIcon } from '@/icons'
import { cn } from '@/lib/utils'
import { useAgents } from '@/hooks/inbox'
import type { Agent } from '@/types/inbox'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalTitle,
  ModalDescription,
  ModalCloseButton,
} from '@/components/ui/modal'
import { Button } from '@/components/ui/button'

interface AssignAgentModalProps {
  open: boolean
  onClose: () => void
  onAssign: (agentId: string) => void
  currentAgentId?: string | null
  conversationContactName: string
}

export function AssignAgentModal({
  open,
  onClose,
  onAssign,
  currentAgentId,
  conversationContactName,
}: AssignAgentModalProps) {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(currentAgentId ?? null)
  const { data: agents = [] } = useAgents()

  const handleAssign = useCallback(() => {
    if (selectedAgentId) {
      onAssign(selectedAgentId)
      onClose()
    }
  }, [selectedAgentId, onAssign, onClose])

  const statusColor = (status: Agent['status']) => {
    if (status === 'online') return 'bg-emerald-500'
    if (status === 'busy') return 'bg-amber-500'
    return 'bg-gray-400'
  }

  const statusLabel = (status: Agent['status']) => {
    if (status === 'online') return 'Online'
    if (status === 'busy') return 'Busy'
    return 'Offline'
  }

  return (
    <Modal open={open} onOpenChange={(v) => !v && onClose()}>
      <ModalContent className="max-w-md">
        <ModalCloseButton onClick={onClose} />
        <ModalHeader>
          <ModalTitle>Assign Agent</ModalTitle>
          <ModalDescription>
            Pilih agent untuk menangani percakapan dengan {conversationContactName}
          </ModalDescription>
        </ModalHeader>

        <ModalBody className="space-y-1.5 py-3">
          {agents.map((agent) => {
            const isSelected = selectedAgentId === agent.id
            return (
              <button
                key={agent.id}
                onClick={() => setSelectedAgentId(agent.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-all text-left',
                  isSelected
                    ? 'border-brand-blue bg-brand-blue/5 shadow-sm'
                    : 'border-hairline hover:bg-surface-soft hover:border-hairline-soft',
                )}
              >
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0',
                  isSelected ? 'bg-brand-blue text-white' : 'bg-surface text-ink',
                )}>
                  {agent.initials}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-ink">{agent.name}</span>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-surface text-[10px] font-medium">
                      <span className={cn('w-1.5 h-1.5 rounded-full', statusColor(agent.status))} />
                      <span className="text-steel">{statusLabel(agent.status)}</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-steel mt-0.5">
                    {agent.activeConversationCount} percakapan aktif
                  </p>
                </div>

                <div
                  className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                    isSelected ? 'border-brand-blue bg-brand-blue' : 'border-hairline',
                  )}
                >
                  {isSelected && (
                    <CheckedIcon size={12} color="white" strokeWidth={3} />
                  )}
                </div>
              </button>
            )
          })}
        </ModalBody>

        <ModalFooter>
          <Button variant="tertiary" size="sm" onClick={onClose}>
            <XIcon size={14} />
            Batal
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={!selectedAgentId}
            onClick={handleAssign}
          >
            <UserCheckIcon size={14} />
            Assign
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
