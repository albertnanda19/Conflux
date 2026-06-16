import { Elysia } from "elysia"

export const messagesRoutes = new Elysia({ prefix: "/messages" })
  .get("/", async () => ({ success: true, message: "Belum diimplementasi." }))
  .get("/:id", async () => ({ success: true, message: "Belum diimplementasi." }))
  .post("/", async () => ({ success: true, message: "Belum diimplementasi." }))
  .put("/:id", async () => ({ success: true, message: "Belum diimplementasi." }))
  .delete("/:id", async () => ({ success: true, message: "Belum diimplementasi." }))
