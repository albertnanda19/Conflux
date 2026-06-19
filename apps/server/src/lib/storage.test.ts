import { describe, it, expect, afterEach } from "vitest"
import { buildPublicUrl } from "./storage"

const prev = { base: process.env.MEDIA_PUBLIC_BASE_URL, ssl: process.env.MINIO_USE_SSL, ep: process.env.MINIO_ENDPOINT, port: process.env.MINIO_PORT }

afterEach(() => {
  process.env.MEDIA_PUBLIC_BASE_URL = prev.base
  process.env.MINIO_USE_SSL = prev.ssl
  process.env.MINIO_ENDPOINT = prev.ep
  process.env.MINIO_PORT = prev.port
})

describe("buildPublicUrl", () => {
  it("pakai MEDIA_PUBLIC_BASE_URL bila di-set (deploy)", () => {
    process.env.MEDIA_PUBLIC_BASE_URL = "https://media.example.com"
    expect(buildPublicUrl("chat/abc/foto.png")).toBe("https://media.example.com/chat/abc/foto.png")
  })

  it("strip trailing slash pada base url", () => {
    process.env.MEDIA_PUBLIC_BASE_URL = "https://cdn.example.com/"
    expect(buildPublicUrl("k.png")).toBe("https://cdn.example.com/k.png")
  })

  it("fallback http endpoint lokal dengan scheme benar", () => {
    delete process.env.MEDIA_PUBLIC_BASE_URL
    process.env.MINIO_USE_SSL = "false"
    process.env.MINIO_ENDPOINT = "localhost"
    process.env.MINIO_PORT = "9000"
    expect(buildPublicUrl("chat/x/a.png")).toBe("http://localhost:9000/dbb-psc-media/chat/x/a.png")
  })

  it("pakai https saat MINIO_USE_SSL true", () => {
    delete process.env.MEDIA_PUBLIC_BASE_URL
    process.env.MINIO_USE_SSL = "true"
    process.env.MINIO_ENDPOINT = "minio.internal"
    process.env.MINIO_PORT = "443"
    expect(buildPublicUrl("k")).toBe("https://minio.internal:443/dbb-psc-media/k")
  })
})
