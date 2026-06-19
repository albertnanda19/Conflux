import { Elysia } from "elysia"
import { authPlugin } from "@/lib/auth-plugin"
import {
  handleListChannels,
  handleCreateChannel,
  handleUpdateChannel,
  handleDeleteChannel,
  handleSimulateInbound,
} from "./handlers"

export const channelsRoutes = new Elysia({ prefix: "/channels" })
  .use(authPlugin)
  .get("/", ({ auth }) => handleListChannels(auth), { detail: { summary: "Daftar channel" } })
  .post("/", ({ auth, body }) => handleCreateChannel(auth, body), { detail: { summary: "Buat channel" } })
  .put("/:id", ({ auth, params, body }) => handleUpdateChannel(auth, params.id, body), { detail: { summary: "Perbarui channel" } })
  .delete("/:id", ({ auth, params }) => handleDeleteChannel(auth, params.id), { detail: { summary: "Hapus channel" } })
  .post("/:id/simulate-inbound", ({ auth, params, body }) => handleSimulateInbound(auth, params.id, body), { detail: { summary: "Simulasi pesan masuk (testing)" } })
