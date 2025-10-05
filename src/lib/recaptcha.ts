/**
 * reCAPTCHA Verification Utility
 *
 * Server-side verification for Google reCAPTCHA v3
 */

export interface RecaptchaVerificationResult {
  success: boolean
  score?: number
  action?: string
  challenge_ts?: string
  hostname?: string
  'error-codes'?: string[]
}

/**
 * Verify reCAPTCHA token with Google's API
 */
export async function verifyRecaptcha(token: string): Promise<RecaptchaVerificationResult> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY

  if (!secretKey) {
    console.warn('reCAPTCHA secret key not configured. Skipping verification.')
    return { success: true } // Don't block submissions if reCAPTCHA isn't configured
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    })

    const result: RecaptchaVerificationResult = await response.json()
    return result
  } catch (error) {
    console.error('Error verifying reCAPTCHA:', error)
    return {
      success: false,
      'error-codes': ['verification-failed'],
    }
  }
}

/**
 * Check if reCAPTCHA score meets minimum threshold
 * reCAPTCHA v3 returns a score (0.0 - 1.0)
 * 1.0 = very likely a legitimate user
 * 0.0 = very likely a bot
 */
export function isValidRecaptchaScore(score: number | undefined, minScore = 0.5): boolean {
  if (score === undefined) {
    return false
  }
  return score >= minScore
}

/**
 * Verify reCAPTCHA and check score in one function
 */
export async function verifyRecaptchaWithScore(
  token: string,
  minScore = 0.5
): Promise<{ valid: boolean; score?: number; error?: string }> {
  const result = await verifyRecaptcha(token)

  if (!result.success) {
    return {
      valid: false,
      error: result['error-codes']?.[0] || 'reCAPTCHA verification failed',
    }
  }

  if (!isValidRecaptchaScore(result.score, minScore)) {
    return {
      valid: false,
      score: result.score,
      error: 'reCAPTCHA score too low. Please try again.',
    }
  }

  return {
    valid: true,
    score: result.score,
  }
}
