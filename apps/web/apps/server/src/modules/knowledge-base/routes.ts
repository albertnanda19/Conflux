import { Elysia } from "elysia"
import * as handler from "./handlers"

export const knowledge_baseRoutes = new Elysia({ prefix: "/knowledge-base" })
  .get("/", ({ query }) => handler.handleList(query))
  .get("/:id", ({ params }) => handler.handleGet(params))
  .post("/", ({ body }) => handler.handleCreate(body))
  .put("/:id", ({ params, body }) => handler.handleUpdate(params, body))
  .delete("/:id", ({ params }) => handler.handleDelete(params))
