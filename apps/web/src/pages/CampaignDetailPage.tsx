import { useParams, useNavigate } from 'react-router-dom'
import { CampaignReportStats } from '@/components/broadcast/CampaignReportStats'
import { CampaignProgressBar } from '@/components/broadcast/CampaignProgressBar'
import { CampaignTimeline } from '@/components/broadcast/CampaignTimeline'
import { CampaignRecipientList } from '@/components/broadcast/CampaignRecipientList'

interface CampaignDetail {
  id: string
  name: string
  description: string
  goal: string
  status: string
  channel: string
  templateName: string | null
  totalRecipients: number
  sentCount: number
  deliveredCount: number
  readCount: number
  repliedCount: number
  failedCount: number
  scheduledAt: string | null
  startedAt: string | null
  completedAt: string | null
  createdBy: string
  createdAt: string
  segmentSummary: string
}

const MOCK_CAMPAIGN: CampaignDetail = {
  id: 'c1',
  name: 'Promo Data Science Batch 12',
  description: 'Campaign promosi program Data Science Batch 12 untuk semua lead yang tertarik.',
  goal: 'Promosi Program',
  status: 'completed',
  channel: 'WhatsApp',
  templateName: 'Promo Harga',
  totalRecipients: 2450,
  sentCount: 2450,
  deliveredCount: 2380,
  readCount: 1890,
  repliedCount: 620,
  failedCount: 70,
  scheduledAt: null,
  startedAt: '2026-06-04T00:00:00.000Z',
  completedAt: '2026-06-05T00:00:00.000Z',
  createdBy: 'Admin User',
  createdAt: '2026-06-02T00:00:00.000Z',
  segmentSummary: 'Program: Data Science · Status: New Lead, Contacted · Label: Hot Lead',
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'bg-surface text-steel' },
  scheduled: { label: 'Terjadwal', color: 'bg-amber-50 text-amber-700' },
  running: { label: 'Berjalan', color: 'bg-emerald-50 text-emerald-700' },
  completed: { label: 'Selesai', color: 'bg-brand-blue-200 text-brand-blue-deep' },
  cancelled: { label: 'Dibatalkan', color: 'bg-red-50 text-red-600' },
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
}

export function CampaignDetailPage() {
  const params = useParams<{ id: string }>()
  const navigate = useNavigate()
  const campaign = MOCK_CAMPAIGN
  const statusInfo = STATUS_CONFIG[campaign.status] ?? STATUS_CONFIG.draft
  const isActionable = campaign.status === 'running' || campaign.status === 'scheduled'
  const isDraft = campaign.status === 'draft'

  return (
    <div className="p-8 h-full max-w-5xl mx-auto">
      <button onClick={() => navigate('/campaigns')} className="flex items-center gap-1 text-xs text-steel hover:text-ink mb-4 transition-colors">
        ← Kembali ke Campaign
      </button>

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-semibold text-ink">{campaign.name}</h1>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>
          <p className="text-steel text-sm">{campaign.description}</p>
        </div>
        <div className="flex items-center gap-2">
          {isActionable && (
            <button className="h-8 px-3 rounded-full border border-red-300 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors">
              Batalkan
            </button>
          )}
          {isDraft && (
            <button className="h-8 px-3 rounded-full border border-red-300 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors">
              Hapus
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-canvas rounded-xl border border-hairline p-4">
          <p className="text-[10px] text-steel uppercase tracking-wide mb-1">Channel</p>
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded bg-emerald-500" />
            <span className="text-xs font-medium text-ink">{campaign.channel}</span>
          </div>
        </div>
        <div className="bg-canvas rounded-xl border border-hairline p-4">
          <p className="text-[10px] text-steel uppercase tracking-wide mb-1">Template</p>
          <span className="text-xs font-medium text-brand-blue-deep">{campaign.templateName ?? '—'}</span>
        </div>
        <div className="bg-canvas rounded-xl border border-hairline p-4">
          <p className="text-[10px] text-steel uppercase tracking-wide mb-1">Tujuan</p>
          <span className="text-xs font-medium text-ink">{campaign.goal}</span>
        </div>
      </div>

      <div className="bg-canvas rounded-xl border border-hairline p-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] text-steel uppercase tracking-wide mb-1">Segmen</p>
            <p className="text-xs text-ink">{campaign.segmentSummary}</p>
          </div>
          <div>
            <p className="text-[10px] text-steel uppercase tracking-wide mb-1">Dibuat Oleh</p>
            <p className="text-xs text-ink">{campaign.createdBy} · {formatDate(campaign.createdAt)}</p>
          </div>
          {campaign.startedAt && (
            <div>
              <p className="text-[10px] text-steel uppercase tracking-wide mb-1">Dimulai</p>
              <p className="text-xs text-ink">{formatDate(campaign.startedAt)}</p>
            </div>
          )}
          {campaign.completedAt && (
            <div>
              <p className="text-[10px] text-steel uppercase tracking-wide mb-1">Selesai</p>
              <p className="text-xs text-ink">{formatDate(campaign.completedAt)}</p>
            </div>
          )}
          {campaign.scheduledAt && (
            <div>
              <p className="text-[10px] text-steel uppercase tracking-wide mb-1">Dijadwalkan</p>
              <p className="text-xs text-ink">{formatDate(campaign.scheduledAt)}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <CampaignReportStats />
      </div>

      <div className="mb-6">
        <CampaignProgressBar />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-1">
          <CampaignTimeline />
        </div>
        <div className="col-span-2">
          <CampaignRecipientList />
        </div>
      </div>

      <span className="hidden">{params.id}</span>
    </div>
  )
}
