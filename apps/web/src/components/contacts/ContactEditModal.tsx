import { useState } from 'react'
import { type CrmContact } from '@/mock/crm'
import { useCrmStore } from '@/stores/crm'
import { MOCK_AGENTS } from '@/mock/inbox'

interface ContactEditModalProps {
  contact: CrmContact
  open: boolean
  onClose: () => void
  onSave: (updates: Partial<CrmContact>) => void
}

export function ContactEditModal({ contact, open, onClose, onSave }: ContactEditModalProps) {
  const columns = useCrmStore((s) => s.columns)
  const [name, setName] = useState(contact.name)
  const [phone, setPhone] = useState(contact.phone ?? '')
  const [email, setEmail] = useState(contact.email ?? '')
  const [pipelineStatus, setPipelineStatus] = useState(contact.pipelineStatus)
  const [programInterest, setProgramInterest] = useState(contact.programInterest)
  const [assignedAgentId, setAssignedAgentId] = useState(contact.assignedAgentId ?? '')
  const [notes, setNotes] = useState(contact.notes ?? '')

  if (!open) return null

  const handleSave = () => {
    onSave({
      name: name.trim(),
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      pipelineStatus,
      programInterest: programInterest.trim(),
      assignedAgentId: assignedAgentId || null,
      notes: notes.trim() || undefined,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-canvas rounded-2xl shadow-xl w-[480px] max-h-[80vh] flex flex-col">
        <div className="px-6 pt-6 pb-4 border-b border-hairline">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-ink">Edit Kontak</h2>
              <p className="text-sm text-steel mt-0.5">Perbarui informasi {contact.name}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-steel hover:bg-surface hover:text-ink transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-steel block mb-1">Nama</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-9 px-3 text-sm bg-canvas border border-hairline rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-brand-blue-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-steel block mb-1">Telepon</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-9 px-3 text-sm bg-canvas border border-hairline rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-brand-blue-200"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-steel block mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-9 px-3 text-sm bg-canvas border border-hairline rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-brand-blue-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-steel block mb-1">Status Pipeline</label>
              <select
                value={pipelineStatus}
                onChange={(e) => setPipelineStatus(e.target.value as CrmContact['pipelineStatus'])}
                className="w-full h-9 px-3 text-sm bg-canvas border border-hairline rounded-lg text-ink appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-blue-200"
              >
                {columns.map((col) => (
                  <option key={col.id} value={col.id}>{col.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-steel block mb-1">Program Minat</label>
              <input
                type="text"
                value={programInterest}
                onChange={(e) => setProgramInterest(e.target.value)}
                className="w-full h-9 px-3 text-sm bg-canvas border border-hairline rounded-lg text-ink focus:outline-none focus:ring-2 focus:ring-brand-blue-200"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-steel block mb-1">Agent</label>
            <select
              value={assignedAgentId}
              onChange={(e) => setAssignedAgentId(e.target.value)}
              className="w-full h-9 px-3 text-sm bg-canvas border border-hairline rounded-lg text-ink appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-blue-200"
            >
              <option value="">Belum ditugaskan</option>
              {MOCK_AGENTS.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-steel block mb-1">Catatan</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 text-sm bg-canvas border border-hairline rounded-lg text-ink resize-none focus:outline-none focus:ring-2 focus:ring-brand-blue-200"
              placeholder="Tambahkan catatan..."
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-hairline flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 text-sm font-medium text-steel hover:text-ink border border-hairline rounded-lg hover:bg-surface transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!name.trim()}
            className="h-9 px-5 text-sm font-medium bg-brand-blue text-white rounded-lg hover:bg-brand-blue-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  )
}
