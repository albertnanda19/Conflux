import { db } from "@/lib/db"

export async function findManyPesan(page: number, limit: number) {
  const offset = (page - 1) * limit
  return [] as any[]
}

export async function findByIdPesan(id: number) {
  return null as any
}

export async function createPesan(data: any) {
  return {} as any
}

export async function updatePesan(id: number, data: any) {
  return {} as any
}

export async function deletePesan(id: number) {
  return {} as any
}
