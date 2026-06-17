import { useState } from 'react'
import { useAuthStore } from '@/stores/auth'
import { useAccountSettingsStore } from '@/stores/account-settings'
import { FormField } from '@/components/settings/FormField'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/utils'

const ROLE_LABEL: Record<string, string> = {
  admin: 'Admin',
  supervisor: 'Supervisor',
  agent: 'Agent',
}

const ROLE_BADGE: Record<string, 'info' | 'warning' | 'default'> = {
  admin: 'info',
  supervisor: 'warning',
  agent: 'default',
}

export function MyProfile() {
  const user = useAuthStore((s) => s.user)
  const { profile, updateProfile, saveProfile } = useAccountSettingsStore()
  const [emailChanged, setEmailChanged] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (profile.fullName.trim().length < 2) e.fullName = 'Nama lengkap minimal 2 karakter.'
    if (profile.phone && !/^[\d\s\-+]{8,15}$/.test(profile.phone)) e.phone = 'Format telepon tidak valid.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (validate()) saveProfile()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-brand-blue text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
          {user?.initials ?? '?'}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-ink">{profile.fullName}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={ROLE_BADGE[profile.role] ?? 'default'}>
              {ROLE_LABEL[profile.role] ?? profile.role}
            </Badge>
            <Badge variant={profile.status === 'active' ? 'success' : 'default'}>
              {profile.status === 'active' ? 'Aktif' : 'Nonaktif'}
            </Badge>
          </div>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Nama Lengkap" required error={errors.fullName}>
          <input
            type="text"
            value={profile.fullName}
            onChange={(e) => updateProfile({ fullName: e.target.value })}
            className="input-field"
          />
        </FormField>
        <FormField label="Email" error={errors.email} hint={emailChanged ? 'Mengubah email akan memerlukan verifikasi ulang.' : undefined}>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => {
              updateProfile({ email: e.target.value })
              setEmailChanged(true)
            }}
            className="input-field"
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Telepon" error={errors.phone}>
          <input
            type="tel"
            value={profile.phone}
            onChange={(e) => updateProfile({ phone: e.target.value })}
            className="input-field"
          />
        </FormField>
        <FormField label="Role">
          <div className="flex items-center h-10 px-3 rounded-md border border-hairline bg-surface text-sm text-steel">
            <Badge variant={ROLE_BADGE[profile.role] ?? 'default'}>
              {ROLE_LABEL[profile.role] ?? profile.role}
            </Badge>
            <span className="ml-2 text-xs">(tidak dapat diubah)</span>
          </div>
        </FormField>
      </div>

      <FormField label="Bio / Deskripsi">
        <textarea
          value={profile.bio}
          onChange={(e) => updateProfile({ bio: e.target.value })}
          rows={3}
          className="input-field resize-none"
        />
      </FormField>

      <div className="flex items-center gap-4 text-sm text-steel">
        <span>Bergabung: <span className="text-ink font-medium">{formatDate(profile.joinedAt)}</span></span>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="pill-button-primary"
        >
          Simpan Profil
        </button>
      </div>
    </div>
  )
}
