import { Elysia } from "elysia"
import * as handler from "./handlers"

export const reportsRoutes = new Elysia({ prefix: "/reports" })
  .get("/", ({ query }) => handler.handleList(query))
  .get("/:id", ({ params }) => handler.handleGet(params))
  .post("/", ({ body }) => handler.handleCreate(body))
  .put("/:id", ({ params, body }) => handler.handleUpdate(params, body))
  .delete("/:id", ({ params }) => handler.handleDelete(params))
