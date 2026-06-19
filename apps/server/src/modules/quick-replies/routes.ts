import { Elysia } from "elysia"
import { authPlugin } from "@/lib/auth-plugin"
import {
  handleListQuickReplies,
  handleCreateQuickReply,
  handleUpdateQuickReply,
  handleDeleteQuickReply,
} from "./handlers"

export const quickRepliesRoutes = new Elysia({ prefix: "/quick-replies" })
  .use(authPlugin)
  .get("/", ({ auth }) => handleListQuickReplies(auth), { detail: { summary: "Daftar quick reply" } })
  .post("/", ({ auth, body }) => handleCreateQuickReply(auth, body), { detail: { summary: "Buat quick reply" } })
  .put("/:id", ({ auth, params, body }) => handleUpdateQuickReply(auth, params.id, body), { detail: { summary: "Perbarui quick reply" } })
  .delete("/:id", ({ auth, params }) => handleDeleteQuickReply(auth, params.id), { detail: { summary: "Hapus quick reply" } })
