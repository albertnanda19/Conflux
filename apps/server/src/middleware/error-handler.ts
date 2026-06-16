import type { ErrorHandler } from "elysia"
import { AppError, ValidationError, type ApiResponse } from "@/lib/errors"

export const errorHandler: ErrorHandler = ({ error }) => {
  if (error instanceof ValidationError) {
    const response: ApiResponse = {
      success: false,
      message: error.message,
      errors: error.details,
    }
    return new Response(JSON.stringify(response), {
      status: error.statusCode,
      headers: { "Content-Type": "application/json" },
    })
  }

  if (error instanceof AppError) {
    const response: ApiResponse = {
      success: false,
      message: error.message,
    }
    return new Response(JSON.stringify(response), {
      status: error.statusCode,
      headers: { "Content-Type": "application/json" },
    })
  }

  const errMsg = error instanceof Error ? error.message : ""
  if (errMsg === "NOT_FOUND") {
    const response: ApiResponse = {
      success: false,
      message: "Endpoint tidak ditemukan. Periksa URL yang Anda gunakan.",
    }
    return new Response(JSON.stringify(response), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    })
  }

  console.error("[ServerError] Kesalahan tak terduga:", error)

  const response: ApiResponse = {
    success: false,
    message: "Terjadi kesalahan internal server. Silakan laporkan ke tim teknis.",
  }
  return new Response(JSON.stringify(response), {
    status: 500,
    headers: { "Content-Type": "application/json" },
  })
}
