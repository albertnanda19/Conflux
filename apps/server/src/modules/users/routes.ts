import { Elysia } from "elysia"
import { authPlugin } from "@/lib/auth-plugin"
import { handleListAgents, handleUpdateMyStatus } from "./handlers"

export const usersRoutes = new Elysia({ prefix: "/users" })
  .use(authPlugin)
  .get("/agents", ({ auth }) => handleListAgents(auth), { detail: { summary: "Daftar agen + jumlah percakapan aktif" } })
  .patch("/me/status", ({ auth, body }) => handleUpdateMyStatus(auth, body), { detail: { summary: "Ubah status kehadiran (presence) sendiri" } })
