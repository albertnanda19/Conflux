import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MOCK_CRM_CONTACTS } from '@/mock/crm'
import { ContactProfileHeader } from '@/components/contacts/ContactProfileHeader'
import { ContactInfoCard } from '@/components/contacts/ContactInfoCard'
import { ContactActivityTimeline } from '@/components/contacts/ContactActivityTimeline'
import { ContactEditModal } from '@/components/contacts/ContactEditModal'
import type { CrmContact } from '@/mock/crm'

export function ContactProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [editOpen, setEditOpen] = useState(false)
  const [contact, setContact] = useState<CrmContact | undefined>(() => MOCK_CRM_CONTACTS.find((c) => c.id === id))

  if (!contact) {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-lg font-semibold text-ink mb-2">Kontak tidak ditemukan</h1>
          <p className="text-sm text-steel mb-4">Kontak dengan ID "{id}" tidak ada.</p>
          <button
            type="button"
            onClick={() => navigate('/contacts')}
            className="h-9 px-4 text-sm font-medium bg-brand-blue text-white rounded-lg hover:bg-brand-blue-deep transition-colors"
          >
            Kembali ke Kontak
          </button>
        </div>
      </div>
    )
  }

  const handleSave = (updates: Partial<CrmContact>) => {
    setContact((prev) => (prev ? { ...prev, ...updates } : prev))
  }

  return (
    <div className="p-8 h-full overflow-y-auto">
      <ContactProfileHeader contact={contact} onEdit={() => setEditOpen(true)} />

      <div className="grid grid-cols-[1fr_340px] gap-6">
        <ContactInfoCard contact={contact} />
        <ContactActivityTimeline activityLog={contact.activityLog} />
      </div>

      <ContactEditModal
        contact={contact}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={handleSave}
      />
    </div>
  )
}
