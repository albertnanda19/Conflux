import { Elysia } from "elysia"
import { authPlugin } from "@/lib/auth-plugin"
import {
  handleListKb,
  handleGetKb,
  handleUploadKb,
  handleUpdateKb,
  handleDeleteKb,
} from "./handlers"

export const knowledgeBaseRoutes = new Elysia({ prefix: "/knowledge-base" })
  .use(authPlugin)
  .get("/", ({ auth, query }) => handleListKb(auth, query), { detail: { summary: "Daftar dokumen knowledge base" } })
  .get("/:id", ({ auth, params }) => handleGetKb(auth, params.id), { detail: { summary: "Detail dokumen" } })
  .post("/", ({ auth, body }) => handleUploadKb(auth, body), { detail: { summary: "Unggah dokumen knowledge base" } })
  .patch("/:id", ({ auth, params, body }) => handleUpdateKb(auth, params.id, body), { detail: { summary: "Perbarui dokumen" } })
  .delete("/:id", ({ auth, params }) => handleDeleteKb(auth, params.id), { detail: { summary: "Hapus dokumen" } })
