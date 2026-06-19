import { Elysia } from "elysia"
import { authPlugin } from "@/lib/auth-plugin"
import { handleListNotifications, handleMarkRead, handleMarkAllRead } from "./handlers"

export const notificationsRoutes = new Elysia({ prefix: "/notifications" })
  .use(authPlugin)
  .get("/", ({ auth, query }) => handleListNotifications(auth, query), { detail: { summary: "Daftar notifikasi pengguna" } })
  .post("/read-all", ({ auth }) => handleMarkAllRead(auth), { detail: { summary: "Tandai semua notifikasi dibaca" } })
  .post("/:id/read", ({ auth, params }) => handleMarkRead(auth, params.id), { detail: { summary: "Tandai notifikasi dibaca" } })
