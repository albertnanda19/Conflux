import { describe, it, expect } from "vitest"
import { z } from "zod"
import { parseSafe } from "./validation"
import { ValidationError } from "./errors"

const schema = z.object({
  name: z.string().min(1, "Nama wajib diisi."),
  limit: z.coerce.number().int().min(1).default(10),
})

describe("parseSafe", () => {
  it("returns parsed output with defaults applied", () => {
    const result = parseSafe(schema, { name: "Acme" })
    expect(result).toEqual({ name: "Acme", limit: 10 })
  })

  it("coerces values per schema", () => {
    const result = parseSafe(schema, { name: "Acme", limit: "5" })
    expect(result.limit).toBe(5)
  })

  it("throws ValidationError with field-level errors", () => {
    try {
      parseSafe(schema, { name: "" })
      expect.unreachable("should have thrown")
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError)
      expect((err as ValidationError).statusCode).toBe(422)
      expect((err as ValidationError).details.name).toContain("Nama wajib diisi.")
    }
  })
})
