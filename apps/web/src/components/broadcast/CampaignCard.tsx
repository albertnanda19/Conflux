import { Badge } from '@/components/ui/badge'

interface CampaignCardData {
  id: string
  name: string
  status: string
  channel: string
  templateName: string | null
  goal: string
  createdBy: string
  totalRecipients: number
  sentCount: number
  deliveredCount: number
  readCount: number
  repliedCount: number
  failedCount: number
  scheduledAt: string | null
  completedAt: string | null
  startedAt: string | null
  createdAt: string
}

const MOCK_CAMPAIGN: CampaignCardData = {
  id: 'c1',
  name: 'Promo Data Science Batch 12',
  status: 'completed',
  channel: 'whatsapp',
  templateName: 'Promo Harga',
  goal: 'Promosi Program',
  createdBy: 'Admin User',
  totalRecipients: 2450,
  sentCount: 2450,
  deliveredCount: 2380,
  readCount: 1890,
  repliedCount: 620,
  failedCount: 70,
  scheduledAt: null,
  completedAt: '2026-06-05T00:00:00.000Z',
  startedAt: '2026-06-04T00:00:00.000Z',
  createdAt: '2026-06-02T00:00:00.000Z',
}

const STATUS_CONFIG: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'error' | 'info' }> = {
  draft: { label: 'Draft', variant: 'default' },
  scheduled: { label: 'Terjadwal', variant: 'warning' },
  running: { label: 'Berjalan', variant: 'info' },
  completed: { label: 'Selesai', variant: 'success' },
  cancelled: { label: 'Dibatalkan', variant: 'error' },
}

function formatShortDate(date: string): string {
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date))
}

interface CampaignCardProps {
  campaign?: CampaignCardData
  onClick?: () => void
}

export function CampaignCard({ campaign = MOCK_CAMPAIGN, onClick }: CampaignCardProps) {
  const statusInfo = STATUS_CONFIG[campaign.status] ?? STATUS_CONFIG.draft
  const sentPercent = campaign.totalRecipients > 0 ? (campaign.sentCount / campaign.totalRecipients) * 100 : 0
  const readPercent = campaign.totalRecipients > 0 ? (campaign.readCount / campaign.totalRecipients) * 100 : 0
  const repliedPercent = campaign.totalRecipients > 0 ? (campaign.repliedCount / campaign.totalRecipients) * 100 : 0

  return (
    <button
      onClick={onClick}
      className="w-full text-left card-base p-4 border border-hairline rounded-xl hover:bg-surface-soft transition-colors"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-ink truncate">{campaign.name}</h3>
        <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
      </div>

      <div className="flex items-center gap-2 text-xs text-steel mb-3">
        <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-medium">WA</span>
        <span>{campaign.templateName ?? 'Tanpa template'}</span>
        <span>•</span>
        <span>{campaign.goal}</span>
        <span>•</span>
        <span>{campaign.createdBy}</span>
      </div>

      {campaign.totalRecipients > 0 && (
        <div className="mb-3">
          <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
            <div className="h-full flex">
              {sentPercent > 0 && <div className="bg-brand-blue" style={{ width: `${sentPercent}%` }} />}
              {readPercent > sentPercent && <div className="bg-brand-cyan" style={{ width: `${readPercent - sentPercent}%` }} />}
              {repliedPercent > 0 && <div className="bg-emerald-500" style={{ width: `${repliedPercent}%` }} />}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 text-xs text-steel mb-2">
        <span>Total: <span className="font-semibold text-ink">{campaign.totalRecipients.toLocaleString('id-ID')}</span></span>
        <span>Terkirim: <span className="font-semibold text-ink">{campaign.sentCount.toLocaleString('id-ID')}</span></span>
        <span>Dibaca: <span className="font-semibold text-ink">{campaign.readCount.toLocaleString('id-ID')}</span></span>
        <span>Dibalas: <span className="font-semibold text-ink">{campaign.repliedCount.toLocaleString('id-ID')}</span></span>
      </div>

      <div className="text-xs text-steel">
        {campaign.scheduledAt && campaign.status === 'scheduled' && (
          <span>Dijadwalkan: {formatShortDate(campaign.scheduledAt)}</span>
        )}
        {campaign.completedAt && campaign.status === 'completed' && (
          <span>Selesai: {formatShortDate(campaign.completedAt)}</span>
        )}
        {campaign.status === 'running' && campaign.startedAt && (
          <span>Mulai: {formatShortDate(campaign.startedAt)}</span>
        )}
        {campaign.status === 'draft' && (
          <span>Dibuat: {formatShortDate(campaign.createdAt)}</span>
        )}
        {campaign.status === 'cancelled' && (
          <span>Dibatalkan</span>
        )}
      </div>
    </button>
  )
}
