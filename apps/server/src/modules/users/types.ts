import { z } from "zod"

export const updateStatusSchema = z.object({
  status: z.enum(["online", "busy", "offline"], {
    errorMap: () => ({ message: "Status tidak valid. Pilih: online, busy, atau offline." }),
  }),
})

export type UpdateStatusInput = z.infer<typeof updateStatusSchema>
