import * as q from "./queries"
import { NotFoundError } from "@/lib/errors"
import type { CreateLabelInput, UpdateLabelInput } from "./types"

export async function getLabels() {
  return q.listLabels()
}

export async function createLabel(input: CreateLabelInput, createdBy: string) {
  return q.createLabel({ ...input, createdBy })
}

export async function updateLabel(id: string, input: UpdateLabelInput) {
  const updated = await q.updateLabel(id, input)
  if (!updated) throw new NotFoundError("Label")
  return updated
}

export async function deleteLabel(id: string) {
  const deleted = await q.deleteLabel(id)
  if (!deleted) throw new NotFoundError("Label")
  return deleted
}
