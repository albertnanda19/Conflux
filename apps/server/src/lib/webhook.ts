import { createHmac, timingSafeEqual } from "node:crypto"
import { BadRequestError } from "./errors"

const META_APP_SECRET = process.env.META_APP_SECRET || ""

export function verifyMetaSignature(
  body: string | ArrayBuffer,
  signatureHeader: string | undefined,
): boolean {
  if (!META_APP_SECRET) {
    console.warn("[Webhook] META_APP_SECRET tidak dikonfigurasi. Verifikasi dilewati.")
    return true
  }

  if (!signatureHeader) return false

  const expectedSignature = createHmac("sha256", META_APP_SECRET)
    .update(typeof body === "string" ? body : new TextDecoder().decode(body))
    .digest("hex")

  const signature = signatureHeader.replace("sha256=", "")

  try {
    return timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expectedSignature, "hex"))
  } catch {
    return false
  }
}

export function requireValidWebhook(
  body: string | ArrayBuffer,
  signatureHeader: string | undefined,
): void {
  if (!verifyMetaSignature(body, signatureHeader)) {
    throw new BadRequestError("Tanda tangan webhook tidak valid. Permintaan ditolak.")
  }
}

export function extractWebhookEntry(body: Record<string, unknown>) {
  const entries = body.object === "page" ? body.entry : body.data
  if (!entries || !Array.isArray(entries)) {
    throw new BadRequestError("Format webhook tidak sesuai. Data entry tidak ditemukan.")
  }
  return entries
}
