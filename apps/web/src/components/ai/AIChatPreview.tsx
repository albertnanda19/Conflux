import { useState, useCallback, useRef, useEffect } from 'react'
import { aiAssistantsApi } from '@/lib/api/ai-assistants'

interface ChatMessage {
  role: 'user' | 'assistant'
  text: string
}

interface AIChatPreviewProps {
  assistantId: string
  personaName: string
}

export function AIChatPreview({ assistantId, personaName }: AIChatPreviewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: `Halo! Saya ${personaName}. Ada yang bisa saya bantu hari ini? 😊` },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [handoff, setHandoff] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text || isTyping) return

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', text }]
    setMessages(nextMessages)
    setInput('')
    setIsTyping(true)
    setHandoff(false)

    try {
      const result = await aiAssistantsApi.testChat(
        assistantId,
        nextMessages.map((m) => ({ role: m.role, content: m.text })),
      )
      setMessages((prev) => [...prev, { role: 'assistant', text: result.response }])
      setHandoff(result.handoffDetected)
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', text: 'Maaf, terjadi kesalahan saat menghubungi AI. Coba lagi.' }])
    } finally {
      setIsTyping(false)
    }
  }, [input, isTyping, messages, assistantId])

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-brand-blue-deep text-white rounded-br-md'
                  : 'bg-surface-soft text-ink border border-hairline-soft rounded-bl-md'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-surface-soft border border-hairline-soft rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-stone rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-stone rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-stone rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        {handoff && !isTyping && (
          <div className="flex justify-center">
            <span className="text-[10px] font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
              ⚡ Sinyal handoff terdeteksi — percakapan akan diserahkan ke agent
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 px-4 py-3 border-t border-hairline-soft">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ketik pesan untuk test AI..."
          className="flex-1 text-sm text-ink bg-canvas border border-hairline-soft rounded-full px-4 py-2.5 placeholder:text-stone focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-brand-blue-deep text-white hover:bg-brand-blue-700 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  )
}
