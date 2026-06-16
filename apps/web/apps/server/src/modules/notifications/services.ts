import { NotFoundError } from "@/lib/errors"
import * as queries from "./queries"

export async function listPemberitahuan(page: number, limit: number) {
  const [items, total] = await Promise.all([
    queries.findManyPemberitahuan(page, limit),
    Promise.resolve(0),
  ])
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
}

export async function getPemberitahuan(id: number) {
  const item = await queries.findByIdPemberitahuan(id)
  if (!item) throw new NotFoundError("Pemberitahuan tidak ditemukan")
  return item
}

export async function createPemberitahuanService(data: any) {
  return queries.createPemberitahuan(data)
}

export async function updatePemberitahuanService(id: number, data: any) {
  await getPemberitahuan(id)
  return queries.updatePemberitahuan(id, data)
}

export async function deletePemberitahuanService(id: number) {
  await getPemberitahuan(id)
  return queries.deletePemberitahuan(id)
}
