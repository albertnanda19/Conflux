import { describe, it, expect } from "vitest"
import { getAdapter } from "./registry"
import { BadRequestError } from "@/lib/errors"

describe("getAdapter", () => {
  it("resolves known providers", () => {
    expect(getAdapter("whatsapp_cloud").provider).toBe("whatsapp_cloud")
    expect(getAdapter("whatsapp_fonnte").provider).toBe("whatsapp_fonnte")
    expect(getAdapter("simulator").provider).toBe("simulator")
  })

  it("resolves telegram_bot to the real telegram adapter", () => {
    const adapter = getAdapter("telegram_bot")
    expect(adapter.provider).toBe("telegram_bot")
    expect(typeof adapter.sendMessage).toBe("function")
    expect(typeof adapter.parseInbound).toBe("function")
  })

  it("throws for unknown provider", () => {
    // @ts-expect-error invalid provider on purpose
    expect(() => getAdapter("bogus")).toThrow(BadRequestError)
  })
})
