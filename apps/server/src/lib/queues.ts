import { Queue } from "bullmq"

export const MESSAGE_QUEUE = "message-queue"
export const INBOUND_JOB = "inbound"

export const DOCUMENT_QUEUE = "document-queue"
export const PROCESS_DOC_JOB = "process-document"

export const AI_QUEUE = "ai-queue"
export const AI_REPLY_JOB = "ai-reply"

function parseRedisConnection(url: string) {
  const u = new URL(url)
  return {
    host: u.hostname,
    port: Number(u.port) || 6379,
    username: u.username || undefined,
    password: u.password || undefined,
    db: u.pathname.length > 1 ? Number(u.pathname.slice(1)) : undefined,
  }
}

export const queueConnection = parseRedisConnection(process.env.REDIS_URL || "redis://localhost:6379")

export const messageQueue = new Queue(MESSAGE_QUEUE, {
  connection: queueConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
    removeOnComplete: 1000,
    removeOnFail: 5000,
  },
})

export const documentQueue = new Queue(DOCUMENT_QUEUE, {
  connection: queueConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 3000 },
    removeOnComplete: 1000,
    removeOnFail: 5000,
  },
})

export const aiQueue = new Queue(AI_QUEUE, {
  connection: queueConnection,
  defaultJobOptions: {
    attempts: 1,
    removeOnComplete: 1000,
    removeOnFail: 5000,
  },
})
