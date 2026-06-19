import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ChannelIcon } from '@/components/inbox/ChannelIcon'
import { ChannelConnectModal } from '@/components/channels/ChannelConnectModal'
import { useChannels } from '@/hooks/inbox'
import type { ChannelInstance } from '@/lib/api/inbox'

export type ChannelCatalogEntry = {
  provider: string
  name: string
  type: string
  icon: 'whatsapp' | 'instagram' | 'facebook' | 'telegram' | 'livechat'
  description: string
  official: boolean
}

const CATALOG: ChannelCatalogEntry[] = [
  { provider: 'whatsapp_cloud', name: 'WhatsApp Business (Cloud API)', type: 'whatsapp', icon: 'whatsapp', description: 'Resmi via Meta Cloud API. Butuh verifikasi bisnis.', official: true },
  { provider: 'whatsapp_fonnte', name: 'WhatsApp (Fonnte)', type: 'whatsapp', icon: 'whatsapp', description: 'Unofficial gateway, mudah untuk testing.', official: false },
  { provider: 'telegram_bot', name: 'Telegram Bot', type: 'telegram', icon: 'telegram', description: 'Via Bot API token dari @BotFather.', official: true },
  { provider: 'instagram', name: 'Instagram Messaging', type: 'instagram', icon: 'instagram', description: 'DM & story mention via Meta. Butuh akun bisnis.', official: true },
  { provider: 'facebook', name: 'Facebook Messenger', type: 'facebook', icon: 'facebook', description: 'Via Meta Messenger Platform.', official: true },
  { provider: 'livechat', name: 'Live Chat Widget', type: 'livechat', icon: 'livechat', description: 'Widget chat untuk website perusahaan.', official: true },
]

export type ChannelCardData = ChannelCatalogEntry & {
  instance?: ChannelInstance
}

export function ChannelsPage() {
  const { data: channels = [], isLoading } = useChannels()
  const [active, setActive] = useState<ChannelCardData | null>(null)

  const cards: ChannelCardData[] = CATALOG.map((c) => ({
    ...c,
    instance: channels.find((ch) => ch.provider === c.provider && ch.isActive),
  }))

  return (
    <div className="flex-1 flex flex-col h-full bg-canvas min-w-0 overflow-hidden">
      <div className="h-14 px-6 flex items-center border-b border-hairline flex-shrink-0">
        <div>
          <h1 className="text-sm font-semibold text-ink">Integrasi Channel</h1>
          <p className="text-[11px] text-steel">Hubungkan channel komunikasi ke inbox terpusat</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-hairline bg-canvas p-4 h-40 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {cards.map((ch) => {
              const connected = !!ch.instance
              return (
                <div key={ch.provider} className="rounded-xl border border-hairline bg-canvas p-4 flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl bg-surface flex items-center justify-center flex-shrink-0">
                      {ch.icon === 'livechat' ? (
                        <svg className="w-5 h-5 text-brand-blue-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      ) : (
                        <ChannelIcon channel={ch.icon} size={22} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-ink truncate">{ch.instance?.name ?? ch.name}</h3>
                      <span className={cn('inline-block mt-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium', ch.official ? 'bg-brand-blue-200 text-brand-blue-deep' : 'bg-amber-50 text-amber-700')}>
                        {ch.official ? 'Official' : 'Unofficial'}
                      </span>
                    </div>
                    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0', connected ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500')}>
                      <span className={cn('w-1.5 h-1.5 rounded-full', connected ? 'bg-emerald-500' : 'bg-gray-400')} />
                      {connected ? 'Terhubung' : 'Belum'}
                    </span>
                  </div>
                  <p className="text-xs text-steel leading-relaxed">{ch.description}</p>
                  <button
                    onClick={() => setActive(ch)}
                    className={cn(
                      'mt-auto w-full py-2 text-xs font-medium rounded-lg transition-colors',
                      connected
                        ? 'border border-hairline text-steel hover:bg-surface-soft hover:text-ink'
                        : 'bg-brand-blue text-white hover:bg-brand-blue-deep',
                    )}
                  >
                    {connected ? 'Kelola' : 'Hubungkan'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <ChannelConnectModal channel={active} onClose={() => setActive(null)} />
    </div>
  )
}
