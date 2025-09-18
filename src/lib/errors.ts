export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export class ValidationError extends AppError {
  constructor(message: string = "Validation failed") {
    super(message, 400, true)
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication required") {
    super(message, 401, true)
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Insufficient permissions") {
    super(message, 403, true)
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404, true)
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Resource already exists") {
    super(message, 409, true)
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = "Too many requests") {
    super(message, 429, true)
  }
}

export interface ErrorResponse {
  success: false
  error: {
    message: string
    code?: string
    statusCode: number
    timestamp: string
    path?: string
  }
}

export function createErrorResponse(
  error: Error | AppError,
  path?: string
): ErrorResponse {
  const isAppError = error instanceof AppError

  return {
    success: false,
    error: {
      message: error.message,
      statusCode: isAppError ? error.statusCode : 500,
      timestamp: new Date().toISOString(),
      ...(path && { path }),
    },
  }
}

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }

  if (error instanceof Error) {
    return new AppError(error.message, 500, false)
  }

  return new AppError("An unexpected error occurred", 500, false)
}

export function logError(error: Error | AppError, context?: Record<string, any>) {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    ...(error instanceof AppError && {
      statusCode: error.statusCode,
      isOperational: error.isOperational,
    }),
    ...(context && { context }),
  }

  console.error("Application Error:", errorInfo)

  // In production, you might want to send this to an error tracking service
  // like Sentry, LogRocket, etc.
}

export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  errorMessage: string = "Operation failed"
): Promise<T> {
  try {
    return await operation()
  } catch (error) {
    const appError = handleError(error)
    logError(appError, { operation: errorMessage })
    throw appError
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === "string") {
    return error
  }

  return "An unexpected error occurred"
}

export function sanitizeErrorForClient(error: Error | AppError): {
  message: string
  statusCode: number
} {
  if (error instanceof AppError && error.isOperational) {
    return {
      message: error.message,
      statusCode: error.statusCode,
    }
  }

  // Don't expose internal errors to clients
  return {
    message: "Internal server error",
    statusCode: 500,
  }
}