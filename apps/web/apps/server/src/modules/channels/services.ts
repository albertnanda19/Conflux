import { NotFoundError } from "@/lib/errors"
import * as queries from "./queries"

export async function listSaluran(page: number, limit: number) {
  const [items, total] = await Promise.all([
    queries.findManySaluran(page, limit),
    Promise.resolve(0),
  ])
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
}

export async function getSaluran(id: number) {
  const item = await queries.findByIdSaluran(id)
  if (!item) throw new NotFoundError("Saluran tidak ditemukan")
  return item
}

export async function createSaluranService(data: any) {
  return queries.createSaluran(data)
}

export async function updateSaluranService(id: number, data: any) {
  await getSaluran(id)
  return queries.updateSaluran(id, data)
}

export async function deleteSaluranService(id: number) {
  await getSaluran(id)
  return queries.deleteSaluran(id)
}
