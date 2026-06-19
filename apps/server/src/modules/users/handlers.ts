import type { JwtPayload } from "@/lib/auth"
import { requireAuth } from "@/lib/auth"
import { successResponse } from "@/lib/errors"
import { parseSafe } from "@/lib/validation"
import { updateStatusSchema } from "./types"
import { getAgents, setMyStatus } from "./services"

export async function handleListAgents(auth: JwtPayload | null) {
  requireAuth(auth)
  const agents = await getAgents()
  return successResponse(agents, "Daftar agen berhasil diambil.")
}

export async function handleUpdateMyStatus(auth: JwtPayload | null, body: unknown) {
  const payload = requireAuth(auth)
  const input = parseSafe(updateStatusSchema, body)
  return successResponse(await setMyStatus(payload.sub, input.status), "Status berhasil diperbarui.")
}
