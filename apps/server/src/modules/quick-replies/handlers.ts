import type { JwtPayload } from "@/lib/auth"
import { requireAuth, requireRole } from "@/lib/auth"
import { successResponse } from "@/lib/errors"
import { parseSafe } from "@/lib/validation"
import { createQuickReplySchema, updateQuickReplySchema } from "./types"
import * as service from "./services"

const ADMIN_ROLES = ["super_admin", "admin", "supervisor"]

export async function handleListQuickReplies(auth: JwtPayload | null) {
  requireAuth(auth)
  return successResponse(await service.getQuickReplies(), "Daftar quick reply berhasil diambil.")
}

export async function handleCreateQuickReply(auth: JwtPayload | null, body: unknown) {
  const payload = requireAuth(auth)
  requireRole(payload, ...ADMIN_ROLES)
  const input = parseSafe(createQuickReplySchema, body)
  return successResponse(await service.createQuickReply(input, payload.sub), "Quick reply berhasil dibuat.")
}

export async function handleUpdateQuickReply(auth: JwtPayload | null, id: string, body: unknown) {
  const payload = requireAuth(auth)
  requireRole(payload, ...ADMIN_ROLES)
  const input = parseSafe(updateQuickReplySchema, body)
  return successResponse(await service.updateQuickReply(id, input), "Quick reply berhasil diperbarui.")
}

export async function handleDeleteQuickReply(auth: JwtPayload | null, id: string) {
  const payload = requireAuth(auth)
  requireRole(payload, ...ADMIN_ROLES)
  await service.deleteQuickReply(id)
  return successResponse({ id }, "Quick reply berhasil dihapus.")
}
