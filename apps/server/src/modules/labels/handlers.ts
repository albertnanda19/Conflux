import type { JwtPayload } from "@/lib/auth"
import { requireAuth, requireRole } from "@/lib/auth"
import { successResponse } from "@/lib/errors"
import { parseSafe } from "@/lib/validation"
import { createLabelSchema, updateLabelSchema } from "./types"
import * as service from "./services"

const ADMIN_ROLES = ["super_admin", "admin", "supervisor"]

export async function handleListLabels(auth: JwtPayload | null) {
  requireAuth(auth)
  return successResponse(await service.getLabels(), "Daftar label berhasil diambil.")
}

export async function handleCreateLabel(auth: JwtPayload | null, body: unknown) {
  const payload = requireAuth(auth)
  requireRole(payload, ...ADMIN_ROLES)
  const input = parseSafe(createLabelSchema, body)
  return successResponse(await service.createLabel(input, payload.sub), "Label berhasil dibuat.")
}

export async function handleUpdateLabel(auth: JwtPayload | null, id: string, body: unknown) {
  const payload = requireAuth(auth)
  requireRole(payload, ...ADMIN_ROLES)
  const input = parseSafe(updateLabelSchema, body)
  return successResponse(await service.updateLabel(id, input), "Label berhasil diperbarui.")
}

export async function handleDeleteLabel(auth: JwtPayload | null, id: string) {
  const payload = requireAuth(auth)
  requireRole(payload, ...ADMIN_ROLES)
  await service.deleteLabel(id)
  return successResponse({ id }, "Label berhasil dihapus.")
}
