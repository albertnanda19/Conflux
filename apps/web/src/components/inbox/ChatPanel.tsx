import { useMemo, useRef, useEffect, useCallback, memo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { cn } from '@/lib/utils'
import { useInboxStore } from '@/stores/ui'
import { queryKeys } from '@/lib/queryKeys'
import { useConversation, useMessages, useConversationMutations } from '@/hooks/inbox'
import type { Message } from '@/types/inbox'
import { ChannelIcon } from './ChannelIcon'
import { MessageInput } from './MessageInput'
import { MediaMessage } from './MediaMessage'
import { ActionBar } from './ActionBar'

export function ChatPanel() {
  const { selectedConversationId, detailPanelOpen, setDetailPanelOpen } = useInboxStore()
  const scrollRef = useRef<HTMLDivElement>(null)
  const qc = useQueryClient()

  const { data: conversation, isLoading: convLoading } = useConversation(selectedConversationId)
  const { data: messagesData } = useMessages(selectedConversationId)
  const { send, sendMedia, assign, transfer, setStatus, markRead, addLabel, removeLabel, assignAi, deactivateAi } = useConversationMutations(selectedConversationId)

  const conversationMessages = useMemo(() => messagesData?.data ?? [], [messagesData])
  const currentStatus = conversation?.status ?? 'open'
  const currentAgent = conversation?.assignedAgent

  useEffect(() => {
    if (selectedConversationId && conversation && conversation.unreadCount > 0) {
      markRead.mutate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversationId, conversation?.unreadCount])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [conversationMessages.length, selectedConversationId])

  const groupedMessages = useMemo(() => {
    const groups: { date: string; messages: Message[] }[] = []
    let currentDate = ''
    for (const msg of conversationMessages) {
      const date = new Date(msg.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
      if (date !== currentDate) {
        currentDate = date
        groups.push({ date, messages: [] })
      }
      groups[groups.length - 1]!.messages.push(msg)
    }
    return groups
  }, [conversationMessages])

  const handleSend = useCallback((content: string) => {
    if (!selectedConversationId || !content.trim()) return
    send.mutate({ text: content, tempId: `temp_${crypto.randomUUID()}` })
  }, [selectedConversationId, send])

  const handleRetry = useCallback((message: Message) => {
    if (!selectedConversationId) return
    qc.setQueryData<{ data: Message[]; nextCursor: string | null }>(
      queryKeys.messages(selectedConversationId),
      (prev) => (prev ? { ...prev, data: prev.data.filter((m) => m.id !== message.id) } : prev),
    )
    send.mutate({ text: message.content, tempId: `temp_${crypto.randomUUID()}` })
  }, [selectedConversationId, send, qc])

  const handleFileSelect = useCallback((file: File) => {
    if (!selectedConversationId) return
    sendMedia.mutate({ file, tempId: `temp_${crypto.randomUUID()}` })
  }, [selectedConversationId, sendMedia])

  const handleAssignAgent = useCallback((agentId: string) => assign.mutate(agentId), [assign])
  const handleTransfer = useCallback((agentId: string, notes: string) => transfer.mutate({ agentId, note: notes }), [transfer])
  const handleAssignAi = useCallback((aiAssistantId: string) => assignAi.mutate(aiAssistantId), [assignAi])
  const handleDeactivateAi = useCallback(() => deactivateAi.mutate(), [deactivateAi])
  const handleResolve = useCallback(() => setStatus.mutate(currentStatus === 'resolved' ? 'open' : 'resolved'), [setStatus, currentStatus])
  const handleSnooze = useCallback(() => setStatus.mutate(currentStatus === 'snoozed' ? 'open' : 'snoozed'), [setStatus, currentStatus])
  const currentLabelIds = useMemo(() => conversation?.labels.map((l) => l.id) ?? [], [conversation])
  const handleToggleLabel = useCallback((labelId: string) => {
    if (currentLabelIds.includes(labelId)) removeLabel.mutate(labelId)
    else addLabel.mutate(labelId)
  }, [currentLabelIds, addLabel, removeLabel])

  if (!selectedConversationId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-canvas">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-surface mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-steel" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <p className="text-sm text-steel">Pilih percakapan untuk mulai</p>
        </div>
      </div>
    )
  }

  if (convLoading || !conversation) {
    return <div className="flex-1 flex items-center justify-center bg-canvas"><p className="text-sm text-steel">Memuat percakapan...</p></div>
  }

  const contactName = conversation.contact.name || 'Tanpa Nama'

  return (
    <div className="flex-1 flex flex-col h-full bg-canvas min-w-0">
      <button
        onClick={() => setDetailPanelOpen(!detailPanelOpen)}
        className="h-14 px-4 flex items-center gap-3 border-b border-hairline flex-shrink-0 w-full text-left hover:bg-surface-soft transition-colors"
      >
        <div className="w-9 h-9 rounded-full bg-surface flex items-center justify-center text-sm font-semibold text-ink flex-shrink-0">
          {contactName.split(' ').map((n) => n[0]).join('').slice(0, 2)}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-ink truncate">{contactName}</span>
            <ChannelIcon channel={conversation.channel} size={14} />
          </div>
          <p className="text-[11px] text-steel">
            {conversation.isAiHandling ? (
              <span className="text-cyan-600">🤖 AI sedang menangani</span>
            ) : conversation.assignedAgent ? (
              <span>• {conversation.assignedAgent.name}</span>
            ) : (
              <span>• Belum di-assign</span>
            )}
          </p>
        </div>
      </button>

      <ActionBar
        contactName={contactName}
        assignedAgent={currentAgent}
        status={currentStatus}
        labelIds={currentLabelIds}
        isAiHandling={conversation.isAiHandling}
        aiAssistantName={conversation.aiAssistant?.name}
        aiAssistantId={conversation.aiAssistantId}
        onToggleLabel={handleToggleLabel}
        onAssignAgent={handleAssignAgent}
        onTransfer={handleTransfer}
        onAssignAi={handleAssignAi}
        onDeactivateAi={handleDeactivateAi}
        onResolve={handleResolve}
        onSnooze={handleSnooze}
      />

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {groupedMessages.map((group) => (
          <div key={group.date}>
            <div className="flex items-center gap-3 my-3">
              <div className="flex-1 h-px bg-hairline-soft" />
              <span className="text-[11px] text-stone font-medium">{group.date}</span>
              <div className="flex-1 h-px bg-hairline-soft" />
            </div>
            <div className="space-y-2">
              {group.messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} onRetry={handleRetry} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <MessageInput onSend={handleSend} onFileSelect={handleFileSelect} />
    </div>
  )
}

const MessageBubble = memo(function MessageBubble({ message, onRetry }: { message: Message; onRetry: (m: Message) => void }) {
  const isOutbound = message.direction === 'outbound'
  const hasMedia = message.contentType && message.contentType !== 'text'

  return (
    <div className={cn('flex', isOutbound ? 'justify-end' : 'justify-start')}>
      <div className="max-w-[75%]">
        <div
          className={cn(
            'rounded-2xl overflow-hidden',
            isOutbound ? 'bg-brand-blue text-white rounded-br-md' : 'bg-surface text-ink rounded-bl-md',
            hasMedia && 'bg-transparent text-ink',
          )}
        >
          {hasMedia ? (
            <MediaMessage message={message} isOutbound={isOutbound} />
          ) : (
            <div className="px-3.5 py-2.5 text-sm leading-relaxed">
              {!isOutbound && message.senderType === 'ai' && (
                <span className="block text-[10px] font-semibold text-cyan-500 mb-1">🤖 AI Assistant</span>
              )}
              {!isOutbound && message.senderType === 'agent' && message.senderName && (
                <span className="block text-[10px] font-semibold text-brand-blue mb-1">{message.senderName}</span>
              )}
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          )}
          <div className={cn('flex items-center gap-1 px-3.5 pb-2', isOutbound ? 'justify-end' : 'justify-start')}>
            <span className={cn('text-[10px]', isOutbound ? 'text-white/60' : 'text-steel')}>
              {new Date(message.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </span>
            {isOutbound && (
              <span className="flex-shrink-0">
                {message.status === 'sending' && (
                  <svg className="w-3.5 h-3.5 text-white/50 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="9" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
                  </svg>
                )}
                {message.status === 'read' && (
                  <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 12.5l5 5L17.5 7" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 12.5l5 5L22.5 7" />
                  </svg>
                )}
                {message.status === 'delivered' && (
                  <svg className="w-4 h-4 text-emerald-500/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M1.5 12.5l5 5L17.5 7" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 12.5l5 5L22.5 7" />
                  </svg>
                )}
                {message.status === 'sent' && (
                  <svg className="w-3.5 h-3.5 text-emerald-500/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12.5l5 5L20 7" />
                  </svg>
                )}
                {message.status === 'failed' && (
                  <svg className="w-3.5 h-3.5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </span>
            )}
          </div>
        </div>
        {isOutbound && message.status === 'failed' && (
          <button
            onClick={() => onRetry(message)}
            className="mt-1 flex items-center gap-1 text-[10px] font-medium text-red-500 hover:text-red-600"
          >
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M5 9a7 7 0 0111-3M19 15a7 7 0 01-11 3" />
            </svg>
            Gagal terkirim · Coba lagi
          </button>
        )}
      </div>
    </div>
  )
})
