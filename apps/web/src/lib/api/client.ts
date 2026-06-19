import { apiRequest, ApiError } from '@/lib/api'
import { useAuthStore } from '@/stores/auth'

type Envelope<T> = { success: boolean; data: T; message: string }

export function getAccessToken(): string | null {
  const match = document.cookie.match(/(^| )access_token=([^;]+)/)
  return match ? decodeURIComponent(match[2]!) : null
}

async function refreshToken(): Promise<boolean> {
  const match = document.cookie.match(/(^| )refresh_token=([^;]+)/)
  const refresh = match ? decodeURIComponent(match[2]!) : null
  if (!refresh) return false
  try {
    const res = await apiRequest<Envelope<{ accessToken: string; refreshToken: string }>>(
      '/api/v1/auth/refresh',
      { method: 'POST', body: { refreshToken: refresh } },
    )
    document.cookie = `access_token=${encodeURIComponent(res.data.accessToken)}; path=/; max-age=${7 * 86400}; SameSite=Lax`
    document.cookie = `refresh_token=${encodeURIComponent(res.data.refreshToken)}; path=/; max-age=${30 * 86400}; SameSite=Lax`
    return true
  } catch {
    return false
  }
}

async function request<T>(path: string, options?: { method?: string; body?: unknown }): Promise<T> {
  try {
    const res = await apiRequest<Envelope<T>>(path, options)
    return res.data
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      if (await refreshToken()) {
        const retry = await apiRequest<Envelope<T>>(path, options)
        return retry.data
      }
      useAuthStore.getState().logout()
    }
    throw err
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body }),
  del: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
