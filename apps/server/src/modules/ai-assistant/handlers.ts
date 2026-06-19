import type { JwtPayload } from "@/lib/auth"
import { requireAuth, requireRole } from "@/lib/auth"
import { successResponse, paginatedResponse } from "@/lib/errors"
import { parseSafe } from "@/lib/validation"
import {
  createAssistantSchema,
  updateAssistantSchema,
  assignAgentSchema,
  testChatSchema,
  listAssistantsQuerySchema,
} from "./types"
import * as service from "./services"

const MANAGE_ROLES = ["super_admin", "admin"]

export async function handleListAssistants(auth: JwtPayload | null, query: unknown) {
  requireAuth(auth)
  const parsed = parseSafe(listAssistantsQuerySchema, query)
  const result = await service.listAssistants(parsed)
  return paginatedResponse(result.data, result.meta.total, result.meta.page, result.meta.limit, "Daftar AI Assistant berhasil diambil.")
}

export async function handleGetAssistant(auth: JwtPayload | null, id: string) {
  requireAuth(auth)
  return successResponse(await service.getAssistant(id), "Detail AI Assistant berhasil diambil.")
}

export async function handleCreateAssistant(auth: JwtPayload | null, body: unknown) {
  const user = requireAuth(auth)
  requireRole(user, ...MANAGE_ROLES)
  const input = parseSafe(createAssistantSchema, body)
  return successResponse(await service.createAssistant(input, user.sub), "AI Assistant berhasil dibuat.")
}

export async function handleUpdateAssistant(auth: JwtPayload | null, id: string, body: unknown) {
  const user = requireAuth(auth)
  requireRole(user, ...MANAGE_ROLES)
  const input = parseSafe(updateAssistantSchema, body)
  return successResponse(await service.updateAssistant(id, input), "AI Assistant berhasil diperbarui.")
}

export async function handleDeleteAssistant(auth: JwtPayload | null, id: string) {
  const user = requireAuth(auth)
  requireRole(user, ...MANAGE_ROLES)
  await service.deleteAssistant(id)
  return successResponse({ id }, "AI Assistant berhasil dihapus.")
}

export async function handleCycleStatus(auth: JwtPayload | null, id: string) {
  const user = requireAuth(auth)
  requireRole(user, ...MANAGE_ROLES)
  return successResponse(await service.cycleStatus(id), "Status AI Assistant berhasil diubah.")
}

export async function handleAssignAgent(auth: JwtPayload | null, id: string, body: unknown) {
  const user = requireAuth(auth)
  requireRole(user, ...MANAGE_ROLES)
  const input = parseSafe(assignAgentSchema, body)
  return successResponse(await service.assignAgent(id, input.agentId), "Penugasan AI Assistant berhasil diperbarui.")
}

export async function handleTestChat(auth: JwtPayload | null, id: string, body: unknown) {
  requireAuth(auth)
  const input = parseSafe(testChatSchema, body)
  return successResponse(await service.testChat(id, input), "Respons AI berhasil dibuat.")
}
