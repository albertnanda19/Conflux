import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { resolveCredentials } from "./credentials"

const prev = { tg: process.env.TELEGRAM_BOT_TOKEN, fn: process.env.FONNTE_TOKEN }

beforeAll(() => {
  process.env.TELEGRAM_BOT_TOKEN = "tg-env-token"
  process.env.FONNTE_TOKEN = "fonnte-env-token"
})
afterAll(() => {
  process.env.TELEGRAM_BOT_TOKEN = prev.tg
  process.env.FONNTE_TOKEN = prev.fn
})

describe("resolveCredentials", () => {
  it("injects telegram botToken from env", () => {
    expect(resolveCredentials("telegram_bot", null)).toEqual({ botToken: "tg-env-token" })
  })

  it("injects fonnte apiToken from env, keeps stored config", () => {
    expect(resolveCredentials("whatsapp_fonnte", { webhookSecret: "s1" })).toEqual({ webhookSecret: "s1", apiToken: "fonnte-env-token" })
  })

  it("env overrides stored token", () => {
    expect(resolveCredentials("telegram_bot", { botToken: "old" })).toEqual({ botToken: "tg-env-token" })
  })

  it("unknown provider returns stored as-is", () => {
    expect(resolveCredentials("simulator", { foo: 1 })).toEqual({ foo: 1 })
  })
})
