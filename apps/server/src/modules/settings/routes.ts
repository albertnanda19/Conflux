import { Elysia } from "elysia"
import { authPlugin } from "@/lib/auth-plugin"
import { handleGetAiSettings, handleUpdateAiSettings, handleUpdateProvider } from "./handlers"

export const settingsRoutes = new Elysia({ prefix: "/settings" })
  .use(authPlugin)
  .get("/ai", ({ auth }) => handleGetAiSettings(auth), { detail: { summary: "Pengaturan AI" } })
  .patch("/ai", ({ auth, body }) => handleUpdateAiSettings(auth, body), { detail: { summary: "Perbarui pengaturan AI" } })
  .patch("/ai/providers/:id", ({ auth, params, body }) => handleUpdateProvider(auth, params.id, body), { detail: { summary: "Perbarui provider AI" } })
