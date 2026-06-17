import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useCampaignStore } from '@/stores/campaign'
import { CampaignReportStats } from '@/components/broadcast/CampaignReportStats'
import { CampaignProgressBar } from '@/components/broadcast/CampaignProgressBar'
import { CampaignTimeline } from '@/components/broadcast/CampaignTimeline'
import { CampaignRecipientList } from '@/components/broadcast/CampaignRecipientList'
import type { CampaignGoal } from '@/mock/campaign'

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'bg-surface text-steel' },
  scheduled: { label: 'Terjadwal', color: 'bg-amber-50 text-amber-700' },
  running: { label: 'Berjalan', color: 'bg-emerald-50 text-emerald-700' },
  completed: { label: 'Selesai', color: 'bg-brand-blue-200 text-brand-blue-deep' },
  cancelled: { label: 'Dibatalkan', color: 'bg-red-50 text-red-600' },
}

const GOAL_LABELS: Record<CampaignGoal, string> = {
  promotion: 'Promosi Program',
  follow_up: 'Follow Up',
  event_invitation: 'Undangan Event',
  re_engagement: 'Re-engagement',
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
}

function buildSegmentSummary(filters: { programs: string[]; pipelineStatuses: string[] }): string {
  const parts: string[] = []
  if (filters.programs.length) parts.push(`Program: ${filters.programs.join(', ')}`)
  if (filters.pipelineStatuses.length) parts.push(`Status: ${filters.pipelineStatuses.join(', ')}`)
  return parts.join(' · ') || 'Semua kontak'
}

export function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const campaigns = useCampaignStore((s) => s.campaigns)
  const campaignStats = useCampaignStore((s) => s.campaignStats)
  const cancelCampaign = useCampaignStore((s) => s.cancelCampaign)
  const deleteCampaign = useCampaignStore((s) => s.deleteCampaign)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const campaign = campaigns.find((c) => c.id === id)

  if (!campaign) {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center">
        <div className="w-14 h-14 rounded-full bg-surface flex items-center justify-center text-2xl mb-4">📢</div>
        <p className="text-sm font-medium text-ink mb-1">Campaign tidak ditemukan</p>
        <p className="text-xs text-steel mb-4">Campaign dengan ID ini tidak ada atau sudah dihapus.</p>
        <button
          onClick={() => navigate('/campaigns')}
          className="h-9 px-4 text-sm font-semibold text-white bg-brand-blue-deep rounded-full hover:bg-brand-blue-700 transition-colors"
        >
          Kembali ke Campaign
        </button>
      </div>
    )
  }

  const statusInfo = STATUS_CONFIG[campaign.status] ?? STATUS_CONFIG.draft
  const isActionable = campaign.status === 'running' || campaign.status === 'scheduled'
  const isDraft = campaign.status === 'draft'
  const stats = campaignStats[campaign.id]

  const reportStats = stats
    ? [
        { key: 'sent', label: 'Terkirim', value: stats.sent, total: campaign.totalRecipients, icon: '📤', color: 'text-brand-blue', bgColor: 'bg-brand-blue-200/30' },
        { key: 'read', label: 'Dibaca', value: stats.read, total: campaign.totalRecipients, icon: '👁', color: 'text-brand-cyan', bgColor: 'bg-brand-cyan/10' },
        { key: 'replied', label: 'Dibalas', value: stats.replied, total: campaign.totalRecipients, icon: '💬', color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
        { key: 'failed', label: 'Gagal', value: stats.failed, total: campaign.totalRecipients, icon: '⚠️', color: 'text-red-500', bgColor: 'bg-red-50' },
      ]
    : undefined

  const progressData = stats
    ? {
        total: campaign.totalRecipients,
        sent: stats.sent,
        delivered: stats.delivered,
        read: stats.read,
        replied: stats.replied,
        failed: stats.failed,
      }
    : undefined

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
            <button
              onClick={() => cancelCampaign(campaign.id)}
              className="h-8 px-3 rounded-full border border-red-300 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              Batalkan
            </button>
          )}
          {isDraft && (
            <button
              onClick={() => setConfirmDelete(true)}
              className="h-8 px-3 rounded-full border border-red-300 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
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
            <span className="text-xs font-medium text-ink capitalize">{campaign.channel}</span>
          </div>
        </div>
        <div className="bg-canvas rounded-xl border border-hairline p-4">
          <p className="text-[10px] text-steel uppercase tracking-wide mb-1">Template</p>
          <span className="text-xs font-medium text-brand-blue-deep">{campaign.templateName ?? '—'}</span>
        </div>
        <div className="bg-canvas rounded-xl border border-hairline p-4">
          <p className="text-[10px] text-steel uppercase tracking-wide mb-1">Tujuan</p>
          <span className="text-xs font-medium text-ink">{GOAL_LABELS[campaign.goal]}</span>
        </div>
      </div>

      <div className="bg-canvas rounded-xl border border-hairline p-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] text-steel uppercase tracking-wide mb-1">Segmen</p>
            <p className="text-xs text-ink">{buildSegmentSummary(campaign.segmentFilters)}</p>
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
        <CampaignReportStats stats={reportStats} />
      </div>

      <div className="mb-6">
        <CampaignProgressBar data={progressData} />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-1">
          <CampaignTimeline events={stats?.timeline} />
        </div>
        <div className="col-span-2">
          <CampaignRecipientList />
        </div>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setConfirmDelete(false)} />
          <div className="relative bg-canvas rounded-2xl shadow-xl w-full max-w-sm mx-4 border border-hairline p-6 text-center animate-in zoom-in-95 fade-in duration-200">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-xl mx-auto mb-4">🗑️</div>
            <h3 className="text-base font-semibold text-ink mb-1">Hapus Campaign?</h3>
            <p className="text-sm text-steel mb-5">
              <span className="font-medium">{campaign.name}</span> akan dihapus permanen.
            </p>
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setConfirmDelete(false)}
                className="h-9 px-4 text-sm font-medium text-steel hover:text-ink rounded-full hover:bg-surface transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => { deleteCampaign(campaign.id); navigate('/campaigns') }}
                className="h-9 px-5 text-sm font-semibold text-white bg-red-500 rounded-full hover:bg-red-600 transition-colors"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
