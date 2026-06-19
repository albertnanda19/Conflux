import { Elysia } from "elysia"
import { authPlugin } from "@/lib/auth-plugin"
import {
  handleListContacts,
  handleGetContact,
  handleCreateContact,
  handleUpdateContact,
  handleDeleteContact,
  handleGetContactActivities,
} from "./handlers"

export const contactsRoutes = new Elysia({ prefix: "/contacts" })
  .use(authPlugin)
  .get("/", ({ auth, query }) => handleListContacts(auth, query), { detail: { summary: "Daftar kontak" } })
  .get("/:id", ({ auth, params }) => handleGetContact(auth, params.id), { detail: { summary: "Detail kontak" } })
  .get("/:id/activities", ({ auth, params }) => handleGetContactActivities(auth, params.id), { detail: { summary: "Riwayat aktivitas kontak" } })
  .post("/", ({ auth, body }) => handleCreateContact(auth, body), { detail: { summary: "Buat kontak" } })
  .put("/:id", ({ auth, params, body }) => handleUpdateContact(auth, params.id, body), { detail: { summary: "Perbarui kontak" } })
  .delete("/:id", ({ auth, params }) => handleDeleteContact(auth, params.id), { detail: { summary: "Hapus kontak" } })
