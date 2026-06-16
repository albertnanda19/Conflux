import { NotFoundError } from "@/lib/errors"
import * as queries from "./queries"

export async function listPengguna(page: number, limit: number) {
  const [items, total] = await Promise.all([
    queries.findManyPengguna(page, limit),
    Promise.resolve(0),
  ])
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
}

export async function getPengguna(id: number) {
  const item = await queries.findByIdPengguna(id)
  if (!item) throw new NotFoundError("Pengguna tidak ditemukan")
  return item
}

export async function createPenggunaService(data: any) {
  return queries.createPengguna(data)
}

export async function updatePenggunaService(id: number, data: any) {
  await getPengguna(id)
  return queries.updatePengguna(id, data)
}

export async function deletePenggunaService(id: number) {
  await getPengguna(id)
  return queries.deletePengguna(id)
}
