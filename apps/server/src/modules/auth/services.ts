import {
  signAccessToken,
  signRefreshToken,
  verifyToken,
  authenticateUser,
  hashPassword,
} from "@/lib/auth"
import { findUserByEmail, findUserById, createUser } from "./queries"
import {
  BadRequestError,
  UnauthorizedError,
  ConflictError,
  InternalError,
} from "@/lib/errors"
import type { LoginInput, RegisterInput, AuthTokens } from "./types"

export async function login(input: LoginInput): Promise<AuthTokens> {
  const user = await authenticateUser(input.email, input.password)

  if (!user) {
    throw new UnauthorizedError("Email atau kata sandi tidak valid.")
  }

  const tokenPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  }

  const [accessToken, refreshToken] = await Promise.all([
    signAccessToken(tokenPayload),
    signRefreshToken(tokenPayload),
  ])

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
  }
}

export async function register(input: RegisterInput): Promise<AuthTokens> {
  const existingUser = await findUserByEmail(input.email)

  if (existingUser) {
    throw new ConflictError("Email sudah terdaftar dalam sistem. Gunakan email lain.")
  }

  const passwordHash = await hashPassword(input.password)

  try {
    const user = await createUser({
      email: input.email,
      passwordHash,
      fullName: input.fullName,
      role: input.role,
    })

    const tokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    }

    const [accessToken, refreshToken] = await Promise.all([
      signAccessToken(tokenPayload),
      signRefreshToken(tokenPayload),
    ])

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    }
  } catch (error) {
    if (error instanceof ConflictError) throw error
    console.error("[Auth] Gagal membuat pengguna baru:", error)
    throw new InternalError("Gagal membuat akun baru. Silakan coba lagi.")
  }
}

export async function refreshAccessToken(refreshTokenStr: string): Promise<AuthTokens> {
  const payload = await verifyToken(refreshTokenStr).catch(() => null)

  if (!payload) {
    throw new UnauthorizedError("Token segar tidak valid atau sudah kedaluwarsa.")
  }

  const user = await findUserById(payload.sub)

  if (!user) {
    throw new UnauthorizedError("Pengguna tidak ditemukan dalam sistem.")
  }

  const tokenPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
  }

  const [accessToken, newRefreshToken] = await Promise.all([
    signAccessToken(tokenPayload),
    signRefreshToken(tokenPayload),
  ])

  return {
    accessToken,
    refreshToken: newRefreshToken,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
  }
}

export async function getProfile(userId: string) {
  const user = await findUserById(userId)

  if (!user) {
    throw new BadRequestError("Pengguna tidak ditemukan.")
  }

  return user
}
