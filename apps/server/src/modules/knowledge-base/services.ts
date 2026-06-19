import * as q from "./queries"
import { NotFoundError } from "@/lib/errors"
import { documentQueue, PROCESS_DOC_JOB } from "@/lib/queues"
import type { ListKbQuery, UpdateKbInput } from "./types"

export async function listDocuments(query: ListKbQuery) {
  return q.listParentDocuments(query)
}

export async function getDocument(id: string) {
  const doc = await q.findDocumentById(id)
  if (!doc || doc.sourceDocumentId) throw new NotFoundError("Dokumen")
  return doc
}

export async function createDocument(data: {
  title: string
  category: string | null
  aiAssistantId: string | null
  fileType: string
  fileSize: number
  originalFileUrl: string
  storageKey: string
  createdBy: string
  createdByName: string
}) {
  const { storageKey, ...row } = data
  const doc = await q.createParentDocument(row)
  await documentQueue.add(PROCESS_DOC_JOB, { documentId: doc.id, storageKey })
  return doc
}

export async function updateDocument(id: string, input: UpdateKbInput) {
  await getDocument(id)
  return q.updateParentDocument(id, input)
}

export async function deleteDocument(id: string) {
  await getDocument(id)
  await q.deleteDocument(id)
}
