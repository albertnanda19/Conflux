import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { useInboxStore } from '@/stores/ui'
import { formatRelativeTime } from '@/lib/utils'
import { MOCK_CONVERSATIONS, type Conversation, type ChannelType } from '@/mock/inbox'
import { ChannelIcon } from './ChannelIcon'

type FilterTab = 'all' | ChannelType

const FILTER_TABS: { value: FilterTab; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'whatsapp', label: 'WA' },
  { value: 'instagram', label: 'IG' },
  { value: 'facebook', label: 'FB' },
]

const STATUS_LABEL: Record<string, string> = {
  open: 'Open',
  pending: 'Pending',
  resolved: 'Resolved',
  snoozed: 'Snoozed',
}

const STATUS_STYLE: Record<string, string> = {
  open: 'bg-brand-blue-200 text-brand-blue-deep',
  pending: 'bg-amber-50 text-amber-700',
  resolved: 'bg-emerald-50 text-emerald-700',
  snoozed: 'bg-gray-100 text-gray-600',
}

export function ConversationList() {
  const { selectedConversationId, selectConversation } = useInboxStore()
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    let result = MOCK_CONVERSATIONS
    if (activeTab !== 'all') {
      result = result.filter((c) => c.channel === activeTab)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (c) =>
          c.contact.name.toLowerCase().includes(q) ||
          c.lastMessage.toLowerCase().includes(q),
      )
    }
    return result
  }, [activeTab, searchQuery])

  const sorted = useMemo(
    () => [...filtered].sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()),
    [filtered],
  )

  return (
    <div className="w-80 h-full flex flex-col border-r border-hairline bg-canvas flex-shrink-0">
      <div className="h-14 px-4 flex items-center border-b border-hairline flex-shrink-0">
        <h2 className="text-sm font-semibold text-ink">Inbox</h2>
        <span className="ml-2 text-xs text-steel">{sorted.length}</span>
      </div>

      <div className="px-3 pt-3 flex-shrink-0">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steel pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Cari percakapan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full pl-9 pr-3 rounded-md border border-hairline bg-surface text-sm text-ink placeholder:text-stone focus:outline-none focus:border-brand-blue-deep"
          />
        </div>
      </div>

      <div className="px-3 pt-2 pb-1 flex gap-1.5 flex-shrink-0">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              'px-3 py-1 text-xs font-medium rounded-full border transition-colors',
              activeTab === tab.value
                ? 'bg-brand-blue text-white border-brand-blue'
                : 'bg-canvas text-steel border-hairline hover:text-ink',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {sorted.length === 0 && (
          <p className="px-4 py-10 text-sm text-steel text-center">Tidak ada percakapan</p>
        )}
        {sorted.map((conv) => (
          <ConversationItem
            key={conv.id}
            conversation={conv}
            isSelected={conv.id === selectedConversationId}
            onSelect={() => selectConversation(conv.id)}
          />
        ))}
      </div>
    </div>
  )
}

function ConversationItem({
  conversation,
  isSelected,
  onSelect,
}: {
  conversation: Conversation
  isSelected: boolean
  onSelect: () => void
}) {
  const { contact, channel, lastMessage, lastMessageAt, unreadCount, assignedAgent, isAiHandling, status } =
    conversation

  return (
    <button
      onClick={onSelect}
      className={cn(
        'w-full px-3 py-3 flex gap-3 text-left transition-colors border-b border-hairline-soft',
        isSelected ? 'bg-surface' : 'hover:bg-surface-soft',
      )}
    >
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-sm font-semibold text-ink">
          {contact.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)}
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-canvas border-2 border-canvas flex items-center justify-center">
          <ChannelIcon channel={channel} size={12} />
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className="text-sm font-medium text-ink truncate">{contact.name}</span>
          <span className="text-[11px] text-steel flex-shrink-0">{formatRelativeTime(lastMessageAt)}</span>
        </div>
        <p className="text-xs text-slate truncate mb-1">{lastMessage}</p>
        <div className="flex items-center gap-1.5">
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-brand-blue text-white text-[10px] font-semibold">
              {unreadCount}
            </span>
          )}
          <span className={cn('text-[10px] font-semibold rounded-full px-2 py-0.5', STATUS_STYLE[status])}>
            {STATUS_LABEL[status]}
          </span>
          {isAiHandling && (
            <span className="text-[10px] font-semibold rounded-full px-2 py-0.5 bg-cyan-50 text-cyan-700">
              AI
            </span>
          )}
          {!isAiHandling && assignedAgent && (
            <span className="text-[10px] text-steel">• {assignedAgent.initials}</span>
          )}
        </div>
      </div>
    </button>
  )
}
