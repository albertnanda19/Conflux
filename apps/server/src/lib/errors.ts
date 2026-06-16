export class AppError extends Error {
  public readonly statusCode: number
  public readonly code: string

  constructor(statusCode: number, code: string, message: string) {
    super(message)
    this.name = "AppError"
    this.statusCode = statusCode
    this.code = code
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Permintaan tidak valid. Silakan periksa data yang dikirim.") {
    super(400, "BAD_REQUEST", message)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Anda belum terautentikasi. Silakan masuk terlebih dahulu.") {
    super(401, "UNAUTHORIZED", message)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Anda tidak memiliki izin untuk mengakses sumber daya ini.") {
    super(403, "FORBIDDEN", message)
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Sumber daya") {
    super(404, "NOT_FOUND", `${resource} tidak ditemukan.`)
  }
}

export class ConflictError extends AppError {
  constructor(message = "Data yang sama sudah ada dalam sistem.") {
    super(409, "CONFLICT", message)
  }
}

export class ValidationError extends AppError {
  public readonly details: Record<string, string[]>

  constructor(details: Record<string, string[]>) {
    super(422, "VALIDATION_ERROR", "Data yang dikirim tidak memenuhi persyaratan.")
    this.details = details
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Terlalu banyak permintaan. Silakan coba lagi dalam beberapa saat.") {
    super(429, "RATE_LIMITED", message)
  }
}

export class InternalError extends AppError {
  constructor(message = "Terjadi kesalahan internal server. Silakan laporkan ke tim teknis.") {
    super(500, "INTERNAL_ERROR", message)
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(service = "Layanan") {
    super(503, "SERVICE_UNAVAILABLE", `${service} sedang tidak tersedia. Silakan coba lagi nanti.`)
  }
}

export type ApiResponse<T = unknown> = {
  success: boolean
  data?: T
  message: string
  errors?: Record<string, string[]>
}

export function successResponse<T>(data: T, message = "Berhasil."): ApiResponse<T> {
  return { success: true, data, message }
}

export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  message = "Berhasil.",
): ApiResponse<{ data: T[]; meta: { total: number; page: number; limit: number; totalPages: number } }> {
  return {
    success: true,
    data: {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
    message,
  }
}
