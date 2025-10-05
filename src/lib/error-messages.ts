/**
 * User-Friendly Error Messages
 *
 * Maps technical errors to user-friendly messages.
 */

export interface ErrorMessageConfig {
  title: string
  message: string
  action?: string
}

/**
 * Common error messages
 */
export const ERROR_MESSAGES: Record<string, ErrorMessageConfig> = {
  // Network errors
  NETWORK_ERROR: {
    title: 'Connection Error',
    message: 'Unable to connect to the server. Please check your internet connection and try again.',
    action: 'Retry',
  },
  TIMEOUT_ERROR: {
    title: 'Request Timeout',
    message: 'The request took too long to complete. Please try again.',
    action: 'Retry',
  },

  // Authentication errors
  UNAUTHORIZED: {
    title: 'Authentication Required',
    message: 'You need to be logged in to perform this action.',
    action: 'Login',
  },
  FORBIDDEN: {
    title: 'Access Denied',
    message: "You don't have permission to perform this action.",
    action: 'Go Back',
  },
  SESSION_EXPIRED: {
    title: 'Session Expired',
    message: 'Your session has expired. Please log in again.',
    action: 'Login',
  },

  // Validation errors
  VALIDATION_ERROR: {
    title: 'Invalid Input',
    message: 'Please check your input and try again.',
    action: 'Fix Errors',
  },
  REQUIRED_FIELD: {
    title: 'Missing Information',
    message: 'Please fill in all required fields.',
    action: 'Complete Form',
  },

  // Resource errors
  NOT_FOUND: {
    title: 'Not Found',
    message: 'The resource you are looking for could not be found.',
    action: 'Go Back',
  },
  ALREADY_EXISTS: {
    title: 'Already Exists',
    message: 'A resource with this information already exists.',
    action: 'Use Different Information',
  },

  // Rate limiting
  RATE_LIMIT: {
    title: 'Too Many Requests',
    message: 'You have made too many requests. Please wait a moment before trying again.',
    action: 'Wait',
  },

  // Server errors
  SERVER_ERROR: {
    title: 'Server Error',
    message: 'Something went wrong on our end. Our team has been notified.',
    action: 'Try Again Later',
  },
  SERVICE_UNAVAILABLE: {
    title: 'Service Unavailable',
    message: 'The service is temporarily unavailable. Please try again later.',
    action: 'Retry Later',
  },

  // Database errors
  DATABASE_ERROR: {
    title: 'Database Error',
    message: 'Unable to access the database. Please try again.',
    action: 'Retry',
  },

  // File upload errors
  FILE_TOO_LARGE: {
    title: 'File Too Large',
    message: 'The file you are trying to upload is too large. Please choose a smaller file.',
    action: 'Choose Smaller File',
  },
  INVALID_FILE_TYPE: {
    title: 'Invalid File Type',
    message: 'This file type is not supported. Please choose a different file.',
    action: 'Choose Different File',
  },
  UPLOAD_FAILED: {
    title: 'Upload Failed',
    message: 'Failed to upload the file. Please try again.',
    action: 'Retry',
  },

  // Generic fallback
  UNKNOWN_ERROR: {
    title: 'Unexpected Error',
    message: 'An unexpected error occurred. Please try again.',
    action: 'Retry',
  },
}

/**
 * Get user-friendly error message from error code or status
 */
export function getErrorMessage(
  errorCodeOrStatus: string | number
): ErrorMessageConfig {
  // Handle HTTP status codes
  if (typeof errorCodeOrStatus === 'number') {
    switch (errorCodeOrStatus) {
      case 400:
        return ERROR_MESSAGES.VALIDATION_ERROR
      case 401:
        return ERROR_MESSAGES.UNAUTHORIZED
      case 403:
        return ERROR_MESSAGES.FORBIDDEN
      case 404:
        return ERROR_MESSAGES.NOT_FOUND
      case 408:
        return ERROR_MESSAGES.TIMEOUT_ERROR
      case 409:
        return ERROR_MESSAGES.ALREADY_EXISTS
      case 429:
        return ERROR_MESSAGES.RATE_LIMIT
      case 500:
        return ERROR_MESSAGES.SERVER_ERROR
      case 503:
        return ERROR_MESSAGES.SERVICE_UNAVAILABLE
      default:
        if (errorCodeOrStatus >= 500) {
          return ERROR_MESSAGES.SERVER_ERROR
        }
        if (errorCodeOrStatus >= 400) {
          return ERROR_MESSAGES.VALIDATION_ERROR
        }
        return ERROR_MESSAGES.UNKNOWN_ERROR
    }
  }

  // Handle error codes
  const errorCode = errorCodeOrStatus.toUpperCase()
  return ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.UNKNOWN_ERROR
}

/**
 * Get error message from Error object
 */
export function getErrorMessageFromError(error: Error): ErrorMessageConfig {
  // Check for network errors
  if (
    error.message.includes('fetch') ||
    error.message.includes('network') ||
    error.message.includes('Failed to fetch')
  ) {
    return ERROR_MESSAGES.NETWORK_ERROR
  }

  // Check for timeout errors
  if (error.message.includes('timeout') || error.message.includes('timed out')) {
    return ERROR_MESSAGES.TIMEOUT_ERROR
  }

  // Check if error has a status code
  if ('status' in error && typeof error.status === 'number') {
    return getErrorMessage(error.status)
  }

  // Check for specific error messages
  const message = error.message.toLowerCase()
  if (message.includes('unauthorized') || message.includes('authentication')) {
    return ERROR_MESSAGES.UNAUTHORIZED
  }
  if (message.includes('forbidden') || message.includes('permission')) {
    return ERROR_MESSAGES.FORBIDDEN
  }
  if (message.includes('not found')) {
    return ERROR_MESSAGES.NOT_FOUND
  }
  if (message.includes('validation') || message.includes('invalid')) {
    return ERROR_MESSAGES.VALIDATION_ERROR
  }
  if (message.includes('already exists') || message.includes('duplicate')) {
    return ERROR_MESSAGES.ALREADY_EXISTS
  }

  // Default to unknown error
  return ERROR_MESSAGES.UNKNOWN_ERROR
}

/**
 * Format error for display to user
 */
export function formatErrorForDisplay(
  error: Error | string | number
): ErrorMessageConfig {
  if (typeof error === 'string') {
    return getErrorMessage(error)
  }
  if (typeof error === 'number') {
    return getErrorMessage(error)
  }
  return getErrorMessageFromError(error)
}

/**
 * Get retry-able status codes
 */
export function isRetryableError(error: Error | number): boolean {
  if (typeof error === 'number') {
    // Retry on 5xx errors, 408 (timeout), and 429 (rate limit)
    return error >= 500 || error === 408 || error === 429
  }

  if ('status' in error && typeof error.status === 'number') {
    return isRetryableError(error.status)
  }

  // Network errors are retryable
  const message = error.message.toLowerCase()
  return (
    message.includes('fetch') ||
    message.includes('network') ||
    message.includes('timeout')
  )
}

/**
 * Create error message for form validation
 */
export function createValidationErrorMessage(
  field: string,
  type: 'required' | 'min' | 'max' | 'email' | 'url' | 'pattern'
): string {
  const fieldName = field.charAt(0).toUpperCase() + field.slice(1)

  switch (type) {
    case 'required':
      return `${fieldName} is required`
    case 'min':
      return `${fieldName} is too short`
    case 'max':
      return `${fieldName} is too long`
    case 'email':
      return `Please enter a valid email address`
    case 'url':
      return `Please enter a valid URL`
    case 'pattern':
      return `${fieldName} format is invalid`
    default:
      return `${fieldName} is invalid`
  }
}
