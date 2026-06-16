import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid."),
  password: z.string().min(6, "Kata sandi minimal 6 karakter."),
})

export const registerSchema = z.object({
  email: z.string().email("Format email tidak valid."),
  password: z.string().min(8, "Kata sandi minimal 8 karakter."),
  fullName: z.string().min(2, "Nama lengkap minimal 2 karakter.").max(255, "Nama lengkap terlalu panjang."),
  role: z.enum(["admin", "supervisor", "agent"], {
    errorMap: () => ({ message: "Peran tidak valid. Pilih: admin, supervisor, atau agent." }),
  }),
})

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Token segar tidak boleh kosong."),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Kata sandi saat ini wajib diisi."),
  newPassword: z.string().min(8, "Kata sandi baru minimal 8 karakter."),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>

export type AuthTokens = {
  accessToken: string
  refreshToken: string
  user: {
    id: string
    email: string
    fullName: string
    role: string
  }
}
