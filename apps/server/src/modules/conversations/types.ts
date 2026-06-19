import { z } from "zod"

export const listConversationsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  channel: z.enum(["whatsapp", "instagram", "facebook", "telegram", "livechat"]).optional(),
  status: z.enum(["open", "pending", "resolved", "snoozed"]).optional(),
  agentId: z.string().uuid("ID agen tidak valid.").optional(),
  contactId: z.string().uuid("ID kontak tidak valid.").optional(),
  labelIds: z
    .string()
    .optional()
    .transform((v) => (v ? v.split(",").map((s) => s.trim()).filter(Boolean) : undefined)),
  search: z.string().max(255).optional(),
  datePreset: z.enum(["today", "7d", "30d"]).optional(),
  sortBy: z.enum(["newest", "waiting", "priority"]).default("newest"),
})

export const updateStatusSchema = z.object({
  status: z.enum(["open", "pending", "resolved", "snoozed"], {
    errorMap: () => ({ message: "Status percakapan tidak valid." }),
  }),
})

export const assignSchema = z.object({
  agentId: z.string().uuid("ID agen tidak valid.").nullable(),
})

export const transferSchema = z.object({
  agentId: z.string().uuid("ID agen tidak valid."),
  note: z.string().max(2000, "Catatan terlalu panjang.").optional(),
})

export const assignAiSchema = z.object({
  aiAssistantId: z.string().uuid("ID AI Assistant tidak valid."),
})

export type ListConversationsQuery = z.infer<typeof listConversationsQuerySchema>
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>
export type AssignInput = z.infer<typeof assignSchema>
export type TransferInput = z.infer<typeof transferSchema>
