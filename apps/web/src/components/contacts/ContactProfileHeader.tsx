import { useNavigate } from 'react-router-dom'
import { type CrmContact } from '@/mock/crm'
import { useCrmStore } from '@/stores/crm'

interface ContactProfileHeaderProps {
  contact: CrmContact
  onEdit: () => void
}

export function ContactProfileHeader({ contact, onEdit }: ContactProfileHeaderProps) {
  const navigate = useNavigate()
  const columns = useCrmStore((s) => s.columns)
  const col = columns.find((c) => c.id === contact.pipelineStatus)

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate('/contacts')}
          className="w-9 h-9 flex items-center justify-center text-steel hover:text-ink border border-hairline rounded-lg hover:bg-surface transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-brand-blue-100 flex items-center justify-center text-base font-medium text-brand-blue-deep">
            {contact.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-ink">{contact.name}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              {col && (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full bg-surface">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                  {col.name}
                </span>
              )}
              <span className="text-xs text-steel">dibuat {new Date(contact.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="h-9 px-4 text-sm font-medium text-steel hover:text-ink border border-hairline rounded-lg hover:bg-surface transition-colors flex items-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Edit
      </button>
    </div>
  )
}
