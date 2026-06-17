import { create } from 'zustand'
import {
  MOCK_ORGANIZATION,
  MOCK_PLATFORM_PREFERENCES,
  MOCK_NOTIFICATION_SETTINGS,
  MOCK_APPEARANCE_SETTINGS,
  type OrganizationInfo,
  type PlatformPreferences,
  type NotificationSettings,
  type AppearanceSettings,
} from '@/mock/general-settings'
import { useToastStore } from '@/components/settings/toast'

interface GeneralSettingsState {
  organization: OrganizationInfo
  preferences: PlatformPreferences
  notifications: NotificationSettings
  appearance: AppearanceSettings
  _hasChanges: boolean

  updateOrganization: (patch: Partial<OrganizationInfo>) => void
  updatePreferences: (patch: Partial<PlatformPreferences>) => void
  updateNotifications: (patch: Partial<NotificationSettings>) => void
  updateAppearance: (patch: Partial<AppearanceSettings>) => void
  saveAll: () => void
  resetChanges: () => void
}

export const useGeneralSettingsStore = create<GeneralSettingsState>((set) => ({
  organization: { ...MOCK_ORGANIZATION },
  preferences: { ...MOCK_PLATFORM_PREFERENCES },
  notifications: { ...MOCK_NOTIFICATION_SETTINGS },
  appearance: { ...MOCK_APPEARANCE_SETTINGS },
  _hasChanges: false,

  updateOrganization: (patch) =>
    set((s) => ({ organization: { ...s.organization, ...patch }, _hasChanges: true })),

  updatePreferences: (patch) =>
    set((s) => ({ preferences: { ...s.preferences, ...patch }, _hasChanges: true })),

  updateNotifications: (patch) =>
    set((s) => ({ notifications: { ...s.notifications, ...patch }, _hasChanges: true })),

  updateAppearance: (patch) =>
    set((s) => ({ appearance: { ...s.appearance, ...patch }, _hasChanges: true })),

  saveAll: () => {
    set({ _hasChanges: false })
    useToastStore.getState().addToast('Pengaturan berhasil disimpan', 'success')
  },

  resetChanges: () => {
    set({
      organization: { ...MOCK_ORGANIZATION },
      preferences: { ...MOCK_PLATFORM_PREFERENCES },
      notifications: { ...MOCK_NOTIFICATION_SETTINGS },
      appearance: { ...MOCK_APPEARANCE_SETTINGS },
      _hasChanges: false,
    })
  },
}))
