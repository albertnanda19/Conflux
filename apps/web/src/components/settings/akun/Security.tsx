import { useState } from 'react'
import { useAccountSettingsStore } from '@/stores/account-settings'
import { FormField } from '@/components/settings/FormField'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatRelativeTime, formatDateTime } from '@/lib/utils'
import { EyeIcon } from '@/icons'

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  const labels = ['', 'Lemah', 'Cukup', 'Baik', 'Sangat Baik']
  const colors = ['', 'bg-red-500', 'bg-amber-500', 'bg-brand-blue', 'bg-emerald-500']
  return { score, label: labels[score] || '', color: colors[score] || '' }
}

export function Security() {
  const { sessions, loginHistory, revokeSession, changePassword } = useAccountSettingsStore()

  const [currentPass, setCurrentPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [passErrors, setPassErrors] = useState<Record<string, string>>({})

  const strength = getPasswordStrength(newPass)

  const handleChangePassword = () => {
    const e: Record<string, string> = {}
    if (!currentPass) e.current = 'Kata sandi saat ini wajib diisi.'
    if (newPass.length < 8) e.newPass = 'Kata sandi baru minimal 8 karakter.'
    if (newPass === currentPass) e.newPass = 'Kata sandi baru harus berbeda dari yang saat ini.'
    if (newPass !== confirmPass) e.confirm = 'Konfirmasi kata sandi tidak cocok.'
    setPassErrors(e)
    if (Object.keys(e).length > 0) return

    const ok = changePassword(currentPass, newPass)
    if (ok) {
      setCurrentPass('')
      setNewPass('')
      setConfirmPass('')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h4 className="text-sm font-semibold text-ink mb-4">Ubah Kata Sandi</h4>
        <div className="space-y-4">
          <FormField label="Kata Sandi Saat Ini" required error={passErrors.current}>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                className="input-field pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-steel hover:text-ink transition-colors"
              >
                <EyeIcon size={16} />
              </button>
            </div>
          </FormField>

          <FormField label="Kata Sandi Baru" required error={passErrors.newPass}>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="input-field pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-steel hover:text-ink transition-colors"
              >
                <EyeIcon size={16} />
              </button>
            </div>
            {newPass && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors ${
                        i <= strength.score ? strength.color : 'bg-hairline'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-steel">{strength.label}</p>
              </div>
            )}
          </FormField>

          <FormField label="Konfirmasi Kata Sandi Baru" required error={passErrors.confirm}>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className="input-field pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-steel hover:text-ink transition-colors"
              >
                <EyeIcon size={16} />
              </button>
            </div>
          </FormField>

          <div className="flex justify-end">
            <button onClick={handleChangePassword} className="pill-button-primary">
              Ubah Kata Sandi
            </button>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-semibold text-ink mb-4">Sesi Aktif</h4>
        <div className="space-y-3">
          {sessions.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 rounded-xl border border-hairline bg-canvas">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-steel">
                  {session.device.includes('iPhone') || session.device.includes('Android') ? '📱' : '💻'}
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">{session.device} — {session.browser}</p>
                  <p className="text-xs text-steel">{session.ipAddress} · {formatRelativeTime(session.lastActive)}</p>
                </div>
              </div>
              {session.isCurrent ? (
                <Badge variant="success">Sesi Ini</Badge>
              ) : (
                <button
                  onClick={() => revokeSession(session.id)}
                  className="text-xs font-medium text-red-500 hover:text-red-700 transition-colors"
                >
                  Cabut
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-semibold text-ink mb-4">Riwayat Login</h4>
        <div className="rounded-xl border border-hairline overflow-hidden">
          <div className="grid grid-cols-[1fr_1fr_100px_80px] gap-4 px-4 py-2.5 bg-surface text-[11px] font-semibold text-steel uppercase tracking-wide">
            <span>Waktu</span>
            <span>Perangkat</span>
            <span>IP</span>
            <span>Status</span>
          </div>
          {loginHistory.map((entry) => (
            <div key={entry.id} className="grid grid-cols-[1fr_1fr_100px_80px] gap-4 px-4 py-3 border-t border-hairline-soft text-sm">
              <span className="text-ink">{formatDateTime(entry.timestamp)}</span>
              <span className="text-ink">{entry.device}</span>
              <span className="text-steel font-mono text-xs">{entry.ipAddress}</span>
              <Badge variant={entry.status === 'success' ? 'success' : 'error'}>
                {entry.status === 'success' ? 'Berhasil' : 'Gagal'}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
