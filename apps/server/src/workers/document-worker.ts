import { Worker } from "bullmq"
import { DOCUMENT_QUEUE, PROCESS_DOC_JOB, queueConnection } from "@/lib/queues"
import { processDocument } from "@/modules/knowledge-base/processing"

let worker: Worker | null = null

export function startDocumentWorker() {
  worker = new Worker(
    DOCUMENT_QUEUE,
    async (job) => {
      if (job.name === PROCESS_DOC_JOB) {
        const { documentId, storageKey } = job.data as { documentId: string; storageKey: string }
        await processDocument(documentId, storageKey)
        console.log(`[DocumentWorker] Dokumen ${documentId} selesai diproses.`)
        return
      }
      console.warn(`[DocumentWorker] Job tidak dikenal: ${job.name}`)
    },
    { connection: queueConnection },
  )

  worker.on("failed", (job, err) => {
    console.error(`[DocumentWorker] Job ${job?.id} gagal:`, err.message)
  })

  console.log("[DocumentWorker] Worker dokumen aktif.")
}

export async function shutdownDocumentWorker() {
  if (worker) await worker.close()
}
