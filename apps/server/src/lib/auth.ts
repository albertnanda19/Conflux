import { SignJWT, jwtVerify } from "jose"
import { db } from "./db"
import { users } from "./schema"
import { eq } from "drizzle-orm"
import { UnauthorizedError, ForbiddenError } from "./errors"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "change-me-in-production")
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m"
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d"

export type JwtPayload = {
  sub: string
  email: string
  role: string
}

export async function signAccessToken(payload: JwtPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(JWT_SECRET)
}

export async function signRefreshToken(payload: JwtPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_REFRESH_EXPIRES_IN)
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<JwtPayload> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as JwtPayload
  } catch {
    throw new UnauthorizedError()
  }
}

export async function authenticateUser(email: string, password: string) {
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      passwordHash: users.passwordHash,
      fullName: users.fullName,
      role: users.role,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1)

  if (!user) return null

  const isValid = await Bun.password.verify(password, user.passwordHash)
  if (!isValid) return null

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
  }
}

export async function hashPassword(password: string): Promise<string> {
  return Bun.password.hash(password)
}

export function requireAuth(payload: JwtPayload | null): JwtPayload {
  if (!payload) throw new UnauthorizedError()
  return payload
}

export function requireRole(payload: JwtPayload, ...roles: string[]) {
  if (!roles.includes(payload.role)) {
    throw new ForbiddenError(
      `Peran Anda (${payload.role}) tidak memiliki izin untuk melakukan aksi ini.`,
    )
  }
}
