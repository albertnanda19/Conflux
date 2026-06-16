import { useState, useEffect } from 'react'
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalBody, ModalFooter, ModalCloseButton } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { LabelColorPicker } from './LabelColorPicker'
import { type Label } from '@/mock/inbox'

interface LabelManagerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingLabel?: Label | null
  onSave: (name: string, color: string) => void
}

export function LabelManagerModal({ open, onOpenChange, editingLabel, onSave }: LabelManagerModalProps) {
  const [name, setName] = useState('')
  const [color, setColor] = useState('#4A7AFF')

  useEffect(() => {
    if (editingLabel) {
      setName(editingLabel.name)
      setColor(editingLabel.color)
    } else {
      setName('')
      setColor('#4A7AFF')
    }
  }, [editingLabel, open])

  const handleSave = () => {
    if (!name.trim()) return
    onSave(name.trim(), color)
    onOpenChange(false)
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>
          <ModalTitle>{editingLabel ? 'Edit Label' : 'Tambah Label'}</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">Nama Label</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masukkan nama label..."
                className="w-full rounded-lg border border-hairline bg-canvas px-3 py-2.5 text-sm text-ink placeholder:text-stone focus:outline-none focus:border-brand-blue-deep"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">Warna</label>
              <LabelColorPicker value={color} onChange={setColor} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-steel">Preview:</span>
              <span
                className="inline-flex items-center font-medium rounded-full px-2.5 py-1 text-xs"
                style={{ color, backgroundColor: `${color}18`, borderWidth: '1px', borderColor: `${color}30` }}
              >
                {name || 'Label'}
              </span>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button onClick={handleSave} disabled={!name.trim()}>{editingLabel ? 'Simpan' : 'Tambah'}</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
