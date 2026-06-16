import { useState, useCallback, useRef, useEffect } from 'react'
import { useAISettingsStore } from '@/stores/ai-settings'

interface ChatMessage {
  role: 'user' | 'ai'
  text: string
}

const MOCK_RESPONSES: Record<string, string> = {
  'harga': 'Program Data Science Bootcamp kami dibanderol seharga Rp 8.500.000. Untuk early bird, ada diskon 15% jika mendaftar 30 hari sebelum batch dimulai. Pembayaran bisa dicicil 3x tanpa bunga.',
  'jadwal': 'Batch berikutnya mulai 7 Juli 2026 dan berakhir 24 Oktober 2026. Kelas diadakan Senin–Rabu pukul 19.00–21.30 WIB. Masih ada slot!',
  'daftar': 'Untuk mendaftar, Anda perlu: (1) minimal 18 tahun, (2) mengisi formulir online, dan (3) membayar DP Rp 1.000.000. Mau saya bantu proses pendaftarannya?',
  'bayar': 'Kami menerima transfer Bank BCA (1234567890) dan Bank Mandiri (0987654321) a.n. Acme Corp. Pembayaran juga bisa via credit card Midtrans.',
  'konsultasi': 'Tentu! Saya akan menghubungkan Anda dengan tim kami untuk sesi konsultasi gratis. Mohon tunggu sebentar ya 😊',
  'default': 'Terima kasih atas pertanyaannya! Berdasarkan knowledge base kami, saya akan membantu menjawab. Silakan tanyakan lebih spesifik tentang program, harga, jadwal, atau cara pendaftaran.',
}

function getAIResponse(input: string): string {
  const lower = input.toLowerCase()
  for (const [keyword, response] of Object.entries(MOCK_RESPONSES)) {
    if (keyword !== 'default' && lower.includes(keyword)) return response
  }
  return MOCK_RESPONSES.default
}

export function AIChatPreview() {
  const { persona } = useAISettingsStore()
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', text: `Halo! Saya ${persona.name}. Ada yang bisa saya bantu hari ini? 😊` },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = useCallback(() => {
    const text = input.trim()
    if (!text) return

    setMessages((prev) => [...prev, { role: 'user', text }])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'ai', text: getAIResponse(text) }])
      setIsTyping(false)
    }, 800 + Math.random() * 700)
  }, [input])

  return (
    <div className="flex flex-col h-full">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
      >
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
          disabled={!input.trim()}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-brand-blue-deep text-white hover:bg-brand-blue-700 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>

      <div className="px-4 py-2 text-center border-t border-hairline-soft">
        <p className="text-[10px] text-stone">
          Persona: {persona.name} · Tone: {persona.tone} · Mode simulasi (mock responses)
        </p>
      </div>
    </div>
  )
}
