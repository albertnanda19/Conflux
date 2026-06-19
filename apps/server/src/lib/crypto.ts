import { randomBytes, createCipheriv, createDecipheriv } from "node:crypto"

function getKey(): Buffer {
  const raw = process.env.ENCRYPTION_KEY
  if (!raw) throw new Error("ENCRYPTION_KEY belum diset di environment.")
  const key = Buffer.from(raw, "base64")
  if (key.length !== 32) throw new Error("ENCRYPTION_KEY harus 32 byte (base64).")
  return key
}

export function encrypt(plain: string): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv("aes-256-gcm", getKey(), iv)
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()
  return `${iv.toString("base64")}:${tag.toString("base64")}:${enc.toString("base64")}`
}

export function decrypt(payload: string): string {
  const [ivB, tagB, dataB] = payload.split(":")
  if (!ivB || !tagB || !dataB) throw new Error("Format ciphertext tidak valid.")
  const decipher = createDecipheriv("aes-256-gcm", getKey(), Buffer.from(ivB, "base64"))
  decipher.setAuthTag(Buffer.from(tagB, "base64"))
  return Buffer.concat([decipher.update(Buffer.from(dataB, "base64")), decipher.final()]).toString("utf8")
}

export function encryptCredentials(obj: unknown): { _enc: string } {
  return { _enc: encrypt(JSON.stringify(obj)) }
}

export function decryptCredentials<T = Record<string, unknown>>(stored: unknown): T | null {
  if (!stored || typeof stored !== "object") return (stored as T) ?? null
  const s = stored as Record<string, unknown>
  if (typeof s._enc === "string") return JSON.parse(decrypt(s._enc)) as T
  return stored as T
}
