import { Elysia } from "elysia"
import { authPlugin } from "@/lib/auth-plugin"
import {
  handleListConversations,
  handleGetConversation,
  handleUpdateStatus,
  handleResolve,
  handleSnooze,
  handleMarkRead,
  handleAssign,
  handleTransfer,
  handleAssignAi,
  handleDeactivateAi,
  handleAddLabel,
  handleRemoveLabel,
} from "./handlers"

export const conversationsRoutes = new Elysia({ prefix: "/conversations" })
  .use(authPlugin)
  .get("/", ({ auth, query }) => handleListConversations(auth, query), { detail: { summary: "Daftar percakapan (filter + sort + pagination)" } })
  .get("/:id", ({ auth, params }) => handleGetConversation(auth, params.id), { detail: { summary: "Detail percakapan" } })
  .patch("/:id/status", ({ auth, params, body }) => handleUpdateStatus(auth, params.id, body), { detail: { summary: "Ubah status percakapan" } })
  .post("/:id/resolve", ({ auth, params }) => handleResolve(auth, params.id), { detail: { summary: "Tandai selesai" } })
  .post("/:id/snooze", ({ auth, params }) => handleSnooze(auth, params.id), { detail: { summary: "Tunda percakapan" } })
  .post("/:id/read", ({ auth, params }) => handleMarkRead(auth, params.id), { detail: { summary: "Tandai sudah dibaca" } })
  .patch("/:id/assign", ({ auth, params, body }) => handleAssign(auth, params.id, body), { detail: { summary: "Tugaskan / batalkan agen" } })
  .post("/:id/transfer", ({ auth, params, body }) => handleTransfer(auth, params.id, body), { detail: { summary: "Transfer ke agen lain" } })
  .post("/:id/assign-ai", ({ auth, params, body }) => handleAssignAi(auth, params.id, body), { detail: { summary: "Tugaskan AI Assistant ke percakapan" } })
  .post("/:id/deactivate-ai", ({ auth, params }) => handleDeactivateAi(auth, params.id), { detail: { summary: "Nonaktifkan AI Assistant dari percakapan" } })
  .post("/:id/labels", ({ auth, params, body }) => handleAddLabel(auth, params.id, body), { detail: { summary: "Tambah label ke percakapan" } })
  .delete("/:id/labels/:labelId", ({ auth, params }) => handleRemoveLabel(auth, params.id, params.labelId), { detail: { summary: "Hapus label dari percakapan" } })
