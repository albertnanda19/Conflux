import { create } from 'zustand'
import {
  MOCK_USER_PROFILE,
  MOCK_ACTIVE_SESSIONS,
  MOCK_LOGIN_HISTORY,
  MOCK_PERSONAL_PREFERENCES,
  type UserProfile,
  type ActiveSession,
  type LoginHistoryEntry,
  type PersonalPreferences,
} from '@/mock/account-settings'
import { useToastStore } from '@/components/settings/toast'

interface AccountSettingsState {
  profile: UserProfile
  sessions: ActiveSession[]
  loginHistory: LoginHistoryEntry[]
  personalPreferences: PersonalPreferences
  _hasChanges: boolean

  updateProfile: (patch: Partial<UserProfile>) => void
  revokeSession: (sessionId: string) => void
  updatePersonalPreferences: (patch: Partial<PersonalPreferences>) => void
  saveProfile: () => void
  savePersonalPreferences: () => void
  changePassword: (current: string, newPass: string) => boolean
}

export const useAccountSettingsStore = create<AccountSettingsState>((set) => ({
  profile: { ...MOCK_USER_PROFILE },
  sessions: MOCK_ACTIVE_SESSIONS.map((s) => ({ ...s })),
  loginHistory: MOCK_LOGIN_HISTORY.map((h) => ({ ...h })),
  personalPreferences: { ...MOCK_PERSONAL_PREFERENCES },
  _hasChanges: false,

  updateProfile: (patch) =>
    set((s) => ({ profile: { ...s.profile, ...patch }, _hasChanges: true })),

  revokeSession: (sessionId) =>
    set((s) => ({
      sessions: s.sessions.filter((sess) => sess.id !== sessionId),
      _hasChanges: true,
    })),

  updatePersonalPreferences: (patch) =>
    set((s) => ({
      personalPreferences: { ...s.personalPreferences, ...patch },
      _hasChanges: true,
    })),

  saveProfile: () => {
    set({ _hasChanges: false })
    useToastStore.getState().addToast('Profil berhasil disimpan', 'success')
  },

  savePersonalPreferences: () => {
    set({ _hasChanges: false })
    useToastStore.getState().addToast('Preferensi berhasil disimpan', 'success')
  },

  changePassword: (current) => {
    if (current !== 'password') {
      useToastStore.getState().addToast('Kata sandi saat ini salah', 'error')
      return false
    }
    useToastStore.getState().addToast('Kata sandi berhasil diubah', 'success')
    return true
  },
}))
