import { Elysia } from "elysia"
import { authPlugin } from "@/lib/auth-plugin"
import { handleUploadMedia } from "./handlers"

export const mediaRoutes = new Elysia({ prefix: "/media" })
  .use(authPlugin)
  .post("/upload", ({ auth, body }) => handleUploadMedia(auth, body), { detail: { summary: "Unggah media chat ke storage" } })
