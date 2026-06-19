import { z } from "zod"

const PROVIDERS = [
  "whatsapp_cloud",
  "whatsapp_fonnte",
  "telegram_bot",
  "instagram",
  "facebook",
  "livechat",
  "simulator",
] as const

const CHANNEL_TYPES = ["whatsapp", "instagram", "facebook", "telegram", "livechat"] as const

export const createChannelSchema = z.object({
  name: z.string().min(1, "Nama channel tidak boleh kosong.").max(255, "Nama terlalu panjang."),
  type: z.enum(CHANNEL_TYPES, { errorMap: () => ({ message: "Tipe channel tidak valid." }) }),
  provider: z.enum(PROVIDERS, { errorMap: () => ({ message: "Provider channel tidak valid." }) }),
  credentials: z.record(z.unknown()).optional(),
  isActive: z.boolean().optional(),
})

export const updateChannelSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  credentials: z.record(z.unknown()).optional(),
  isActive: z.boolean().optional(),
})

export const simulateInboundSchema = z.object({
  channelIdentifier: z.string().min(1, "Identitas pengirim wajib diisi."),
  contactName: z.string().max(255).optional(),
  contentType: z.enum(["text", "image", "video", "document", "audio", "location"]).default("text"),
  content: z
    .object({
      text: z.string().optional(),
      mediaUrl: z.string().url().optional(),
      fileName: z.string().optional(),
      fileSize: z.string().optional(),
      location: z.object({ lat: z.number(), lng: z.number(), name: z.string().optional() }).optional(),
    })
    .default({}),
  externalMessageId: z.string().optional(),
})

export type CreateChannelInput = z.infer<typeof createChannelSchema>
export type UpdateChannelInput = z.infer<typeof updateChannelSchema>
export type SimulateInboundInput = z.infer<typeof simulateInboundSchema>
