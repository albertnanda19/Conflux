import { Elysia } from "elysia"
import { authPlugin } from "@/lib/auth-plugin"
import {
  handleListAssistants,
  handleGetAssistant,
  handleCreateAssistant,
  handleUpdateAssistant,
  handleDeleteAssistant,
  handleCycleStatus,
  handleAssignAgent,
  handleTestChat,
} from "./handlers"

export const aiAssistantRoutes = new Elysia({ prefix: "/ai-assistants" })
  .use(authPlugin)
  .get("/", ({ auth, query }) => handleListAssistants(auth, query), { detail: { summary: "Daftar AI Assistant" } })
  .get("/:id", ({ auth, params }) => handleGetAssistant(auth, params.id), { detail: { summary: "Detail AI Assistant" } })
  .post("/", ({ auth, body }) => handleCreateAssistant(auth, body), { detail: { summary: "Buat AI Assistant" } })
  .put("/:id", ({ auth, params, body }) => handleUpdateAssistant(auth, params.id, body), { detail: { summary: "Perbarui AI Assistant" } })
  .delete("/:id", ({ auth, params }) => handleDeleteAssistant(auth, params.id), { detail: { summary: "Hapus AI Assistant" } })
  .patch("/:id/status", ({ auth, params }) => handleCycleStatus(auth, params.id), { detail: { summary: "Ubah status AI Assistant" } })
  .post("/:id/assign", ({ auth, params, body }) => handleAssignAgent(auth, params.id, body), { detail: { summary: "Tugaskan AI Assistant ke agen" } })
  .post("/:id/test-chat", ({ auth, params, body }) => handleTestChat(auth, params.id, body), { detail: { summary: "Uji coba chat AI Assistant" } })
