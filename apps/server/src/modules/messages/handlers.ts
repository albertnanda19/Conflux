import type { JwtPayload } from "@/lib/auth"
import { requireAuth } from "@/lib/auth"
import { successResponse } from "@/lib/errors"
import { parseSafe } from "@/lib/validation"
import { sendMessageSchema, listMessagesQuerySchema } from "./types"
import * as service from "./services"

export async function handleListMessages(auth: JwtPayload | null, conversationId: string, query: unknown) {
  requireAuth(auth)
  const parsed = parseSafe(listMessagesQuerySchema, query)
  const result = await service.listMessages(conversationId, parsed.limit, parsed.cursor)
  return successResponse(result, "Daftar pesan berhasil diambil.")
}

export async function handleSendMessage(auth: JwtPayload | null, conversationId: string, body: unknown) {
  const payload = requireAuth(auth)
  const input = parseSafe(sendMessageSchema, body)
  return successResponse(await service.sendMessage(conversationId, input, payload), "Pesan berhasil dikirim.")
}
