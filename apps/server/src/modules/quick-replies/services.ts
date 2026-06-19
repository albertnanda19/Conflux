import * as q from "./queries"
import { ConflictError, NotFoundError } from "@/lib/errors"
import type { CreateQuickReplyInput, UpdateQuickReplyInput } from "./types"

export async function getQuickReplies() {
  return q.listQuickReplies()
}

export async function createQuickReply(input: CreateQuickReplyInput, createdBy: string) {
  const existing = await q.findQuickReplyByShortcut(input.shortcut)
  if (existing) throw new ConflictError(`Shortcut "${input.shortcut}" sudah digunakan.`)
  return q.createQuickReply({ ...input, createdBy })
}

export async function updateQuickReply(id: string, input: UpdateQuickReplyInput) {
  if (input.shortcut) {
    const existing = await q.findQuickReplyByShortcut(input.shortcut)
    if (existing && existing.id !== id) throw new ConflictError(`Shortcut "${input.shortcut}" sudah digunakan.`)
  }
  const updated = await q.updateQuickReply(id, input)
  if (!updated) throw new NotFoundError("Quick reply")
  return updated
}

export async function deleteQuickReply(id: string) {
  const deleted = await q.deleteQuickReply(id)
  if (!deleted) throw new NotFoundError("Quick reply")
  return deleted
}
