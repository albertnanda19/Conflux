import { and, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { kbDocuments } from "@/lib/schema"
import { downloadFile } from "@/lib/storage"
import { extractText } from "@/lib/extract"
import { splitText } from "@/lib/text-splitter"
import { embedTexts } from "@/lib/ai"

export async function processDocument(documentId: string, storageKey: string): Promise<void> {
  const [doc] = await db.select().from(kbDocuments).where(eq(kbDocuments.id, documentId)).limit(1)
  if (!doc) return

  await db
    .update(kbDocuments)
    .set({ processingStatus: "processing", updatedAt: new Date() })
    .where(eq(kbDocuments.id, documentId))

  try {
    const buffer = await downloadFile(storageKey)
    const text = await extractText(buffer, doc.fileType ?? "")
    const chunks = splitText(text)
    if (chunks.length === 0) throw new Error("Dokumen kosong atau tidak ada teks terekstrak.")

    const embeddings = await embedTexts(chunks)

    await db.delete(kbDocuments).where(eq(kbDocuments.sourceDocumentId, documentId))
    await db.insert(kbDocuments).values(
      chunks.map((content, i) => ({
        title: doc.title,
        category: doc.category,
        content,
        embedding: embeddings[i],
        isActive: doc.isActive,
        aiAssistantId: doc.aiAssistantId,
        fileType: doc.fileType,
        sourceDocumentId: documentId,
        chunkIndex: i,
        processingStatus: "completed",
        createdBy: doc.createdBy,
        createdByName: doc.createdByName,
      })),
    )

    await db
      .update(kbDocuments)
      .set({
        processingStatus: "completed",
        chunkCount: chunks.length,
        content: text.slice(0, 5000),
        updatedAt: new Date(),
      })
      .where(and(eq(kbDocuments.id, documentId)))
  } catch (error) {
    await db
      .update(kbDocuments)
      .set({ processingStatus: "failed", updatedAt: new Date() })
      .where(eq(kbDocuments.id, documentId))
    throw error
  }
}
