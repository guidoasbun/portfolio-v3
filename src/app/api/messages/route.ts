/**
 * Messages API Route
 *
 * Handles GET (list all messages) and POST (create new message/contact form)
 */

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getMessages, addMessage } from '@/lib/services'
import { messageSchema } from '@/lib/validations'
import type { ApiResponse, Message } from '@/types'

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

    const messages = await getMessages(read, replied)

    return NextResponse.json({
      success: true,
      data: messages,
      message: 'Messages retrieved successfully',
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch messages',
      },
      { status: 500 }
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
    const body = await request.json()

    // Validate the request body
    const validatedData = await messageSchema.validate(body, {
      abortEarly: false,
    })

    // TODO: Add rate limiting here to prevent spam
    // Check if the same email has sent a message in the last X minutes

    // Add the message to the database
    const id = await addMessage(validatedData)

    // TODO: Send email notification to admin
    // await sendEmailNotification(validatedData)

    return NextResponse.json({
      success: true,
      data: { id },
      message: 'Message sent successfully. We will get back to you soon!',
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating message:', error)

    // Handle validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send message',
      },
      { status: 500 }
    )
  }
}
