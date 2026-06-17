import { useGeneralSettingsStore } from '@/stores/general-settings'
import { FormField } from '@/components/settings/FormField'
import {
  TIMEZONE_OPTIONS,
  LANGUAGE_OPTIONS,
  DATE_FORMAT_OPTIONS,
  CURRENCY_OPTIONS,
  TIME_FORMAT_OPTIONS,
  WEEK_START_OPTIONS,
} from '@/mock/general-settings'

export function PlatformPreferences() {
  const { preferences, updatePreferences, saveAll } = useGeneralSettingsStore()

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Timezone">
          <select
            value={preferences.timezone}
            onChange={(e) => updatePreferences({ timezone: e.target.value })}
            className="w-full text-sm text-ink bg-canvas border border-hairline-soft rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1"
          >
            {TIMEZONE_OPTIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Bahasa">
          <select
            value={preferences.language}
            onChange={(e) => updatePreferences({ language: e.target.value })}
            className="w-full text-sm text-ink bg-canvas border border-hairline-soft rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1"
          >
            {LANGUAGE_OPTIONS.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Format Tanggal">
          <select
            value={preferences.dateFormat}
            onChange={(e) => updatePreferences({ dateFormat: e.target.value })}
            className="w-full text-sm text-ink bg-canvas border border-hairline-soft rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1"
          >
            {DATE_FORMAT_OPTIONS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Mata Uang">
          <select
            value={preferences.currency}
            onChange={(e) => updatePreferences({ currency: e.target.value })}
            className="w-full text-sm text-ink bg-canvas border border-hairline-soft rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1"
          >
            {CURRENCY_OPTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Format Waktu">
          <select
            value={preferences.timeFormat}
            onChange={(e) => updatePreferences({ timeFormat: e.target.value })}
            className="w-full text-sm text-ink bg-canvas border border-hairline-soft rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1"
          >
            {TIME_FORMAT_OPTIONS.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </FormField>
        <FormField label="Minggu Dimulai">
          <select
            value={preferences.weekStartsOn}
            onChange={(e) => updatePreferences({ weekStartsOn: e.target.value })}
            className="w-full text-sm text-ink bg-canvas border border-hairline-soft rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1"
          >
            {WEEK_START_OPTIONS.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </FormField>
      </div>

      <div className="flex justify-end pt-2">
        <button
          onClick={() => saveAll()}
          className="px-6 py-2 text-sm font-semibold text-white bg-brand-blue-deep rounded-full hover:bg-brand-blue transition-colors"
        >
          Simpan Perubahan
        </button>
      </div>
    </div>
  )
}
