import type { JwtPayload } from "@/lib/auth"
import { requireAuth, requireRole } from "@/lib/auth"
import { successResponse } from "@/lib/errors"
import { parseSafe } from "@/lib/validation"
import { createChannelSchema, updateChannelSchema, simulateInboundSchema } from "./types"
import * as service from "./services"

const ADMIN_ROLES = ["super_admin", "admin"]

export async function handleListChannels(auth: JwtPayload | null) {
  requireAuth(auth)
  return successResponse(await service.getChannels(), "Daftar channel berhasil diambil.")
}

export async function handleCreateChannel(auth: JwtPayload | null, body: unknown) {
  const payload = requireAuth(auth)
  requireRole(payload, ...ADMIN_ROLES)
  const input = parseSafe(createChannelSchema, body)
  return successResponse(await service.createChannel(input), "Channel berhasil dibuat.")
}

export async function handleUpdateChannel(auth: JwtPayload | null, id: string, body: unknown) {
  const payload = requireAuth(auth)
  requireRole(payload, ...ADMIN_ROLES)
  const input = parseSafe(updateChannelSchema, body)
  return successResponse(await service.updateChannel(id, input), "Channel berhasil diperbarui.")
}

export async function handleDeleteChannel(auth: JwtPayload | null, id: string) {
  const payload = requireAuth(auth)
  requireRole(payload, ...ADMIN_ROLES)
  await service.deleteChannel(id)
  return successResponse({ id }, "Channel berhasil dihapus.")
}

export async function handleSimulateInbound(auth: JwtPayload | null, id: string, body: unknown) {
  requireAuth(auth)
  const input = parseSafe(simulateInboundSchema, body)
  return successResponse(await service.simulateInbound(id, input), "Pesan masuk simulasi berhasil diantrekan.")
}
