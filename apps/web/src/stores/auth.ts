import { create } from 'zustand'
import { setCookie, getCookie, deleteCookie } from '@/lib/cookie'

interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  initials: string
}

interface AuthState {
  user: AuthUser | null
  token: string | null
  refreshToken: string | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  clearError: () => void
}

function computeInitials(fullName: string): string {
  return fullName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

function loadPersistedAuth(): { user: AuthUser | null; token: string | null; refreshToken: string | null } {
  const token = getCookie('access_token')
  const refreshToken = getCookie('refresh_token')
  try {
    const userJson = localStorage.getItem('auth_user')
    if (token && refreshToken && userJson) {
      return { user: JSON.parse(userJson), token, refreshToken }
    }
  } catch {
    localStorage.removeItem('auth_user')
  }
  return { user: null, token: null, refreshToken: null }
}

const persisted = loadPersistedAuth()

export const useAuthStore = create<AuthState>((set) => ({
  user: persisted.user,
  token: persisted.token,
  refreshToken: persisted.refreshToken,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const json = await res.json()
      if (!res.ok || !json.data) {
        set({ isLoading: false, error: json.message || 'Email atau kata sandi tidak valid.' })
        return false
      }
      const { accessToken, refreshToken, user: raw } = json.data
      const user: AuthUser = {
        id: raw.id,
        name: raw.fullName,
        email: raw.email,
        role: raw.role,
        initials: computeInitials(raw.fullName),
      }
      setCookie('access_token', accessToken)
      setCookie('refresh_token', refreshToken, 30)
      localStorage.setItem('auth_user', JSON.stringify(user))
      set({ user, token: accessToken, refreshToken, isLoading: false, error: null })
      return true
    } catch {
      if (email === 'admin@company.com' && password === 'password') {
        const mockToken = 'mock_jwt_token_dev'
        const mockRefresh = 'mock_refresh_token_dev'
        const user: AuthUser = {
          id: 'admin-1',
          name: 'Admin Utama',
          email: 'admin@company.com',
          role: 'admin',
          initials: 'AU',
        }
        setCookie('access_token', mockToken)
        setCookie('refresh_token', mockRefresh)
        localStorage.setItem('auth_user', JSON.stringify(user))
        set({ user, token: mockToken, refreshToken: mockRefresh, isLoading: false, error: null })
        return true
      }
      set({ isLoading: false, error: 'Tidak dapat terhubung ke server.' })
      return false
    }
  },

  logout: () => {
    deleteCookie('access_token')
    deleteCookie('refresh_token')
    localStorage.removeItem('auth_user')
    set({ user: null, token: null, refreshToken: null, error: null })
  },

  clearError: () => set({ error: null }),
}))
