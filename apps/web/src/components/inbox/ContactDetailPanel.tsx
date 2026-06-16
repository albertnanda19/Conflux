import { useInboxStore } from '@/stores/ui'
import { cn, formatDate } from '@/lib/utils'
import { MOCK_CONVERSATIONS } from '@/mock/inbox'
import { ChannelIcon } from './ChannelIcon'

const PIPELINE_LABELS: Record<string, string> = {
  new_lead: 'New Lead',
  contacted: 'Contacted',
  qualified: 'Qualified',
  proposal_sent: 'Proposal Sent',
  closed_won: 'Closed Won',
  closed_lost: 'Closed Lost',
}

const PIPELINE_COLORS: Record<string, string> = {
  new_lead: 'bg-brand-blue-200 text-brand-blue-deep',
  contacted: 'bg-coral/10 text-coral',
  qualified: 'bg-fuchsia-50 text-fuchsia-700',
  proposal_sent: 'bg-purple-50 text-purple-700',
  closed_won: 'bg-emerald-50 text-emerald-700',
  closed_lost: 'bg-gray-100 text-gray-600',
}

export function ContactDetailPanel() {
  const { selectedConversationId, detailPanelOpen, setDetailPanelOpen } = useInboxStore()
  const conversation = MOCK_CONVERSATIONS.find((c) => c.id === selectedConversationId)
  const isOpen = detailPanelOpen && !!conversation
  const { contact } = conversation ?? { contact: null }

  return (
    <div
      className={cn(
        'h-full border-l border-hairline bg-canvas flex flex-col flex-shrink-0 overflow-hidden transition-[width] duration-300 ease-in-out',
        isOpen ? 'w-80' : 'w-0 border-l-0',
      )}
    >
      <div className="min-w-80 h-full flex flex-col">
        <div className="h-14 px-4 flex items-center justify-between border-b border-hairline flex-shrink-0">
          <h2 className="text-sm font-semibold text-ink">Detail Kontak</h2>
          <button
            onClick={() => setDetailPanelOpen(false)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-steel hover:bg-surface"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {contact && (
          <div className="flex-1 overflow-y-auto">
            <div className="px-5 pt-6 pb-4 border-b border-hairline-soft">
              <div className="w-16 h-16 rounded-full bg-surface mx-auto mb-3 flex items-center justify-center text-lg font-semibold text-ink">
                {contact.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <h3 className="text-base font-semibold text-ink text-center">{contact.name}</h3>
              <p className="text-xs text-steel text-center mt-1">
                {formatDate(contact.createdAt)}
              </p>
            </div>

            <div className="px-5 py-4 border-b border-hairline-soft space-y-3">
              <SectionLabel>Kontak</SectionLabel>
              {contact.phone && (
                <InfoRow
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  }
                  value={contact.phone}
                />
              )}
              {contact.email && (
                <InfoRow
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  }
                  value={contact.email}
                />
              )}
              {contact.channelIdentifiers.map((ci) => (
                <InfoRow
                  key={ci.identifier}
                  icon={<ChannelIcon channel={ci.channel} size={14} />}
                  value={ci.identifier}
                />
              ))}
            </div>

            <div className="px-5 py-4 border-b border-hairline-soft space-y-3">
              <SectionLabel>Lead Info</SectionLabel>
              <div>
                <p className="text-[11px] text-steel mb-1">Pipeline Status</p>
                <span
                  className={cn(
                    'inline-flex text-[11px] font-semibold rounded-full px-2.5 py-0.5',
                    PIPELINE_COLORS[contact.pipelineStatus],
                  )}
                >
                  {PIPELINE_LABELS[contact.pipelineStatus]}
                </span>
              </div>
              <div>
                <p className="text-[11px] text-steel mb-1">Sumber</p>
                <div className="flex items-center gap-1.5">
                  <ChannelIcon channel={contact.source} size={14} />
                  <span className="text-xs text-ink capitalize">{contact.source}</span>
                </div>
              </div>
              <div>
                <p className="text-[11px] text-steel mb-1">Channel Asal</p>
                <div className="flex items-center gap-1.5">
                  <ChannelIcon channel={conversation!.channel} size={14} />
                  <span className="text-xs text-ink capitalize">{conversation!.channel}</span>
                </div>
              </div>
            </div>

            <div className="px-5 py-4 border-b border-hairline-soft space-y-3">
              <SectionLabel>Label</SectionLabel>
              {contact.labels.length === 0 ? (
                <p className="text-xs text-stone">Belum ada label</p>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {contact.labels.map((label) => (
                    <span
                      key={label.id}
                      className="inline-flex items-center text-[11px] font-medium rounded-full px-2.5 py-0.5 border"
                      style={{
                        color: label.color,
                        borderColor: label.color + '40',
                        backgroundColor: label.color + '10',
                      }}
                    >
                      {label.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {contact.notes && (
              <div className="px-5 py-4 space-y-3">
                <SectionLabel>Catatan</SectionLabel>
                <p className="text-xs text-charcoal leading-relaxed">{contact.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold text-steel uppercase tracking-wide">{children}</p>
  )
}

function InfoRow({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-steel flex-shrink-0">{icon}</span>
      <span className="text-xs text-ink truncate">{value}</span>
    </div>
  )
}
