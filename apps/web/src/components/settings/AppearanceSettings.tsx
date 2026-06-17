import { useGeneralSettingsStore } from '@/stores/general-settings'
import { ToggleRow } from '@/components/settings/ToggleRow'
import { FormField } from '@/components/settings/FormField'
import { ACCENT_COLORS } from '@/mock/general-settings'

const THEME_OPTIONS = [
  { value: 'light', label: 'Terang', icon: '☀️', desc: 'Latar belakang terang' },
  { value: 'dark', label: 'Gelap', icon: '🌙', desc: 'Latar belakang gelap' },
  { value: 'auto', label: 'Otomatis', icon: '⚙️', desc: 'Ikuti sistem' },
] as const

export function AppearanceSettings() {
  const { appearance, updateAppearance, saveAll } = useGeneralSettingsStore()

  return (
    <div className="space-y-6">
      <FormField label="Tema">
        <div className="grid grid-cols-3 gap-3">
          {THEME_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateAppearance({ theme: opt.value })}
              className={`flex flex-col items-center gap-2 px-4 py-4 rounded-xl border transition-all ${
                appearance.theme === opt.value
                  ? 'border-brand-blue-deep ring-2 ring-brand-blue-deep bg-brand-blue-50'
                  : 'border-hairline-soft hover:border-brand-blue-200 bg-canvas'
              }`}
            >
              <span className="text-2xl">{opt.icon}</span>
              <span className={`text-sm font-semibold ${
                appearance.theme === opt.value ? 'text-brand-blue-deep' : 'text-ink'
              }`}>
                {opt.label}
              </span>
              <span className={`text-xs ${
                appearance.theme === opt.value ? 'text-brand-blue-200' : 'text-stone'
              }`}>
                {opt.desc}
              </span>
            </button>
          ))}
        </div>
      </FormField>

      <div className="space-y-3">
        <ToggleRow
          label="Mode Sidebar Kompak"
          description="Perkecil sidebar untuk lebih banyak ruang konten"
          checked={appearance.sidebarCompact}
          onCheckedChange={(v) => updateAppearance({ sidebarCompact: v })}
        />
        <ToggleRow
          label="Tampilkan Inisial"
          description="Gunakan inisial alih-alih foto profil untuk avatar"
          checked={appearance.showInitials}
          onCheckedChange={(v) => updateAppearance({ showInitials: v })}
        />
      </div>

      <FormField label="Warna Aksen">
        <div className="flex items-center gap-3">
          {ACCENT_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => updateAppearance({ accentColor: color })}
              className={`w-9 h-9 rounded-full transition-all flex-shrink-0 ${
                appearance.accentColor === color
                  ? 'ring-2 ring-offset-2 ring-current scale-110'
                  : 'hover:scale-110'
              }`}
              style={{
                backgroundColor: color,
                color: appearance.accentColor === color ? color : undefined,
              }}
            />
          ))}
        </div>
      </FormField>

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
