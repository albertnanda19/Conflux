import { db } from "@/lib/db"

export async function findManyPemberitahuan(page: number, limit: number) {
  const offset = (page - 1) * limit
  return [] as any[]
}

export async function findByIdPemberitahuan(id: number) {
  return null as any
}

export async function createPemberitahuan(data: any) {
  return {} as any
}

export async function updatePemberitahuan(id: number, data: any) {
  return {} as any
}

export async function deletePemberitahuan(id: number) {
  return {} as any
}
