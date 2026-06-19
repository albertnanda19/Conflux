import { Elysia } from "elysia"
import { authPlugin } from "@/lib/auth-plugin"
import {
  handleListLabels,
  handleCreateLabel,
  handleUpdateLabel,
  handleDeleteLabel,
} from "./handlers"

export const labelsRoutes = new Elysia({ prefix: "/labels" })
  .use(authPlugin)
  .get("/", ({ auth }) => handleListLabels(auth), { detail: { summary: "Daftar label" } })
  .post("/", ({ auth, body }) => handleCreateLabel(auth, body), { detail: { summary: "Buat label" } })
  .put("/:id", ({ auth, params, body }) => handleUpdateLabel(auth, params.id, body), { detail: { summary: "Perbarui label" } })
  .delete("/:id", ({ auth, params }) => handleDeleteLabel(auth, params.id), { detail: { summary: "Hapus label" } })
