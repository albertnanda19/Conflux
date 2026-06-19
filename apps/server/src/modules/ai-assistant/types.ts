import { z } from "zod"

const workingHoursSchema = z.object({
  timezone: z.string(),
  days: z.array(z.object({
    day: z.string(),
    dayLabel: z.string(),
    enabled: z.boolean(),
    start: z.string(),
    end: z.string(),
  })),
  oooMessage: z.string(),
})

const handoffConfigSchema = z.object({
  triggerKeywords: z.array(z.string()),
  conversionSignals: z.array(z.object({
    id: z.string(),
    type: z.string(),
    description: z.string(),
    enabled: z.boolean(),
  })),
  handoffMessage: z.string(),
  maxAiMessages: z.number().int().min(1).max(100),
  priorityNotification: z.boolean(),
})

export const createAssistantSchema = z.object({
  name: z.string().min(1, "Nama AI Assistant tidak boleh kosong.").max(255),
  description: z.string().max(2000).optional(),
  avatar: z.string().max(50).optional(),
  status: z.enum(["active", "draft", "paused"]).optional(),
  personaName: z.string().max(255).optional(),
  personaLanguage: z.string().max(100).optional(),
  personaTone: z.enum(["formal", "semi-formal", "casual"]).optional(),
  systemPrompt: z.string().max(10000).optional(),
  workingHours: workingHoursSchema.optional(),
  handoffConfig: handoffConfigSchema.optional(),
  kbScope: z.enum(["global", "custom"]).optional(),
  customKbDocumentIds: z.array(z.string().uuid()).optional(),
})

export const updateAssistantSchema = createAssistantSchema.partial()

export const assignAgentSchema = z.object({
  agentId: z.string().uuid("ID agen tidak valid.").nullable(),
})

export const testChatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "assistant"]),
    content: z.string().min(1),
  })).min(1, "Minimal satu pesan diperlukan."),
})

export const listAssistantsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  search: z.string().max(255).optional(),
  status: z.enum(["active", "draft", "paused"]).optional(),
})

export type CreateAssistantInput = z.infer<typeof createAssistantSchema>
export type UpdateAssistantInput = z.infer<typeof updateAssistantSchema>
export type AssignAgentInput = z.infer<typeof assignAgentSchema>
export type TestChatInput = z.infer<typeof testChatSchema>
export type ListAssistantsQuery = z.infer<typeof listAssistantsQuerySchema>
