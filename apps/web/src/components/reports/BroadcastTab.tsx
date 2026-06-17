import { StatCard } from './StatCard'
import { ChartCard } from './ChartCard'
import { ChartSuspense, CampaignFunnelChart } from './LazyChart'
import { MOCK_BROADCAST_CAMPAIGNS, MOCK_CAMPAIGN_FUNNEL, formatDateShort } from '@/mock/analytics'
import type { BroadcastCampaignRow } from '@/mock/analytics'

const STATUS_CONFIG: Record<BroadcastCampaignRow['status'], { label: string; dot: string; bg: string; text: string }> = {
  draft: { label: 'Draft', dot: 'bg-gray-400', bg: 'bg-gray-100', text: 'text-gray-600' },
  scheduled: { label: 'Scheduled', dot: 'bg-brand-blue', bg: 'bg-brand-blue-50', text: 'text-brand-blue' },
  running: { label: 'Running', dot: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-600' },
  completed: { label: 'Completed', dot: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  cancelled: { label: 'Cancelled', dot: 'bg-red-400', bg: 'bg-red-50', text: 'text-red-500' },
}

const funnel = MOCK_CAMPAIGN_FUNNEL
const completed = MOCK_BROADCAST_CAMPAIGNS.filter((c) => c.status === 'completed' || c.status === 'running')
const totalSent = completed.reduce((s, c) => s + c.sent, 0)
const totalRead = completed.reduce((s, c) => s + c.read, 0)
const avgReply = completed.length > 0 ? completed.reduce((s, c) => s + c.replyRate, 0) / completed.length : 0
const avgConversion = completed.length > 0 ? completed.reduce((s, c) => s + c.conversionRate, 0) / completed.length : 0

export function BroadcastTab() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Total Terkirim"
          value={totalSent}
          icon="📤"
          color="text-brand-blue"
          bgColor="bg-brand-blue-200/30"
        />
        <StatCard
          label="Total Dibaca"
          value={totalRead}
          icon="👁️"
          color="text-brand-purple"
          bgColor="bg-purple-50"
        />
        <StatCard
          label="Avg Reply Rate"
          value={avgReply}
          icon="💬"
          color="text-emerald-600"
          bgColor="bg-emerald-50"
          decimals={1}
          suffix="%"
        />
        <StatCard
          label="Avg Conversion"
          value={avgConversion}
          icon="🎯"
          color="text-amber-600"
          bgColor="bg-amber-50"
          decimals={1}
          suffix="%"
        />
      </div>

      <ChartCard title="Funnel Campaign" subtitle="Dari kirim ke balasan">
        <ChartSuspense>
          <CampaignFunnelChart data={funnel} />
        </ChartSuspense>
      </ChartCard>

      <div className="card-base overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3 px-4 text-steel font-medium text-xs">Campaign</th>
              <th className="text-left py-3 px-4 text-steel font-medium text-xs">Status</th>
              <th className="text-left py-3 px-4 text-steel font-medium text-xs">Channel</th>
              <th className="text-right py-3 px-4 text-steel font-medium text-xs">Terkirim</th>
              <th className="text-right py-3 px-4 text-steel font-medium text-xs">Dibaca</th>
              <th className="text-right py-3 px-4 text-steel font-medium text-xs">Dibalas</th>
              <th className="text-right py-3 px-4 text-steel font-medium text-xs">Reply %</th>
              <th className="text-right py-3 px-4 text-steel font-medium text-xs">Conversion %</th>
              <th className="text-left py-3 px-4 text-steel font-medium text-xs">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_BROADCAST_CAMPAIGNS.map((c) => {
              const st = STATUS_CONFIG[c.status]
              return (
                <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 px-4 font-medium text-ink">{c.name}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${st.bg} ${st.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                      {st.label}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-steel">{c.channel}</td>
                  <td className="py-3 px-4 text-right tabular-nums">{c.sent.toLocaleString('id-ID')}</td>
                  <td className="py-3 px-4 text-right tabular-nums">{c.read.toLocaleString('id-ID')}</td>
                  <td className="py-3 px-4 text-right tabular-nums">{c.replied.toLocaleString('id-ID')}</td>
                  <td className="py-3 px-4 text-right tabular-nums">{c.replyRate.toFixed(1)}%</td>
                  <td className="py-3 px-4 text-right tabular-nums">{c.conversionRate.toFixed(1)}%</td>
                  <td className="py-3 px-4 text-steel">{formatDateShort(c.createdAt)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
