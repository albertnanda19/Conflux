import { z } from "zod"

const locationSchema = z.object({
  lat: z.number(),
  lng: z.number(),
  name: z.string().optional(),
})

export const messageContentSchema = z.object({
  text: z.string().optional(),
  mediaUrl: z.string().url("URL media tidak valid.").optional(),
  fileName: z.string().optional(),
  fileSize: z.string().optional(),
  location: locationSchema.optional(),
})

export const sendMessageSchema = z
  .object({
    contentType: z.enum(["text", "image", "video", "document", "audio", "location"]).default("text"),
    content: messageContentSchema,
  })
  .refine((d) => d.contentType !== "text" || !!d.content.text, {
    message: "Pesan teks memerlukan content.text.",
    path: ["content", "text"],
  })
  .refine((d) => d.contentType !== "location" || !!d.content.location, {
    message: "Pesan lokasi memerlukan content.location.",
    path: ["content", "location"],
  })

export const listMessagesQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(30),
  cursor: z.string().datetime({ message: "Cursor tidak valid." }).optional(),
})

export type SendMessageInput = z.infer<typeof sendMessageSchema>
export type ListMessagesQuery = z.infer<typeof listMessagesQuerySchema>

export type MessageContent = z.infer<typeof messageContentSchema>

export type MessageResponse = {
  id: string
  conversationId: string
  direction: string
  senderType: string
  senderName?: string
  content: string
  contentType: string
  status: string
  createdAt: Date
  mediaUrl?: string
  fileName?: string
  fileSize?: string
  location?: { lat: number; lng: number; name?: string }
}
