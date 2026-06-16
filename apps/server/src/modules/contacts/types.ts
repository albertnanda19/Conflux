import { z } from "zod"

export const createContactSchema = z.object({
  fullName: z.string().min(1, "Nama lengkap tidak boleh kosong.").max(255, "Nama lengkap terlalu panjang.").optional(),
  phoneNumber: z.string().min(1, "Nomor telepon tidak boleh kosong.").max(50, "Nomor telepon terlalu panjang.").optional(),
  email: z.string().email("Format email tidak valid.").max(255, "Email terlalu panjang.").optional(),
  notes: z.string().max(5000, "Catatan terlalu panjang.").optional(),
  pipelineStatus: z.enum(["new_lead", "contacted", "qualified", "proposal", "negotiation", "closed_won", "closed_lost"], {
    errorMap: () => ({ message: "Status pipeline tidak valid." }),
  }).optional(),
  source: z.string().max(50, "Sumber terlalu panjang.").optional(),
  sourceChannelId: z.string().uuid("ID channel sumber tidak valid.").optional(),
  assignedAgentId: z.string().uuid("ID agen tidak valid.").optional(),
}).refine(
  (data) => data.fullName || data.phoneNumber || data.email,
  { message: "Minimal salah satu harus diisi: nama lengkap, nomor telepon, atau email." },
)

export const updateContactSchema = z.object({
  fullName: z.string().min(1, "Nama lengkap tidak boleh kosong.").max(255, "Nama lengkap terlalu panjang.").optional(),
  phoneNumber: z.string().min(1, "Nomor telepon tidak boleh kosong.").max(50, "Nomor telepon terlalu panjang.").optional(),
  email: z.string().email("Format email tidak valid.").max(255, "Email terlalu panjang.").optional(),
  notes: z.string().max(5000, "Catatan terlalu panjang.").optional(),
  pipelineStatus: z.enum(["new_lead", "contacted", "qualified", "proposal", "negotiation", "closed_won", "closed_lost"], {
    errorMap: () => ({ message: "Status pipeline tidak valid." }),
  }).optional(),
  source: z.string().max(50, "Sumber terlalu panjang.").optional(),
  assignedAgentId: z.string().uuid("ID agen tidak valid.").nullable().optional(),
})

export const listContactsQuerySchema = z.object({
  page: z.coerce.number().int().min(1, "Halaman minimal 1.").default(1),
  limit: z.coerce.number().int().min(1, "Batas data minimal 1.").max(100, "Batas data maksimal 100.").default(20),
  search: z.string().max(255).optional(),
  pipelineStatus: z.enum(["new_lead", "contacted", "qualified", "proposal", "negotiation", "closed_won", "closed_lost"]).optional(),
  assignedAgentId: z.string().uuid().optional(),
  source: z.string().max(50).optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "fullName"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
})

export type CreateContactInput = z.infer<typeof createContactSchema>
export type UpdateContactInput = z.infer<typeof updateContactSchema>
export type ListContactsQuery = z.infer<typeof listContactsQuerySchema>

export type ContactResponse = {
  id: string
  fullName: string | null
  avatarUrl: string | null
  phoneNumber: string | null
  email: string | null
  notes: string | null
  pipelineStatus: string
  source: string | null
  sourceChannelId: string | null
  assignedAgentId: string | null
  createdAt: Date
  updatedAt: Date
}
