import { useGeneralSettingsStore } from '@/stores/general-settings'
import { ToggleRow } from '@/components/settings/ToggleRow'
import { Separator } from '@/components/ui/separator'
import { FormField } from '@/components/settings/FormField'

const DIGEST_OPTIONS = [
  { value: 'none', label: 'Nonaktif' },
  { value: 'daily', label: 'Harian' },
  { value: 'weekly', label: 'Mingguan' },
] as const

export function NotificationPrefs() {
  const { notifications, updateNotifications, saveAll } = useGeneralSettingsStore()

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <ToggleRow
          label="Email Notifikasi"
          description="Terima ringkasan notifikasi via email"
          checked={notifications.emailNotifications}
          onCheckedChange={(v) => updateNotifications({ emailNotifications: v })}
        />
        <ToggleRow
          label="Notifikasi Desktop"
          description="Tampilkan notifikasi di browser desktop"
          checked={notifications.desktopNotifications}
          onCheckedChange={(v) => updateNotifications({ desktopNotifications: v })}
        />
        <ToggleRow
          label="Suara Notifikasi"
          description="Putar suara saat ada pesan baru masuk"
          checked={notifications.notificationSound}
          onCheckedChange={(v) => updateNotifications({ notificationSound: v })}
        />
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-semibold text-ink mb-3">Pemicu Notifikasi</h4>
        <div className="space-y-3">
          <ToggleRow
            label="Pesan Baru"
            description="Saat ada pesan masuk dari pelanggan"
            checked={notifications.notifyOnNewMessage}
            onCheckedChange={(v) => updateNotifications({ notifyOnNewMessage: v })}
          />
          <ToggleRow
            label="Penugasan"
            description="Saat ada percakapan ditugaskan ke Anda"
            checked={notifications.notifyOnAssignment}
            onCheckedChange={(v) => updateNotifications({ notifyOnAssignment: v })}
          />
          <ToggleRow
            label="Broadcast Selesai"
            description="Saat kampanye broadcast selesai dikirim"
            checked={notifications.notifyOnBroadcastComplete}
            onCheckedChange={(v) => updateNotifications({ notifyOnBroadcastComplete: v })}
          />
        </div>
      </div>

      <Separator />

      <FormField label="Ringkasan (Digest)">
        <select
          value={notifications.digestFrequency}
          onChange={(e) =>
            updateNotifications({
              digestFrequency: e.target.value as 'none' | 'daily' | 'weekly',
            })
          }
          className="w-full text-sm text-ink bg-canvas border border-hairline-soft rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue-deep focus:ring-offset-1"
        >
          {DIGEST_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <p className="text-xs text-stone mt-1.5">
          Kirim ringkasan notifikasi ke email secara berkala.
        </p>
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
