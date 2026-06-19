import { describe, it, expect, vi } from "vitest"
import { handleUploadMedia } from "./handlers"
import { BadRequestError } from "@/lib/errors"

vi.mock("@/lib/storage", () => ({
  uploadFile: vi.fn(async (key: string) => `localhost:9000/dbb-psc-media/${key}`),
}))

const auth = { sub: "u1", email: "a@test.com", role: "agent" }

function makeFile(name: string, type: string, size: number): File {
  const blob = new Blob([new Uint8Array(size)], { type })
  return new File([blob], name, { type })
}

describe("handleUploadMedia", () => {
  it("menolak tanpa file", async () => {
    await expect(handleUploadMedia(auth, {})).rejects.toBeInstanceOf(BadRequestError)
  })

  it("menolak file > 10MB", async () => {
    const file = makeFile("big.jpg", "image/jpeg", 11 * 1024 * 1024)
    await expect(handleUploadMedia(auth, { file })).rejects.toThrow(/10MB/)
  })

  it("menolak tipe tidak didukung", async () => {
    const file = makeFile("app.exe", "application/x-msdownload", 1000)
    await expect(handleUploadMedia(auth, { file })).rejects.toThrow(/tidak didukung/)
  })

  it("upload gambar → return url + contentType image", async () => {
    const file = makeFile("foto.png", "image/png", 2000)
    const res = await handleUploadMedia(auth, { file })
    expect(res.success).toBe(true)
    expect(res.data!.contentType).toBe("image")
    expect(res.data!.url).toContain("dbb-psc-media")
    expect(res.data!.fileName).toBe("foto.png")
  })

  it("pdf → contentType document", async () => {
    const file = makeFile("doc.pdf", "application/pdf", 2000)
    const res = await handleUploadMedia(auth, { file })
    expect(res.data!.contentType).toBe("document")
  })
})
