import { useState, useCallback } from 'react'
import { useInboxStore } from '@/stores/ui'
import { cn, formatDate, formatRelativeTime } from '@/lib/utils'
import { MOCK_CONVERSATIONS, type Contact, type ActivityLog } from '@/mock/inbox'
import { ChannelIcon } from './ChannelIcon'
import { LabelBadge } from '@/components/labels/LabelBadge'

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

const ACTIVITY_ICON: Record<string, string> = {
  status_change: '📋',
  assignment: '👤',
  note_added: '📝',
  label_added: '🏷️',
  message_sent: '💬',
  ai_handoff: '🤖',
}

type Tab = 'info' | 'history'

export function ContactDetailPanel() {
  const { selectedConversationId, detailPanelOpen, setDetailPanelOpen, selectConversation } = useInboxStore()
  const conversation = MOCK_CONVERSATIONS.find((c) => c.id === selectedConversationId)
  const isOpen = detailPanelOpen && !!conversation
  const { contact } = conversation ?? { contact: null }

  const [activeTab, setActiveTab] = useState<Tab>('info')
  const [notes, setNotes] = useState<string | null>(null)
  const [isEditingNotes, setIsEditingNotes] = useState(false)

  const contactConversations = contact
    ? MOCK_CONVERSATIONS.filter((c) => c.contactId === contact.id)
    : []

  const effectiveNotes = notes !== null ? notes : contact?.notes ?? ''

  const handleSaveNotes = useCallback(() => {
    setIsEditingNotes(false)
  }, [])

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
          <>
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

            <div className="px-3 pt-2 flex gap-1 border-b border-hairline-soft flex-shrink-0">
              <TabButton active={activeTab === 'info'} onClick={() => setActiveTab('info')}>
                Info
              </TabButton>
              <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')}>
                Riwayat
              </TabButton>
            </div>

            <div className="flex-1 overflow-y-auto">
              {activeTab === 'info' ? (
                <InfoTab
                  contact={contact}
                  conversation={conversation!}
                  notes={effectiveNotes}
                  isEditingNotes={isEditingNotes}
                  onNotesChange={setNotes}
                  onStartEditNotes={() => setIsEditingNotes(true)}
                  onSaveNotes={handleSaveNotes}
                  onCancelNotes={() => { setNotes(null); setIsEditingNotes(false) }}
                />
              ) : (
                <HistoryTab
                  activityLog={contact.activityLog}
                  conversations={contactConversations}
                  onSelectConversation={selectConversation}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-2 text-xs font-medium transition-colors relative',
        active ? 'text-ink' : 'text-steel hover:text-ink',
      )}
    >
      {children}
      {active && (
        <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-ink rounded-full" />
      )}
    </button>
  )
}

function InfoTab({
  contact,
  conversation,
  notes,
  isEditingNotes,
  onNotesChange,
  onStartEditNotes,
  onSaveNotes,
  onCancelNotes,
}: {
  contact: Contact
  conversation: NonNullable<ReturnType<typeof MOCK_CONVERSATIONS.find>>
  notes: string
  isEditingNotes: boolean
  onNotesChange: (val: string) => void
  onStartEditNotes: () => void
  onSaveNotes: () => void
  onCancelNotes: () => void
}) {
  return (
    <>
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
            <ChannelIcon channel={conversation.channel} size={14} />
            <span className="text-xs text-ink capitalize">{conversation.channel}</span>
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
              <LabelBadge key={label.id} name={label.name} color={label.color} size="md" />
            ))}
          </div>
        )}
      </div>

      <div className="px-5 py-4 space-y-3">
        <div className="flex items-center justify-between">
          <SectionLabel>Catatan</SectionLabel>
          {!isEditingNotes && (
            <button
              onClick={onStartEditNotes}
              className="text-[11px] font-medium text-brand-blue hover:text-brand-blue-deep transition-colors"
            >
              Edit
            </button>
          )}
        </div>
        {isEditingNotes ? (
          <div className="space-y-2">
            <textarea
              value={notes}
              onChange={(e) => onNotesChange(e.target.value)}
              placeholder="Tambahkan catatan..."
              rows={4}
              className="w-full resize-none rounded-lg border border-hairline bg-canvas px-3 py-2.5 text-xs text-ink placeholder:text-stone focus:outline-none focus:border-brand-blue-deep"
            />
            <div className="flex gap-1.5">
              <button
                onClick={onSaveNotes}
                className="px-3 py-1 text-[11px] font-medium bg-ink text-white rounded-full hover:bg-charcoal transition-colors"
              >
                Simpan
              </button>
              <button
                onClick={onCancelNotes}
                className="px-3 py-1 text-[11px] font-medium text-steel hover:text-ink rounded-full hover:bg-surface transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-charcoal leading-relaxed">
            {notes || <span className="text-stone italic">Belum ada catatan</span>}
          </p>
        )}
      </div>
    </>
  )
}

function HistoryTab({
  activityLog,
  conversations,
  onSelectConversation,
}: {
  activityLog: ActivityLog[]
  conversations: NonNullable<ReturnType<typeof MOCK_CONVERSATIONS.find>>[]
  onSelectConversation: (id: string | null) => void
}) {
  return (
    <>
      <div className="px-5 py-4 border-b border-hairline-soft">
        <SectionLabel>Aktivitas</SectionLabel>
        {activityLog.length === 0 ? (
          <p className="text-xs text-stone mt-2">Belum ada aktivitas</p>
        ) : (
          <div className="mt-3 space-y-0">
            {activityLog.map((log) => (
              <div key={log.id} className="flex gap-3 pb-3 last:pb-0">
                <div className="flex flex-col items-center flex-shrink-0">
                  <span className="text-sm">{ACTIVITY_ICON[log.type] || '📋'}</span>
                  <div className="w-px flex-1 bg-hairline-soft mt-1" />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-xs text-ink leading-relaxed">{log.description}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {log.agentName && (
                      <span className="text-[10px] text-brand-blue font-medium">{log.agentName}</span>
                    )}
                    <span className="text-[10px] text-stone">{formatRelativeTime(log.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-5 py-4 space-y-3">
        <SectionLabel>Riwayat Percakapan</SectionLabel>
        {conversations.length === 0 ? (
          <p className="text-xs text-stone">Belum ada percakapan</p>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className="w-full px-3 py-2.5 text-left rounded-lg border border-hairline hover:bg-surface-soft transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <ChannelIcon channel={conv.channel} size={12} />
                  <span className="text-xs font-medium text-ink capitalize">{conv.channel}</span>
                  <span className="text-[10px] text-stone">{formatRelativeTime(conv.lastMessageAt)}</span>
                </div>
                <p className="text-[11px] text-slate truncate">{conv.lastMessage}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </>
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
