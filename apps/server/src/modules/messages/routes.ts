import { Elysia } from "elysia"
import { authPlugin } from "@/lib/auth-plugin"
import { handleListMessages, handleSendMessage } from "./handlers"

export const messagesRoutes = new Elysia({ prefix: "/conversations" })
  .use(authPlugin)
  .get("/:id/messages", ({ auth, params, query }) => handleListMessages(auth, params.id, query), { detail: { summary: "Daftar pesan percakapan (cursor)" } })
  .post("/:id/messages", ({ auth, params, body }) => handleSendMessage(auth, params.id, body), { detail: { summary: "Kirim pesan keluar" } })
