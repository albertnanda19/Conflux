import type { z } from "zod"
import { ValidationError } from "./errors"

export function parseSafe<S extends z.ZodTypeAny>(schema: S, data: unknown): z.output<S> {
  const result = schema.safeParse(data)
  if (!result.success) {
    const fieldErrors: Record<string, string[]> = {}
    for (const issue of result.error.issues) {
      const field = issue.path.join(".") || "_"
      ;(fieldErrors[field] ??= []).push(issue.message)
    }
    throw new ValidationError(fieldErrors)
  }
  return result.data
}
