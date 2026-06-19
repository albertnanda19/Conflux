import { z } from "zod"

export const createQuickReplySchema = z.object({
  shortcut: z.string().min(1, "Shortcut wajib diisi.").max(100, "Shortcut terlalu panjang.").regex(/^\//, "Shortcut harus diawali '/'."),
  name: z.string().min(1, "Nama wajib diisi.").max(255, "Nama terlalu panjang."),
  content: z.string().min(1, "Isi pesan tidak boleh kosong."),
  category: z.string().max(100, "Kategori terlalu panjang.").optional(),
})

export const updateQuickReplySchema = z.object({
  shortcut: z.string().min(1).max(100).regex(/^\//, "Shortcut harus diawali '/'.").optional(),
  name: z.string().min(1).max(255).optional(),
  content: z.string().min(1).optional(),
  category: z.string().max(100).optional(),
})

export type CreateQuickReplyInput = z.infer<typeof createQuickReplySchema>
export type UpdateQuickReplyInput = z.infer<typeof updateQuickReplySchema>
