import { format, formatDistanceToNow, isValid, parseISO } from "date-fns"

/**
 * Formats a date to a readable string
 */
export function formatDate(
  date: Date | string,
  pattern: string = "MMM dd, yyyy"
): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date

  if (!isValid(dateObj)) {
    return "Invalid date"
  }

  return format(dateObj, pattern)
}

/**
 * Formats a date range (e.g., "Jan 2023 - Present")
 */
export function formatDateRange(
  startDate: Date | string,
  endDate?: Date | string | null,
  options?: {
    showMonthYear?: boolean
    currentLabel?: string
  }
): string {
  const { showMonthYear = true, currentLabel = "Present" } = options || {}

  const pattern = showMonthYear ? "MMM yyyy" : "yyyy"
  const start = formatDate(startDate, pattern)

  if (!endDate) {
    return `${start} - ${currentLabel}`
  }

  const end = formatDate(endDate, pattern)
  return `${start} - ${end}`
}

/**
 * Returns relative time (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date

  if (!isValid(dateObj)) {
    return "Invalid date"
  }

  return formatDistanceToNow(dateObj, { addSuffix: true })
}

/**
 * Calculates duration between two dates in a human-readable format
 */
export function calculateDuration(
  startDate: Date | string,
  endDate?: Date | string | null
): string {
  const start = typeof startDate === "string" ? parseISO(startDate) : startDate
  const end = endDate
    ? typeof endDate === "string" ? parseISO(endDate) : endDate
    : new Date()

  if (!isValid(start) || !isValid(end)) {
    return "Invalid date range"
  }

  const diffInMs = end.getTime() - start.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  const years = Math.floor(diffInDays / 365)
  const months = Math.floor((diffInDays % 365) / 30)

  if (years > 0) {
    if (months > 0) {
      return `${years} yr${years > 1 ? "s" : ""} ${months} mo${months > 1 ? "s" : ""}`
    }
    return `${years} yr${years > 1 ? "s" : ""}`
  }

  if (months > 0) {
    return `${months} mo${months > 1 ? "s" : ""}`
  }

  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""}`
  }

  return "Less than a day"
}

/**
 * Formats a date for display in forms (YYYY-MM-DD)
 */
export function formatDateForInput(date: Date | string): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date

  if (!isValid(dateObj)) {
    return ""
  }

  return format(dateObj, "yyyy-MM-dd")
}

/**
 * Formats a date for API requests (ISO string)
 */
export function formatDateForAPI(date: Date | string): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date

  if (!isValid(dateObj)) {
    throw new Error("Invalid date provided")
  }

  return dateObj.toISOString()
}

/**
 * Checks if a date is in the past
 */
export function isPastDate(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? parseISO(date) : date

  if (!isValid(dateObj)) {
    return false
  }

  return dateObj < new Date()
}

/**
 * Checks if a date is in the future
 */
export function isFutureDate(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? parseISO(date) : date

  if (!isValid(dateObj)) {
    return false
  }

  return dateObj > new Date()
}

/**
 * Gets the current year
 */
export function getCurrentYear(): number {
  return new Date().getFullYear()
}

/**
 * Formats a timestamp for display (e.g., "Jan 15, 2024 at 3:30 PM")
 */
export function formatTimestamp(
  date: Date | string,
  options?: {
    includeTime?: boolean
    includeSeconds?: boolean
  }
): string {
  const { includeTime = true, includeSeconds = false } = options || {}
  const dateObj = typeof date === "string" ? parseISO(date) : date

  if (!isValid(dateObj)) {
    return "Invalid date"
  }

  let pattern = "MMM dd, yyyy"

  if (includeTime) {
    pattern += " 'at' h:mm"
    if (includeSeconds) {
      pattern += ":ss"
    }
    pattern += " a"
  }

  return format(dateObj, pattern)
}

/**
 * Validates if a string is a valid date
 */
export function isValidDateString(dateString: string): boolean {
  const date = parseISO(dateString)
  return isValid(date)
}

/**
 * Gets age from birth date
 */
export function getAge(birthDate: Date | string): number {
  const birth = typeof birthDate === "string" ? parseISO(birthDate) : birthDate

  if (!isValid(birth)) {
    throw new Error("Invalid birth date")
  }

  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}