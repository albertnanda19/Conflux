import { describe, it, expect, beforeAll } from "vitest"
import { encrypt, decrypt, encryptCredentials, decryptCredentials } from "./crypto"

beforeAll(() => {
  process.env.ENCRYPTION_KEY = Buffer.alloc(32, 9).toString("base64")
})

describe("encrypt/decrypt", () => {
  it("round-trips a string", () => {
    const c = encrypt("rahasia-123")
    expect(c).not.toContain("rahasia")
    expect(decrypt(c)).toBe("rahasia-123")
  })

  it("produces different ciphertext each call (random IV)", () => {
    expect(encrypt("x")).not.toBe(encrypt("x"))
  })

  it("throws on tampered ciphertext (GCM auth)", () => {
    const c = encrypt("data")
    const [iv, tag, data] = c.split(":")
    const tampered = `${iv}:${tag}:${Buffer.from("haxx").toString("base64")}`
    void data
    expect(() => decrypt(tampered)).toThrow()
  })
})

describe("credentials helpers", () => {
  it("encryptCredentials wraps in _enc, decryptCredentials restores object", () => {
    const enc = encryptCredentials({ botToken: "abc:123", mode: "polling" })
    expect(typeof enc._enc).toBe("string")
    expect(JSON.stringify(enc)).not.toContain("abc:123")
    expect(decryptCredentials(enc)).toEqual({ botToken: "abc:123", mode: "polling" })
  })

  it("decryptCredentials passes through plaintext object (backward-compat)", () => {
    expect(decryptCredentials({ botToken: "plain" })).toEqual({ botToken: "plain" })
  })

  it("decryptCredentials handles null", () => {
    expect(decryptCredentials(null)).toBeNull()
  })
})
