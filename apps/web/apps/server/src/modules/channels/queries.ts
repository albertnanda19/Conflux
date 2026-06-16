import { db } from "@/lib/db"

export async function findManySaluran(page: number, limit: number) {
  const offset = (page - 1) * limit
  return [] as any[]
}

export async function findByIdSaluran(id: number) {
  return null as any
}

export async function createSaluran(data: any) {
  return {} as any
}

export async function updateSaluran(id: number, data: any) {
  return {} as any
}

export async function deleteSaluran(id: number) {
  return {} as any
}
