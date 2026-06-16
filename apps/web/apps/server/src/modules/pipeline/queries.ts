import { db } from "@/lib/db"

export async function findManyPipeline(page: number, limit: number) {
  const offset = (page - 1) * limit
  return [] as any[]
}

export async function findByIdPipeline(id: number) {
  return null as any
}

export async function createPipeline(data: any) {
  return {} as any
}

export async function updatePipeline(id: number, data: any) {
  return {} as any
}

export async function deletePipeline(id: number) {
  return {} as any
}
