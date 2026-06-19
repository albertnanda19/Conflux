import { useState, useEffect, useRef, useMemo, memo, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { useInboxStore } from '@/stores/ui'
import { formatRelativeTime } from '@/lib/utils'
import { useConversations, useAgents, useLabels } from '@/hooks/inbox'
import type { ConversationListItem, ConversationFilters } from '@/lib/api/inbox'
import type { ChannelType } from '@/types/inbox'
import { ChannelIcon } from './ChannelIcon'

type FilterTab = 'all' | ChannelType

const FILTER_TABS: { value: FilterTab; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'whatsapp', label: 'WA' },
  { value: 'instagram', label: 'IG' },
  { value: 'facebook', label: 'FB' },
  { value: 'telegram', label: 'TG' },
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

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'waiting', label: 'Terlama Menunggu' },
  { value: 'priority', label: 'Prioritas' },
]

const STATUS_FILTER_OPTIONS: { value: 'open' | 'pending' | 'resolved' | 'snoozed'; label: string }[] = [
  { value: 'open', label: 'Open' },
  { value: 'pending', label: 'Pending' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'snoozed', label: 'Snoozed' },
]

const DATE_OPTIONS: { value: 'all' | 'today' | '7d' | '30d'; label: string }[] = [
  { value: 'all', label: 'Semua Tanggal' },
  { value: 'today', label: 'Hari Ini' },
  { value: '7d', label: '7 Hari Terakhir' },
  { value: '30d', label: '30 Hari Terakhir' },
]

export function ConversationList() {
  const {
    selectedConversationId, selectConversation,
    agentFilter, setAgentFilter, labelFilter, toggleLabelFilter,
    sortBy, setSortBy, searchQuery, setSearchQuery, channelTab, setChannelTab,
    statusFilter, setStatusFilter, dateFilter, setDateFilter,
  } = useInboxStore()
  const [showAgentDropdown, setShowAgentDropdown] = useState(false)
  const [showLabelDropdown, setShowLabelDropdown] = useState(false)
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [showDateDropdown, setShowDateDropdown] = useState(false)
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery)
  const agentRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)
  const sortRef = useRef<HTMLDivElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)
  const dateRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchQuery), 300)
    return () => clearTimeout(t)
  }, [searchQuery])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (agentRef.current && !agentRef.current.contains(e.target as Node)) setShowAgentDropdown(false)
      if (labelRef.current && !labelRef.current.contains(e.target as Node)) setShowLabelDropdown(false)
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setShowSortDropdown(false)
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) setShowStatusDropdown(false)
      if (dateRef.current && !dateRef.current.contains(e.target as Node)) setShowDateDropdown(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filters = useMemo<ConversationFilters>(() => ({
    channel: channelTab === 'all' ? undefined : channelTab,
    status: statusFilter ?? undefined,
    agentId: agentFilter ?? undefined,
    labelIds: labelFilter.length > 0 ? labelFilter : undefined,
    search: debouncedSearch.trim() || undefined,
    datePreset: dateFilter === 'all' ? undefined : dateFilter,
    sortBy,
    limit: 50,
  }), [channelTab, statusFilter, agentFilter, labelFilter, debouncedSearch, dateFilter, sortBy])

  const { data, isLoading, isError } = useConversations(filters)
  const { data: agents = [] } = useAgents()
  const { data: labels = [] } = useLabels()

  const conversations = data?.data ?? []

  return (
    <div className="w-80 h-full flex flex-col border-r border-hairline bg-canvas flex-shrink-0">
      <div className="h-14 px-4 flex items-center border-b border-hairline flex-shrink-0">
        <h2 className="text-sm font-semibold text-ink">Inbox</h2>
        <span className="ml-2 text-xs text-steel">{data?.meta.total ?? 0}</span>
      </div>

      <div className="px-3 pt-3 flex-shrink-0">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-steel pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
            onClick={() => setChannelTab(tab.value)}
            className={cn(
              'px-3 py-1 text-xs font-medium rounded-full border transition-colors',
              channelTab === tab.value
                ? 'bg-brand-blue text-white border-brand-blue'
                : 'bg-canvas text-steel border-hairline hover:text-ink',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="px-3 pt-2 pb-1 flex flex-wrap gap-2 flex-shrink-0">
        <div ref={statusRef} className="relative">
          <button
            onClick={() => { setShowStatusDropdown(!showStatusDropdown); setShowAgentDropdown(false); setShowLabelDropdown(false); setShowSortDropdown(false); setShowDateDropdown(false) }}
            className={cn(
              'inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-full border transition-colors',
              statusFilter ? 'bg-brand-blue-200 text-brand-blue-deep border-brand-blue-200' : 'bg-canvas text-steel border-hairline hover:text-ink',
            )}
          >
            <span className="truncate">{statusFilter ? STATUS_FILTER_OPTIONS.find((o) => o.value === statusFilter)?.label : 'Status'}</span>
            <span className="text-[10px] flex-shrink-0">▾</span>
          </button>
          {showStatusDropdown && (
            <div className="absolute top-full left-0 mt-1 w-44 bg-canvas border border-hairline rounded-xl shadow-lg z-50 py-1">
              <button onClick={() => { setStatusFilter(null); setShowStatusDropdown(false) }} className="w-full px-3 py-2 text-xs text-left text-ink hover:bg-surface-soft">Semua Status</button>
              {STATUS_FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setStatusFilter(opt.value); setShowStatusDropdown(false) }}
                  className={cn('w-full px-3 py-2 text-xs text-left hover:bg-surface-soft', statusFilter === opt.value && 'bg-surface text-ink font-medium')}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div ref={dateRef} className="relative">
          <button
            onClick={() => { setShowDateDropdown(!showDateDropdown); setShowAgentDropdown(false); setShowLabelDropdown(false); setShowSortDropdown(false); setShowStatusDropdown(false) }}
            className={cn(
              'inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-full border transition-colors',
              dateFilter !== 'all' ? 'bg-brand-blue-200 text-brand-blue-deep border-brand-blue-200' : 'bg-canvas text-steel border-hairline hover:text-ink',
            )}
          >
            <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0V11.25A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <span className="truncate">{DATE_OPTIONS.find((o) => o.value === dateFilter)?.label}</span>
            <span className="text-[10px] flex-shrink-0">▾</span>
          </button>
          {showDateDropdown && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-canvas border border-hairline rounded-xl shadow-lg z-50 py-1">
              {DATE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setDateFilter(opt.value); setShowDateDropdown(false) }}
                  className={cn('w-full px-3 py-2 text-xs text-left hover:bg-surface-soft', dateFilter === opt.value && 'bg-surface text-ink font-medium')}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div ref={agentRef} className="relative">
          <button
            onClick={() => { setShowAgentDropdown(!showAgentDropdown); setShowLabelDropdown(false); setShowSortDropdown(false) }}
            className={cn(
              'w-[110px] inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-full border transition-colors',
              agentFilter ? 'bg-brand-blue-200 text-brand-blue-deep border-brand-blue-200' : 'bg-canvas text-steel border-hairline hover:text-ink',
            )}
          >
            <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <span className="truncate flex-1 min-w-0">
              {agentFilter ? agents.find((a) => a.id === agentFilter)?.name ?? 'Agent' : 'Agent'}
            </span>
            {agentFilter && (
              <button onClick={(e) => { e.stopPropagation(); setAgentFilter(null) }} className="w-3.5 h-3.5 rounded-full bg-brand-blue-deep/20 flex items-center justify-center flex-shrink-0 hover:bg-brand-blue-deep/30">
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            {!agentFilter && <span className="text-[10px] ml-0.5 flex-shrink-0">▾</span>}
          </button>
          {showAgentDropdown && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-canvas border border-hairline rounded-xl shadow-lg z-50 py-1 max-h-60 overflow-y-auto">
              <button onClick={() => { setAgentFilter(null); setShowAgentDropdown(false) }} className="w-full px-3 py-2 text-xs text-left text-ink hover:bg-surface-soft">Semua Agent</button>
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => { setAgentFilter(agent.id); setShowAgentDropdown(false) }}
                  className={cn('w-full px-3 py-2 text-xs text-left flex items-center gap-2 hover:bg-surface-soft', agentFilter === agent.id && 'bg-surface')}
                >
                  <span className={cn('w-2 h-2 rounded-full', agent.status === 'online' ? 'bg-emerald-500' : agent.status === 'busy' ? 'bg-amber-500' : 'bg-gray-400')} />
                  <span className="text-ink">{agent.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div ref={labelRef} className="relative">
          <button
            onClick={() => { setShowLabelDropdown(!showLabelDropdown); setShowAgentDropdown(false); setShowSortDropdown(false) }}
            className={cn(
              'px-2.5 py-1 text-[11px] font-medium rounded-full border transition-colors',
              labelFilter.length > 0 ? 'bg-brand-blue-200 text-brand-blue-deep border-brand-blue-200' : 'bg-canvas text-steel border-hairline hover:text-ink',
            )}
          >
            Label {labelFilter.length > 0 ? `(${labelFilter.length})` : '▾'}
          </button>
          {showLabelDropdown && (
            <div className="absolute top-full left-0 mt-1 w-52 bg-canvas border border-hairline rounded-xl shadow-lg z-50 py-1 max-h-60 overflow-y-auto">
              {labels.map((label) => (
                <button
                  key={label.id}
                  onClick={() => toggleLabelFilter(label.id)}
                  className={cn('w-full px-3 py-2 text-xs text-left flex items-center gap-2 hover:bg-surface-soft', labelFilter.includes(label.id) && 'bg-surface')}
                >
                  <span className="w-3 h-3 rounded-full border flex-shrink-0" style={{ backgroundColor: label.color }} />
                  <span className="text-ink flex-1">{label.name}</span>
                  {labelFilter.includes(label.id) && (
                    <svg className="w-3.5 h-3.5 text-brand-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div ref={sortRef} className="relative">
          <button
            onClick={() => { setShowSortDropdown(!showSortDropdown); setShowAgentDropdown(false); setShowLabelDropdown(false) }}
            className={cn(
              'inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-full border transition-colors',
              sortBy !== 'newest' ? 'bg-brand-blue-200 text-brand-blue-deep border-brand-blue-200' : 'bg-canvas text-steel border-hairline hover:text-ink',
            )}
          >
            <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h6M3 12h10M3 17h14" />
            </svg>
            <span className="truncate">{SORT_OPTIONS.find((o) => o.value === sortBy)?.label ?? 'Sort'}</span>
            <span className="text-[10px] ml-0.5 flex-shrink-0">▾</span>
          </button>
          {showSortDropdown && (
            <div className="absolute top-full right-0 mt-1 w-48 bg-canvas border border-hairline rounded-xl shadow-lg z-50 py-1">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setSortBy(opt.value as 'newest' | 'waiting' | 'priority'); setShowSortDropdown(false) }}
                  className={cn('w-full px-3 py-2 text-xs text-left flex items-center gap-2 hover:bg-surface-soft', sortBy === opt.value && 'bg-surface text-ink font-medium')}
                >
                  {sortBy === opt.value && (
                    <svg className="w-3.5 h-3.5 text-brand-blue flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {sortBy !== opt.value && <span className="w-3.5" />}
                  <span className="text-ink">{opt.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading && (
          <div className="px-3 py-3 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-surface flex-shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 bg-surface rounded w-2/3" />
                  <div className="h-2.5 bg-surface rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        )}
        {isError && <p className="px-4 py-10 text-sm text-red-500 text-center">Gagal memuat percakapan</p>}
        {!isLoading && !isError && conversations.length === 0 && (
          <p className="px-4 py-10 text-sm text-steel text-center">Tidak ada percakapan</p>
        )}
        {conversations.map((conv) => (
          <ConversationItem
            key={conv.id}
            conversation={conv}
            isSelected={conv.id === selectedConversationId}
            onSelect={selectConversation}
          />
        ))}
      </div>
    </div>
  )
}

const ConversationItem = memo(function ConversationItem({
  conversation,
  isSelected,
  onSelect,
}: {
  conversation: ConversationListItem
  isSelected: boolean
  onSelect: (id: string) => void
}) {
  const { contact, channel, lastMessage, lastMessageAt, unreadCount, assignedAgent, isAiHandling, status } = conversation
  const name = contact.name || 'Tanpa Nama'
  const handleClick = useCallback(() => onSelect(conversation.id), [onSelect, conversation.id])

  return (
    <button
      onClick={handleClick}
      className={cn(
        'w-full px-3 py-3 flex gap-3 text-left transition-colors border-b border-hairline-soft',
        isSelected ? 'bg-surface' : 'hover:bg-surface-soft',
      )}
    >
      <div className="relative flex-shrink-0">
        <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center text-sm font-semibold text-ink">
          {name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-canvas border-2 border-canvas flex items-center justify-center">
          <ChannelIcon channel={channel} size={12} />
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <span className="text-sm font-medium text-ink truncate">{name}</span>
          {lastMessageAt && <span className="text-[11px] text-steel flex-shrink-0">{formatRelativeTime(lastMessageAt)}</span>}
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
            <span className="text-[10px] font-semibold rounded-full px-2 py-0.5 bg-cyan-50 text-cyan-700">AI</span>
          )}
          {!isAiHandling && assignedAgent && (
            <span className="text-[10px] text-steel">• {assignedAgent.initials}</span>
          )}
        </div>
      </div>
    </button>
  )
})
