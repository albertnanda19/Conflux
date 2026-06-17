import { ClockIcon } from '@/icons'

interface WizardStepScheduleProps {
  scheduleMode: 'now' | 'scheduled'
  scheduledDate: string
  scheduledTime: string
  onModeChange: (mode: 'now' | 'scheduled') => void
  onDateChange: (date: string) => void
  onTimeChange: (time: string) => void
}

export function WizardStepSchedule({
  scheduleMode,
  scheduledDate,
  scheduledTime,
  onModeChange,
  onDateChange,
  onTimeChange,
}: WizardStepScheduleProps) {
  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <button
          onClick={() => onModeChange('now')}
          className={`flex-1 p-4 rounded-xl border text-left transition-colors ${
            scheduleMode === 'now'
              ? 'border-brand-blue bg-brand-blue-200/10 ring-1 ring-brand-blue'
              : 'border-hairline hover:bg-surface-soft/50'
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-base">🚀</span>
            <span className="text-xs font-semibold text-ink">Kirim Sekarang</span>
          </div>
          <p className="text-[11px] text-steel">Campaign akan langsung dikirim setelah dibuat.</p>
        </button>

        <button
          onClick={() => onModeChange('scheduled')}
          className={`flex-1 p-4 rounded-xl border text-left transition-colors ${
            scheduleMode === 'scheduled'
              ? 'border-brand-blue bg-brand-blue-200/10 ring-1 ring-brand-blue'
              : 'border-hairline hover:bg-surface-soft/50'
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <ClockIcon size={16} className="text-amber-600" />
            <span className="text-xs font-semibold text-ink">Jadwalkan</span>
          </div>
          <p className="text-[11px] text-steel">Pilih tanggal dan waktu pengiriman.</p>
        </button>
      </div>

      {scheduleMode === 'scheduled' && (
        <div className="bg-surface/50 rounded-xl border border-hairline-soft p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-semibold border border-amber-200">
              WIB (UTC+7)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5">Tanggal</label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => onDateChange(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-hairline bg-canvas text-sm text-ink focus:outline-none focus:border-brand-blue-deep"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5">Waktu</label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => onTimeChange(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-hairline bg-canvas text-sm text-ink focus:outline-none focus:border-brand-blue-deep"
              />
            </div>
          </div>

          {scheduledDate && scheduledTime && (
            <div className="flex items-center gap-2 px-3 py-2 bg-brand-blue-200/20 rounded-lg">
              <span className="text-sm">⏰</span>
              <p className="text-xs text-brand-blue-deep font-medium">
                Campaign akan dikirim pada {new Date(`${scheduledDate}T${scheduledTime}`).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} pukul {scheduledTime} WIB
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
