import { z } from "zod"

export const updateAiSettingsSchema = z.object({
  aiEnabled: z.boolean(),
})

export const updateProviderSchema = z.object({
  model: z.string().min(1).max(100).optional(),
  priority: z.number().int().min(1).max(99).optional(),
  maxTokens: z.number().int().min(1).max(32000).optional(),
  temperature: z.number().min(0).max(2).optional(),
  isEnabled: z.boolean().optional(),
})

export type UpdateAiSettingsInput = z.infer<typeof updateAiSettingsSchema>
export type UpdateProviderInput = z.infer<typeof updateProviderSchema>

export type ProviderResponse = {
  id: string
  name: string
  model: string
  priority: number
  maxTokens: number
  temperature: number
  isEnabled: boolean
  status: "active" | "fallback" | "disabled" | "error"
  hasKey: boolean
}
