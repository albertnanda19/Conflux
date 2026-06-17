interface ProgressData {
  total: number
  sent: number
  delivered: number
  read: number
  replied: number
  failed: number
}

const MOCK_PROGRESS: ProgressData = {
  total: 2450,
  sent: 2450,
  delivered: 2380,
  read: 1890,
  replied: 620,
  failed: 70,
}


interface CampaignProgressBarProps {
  data?: ProgressData
}

export function CampaignProgressBar({ data = MOCK_PROGRESS }: CampaignProgressBarProps) {
  const { total, delivered, read, replied, failed } = data

  const deliveredPct = total > 0 ? (delivered / total) * 100 : 0
  const readPct = total > 0 ? (read / total) * 100 : 0
  const repliedPct = total > 0 ? (replied / total) * 100 : 0
  const failedPct = total > 0 ? (failed / total) * 100 : 0

  return (
    <div className="bg-canvas rounded-xl border border-hairline p-5">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-semibold text-ink">Progress Pengiriman</h4>
        <span className="text-[11px] text-steel">{total.toLocaleString('id-ID')} total</span>
      </div>

      <div className="relative h-5 rounded-full overflow-hidden bg-surface flex">
        {deliveredPct > 0 && (
          <div
            className="h-full bg-brand-blue transition-all"
            style={{ width: `${deliveredPct}%` }}
          />
        )}
        {readPct > 0 && (
          <div
            className="h-full bg-brand-cyan transition-all"
            style={{ width: `${readPct}%` }}
          />
        )}
        {repliedPct > 0 && (
          <div
            className="h-full bg-emerald-500 transition-all"
            style={{ width: `${repliedPct}%` }}
          />
        )}
        {failedPct > 0 && (
          <div
            className="h-full bg-red-400 transition-all"
            style={{ width: `${failedPct}%` }}
          />
        )}
      </div>

      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-blue" />
          <span className="text-[11px] text-steel">Terkirim {delivered.toLocaleString('id-ID')} ({deliveredPct.toFixed(1)}%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-cyan" />
          <span className="text-[11px] text-steel">Dibaca {read.toLocaleString('id-ID')} ({readPct.toFixed(1)}%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[11px] text-steel">Dibalas {replied.toLocaleString('id-ID')} ({repliedPct.toFixed(1)}%)</span>
        </div>
        {failed > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-[11px] text-steel">Gagal {failed.toLocaleString('id-ID')} ({failedPct.toFixed(1)}%)</span>
          </div>
        )}
      </div>
    </div>
  )
}
