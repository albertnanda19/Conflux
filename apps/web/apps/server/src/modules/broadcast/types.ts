import { z } from "zod"

export const broadcastQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
})

export type broadcastQuery = z.infer<typeof broadcastQuerySchema>
