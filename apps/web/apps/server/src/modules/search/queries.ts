import { db } from "@/lib/db"

export async function findManyPencarian(page: number, limit: number) {
  const offset = (page - 1) * limit
  return [] as any[]
}

export async function findByIdPencarian(id: number) {
  return null as any
}

export async function createPencarian(data: any) {
  return {} as any
}

export async function updatePencarian(id: number, data: any) {
  return {} as any
}

export async function deletePencarian(id: number) {
  return {} as any
}
