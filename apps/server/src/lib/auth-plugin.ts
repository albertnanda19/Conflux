import { Elysia } from "elysia"
import { verifyToken, type JwtPayload } from "./auth"

export { requireAuth, requireRole } from "./auth"

export const authPlugin = new Elysia({ name: "auth-plugin" })
  .derive({ as: "scoped" }, async ({ headers }): Promise<{ auth: JwtPayload | null }> => {
    const header = headers.authorization
    if (!header?.startsWith("Bearer ")) return { auth: null }
    try {
      return { auth: await verifyToken(header.slice(7)) }
    } catch {
      return { auth: null }
    }
  })
