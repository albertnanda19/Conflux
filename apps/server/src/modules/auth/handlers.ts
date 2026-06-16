import { loginSchema, registerSchema, refreshTokenSchema } from "./types"
import type { LoginInput, RegisterInput } from "./types"
import * as authService from "./services"
import {
  successResponse,
  ValidationError,
} from "@/lib/errors"

function parseBodySafe<T>(schema: { safeParse: (data: unknown) => { success: boolean; data?: T; error?: { issues: Array<{ path: Array<string | number>; message: string }> } } }, data: unknown): T {
  const result = schema.safeParse(data)
  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {}
    for (const issue of result.error!.issues) {
      const field = issue.path.join(".")
      if (!fieldErrors[field]) fieldErrors[field] = []
      fieldErrors[field].push(issue.message)
    }
    throw new ValidationError(fieldErrors)
  }
  return result.data as T
}

export async function handleLogin(body: unknown) {
  const parsed = parseBodySafe<LoginInput>(loginSchema, body)
  const tokens = await authService.login(parsed)
  return successResponse(tokens, "Berhasil masuk ke dalam sistem.")
}

export async function handleRegister(body: unknown) {
  const parsed = parseBodySafe<RegisterInput>(registerSchema, body)
  const tokens = await authService.register(parsed)
  return successResponse(tokens, "Akun baru berhasil dibuat.")
}

export async function handleRefreshToken(body: unknown) {
  const parsed = parseBodySafe<{ refreshToken: string }>(refreshTokenSchema, body)
  const tokens = await authService.refreshAccessToken(parsed.refreshToken)
  return successResponse(tokens, "Token berhasil diperbarui.")
}
