import { Worker } from "bullmq"
import { AI_QUEUE, AI_REPLY_JOB, queueConnection } from "@/lib/queues"
import { maybeAutoReply } from "@/modules/messages/ai-reply"

let worker: Worker | null = null

export function startAiWorker() {
  worker = new Worker(
    AI_QUEUE,
    async (job) => {
      if (job.name === AI_REPLY_JOB) {
        const { conversationId, inboundText, contactName } = job.data as {
          conversationId: string
          inboundText: string
          contactName?: string
        }
        await maybeAutoReply(conversationId, inboundText, contactName)
        return
      }
      console.warn(`[AiWorker] Job tidak dikenal: ${job.name}`)
    },
    { connection: queueConnection, concurrency: 5 },
  )

  worker.on("failed", (job, err) => {
    console.error(`[AiWorker] Job ${job?.id} gagal:`, err.message)
  })

  console.log("[AiWorker] Worker AI aktif.")
}

export async function shutdownAiWorker() {
  if (worker) await worker.close()
}
