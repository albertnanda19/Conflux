import type { WorkingHoursConfig } from '@/types/ai'

const TIME_OPTIONS = Array.from({ length: 25 }, (_, i) => {
  const h = Math.floor(i / 2)
  const m = i % 2 === 0 ? '00' : '30'
  return `${String(h).padStart(2, '0')}:${m}`
})

interface WorkingHoursProps {
  workingHours: WorkingHoursConfig
  onChange: (next: WorkingHoursConfig) => void
}

export function WorkingHours({ workingHours, onChange }: WorkingHoursProps) {
  const toggleDay = (day: string) =>
    onChange({ ...workingHours, days: workingHours.days.map((d) => (d.day === day ? { ...d, enabled: !d.enabled } : d)) })

  const updateDayHours = (day: string, start: string, end: string) =>
    onChange({ ...workingHours, days: workingHours.days.map((d) => (d.day === day ? { ...d, start, end } : d)) })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-ink">Timezone</span>
        <span className="text-sm text-steel bg-surface-soft px-3 py-1.5 rounded-full">
          {workingHours.timezone}
        </span>
      </div>

      <div className="space-y-2">
        {workingHours.days.map((d) => (
          <div
            key={d.day}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${
              d.enabled ? 'bg-canvas border border-hairline-soft' : 'bg-surface-soft/50'
            }`}
          >
            <button
              onClick={() => toggleDay(d.day)}
              className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ${
                d.enabled ? 'bg-emerald-500' : 'bg-hairline'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                  d.enabled ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>

            <span
              className={`text-sm font-medium w-16 flex-shrink-0 ${
                d.enabled ? 'text-ink' : 'text-stone'
              }`}
            >
              {d.dayLabel}
            </span>

            <div
              className={`flex items-center gap-2 ml-auto ${
                d.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'
              }`}
            >
              <select
                value={d.start}
                onChange={(e) => updateDayHours(d.day, e.target.value, d.end)}
                className="text-sm text-ink bg-canvas border border-hairline-soft rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1"
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <span className="text-xs text-stone">—</span>
              <select
                value={d.end}
                onChange={(e) => updateDayHours(d.day, d.start, e.target.value)}
                className="text-sm text-ink bg-canvas border border-hairline-soft rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1"
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-ink">
          Pesan Di Luar Jam Kerja (OOO)
        </label>
        <textarea
          value={workingHours.oooMessage}
          onChange={(e) => onChange({ ...workingHours, oooMessage: e.target.value })}
          rows={3}
          className="w-full text-sm text-ink bg-canvas border border-hairline-soft rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1"
        />
        <p className="text-xs text-stone">
          Pesan ini dikirim otomatis ke pelanggan yang menghubungi di luar jam kerja.
        </p>
      </div>
    </div>
  )
}
