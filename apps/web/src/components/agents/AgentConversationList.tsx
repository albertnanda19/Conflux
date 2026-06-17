import { cn } from '@/lib/utils'

interface Conversation {
  id: string
  contactName: string
  channel: 'whatsapp' | 'instagram' | 'facebook'
  lastMessage: string
  lastMessageAt: string
  status: 'open' | 'pending' | 'resolved'
}

const MOCK_RECENT_CONVERSATIONS: Conversation[] = [
  { id: 'c1', contactName: 'Budi Santoso', channel: 'whatsapp', lastMessage: 'Terima kasih atas informasinya', lastMessageAt: new Date(Date.now() - 15 * 60000).toISOString(), status: 'open' },
  { id: 'c2', contactName: 'Siti Rahayu', channel: 'instagram', lastMessage: 'Baik, saya akan hubungi kembali', lastMessageAt: new Date(Date.now() - 45 * 60000).toISOString(), status: 'pending' },
  { id: 'c3', contactName: 'Ahmad Fauzi', channel: 'whatsapp', lastMessage: 'Apakah masih tersedia?', lastMessageAt: new Date(Date.now() - 120 * 60000).toISOString(), status: 'resolved' },
  { id: 'c4', contactName: 'Dewi Lestari', channel: 'facebook', lastMessage: 'Sudah saya terima paketnya', lastMessageAt: new Date(Date.now() - 180 * 60000).toISOString(), status: 'resolved' },
  { id: 'c5', contactName: 'Rina Marlina', channel: 'whatsapp', lastMessage: 'Harga promo sampai kapan?', lastMessageAt: new Date(Date.now() - 300 * 60000).toISOString(), status: 'open' },
]

const CHANNEL_ICON: Record<string, { emoji: string; bg: string }> = {
  whatsapp: { emoji: '📱', bg: 'bg-emerald-50' },
  instagram: { emoji: '📷', bg: 'bg-pink-50' },
  facebook: { emoji: '📘', bg: 'bg-blue-50' },
}

const STATUS_BADGE: Record<string, string> = {
  open: 'bg-emerald-50 text-emerald-700',
  pending: 'bg-amber-50 text-amber-700',
  resolved: 'bg-gray-100 text-gray-500',
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'baru saja'
  if (mins < 60) return `${mins}m lalu`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}j lalu`
  return `${Math.floor(hours / 24)}h lalu`
}

export function AgentConversationList() {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-hairline">
            <th className="py-3 px-4 text-[11px] font-semibold text-steel uppercase tracking-wide">Kontak</th>
            <th className="py-3 px-4 text-[11px] font-semibold text-steel uppercase tracking-wide">Channel</th>
            <th className="py-3 px-4 text-[11px] font-semibold text-steel uppercase tracking-wide">Pesan Terakhir</th>
            <th className="py-3 px-4 text-[11px] font-semibold text-steel uppercase tracking-wide">Status</th>
            <th className="py-3 px-4 text-[11px] font-semibold text-steel uppercase tracking-wide text-right">Waktu</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_RECENT_CONVERSATIONS.map((conv) => {
            const ch = CHANNEL_ICON[conv.channel]
            return (
              <tr key={conv.id} className="border-b border-hairline-soft hover:bg-surface-soft transition-colors">
                <td className="py-3 px-4 text-sm font-medium text-ink">{conv.contactName}</td>
                <td className="py-3 px-4">
                  <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium', ch.bg)}>
                    {ch.emoji} {conv.channel}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-steel max-w-[280px] truncate">{conv.lastMessage}</td>
                <td className="py-3 px-4">
                  <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium', STATUS_BADGE[conv.status])}>
                    {conv.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-[11px] text-steel text-right">{relativeTime(conv.lastMessageAt)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
