import { useAccountSettingsStore } from '@/stores/account-settings'
import { ToggleRow } from '@/components/settings/ToggleRow'
import { FormField } from '@/components/settings/FormField'
import { Separator } from '@/components/ui/separator'

const DIGEST_OPTIONS = [
  { value: 'none', label: 'Nonaktif' },
  { value: 'daily', label: 'Harian' },
  { value: 'weekly', label: 'Mingguan' },
] as const

export function AkunNotifications() {
  const { personalPreferences, updatePersonalPreferences, savePersonalPreferences } = useAccountSettingsStore()

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <ToggleRow
          label="Email Notifikasi"
          description="Terima notifikasi personal via email"
          checked={personalPreferences.emailNotifications}
          onCheckedChange={(v) => updatePersonalPreferences({ emailNotifications: v })}
        />
        <ToggleRow
          label="Notifikasi Desktop"
          description="Tampilkan notifikasi di browser desktop"
          checked={personalPreferences.desktopNotifications}
          onCheckedChange={(v) => updatePersonalPreferences({ desktopNotifications: v })}
        />
        <ToggleRow
          label="Suara Notifikasi"
          description="Putar suara saat ada pesan baru"
          checked={personalPreferences.notificationSound}
          onCheckedChange={(v) => updatePersonalPreferences({ notificationSound: v })}
        />
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-semibold text-ink mb-3">Pemicu Notifikasi</h4>
        <div className="space-y-3">
          <ToggleRow
            label="Pesan Baru"
            description="Saat ada pesan masuk dari pelanggan"
            checked={personalPreferences.notifyOnNewMessage}
            onCheckedChange={(v) => updatePersonalPreferences({ notifyOnNewMessage: v })}
          />
          <ToggleRow
            label="Penugasan"
            description="Saat ada percakapan ditugaskan ke Anda"
            checked={personalPreferences.notifyOnAssignment}
            onCheckedChange={(v) => updatePersonalPreferences({ notifyOnAssignment: v })}
          />
        </div>
      </div>

      <Separator />

      <FormField label="Ringkasan (Digest)">
        <select
          value={personalPreferences.digestFrequency}
          onChange={(e) =>
            updatePersonalPreferences({
              digestFrequency: e.target.value as 'none' | 'daily' | 'weekly',
            })
          }
          className="input-field"
        >
          {DIGEST_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <p className="text-xs text-steel mt-1.5">
          Kirim ringkasan notifikasi ke email secara berkala.
        </p>
      </FormField>

      <div className="flex justify-end">
        <button onClick={() => savePersonalPreferences()} className="pill-button-primary">
          Simpan Preferensi
        </button>
      </div>
    </div>
  )
}
