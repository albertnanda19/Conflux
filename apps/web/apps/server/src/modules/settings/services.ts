import { NotFoundError } from "@/lib/errors"
import * as queries from "./queries"

export async function listPengaturan(page: number, limit: number) {
  const [items, total] = await Promise.all([
    queries.findManyPengaturan(page, limit),
    Promise.resolve(0),
  ])
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
}

export async function getPengaturan(id: number) {
  const item = await queries.findByIdPengaturan(id)
  if (!item) throw new NotFoundError("Pengaturan tidak ditemukan")
  return item
}

export async function createPengaturanService(data: any) {
  return queries.createPengaturan(data)
}

export async function updatePengaturanService(id: number, data: any) {
  await getPengaturan(id)
  return queries.updatePengaturan(id, data)
}

export async function deletePengaturanService(id: number) {
  await getPengaturan(id)
  return queries.deletePengaturan(id)
}
