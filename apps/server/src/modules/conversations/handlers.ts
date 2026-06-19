import type { JwtPayload } from "@/lib/auth"
import { requireAuth } from "@/lib/auth"
import { successResponse, paginatedResponse } from "@/lib/errors"
import { parseSafe } from "@/lib/validation"
import {
  listConversationsQuerySchema,
  updateStatusSchema,
  assignSchema,
  transferSchema,
  assignAiSchema,
} from "./types"
import { attachLabelSchema } from "@/modules/labels/types"
import * as service from "./services"

export async function handleListConversations(auth: JwtPayload | null, query: unknown) {
  requireAuth(auth)
  const parsed = parseSafe(listConversationsQuerySchema, query)
  const result = await service.listConversations(parsed)
  return paginatedResponse(result.data, result.meta.total, result.meta.page, result.meta.limit, "Daftar percakapan berhasil diambil.")
}

export async function handleGetConversation(auth: JwtPayload | null, id: string) {
  requireAuth(auth)
  return successResponse(await service.getConversationDetail(id), "Detail percakapan berhasil diambil.")
}

export async function handleUpdateStatus(auth: JwtPayload | null, id: string, body: unknown) {
  requireAuth(auth)
  const input = parseSafe(updateStatusSchema, body)
  return successResponse(await service.changeStatus(id, input.status), "Status percakapan diperbarui.")
}

export async function handleResolve(auth: JwtPayload | null, id: string) {
  requireAuth(auth)
  return successResponse(await service.resolveConversation(id), "Percakapan ditandai selesai.")
}

export async function handleSnooze(auth: JwtPayload | null, id: string) {
  requireAuth(auth)
  return successResponse(await service.snoozeConversation(id), "Percakapan ditunda.")
}

export async function handleMarkRead(auth: JwtPayload | null, id: string) {
  requireAuth(auth)
  return successResponse(await service.markRead(id), "Percakapan ditandai sudah dibaca.")
}

export async function handleAssign(auth: JwtPayload | null, id: string, body: unknown) {
  requireAuth(auth)
  const input = parseSafe(assignSchema, body)
  return successResponse(await service.assignConversation(id, input.agentId), "Penugasan percakapan diperbarui.")
}

export async function handleTransfer(auth: JwtPayload | null, id: string, body: unknown) {
  const payload = requireAuth(auth)
  const input = parseSafe(transferSchema, body)
  return successResponse(await service.transferConversation(id, input, payload), "Percakapan berhasil ditransfer.")
}

export async function handleAssignAi(auth: JwtPayload | null, id: string, body: unknown) {
  requireAuth(auth)
  const input = parseSafe(assignAiSchema, body)
  return successResponse(await service.assignAiAssistant(id, input.aiAssistantId), "AI Assistant berhasil ditugaskan ke percakapan.")
}

export async function handleDeactivateAi(auth: JwtPayload | null, id: string) {
  requireAuth(auth)
  return successResponse(await service.deactivateAi(id), "AI Assistant dinonaktifkan dari percakapan.")
}

export async function handleAddLabel(auth: JwtPayload | null, id: string, body: unknown) {
  requireAuth(auth)
  const input = parseSafe(attachLabelSchema, body)
  return successResponse(await service.addLabel(id, input.labelId), "Label berhasil ditambahkan.")
}

export async function handleRemoveLabel(auth: JwtPayload | null, id: string, labelId: string) {
  requireAuth(auth)
  return successResponse(await service.removeLabel(id, labelId), "Label berhasil dihapus dari percakapan.")
}
