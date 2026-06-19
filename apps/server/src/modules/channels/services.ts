import * as q from "./queries"
import { simulatorAdapter } from "./providers/simulator"
import { messageQueue, INBOUND_JOB } from "@/lib/queues"
import { NotFoundError } from "@/lib/errors"
import { encryptCredentials } from "@/lib/crypto"
import type { ChannelType } from "./adapter"
import type { CreateChannelInput, UpdateChannelInput, SimulateInboundInput } from "./types"

export async function getChannels() {
  return q.listChannels()
}

export async function createChannel(input: CreateChannelInput) {
  return q.createChannel({
    ...input,
    credentials: input.credentials ? encryptCredentials(input.credentials) : undefined,
  })
}

export async function updateChannel(id: string, input: UpdateChannelInput) {
  const updated = await q.updateChannel(id, {
    ...input,
    credentials: input.credentials ? encryptCredentials(input.credentials) : undefined,
  })
  if (!updated) throw new NotFoundError("Channel")
  return updated
}

export async function deleteChannel(id: string) {
  const deleted = await q.deleteChannel(id)
  if (!deleted) throw new NotFoundError("Channel")
  return deleted
}

export async function simulateInbound(channelId: string, input: SimulateInboundInput) {
  const channel = await q.findChannelById(channelId)
  if (!channel) throw new NotFoundError("Channel")

  const normalized = simulatorAdapter.parseInbound({
    channelType: channel.type as ChannelType,
    channelIdentifier: input.channelIdentifier,
    contactName: input.contactName,
    contentType: input.contentType,
    content: input.content,
    externalMessageId: input.externalMessageId,
  })

  await Promise.all(
    normalized.map((inbound) =>
      messageQueue.add(INBOUND_JOB, { channelId, inbound }, { jobId: inbound.externalMessageId }),
    ),
  )

  return { queued: normalized.length }
}
