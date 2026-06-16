import { describe, it, expect } from "vitest"
import {
  AppError,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ValidationError,
  successResponse,
  paginatedResponse,
} from "./errors"

describe("AppError", () => {
  it("should create error with correct properties", () => {
    const error = new AppError(400, "TEST", "Pesan kesalahan")
    expect(error.statusCode).toBe(400)
    expect(error.code).toBe("TEST")
    expect(error.message).toBe("Pesan kesalahan")
    expect(error.name).toBe("AppError")
  })
})

describe("BadRequestError", () => {
  it("should use default Indonesian message", () => {
    const error = new BadRequestError()
    expect(error.statusCode).toBe(400)
    expect(error.code).toBe("BAD_REQUEST")
    expect(error.message).toContain("tidak valid")
  })
})

describe("UnauthorizedError", () => {
  it("should use default Indonesian message", () => {
    const error = new UnauthorizedError()
    expect(error.statusCode).toBe(401)
    expect(error.message).toContain("autentikasi")
  })
})

describe("NotFoundError", () => {
  it("should append resource name to message", () => {
    const error = new NotFoundError("Kontak")
    expect(error.statusCode).toBe(404)
    expect(error.message).toContain("Kontak")
    expect(error.message).toContain("tidak ditemukan")
  })
})

describe("ValidationError", () => {
  it("should store field errors", () => {
    const details = { email: ["Format tidak valid"] }
    const error = new ValidationError(details)
    expect(error.statusCode).toBe(422)
    expect(error.details).toEqual(details)
  })
})

describe("successResponse", () => {
  it("should create success response with data", () => {
    const response = successResponse({ id: 1 }, "Berhasil")
    expect(response.success).toBe(true)
    expect(response.data).toEqual({ id: 1 })
    expect(response.message).toBe("Berhasil")
  })
})

describe("paginatedResponse", () => {
  it("should create paginated response with meta", () => {
    const data = [{ id: 1 }, { id: 2 }]
    const response = paginatedResponse(data, 10, 1, 5)
    expect(response.success).toBe(true)
    expect(response.data).toBeDefined()
    expect(response.data!.data).toHaveLength(2)
    expect(response.data!.meta.total).toBe(10)
    expect(response.data!.meta.totalPages).toBe(2)
  })
})
