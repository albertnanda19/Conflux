export interface OrganizationInfo {
  name: string
  logoUrl: string | null
  address: string
  phone: string
  website: string
  email: string
  industry: string
}

export interface PlatformPreferences {
  timezone: string
  language: string
  dateFormat: string
  currency: string
  timeFormat: string
  weekStartsOn: string
}

export interface NotificationSettings {
  emailNotifications: boolean
  desktopNotifications: boolean
  notificationSound: boolean
  notifyOnNewMessage: boolean
  notifyOnAssignment: boolean
  notifyOnBroadcastComplete: boolean
  digestFrequency: 'none' | 'daily' | 'weekly'
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'auto'
  sidebarCompact: boolean
  showInitials: boolean
  accentColor: string
}

export type GeneralSettings = {
  organization: OrganizationInfo
  preferences: PlatformPreferences
  notifications: NotificationSettings
  appearance: AppearanceSettings
}

export const TIMEZONE_OPTIONS = [
  'Asia/Jakarta (WIB, UTC+7)',
  'Asia/Makassar (WITA, UTC+8)',
  'Asia/Jayapura (WIT, UTC+9)',
  'Asia/Singapore (SGT, UTC+8)',
  'Asia/Kuala_Lumpur (MYT, UTC+8)',
] as const

export const LANGUAGE_OPTIONS = [
  'Bahasa Indonesia',
  'English',
] as const

export const DATE_FORMAT_OPTIONS = [
  'DD/MM/YYYY',
  'MM/DD/YYYY',
  'YYYY-MM-DD',
] as const

export const CURRENCY_OPTIONS = [
  'IDR (Rupiah)',
  'USD (Dollar)',
] as const

export const TIME_FORMAT_OPTIONS = [
  '24 Jam',
  '12 Jam',
] as const

export const WEEK_START_OPTIONS = [
  'Senin',
  'Minggu',
] as const

export const INDUSTRY_OPTIONS = [
  'Teknologi',
  'Pendidikan',
  'Kesehatan',
  'Retail',
  'Manufaktur',
  'Jasa',
  'Lainnya',
] as const

export const ACCENT_COLORS = [
  '#4A7AFF',
  '#10B981',
  '#7C3AED',
  '#FF6B5A',
  '#F59E0B',
] as const

export const MOCK_ORGANIZATION: OrganizationInfo = {
  name: 'Acme Learning Indonesia',
  logoUrl: null,
  address: 'Jl. Sudirman No. 123, Jakarta Selatan, DKI Jakarta 12190',
  phone: '+62 21 5555 1234',
  website: 'https://acme-learning.co.id',
  email: 'info@acme-learning.co.id',
  industry: 'Pendidikan',
}

export const MOCK_PLATFORM_PREFERENCES: PlatformPreferences = {
  timezone: TIMEZONE_OPTIONS[0],
  language: LANGUAGE_OPTIONS[0],
  dateFormat: DATE_FORMAT_OPTIONS[0],
  currency: CURRENCY_OPTIONS[0],
  timeFormat: TIME_FORMAT_OPTIONS[0],
  weekStartsOn: WEEK_START_OPTIONS[0],
}

export const MOCK_NOTIFICATION_SETTINGS: NotificationSettings = {
  emailNotifications: true,
  desktopNotifications: true,
  notificationSound: true,
  notifyOnNewMessage: true,
  notifyOnAssignment: true,
  notifyOnBroadcastComplete: false,
  digestFrequency: 'daily',
}

export const MOCK_APPEARANCE_SETTINGS: AppearanceSettings = {
  theme: 'light',
  sidebarCompact: false,
  showInitials: true,
  accentColor: ACCENT_COLORS[0],
}
