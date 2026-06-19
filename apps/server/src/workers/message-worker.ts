import { Worker } from "bullmq"
import { MESSAGE_QUEUE, INBOUND_JOB, queueConnection } from "@/lib/queues"
import { ingestInbound } from "@/modules/messages/ingest"
import type { NormalizedInbound } from "@/modules/channels/adapter"

let worker: Worker | null = null

export function startMessageWorker() {
  worker = new Worker(
    MESSAGE_QUEUE,
    async (job) => {
      if (job.name === INBOUND_JOB) {
        const { channelId, inbound } = job.data as { channelId: string; inbound: NormalizedInbound }
        const result = await ingestInbound(channelId, inbound)
        console.log(
          `[MessageWorker] Inbound diproses → conv=${result.conversationId} kontak=${result.contactId}` +
            `${result.isNewContact ? " (kontak baru)" : ""}${result.isNewConversation ? " (percakapan baru)" : ""}`,
        )
        return result
      }
      console.warn(`[MessageWorker] Job tidak dikenal: ${job.name}`)
    },
    { connection: queueConnection },
  )

  worker.on("failed", (job, err) => {
    console.error(`[MessageWorker] Job ${job?.id} gagal:`, err.message)
  })

  console.log("[MessageWorker] Worker pesan aktif.")
}

export async function shutdownMessageWorker() {
  if (worker) await worker.close()
}
