/**
 * Messages API Route
 *
 * Handles GET (list all messages) and POST (create new message/contact form)
 */

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getMessages, addMessage } from '@/lib/services/messages.service.admin'
import { messageSchema } from '@/lib/validations'
import type { ApiResponse, Message } from '@/types'
import { rateLimitMiddleware, RATE_LIMITS } from '@/lib/rate-limiter'
import { verifyRecaptchaWithScore } from '@/lib/recaptcha'
import { sendContactFormEmails } from '@/lib/email'
import { handleError, ValidationError, RateLimitError, logError } from '@/lib/errors'

/**
 * GET /api/messages
 * Get all messages with optional filtering
 * Requires authentication
 */
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<Message[]>>> {
  try {
    // TODO: Add authentication check here when admin auth is fully implemented
    // const session = await getServerSession()
    // if (!session) {
    //   return NextResponse.json(
    //     { success: false, error: 'Unauthorized' },
    //     { status: 401 }
    //   )
    // }

    const searchParams = request.nextUrl.searchParams
    const read = searchParams.get('read')
      ? searchParams.get('read') === 'true'
      : undefined
    const replied = searchParams.get('replied')
      ? searchParams.get('replied') === 'true'
      : undefined

    let messages = await getMessages()

    // Filter by read status if specified
    if (read !== undefined) {
      messages = messages.filter(msg => msg.read === read)
    }

    // Filter by replied status if specified
    if (replied !== undefined) {
      messages = messages.filter(msg => msg.replied === replied)
    }

    return NextResponse.json({
      success: true,
      data: messages,
      message: 'Messages retrieved successfully',
    })
  } catch (error) {
    const appError = handleError(error)
    logError(appError, { endpoint: 'GET /api/messages' })
    return NextResponse.json(
      {
        success: false,
        error: appError.message,
      },
      { status: appError.statusCode }
    )
  }
}

/**
 * POST /api/messages
 * Create a new message (contact form submission)
 * Public endpoint - no authentication required
 */
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<{ id: string }>>> {
  try {
    // 1. Check rate limiting (3 submissions per 15 minutes)
    const rateLimitResult = await rateLimitMiddleware(request, RATE_LIMITS.CONTACT_FORM)

    if (!rateLimitResult.success) {
      const retryAfter = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
      const rateLimitError = new RateLimitError('Too many requests. Please try again later.')
      logError(rateLimitError, { endpoint: 'POST /api/messages', rateLimitInfo: rateLimitResult })

      return NextResponse.json(
        {
          success: false,
          error: rateLimitError.message,
        },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
          },
        }
      )
    }

    const body = await request.json()

    // 2. Verify reCAPTCHA token (if provided)
    const { recaptchaToken, ...formData } = body

    if (recaptchaToken) {
      const recaptchaResult = await verifyRecaptchaWithScore(recaptchaToken, 0.5)

      if (!recaptchaResult.valid) {
        const validationError = new ValidationError('Security verification failed. Please try again.')
        logError(validationError, {
          endpoint: 'POST /api/messages',
          recaptchaError: recaptchaResult.error,
        })
        return NextResponse.json(
          {
            success: false,
            error: validationError.message,
          },
          { status: 400 }
        )
      }

      // Log successful verification (optional)
      if (process.env.NODE_ENV === 'development') {
        console.log('reCAPTCHA verification successful. Score:', recaptchaResult.score)
      }
    }

    // 3. Validate the request body
    let validatedData
    try {
      validatedData = await messageSchema.validate(formData, {
        abortEarly: false,
      })
    } catch (validationError) {
      if (validationError instanceof Error && validationError.name === 'ValidationError') {
        throw new ValidationError(validationError.message)
      }
      throw validationError
    }

    // 4. Add the message to the database
    const id = await addMessage(validatedData)

    // 5. Send email notifications (async, don't block response)
    sendContactFormEmails(validatedData)
      .then((results) => {
        if (results.admin.success) {
          console.log('Admin notification sent successfully')
        } else {
          console.error('Failed to send admin notification:', results.admin.error)
        }

        if (results.user.success) {
          console.log('User confirmation sent successfully')
        } else {
          console.error('Failed to send user confirmation:', results.user.error)
        }
      })
      .catch((error) => {
        console.error('Error sending emails:', error)
      })

    return NextResponse.json(
      {
        success: true,
        data: { id },
        message: 'Message sent successfully. We will get back to you soon!',
      },
      {
        status: 201,
        headers: {
          'X-RateLimit-Limit': rateLimitResult.limit.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        },
      }
    )
  } catch (error) {
    const appError = handleError(error)
    logError(appError, { endpoint: 'POST /api/messages' })
    return NextResponse.json(
      {
        success: false,
        error: appError.message,
      },
      { status: appError.statusCode }
    )
  }
}
