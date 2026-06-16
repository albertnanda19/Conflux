import { Elysia } from "elysia"
import { handleLogin, handleRegister, handleRefreshToken } from "./handlers"

export const authRoutes = new Elysia({ prefix: "/auth" })
  .post("/login", ({ body }) => handleLogin(body), { detail: { summary: "Masuk ke dalam sistem" } })
  .post("/register", ({ body }) => handleRegister(body), { detail: { summary: "Membuat akun baru" } })
  .post("/refresh", ({ body }) => handleRefreshToken(body), { detail: { summary: "Memperbarui token akses" } })
