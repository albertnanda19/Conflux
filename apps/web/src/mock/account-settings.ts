export interface UserProfile {
  fullName: string
  email: string
  phone: string
  role: 'admin' | 'supervisor' | 'agent'
  status: 'active' | 'inactive'
  bio: string
  joinedAt: string
  avatarUrl: string | null
}

export interface ActiveSession {
  id: string
  device: string
  browser: string
  ipAddress: string
  lastActive: string
  isCurrent: boolean
}

export interface LoginHistoryEntry {
  id: string
  timestamp: string
  device: string
  browser: string
  ipAddress: string
  status: 'success' | 'failed'
  location?: string
}

export interface PersonalPreferences {
  language: string
  timezone: string
  emailNotifications: boolean
  desktopNotifications: boolean
  notificationSound: boolean
  notifyOnNewMessage: boolean
  notifyOnAssignment: boolean
  digestFrequency: 'none' | 'daily' | 'weekly'
  autoLogout: '15min' | '30min' | '1hr' | 'never'
  compactMode: boolean
}

export type AccountSettings = {
  profile: UserProfile
  sessions: ActiveSession[]
  loginHistory: LoginHistoryEntry[]
  personalPreferences: PersonalPreferences
}

export const AUTO_LOGOUT_OPTIONS = [
  { value: '15min', label: '15 Menit' },
  { value: '30min', label: '30 Menit' },
  { value: '1hr', label: '1 Jam' },
  { value: 'never', label: 'Tidak Pernah' },
] as const

export const MOCK_USER_PROFILE: UserProfile = {
  fullName: 'Admin Utama',
  email: 'admin@company.com',
  phone: '+62 812 3456 7890',
  role: 'admin',
  status: 'active',
  bio: 'System administrator untuk platform sales communication.',
  joinedAt: '2024-03-15T00:00:00Z',
  avatarUrl: null,
}

export const MOCK_ACTIVE_SESSIONS: ActiveSession[] = [
  {
    id: 'sess-1',
    device: 'MacBook Pro',
    browser: 'Chrome 125.0',
    ipAddress: '103.28.12.45',
    lastActive: new Date().toISOString(),
    isCurrent: true,
  },
  {
    id: 'sess-2',
    device: 'iPhone 15',
    browser: 'Safari 17.4',
    ipAddress: '103.28.12.45',
    lastActive: new Date(Date.now() - 2 * 3600_000).toISOString(),
    isCurrent: false,
  },
  {
    id: 'sess-3',
    device: 'Windows Desktop',
    browser: 'Firefox 126.0',
    ipAddress: '114.124.88.21',
    lastActive: new Date(Date.now() - 24 * 3600_000).toISOString(),
    isCurrent: false,
  },
]

export const MOCK_LOGIN_HISTORY: LoginHistoryEntry[] = [
  {
    id: 'hist-1',
    timestamp: new Date().toISOString(),
    device: 'MacBook Pro',
    browser: 'Chrome 125.0',
    ipAddress: '103.28.12.45',
    status: 'success',
    location: 'Jakarta, Indonesia',
  },
  {
    id: 'hist-2',
    timestamp: new Date(Date.now() - 3600_000).toISOString(),
    device: 'MacBook Pro',
    browser: 'Chrome 125.0',
    ipAddress: '103.28.12.45',
    status: 'success',
    location: 'Jakarta, Indonesia',
  },
  {
    id: 'hist-3',
    timestamp: new Date(Date.now() - 86400_000).toISOString(),
    device: 'iPhone 15',
    browser: 'Safari 17.4',
    ipAddress: '103.28.12.45',
    status: 'success',
    location: 'Jakarta, Indonesia',
  },
  {
    id: 'hist-4',
    timestamp: new Date(Date.now() - 86400_000 * 2).toISOString(),
    device: 'Unknown Device',
    browser: 'Chrome 120.0',
    ipAddress: '203.0.113.50',
    status: 'failed',
    location: 'Surabaya, Indonesia',
  },
  {
    id: 'hist-5',
    timestamp: new Date(Date.now() - 86400_000 * 3).toISOString(),
    device: 'Windows Desktop',
    browser: 'Firefox 126.0',
    ipAddress: '114.124.88.21',
    status: 'success',
    location: 'Bandung, Indonesia',
  },
]

export const MOCK_PERSONAL_PREFERENCES: PersonalPreferences = {
  language: 'Bahasa Indonesia',
  timezone: 'Asia/Jakarta (WIB, UTC+7)',
  emailNotifications: true,
  desktopNotifications: true,
  notificationSound: false,
  notifyOnNewMessage: true,
  notifyOnAssignment: true,
  digestFrequency: 'daily',
  autoLogout: '30min',
  compactMode: false,
}
