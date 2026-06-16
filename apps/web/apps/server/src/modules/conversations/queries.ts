import { db } from "@/lib/db"

export async function findManyPercakapan(page: number, limit: number) {
  const offset = (page - 1) * limit
  return [] as any[]
}

export async function findByIdPercakapan(id: number) {
  return null as any
}

export async function createPercakapan(data: any) {
  return {} as any
}

export async function updatePercakapan(id: number, data: any) {
  return {} as any
}

export async function deletePercakapan(id: number) {
  return {} as any
}
