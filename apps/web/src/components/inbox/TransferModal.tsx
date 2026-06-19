import { useState, useCallback } from 'react'
import { RefreshIcon, XIcon, MessageCircleIcon, CheckedIcon } from '@/icons'
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

interface TransferModalProps {
  open: boolean
  onClose: () => void
  onTransfer: (agentId: string, notes: string) => void
  currentAgentName?: string
  conversationContactName: string
}

export function TransferModal({
  open,
  onClose,
  onTransfer,
  currentAgentName,
  conversationContactName,
}: TransferModalProps) {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const { data: agents = [] } = useAgents()

  const handleTransfer = useCallback(() => {
    if (selectedAgentId) {
      onTransfer(selectedAgentId, notes)
      setSelectedAgentId(null)
      setNotes('')
      onClose()
    }
  }, [selectedAgentId, notes, onTransfer, onClose])

  const handleClose = useCallback(() => {
    setSelectedAgentId(null)
    setNotes('')
    onClose()
  }, [onClose])

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
    <Modal open={open} onOpenChange={(v) => !v && handleClose()}>
      <ModalContent className="max-w-md">
        <ModalCloseButton onClick={handleClose} />
        <ModalHeader>
          <ModalTitle>Transfer Percakapan</ModalTitle>
          <ModalDescription>
            Transfer percakapan {conversationContactName}
            {currentAgentName ? ` dari ${currentAgentName}` : ''} ke agent lain
          </ModalDescription>
        </ModalHeader>

        <ModalBody className="space-y-4 py-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-steel">Pilih Agent</label>
            <div className="space-y-1.5">
              {agents.filter((a) => a.status !== 'offline').map((agent) => {
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
                      'w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0',
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
                      <p className="text-[11px] text-steel">
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
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-steel">Catatan Transfer (opsional)</label>
            <div className="relative">
              <MessageCircleIcon size={14} className="absolute top-2.5 left-3 text-steel" />
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tambahkan catatan untuk agent tujuan..."
                rows={3}
                className="w-full resize-none rounded-lg border border-hairline bg-canvas pl-9 pr-3 py-2.5 text-sm text-ink placeholder:text-stone focus:outline-none focus:border-brand-blue-deep"
              />
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="tertiary" size="sm" onClick={handleClose}>
            <XIcon size={14} />
            Batal
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={!selectedAgentId}
            onClick={handleTransfer}
          >
            <RefreshIcon size={14} />
            Transfer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
