interface WizardStepReviewProps {
  name: string
  description: string
  goal: string
  templateName: string | null
  scheduleMode: 'now' | 'scheduled'
  scheduledDate: string
  scheduledTime: string
  estimatedCount: number
}

const GOAL_LABELS: Record<string, string> = {
  promotion: 'Promosi Program',
  follow_up: 'Follow Up',
  event_invitation: 'Undangan Event',
  re_engagement: 'Re-engagement',
}

const GOAL_ICONS: Record<string, string> = {
  promotion: '📢',
  follow_up: '🤝',
  event_invitation: '📣',
  re_engagement: '🔄',
}

export function WizardStepReview({
  name,
  description,
  goal,
  templateName,
  scheduleMode,
  scheduledDate,
  scheduledTime,
  estimatedCount,
}: WizardStepReviewProps) {
  const scheduleDisplay = scheduleMode === 'now'
    ? 'Kirim segera setelah campaign dibuat'
    : `${new Date(`${scheduledDate}T${scheduledTime}`).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} pukul ${scheduledTime} WIB`

  return (
    <div className="space-y-4">
      <div className="bg-surface/50 rounded-xl border border-hairline-soft p-5">
        <h4 className="text-xs font-semibold text-ink mb-3 uppercase tracking-wide">Ringkasan Campaign</h4>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span className="text-sm mt-0.5">📝</span>
            <div>
              <p className="text-[11px] text-steel">Nama</p>
              <p className="text-xs font-medium text-ink">{name || '—'}</p>
            </div>
          </div>

          {description && (
            <div className="flex items-start gap-3">
              <span className="text-sm mt-0.5">📋</span>
              <div>
                <p className="text-[11px] text-steel">Deskripsi</p>
                <p className="text-xs text-ink">{description}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-3">
            <span className="text-sm mt-0.5">{GOAL_ICONS[goal] ?? '🎯'}</span>
            <div>
              <p className="text-[11px] text-steel">Tujuan</p>
              <p className="text-xs font-medium text-ink">{GOAL_LABELS[goal] ?? goal}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-sm mt-0.5">💬</span>
            <div>
              <p className="text-[11px] text-steel">Channel</p>
              <p className="text-xs font-medium text-ink">WhatsApp</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-sm mt-0.5">📄</span>
            <div>
              <p className="text-[11px] text-steel">Template</p>
              <p className="text-xs font-medium text-ink">{templateName || 'Belum dipilih'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-sm mt-0.5">👥</span>
            <div>
              <p className="text-[11px] text-steel">Estimasi Penerima</p>
              <p className="text-xs font-medium text-ink">{estimatedCount.toLocaleString('id-ID')} kontak</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-sm mt-0.5">⏰</span>
            <div>
              <p className="text-[11px] text-steel">Jadwal</p>
              <p className="text-xs font-medium text-ink">{scheduleDisplay}</p>
            </div>
          </div>
        </div>
      </div>

      {estimatedCount === 0 && (
        <div className="px-4 py-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-2">
          <span className="text-sm">⚠️</span>
          <p className="text-xs text-amber-700">
            Tidak ada kontak yang cocok dengan filter segmen. Ubah filter segmen sebelum mengirim.
          </p>
        </div>
      )}
    </div>
  )
}
