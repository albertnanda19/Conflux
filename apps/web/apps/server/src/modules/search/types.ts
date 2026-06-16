import { z } from "zod"

export const searchQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
})

export type searchQuery = z.infer<typeof searchQuerySchema>
