import { z } from "zod"

export const pipelineQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
})

export type pipelineQuery = z.infer<typeof pipelineQuerySchema>
