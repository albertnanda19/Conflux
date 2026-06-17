import { type CrmContact, getAgentById, formatCurrency } from '@/mock/crm'
import { ChannelIcon } from '@/components/inbox/ChannelIcon'
import { LabelBadge } from '@/components/labels/LabelBadge'
import { useCrmStore } from '@/stores/crm'

interface ContactInfoCardProps {
  contact: CrmContact
}

export function ContactInfoCard({ contact }: ContactInfoCardProps) {
  const columns = useCrmStore((s) => s.columns)
  const agent = contact.assignedAgentId ? getAgentById(contact.assignedAgentId) : null
  const col = columns.find((c) => c.id === contact.pipelineStatus)

  return (
    <div className="card-base p-5 space-y-5">
      <h2 className="text-sm font-semibold text-ink">Informasi Kontak</h2>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <span className="text-xs text-steel block mb-1">Telepon</span>
          <span className="text-sm text-ink font-medium">{contact.phone ?? '—'}</span>
        </div>
        <div>
          <span className="text-xs text-steel block mb-1">Email</span>
          <span className="text-sm text-ink font-medium">{contact.email ?? '—'}</span>
        </div>
        <div>
          <span className="text-xs text-steel block mb-1">Channel</span>
          <div className="flex items-center gap-1.5">
            <ChannelIcon channel={contact.source} size={14} />
            <span className="text-sm text-ink capitalize">{contact.source}</span>
          </div>
        </div>
        <div>
          <span className="text-xs text-steel block mb-1">Identitas Channel</span>
          <div className="space-y-1">
            {contact.channelIdentifiers.map((ci, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <ChannelIcon channel={ci.channel} size={12} />
                <span className="text-sm text-ink">{ci.identifier}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <span className="text-xs text-steel block mb-1">Status Pipeline</span>
          {col && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full bg-surface">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
              {col.name}
            </span>
          )}
        </div>
        <div>
          <span className="text-xs text-steel block mb-1">Program Minat</span>
          <span className="text-sm text-ink font-medium">{contact.programInterest}</span>
        </div>
        <div>
          <span className="text-xs text-steel block mb-1">Nilai Program</span>
          <span className="text-sm text-ink font-medium">{formatCurrency(contact.programValue)}</span>
        </div>
        <div>
          <span className="text-xs text-steel block mb-1">Agent</span>
          {agent ? (
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-surface flex items-center justify-center text-[10px] font-medium text-steel">
                {agent.initials}
              </span>
              <span className="text-sm text-ink">{agent.name}</span>
            </div>
          ) : (
            <span className="text-sm text-steel italic">Belum ditugaskan</span>
          )}
        </div>
      </div>

      {contact.labels.length > 0 && (
        <div>
          <span className="text-xs text-steel block mb-1.5">Label</span>
          <div className="flex flex-wrap gap-1.5">
            {contact.labels.map((l) => (
              <LabelBadge key={l.id} name={l.name} color={l.color} />
            ))}
          </div>
        </div>
      )}

      {contact.notes && (
        <div>
          <span className="text-xs text-steel block mb-1">Catatan</span>
          <p className="text-sm text-ink leading-relaxed">{contact.notes}</p>
        </div>
      )}
    </div>
  )
}
