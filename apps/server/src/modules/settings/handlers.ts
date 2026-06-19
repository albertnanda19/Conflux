import type { JwtPayload } from "@/lib/auth"
import { requireAuth, requireRole } from "@/lib/auth"
import { successResponse } from "@/lib/errors"
import { parseSafe } from "@/lib/validation"
import { updateAiSettingsSchema, updateProviderSchema } from "./types"
import * as service from "./services"

const MANAGE_ROLES = ["super_admin", "admin"]

export async function handleGetAiSettings(auth: JwtPayload | null) {
  requireAuth(auth)
  return successResponse(await service.getAiSettings(), "Pengaturan AI berhasil diambil.")
}

export async function handleUpdateAiSettings(auth: JwtPayload | null, body: unknown) {
  const user = requireAuth(auth)
  requireRole(user, ...MANAGE_ROLES)
  const input = parseSafe(updateAiSettingsSchema, body)
  return successResponse(await service.updateAiEnabled(input.aiEnabled), "Pengaturan AI berhasil diperbarui.")
}

export async function handleUpdateProvider(auth: JwtPayload | null, id: string, body: unknown) {
  const user = requireAuth(auth)
  requireRole(user, ...MANAGE_ROLES)
  const input = parseSafe(updateProviderSchema, body)
  return successResponse(await service.updateProvider(id, input), "Provider AI berhasil diperbarui.")
}
