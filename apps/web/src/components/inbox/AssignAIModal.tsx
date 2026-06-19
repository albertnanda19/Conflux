import { useState, useCallback } from 'react'
import { XIcon, CheckedIcon } from '@/icons'
import { cn } from '@/lib/utils'
import { useAIAssistants } from '@/hooks/ai-assistants'
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

interface AssignAIModalProps {
  open: boolean
  onClose: () => void
  onAssign: (aiAssistantId: string) => void
  currentAssistantId?: string | null
  conversationContactName: string
}

const TONE_LABEL: Record<string, string> = { formal: 'Formal', 'semi-formal': 'Semi-Formal', casual: 'Casual' }

export function AssignAIModal({ open, onClose, onAssign, currentAssistantId, conversationContactName }: AssignAIModalProps) {
  const [selectedId, setSelectedId] = useState<string | null>(currentAssistantId ?? null)
  const { data: assistants = [], isLoading } = useAIAssistants({ status: 'active' })

  const handleAssign = useCallback(() => {
    if (selectedId) {
      onAssign(selectedId)
      onClose()
    }
  }, [selectedId, onAssign, onClose])

  return (
    <Modal open={open} onOpenChange={(v) => !v && onClose()}>
      <ModalContent className="max-w-md">
        <ModalCloseButton onClick={onClose} />
        <ModalHeader>
          <ModalTitle>Assign AI Assistant</ModalTitle>
          <ModalDescription>
            AI akan langsung membalas percakapan dengan {conversationContactName}
          </ModalDescription>
        </ModalHeader>

        <ModalBody className="space-y-1.5 py-3">
          {isLoading && <p className="text-sm text-steel text-center py-6">Memuat…</p>}
          {!isLoading && assistants.length === 0 && (
            <p className="text-sm text-stone text-center py-6">Belum ada AI Assistant aktif. Aktifkan dulu di halaman AI Assistant.</p>
          )}
          {assistants.map((a) => {
            const isSelected = selectedId === a.id
            return (
              <button
                key={a.id}
                onClick={() => setSelectedId(a.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-all text-left',
                  isSelected ? 'border-brand-blue bg-brand-blue/5 shadow-sm' : 'border-hairline hover:bg-surface-soft hover:border-hairline-soft',
                )}
              >
                <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-lg flex-shrink-0">
                  {a.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-ink">{a.name}</span>
                  <p className="text-[11px] text-steel mt-0.5">
                    {TONE_LABEL[a.persona.tone] ?? a.persona.tone} · {a.persona.language}
                  </p>
                </div>
                <div className={cn(
                  'w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors',
                  isSelected ? 'border-brand-blue bg-brand-blue' : 'border-hairline',
                )}>
                  {isSelected && <CheckedIcon size={12} color="white" strokeWidth={3} />}
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
          <Button variant="primary" size="sm" disabled={!selectedId} onClick={handleAssign}>
            🤖 Assign AI
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
