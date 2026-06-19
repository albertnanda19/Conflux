import { z } from "zod"

export const listKbQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().max(255).optional(),
  category: z.string().max(100).optional(),
  status: z.enum(["pending", "processing", "completed", "failed"]).optional(),
  scope: z.enum(["global", "assistant"]).optional(),
  aiAssistantId: z.string().uuid("ID AI Assistant tidak valid.").optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "title"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

export const updateKbSchema = z.object({
  title: z.string().min(1, "Judul tidak boleh kosong.").max(255).optional(),
  category: z.string().max(100).nullable().optional(),
  isActive: z.boolean().optional(),
  content: z.string().optional(),
})

export type ListKbQuery = z.infer<typeof listKbQuerySchema>
export type UpdateKbInput = z.infer<typeof updateKbSchema>

export type KbDocumentResponse = {
  id: string
  title: string
  category: string | null
  fileType: string | null
  fileSize: number | null
  chunkCount: number | null
  processingStatus: string
  isActive: boolean
  aiAssistantId: string | null
  originalFileUrl: string | null
  createdBy: string | null
  createdByName: string | null
  createdAt: Date
  updatedAt: Date
}
