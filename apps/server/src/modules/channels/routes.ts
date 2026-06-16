import { Elysia } from "elysia"

export const channelsRoutes = new Elysia({ prefix: "/channels" })
  .get("/", async () => ({ success: true, message: "Belum diimplementasi." }))
  .get("/:id", async () => ({ success: true, message: "Belum diimplementasi." }))
  .post("/", async () => ({ success: true, message: "Belum diimplementasi." }))
  .put("/:id", async () => ({ success: true, message: "Belum diimplementasi." }))
  .delete("/:id", async () => ({ success: true, message: "Belum diimplementasi." }))
