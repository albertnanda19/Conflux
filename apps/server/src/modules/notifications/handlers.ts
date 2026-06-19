import type { JwtPayload } from "@/lib/auth"
import { requireAuth } from "@/lib/auth"
import { successResponse } from "@/lib/errors"
import { parseSafe } from "@/lib/validation"
import { listNotificationsQuerySchema } from "./types"
import * as service from "./services"

export async function handleListNotifications(auth: JwtPayload | null, query: unknown) {
  const payload = requireAuth(auth)
  const parsed = parseSafe(listNotificationsQuerySchema, query)
  return successResponse(await service.getMyNotifications(payload.sub, parsed.unreadOnly), "Daftar notifikasi berhasil diambil.")
}

export async function handleMarkRead(auth: JwtPayload | null, id: string) {
  const payload = requireAuth(auth)
  await service.markRead(payload.sub, id)
  return successResponse({ id }, "Notifikasi ditandai sudah dibaca.")
}

export async function handleMarkAllRead(auth: JwtPayload | null) {
  const payload = requireAuth(auth)
  return successResponse(await service.markAllRead(payload.sub), "Semua notifikasi ditandai sudah dibaca.")
}
