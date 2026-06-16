import { NotFoundError } from "@/lib/errors"
import * as queries from "./queries"

export async function listPesan(page: number, limit: number) {
  const [items, total] = await Promise.all([
    queries.findManyPesan(page, limit),
    Promise.resolve(0),
  ])
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
}

export async function getPesan(id: number) {
  const item = await queries.findByIdPesan(id)
  if (!item) throw new NotFoundError("Pesan tidak ditemukan")
  return item
}

export async function createPesanService(data: any) {
  return queries.createPesan(data)
}

export async function updatePesanService(id: number, data: any) {
  await getPesan(id)
  return queries.updatePesan(id, data)
}

export async function deletePesanService(id: number) {
  await getPesan(id)
  return queries.deletePesan(id)
}
