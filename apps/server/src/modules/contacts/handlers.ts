import type { JwtPayload } from "@/lib/auth"
import { requireAuth } from "@/lib/auth"
import { successResponse, paginatedResponse } from "@/lib/errors"
import { parseSafe } from "@/lib/validation"
import { createContactSchema, updateContactSchema, listContactsQuerySchema } from "./types"
import * as service from "./services"

export async function handleListContacts(auth: JwtPayload | null, query: unknown) {
  requireAuth(auth)
  const parsed = parseSafe(listContactsQuerySchema, query)
  const result = await service.listContacts(parsed)
  return paginatedResponse(result.data, result.meta.total, result.meta.page, result.meta.limit, "Daftar kontak berhasil diambil.")
}

export async function handleGetContact(auth: JwtPayload | null, id: string) {
  requireAuth(auth)
  return successResponse(await service.getContactDetail(id), "Detail kontak berhasil diambil.")
}

export async function handleCreateContact(auth: JwtPayload | null, body: unknown) {
  requireAuth(auth)
  const input = parseSafe(createContactSchema, body)
  return successResponse(await service.createContact(input), "Kontak berhasil dibuat.")
}

export async function handleUpdateContact(auth: JwtPayload | null, id: string, body: unknown) {
  requireAuth(auth)
  const input = parseSafe(updateContactSchema, body)
  return successResponse(await service.updateContact(id, input), "Kontak berhasil diperbarui.")
}

export async function handleDeleteContact(auth: JwtPayload | null, id: string) {
  requireAuth(auth)
  await service.deleteContact(id)
  return successResponse({ id }, "Kontak berhasil dihapus.")
}

export async function handleGetContactActivities(auth: JwtPayload | null, id: string) {
  requireAuth(auth)
  return successResponse(await service.getContactActivities(id), "Riwayat aktivitas kontak berhasil diambil.")
}
