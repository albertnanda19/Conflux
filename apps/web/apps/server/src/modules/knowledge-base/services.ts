import { NotFoundError } from "@/lib/errors"
import * as queries from "./queries"

export async function listBasis Pengetahuan(page: number, limit: number) {
  const [items, total] = await Promise.all([
    queries.findManyBasis Pengetahuan(page, limit),
    Promise.resolve(0),
  ])
  return { items, total, page, limit, totalPages: Math.ceil(total / limit) }
}

export async function getBasis Pengetahuan(id: number) {
  const item = await queries.findByIdBasis Pengetahuan(id)
  if (!item) throw new NotFoundError("Basis Pengetahuan tidak ditemukan")
  return item
}

export async function createBasis PengetahuanService(data: any) {
  return queries.createBasis Pengetahuan(data)
}

export async function updateBasis PengetahuanService(id: number, data: any) {
  await getBasis Pengetahuan(id)
  return queries.updateBasis Pengetahuan(id, data)
}

export async function deleteBasis PengetahuanService(id: number) {
  await getBasis Pengetahuan(id)
  return queries.deleteBasis Pengetahuan(id)
}
