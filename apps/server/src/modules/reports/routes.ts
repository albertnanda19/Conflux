import { Elysia } from "elysia"

export const reportsRoutes = new Elysia({ prefix: "/reports" })
  .get("/", async () => ({ success: true, message: "Belum diimplementasi." }))
  .get("/:id", async () => ({ success: true, message: "Belum diimplementasi." }))
  .post("/", async () => ({ success: true, message: "Belum diimplementasi." }))
