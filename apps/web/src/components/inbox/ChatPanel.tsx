import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { useInboxStore } from '@/stores/ui'
import { MOCK_CONVERSATIONS, MOCK_AGENTS, MOCK_MESSAGES, type Message, type ConversationStatus, type Agent } from '@/mock/inbox'
import { ChannelIcon } from './ChannelIcon'
import { MessageInput } from './MessageInput'
import { MediaMessage } from './MediaMessage'
import { ActionBar } from './ActionBar'

export function ChatPanel() {
  const { selectedConversationId, detailPanelOpen, setDetailPanelOpen } = useInboxStore()
  const [messages, setMessages] = useState(MOCK_MESSAGES)
  const [convOverrides, setConvOverrides] = useState<Record<string, { status?: ConversationStatus; agent?: Agent | null }>>({})
  const scrollRef = useRef<HTMLDivElement>(null)

  const conversation = MOCK_CONVERSATIONS.find((c) => c.id === selectedConversationId)
  const conversationMessages = selectedConversationId ? messages[selectedConversationId] ?? [] : []

  const overrides = selectedConversationId ? convOverrides[selectedConversationId] : undefined
  const currentStatus = overrides?.status ?? conversation?.status ?? 'open'
  const currentAgent = overrides?.agent !== undefined ? overrides.agent ?? undefined : conversation?.assignedAgent

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [conversationMessages.length, selectedConversationId])

  const groupedMessages = useMemo(() => {
    const groups: { date: string; messages: Message[] }[] = []
    let currentDate = ''
    for (const msg of conversationMessages) {
      const date = new Date(msg.createdAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
      if (date !== currentDate) {
        currentDate = date
        groups.push({ date, messages: [] })
      }
      groups[groups.length - 1].messages.push(msg)
    }
    return groups
  }, [conversationMessages])

  const handleSend = useCallback((content: string) => {
    if (!selectedConversationId) return
    const newMsg: Message = {
      id: `m${Date.now()}`,
      conversationId: selectedConversationId,
      direction: 'outbound',
      senderType: 'agent',
      senderName: 'Anda',
      content,
      contentType: 'text',
      status: 'sent',
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => ({
      ...prev,
      [selectedConversationId]: [...(prev[selectedConversationId] ?? []), newMsg],
    }))
  }, [selectedConversationId])

  const handleFileSelect = useCallback((file: File) => {
    if (!selectedConversationId) return
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')
    const contentType = isImage ? 'image' : isVideo ? 'video' : 'document'
    const newMsg: Message = {
      id: `m${Date.now()}`,
      conversationId: selectedConversationId,
      direction: 'outbound',
      senderType: 'agent',
      senderName: 'Anda',
      content: file.name,
      contentType,
      status: 'sent',
      createdAt: new Date().toISOString(),
      mediaUrl: URL.createObjectURL(file),
      fileName: file.name,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    }
    setMessages((prev) => ({
      ...prev,
      [selectedConversationId]: [...(prev[selectedConversationId] ?? []), newMsg],
    }))
  }, [selectedConversationId])

  const handleAssignAgent = useCallback((agentId: string) => {
    if (!selectedConversationId) return
    const agent = MOCK_AGENTS.find((a) => a.id === agentId)
    setConvOverrides((prev) => ({
      ...prev,
      [selectedConversationId]: { ...prev[selectedConversationId], agent: agent ?? null },
    }))
  }, [selectedConversationId])

  const handleTransfer = useCallback((agentId: string, notes: string) => {
    if (!selectedConversationId) return
    const agent = MOCK_AGENTS.find((a) => a.id === agentId)
    setConvOverrides((prev) => ({
      ...prev,
      [selectedConversationId]: { ...prev[selectedConversationId], agent: agent ?? null },
    }))
    if (notes) {
      const systemMsg: Message = {
        id: `m${Date.now()}`,
        conversationId: selectedConversationId,
        direction: 'outbound',
        senderType: 'system',
        content: `Percakapan ditransfer. Catatan: ${notes}`,
        contentType: 'text',
        status: 'delivered',
        createdAt: new Date().toISOString(),
      }
      setMessages((prev) => ({
        ...prev,
        [selectedConversationId]: [...(prev[selectedConversationId] ?? []), systemMsg],
      }))
    }
  }, [selectedConversationId])

  const handleResolve = useCallback(() => {
    if (!selectedConversationId) return
    setConvOverrides((prev) => ({
      ...prev,
      [selectedConversationId]: {
        ...prev[selectedConversationId],
        status: currentStatus === 'resolved' ? 'open' : 'resolved',
      },
    }))
  }, [selectedConversationId, currentStatus])

  const handleSnooze = useCallback(() => {
    if (!selectedConversationId) return
    setConvOverrides((prev) => ({
      ...prev,
      [selectedConversationId]: {
        ...prev[selectedConversationId],
        status: currentStatus === 'snoozed' ? 'open' : 'snoozed',
      },
    }))
  }, [selectedConversationId, currentStatus])

  if (!conversation) {
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

  return (
    <div className="flex-1 flex flex-col h-full bg-canvas min-w-0">
      <button
        onClick={() => setDetailPanelOpen(!detailPanelOpen)}
        className="h-14 px-4 flex items-center gap-3 border-b border-hairline flex-shrink-0 w-full text-left hover:bg-surface-soft transition-colors"
      >
        <div className="w-9 h-9 rounded-full bg-surface flex items-center justify-center text-sm font-semibold text-ink flex-shrink-0">
          {conversation.contact.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-ink truncate">{conversation.contact.name}</span>
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
        contactName={conversation.contact.name}
        assignedAgent={currentAgent}
        status={currentStatus}
        onAssignAgent={handleAssignAgent}
        onTransfer={handleTransfer}
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
                <MessageBubble key={msg.id} message={msg} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <MessageInput onSend={handleSend} onFileSelect={handleFileSelect} />
    </div>
  )
}

function MessageBubble({ message }: { message: Message }) {
  const isOutbound = message.direction === 'outbound'
  const hasMedia = message.contentType && message.contentType !== 'text'

  return (
    <div className={cn('flex', isOutbound ? 'justify-end' : 'justify-start')}>
      <div className="max-w-[75%]">
        <div
          className={cn(
            'rounded-2xl overflow-hidden',
            isOutbound ? 'bg-brand-blue text-white rounded-br-md' : 'bg-surface text-ink rounded-bl-md',
            hasMedia && (isOutbound ? 'bg-transparent text-ink' : 'bg-transparent text-ink'),
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
          <div
            className={cn(
              'flex items-center gap-1 px-3.5 pb-2',
              isOutbound ? 'justify-end' : 'justify-start',
            )}
          >
            <span className={cn('text-[10px]', isOutbound ? 'text-white/60' : 'text-steel')}>
              {new Date(message.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
            </span>
            {isOutbound && (
              <span className="flex-shrink-0">
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
      </div>
    </div>
  )
}
