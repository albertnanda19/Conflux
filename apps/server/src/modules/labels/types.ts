import { z } from "zod"

export const createLabelSchema = z.object({
  name: z.string().min(1, "Nama label tidak boleh kosong.").max(100, "Nama label terlalu panjang."),
  color: z.string().min(1, "Warna label wajib diisi.").max(20, "Kode warna terlalu panjang."),
})

export const updateLabelSchema = z.object({
  name: z.string().min(1, "Nama label tidak boleh kosong.").max(100, "Nama label terlalu panjang.").optional(),
  color: z.string().min(1, "Warna label wajib diisi.").max(20, "Kode warna terlalu panjang.").optional(),
})

export const attachLabelSchema = z.object({
  labelId: z.string().uuid("ID label tidak valid."),
})

export type CreateLabelInput = z.infer<typeof createLabelSchema>
export type UpdateLabelInput = z.infer<typeof updateLabelSchema>
export type AttachLabelInput = z.infer<typeof attachLabelSchema>

export type LabelResponse = {
  id: string
  name: string
  color: string
}
