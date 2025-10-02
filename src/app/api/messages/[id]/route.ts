/**
 * Messages API Route - Single Message
 *
 * Handles GET (single message), PUT (update), and DELETE operations
 */

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getMessage, updateMessage, deleteMessage, markAsRead, markAsReplied } from '@/lib/services'
import type { ApiResponse, Message } from '@/types'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

/**
 * GET /api/messages/[id]
 * Get a single message by ID
 * Requires authentication
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<Message>>> {
  try {
    // TODO: Add authentication check here when admin auth is fully implemented
    // const session = await getServerSession()
    // if (!session) {
    //   return NextResponse.json(
    //     { success: false, error: 'Unauthorized' },
    //     { status: 401 }
    //   )
    // }

    const { id } = await params

    const message = await getMessage(id)

    if (!message) {
      return NextResponse.json(
        {
          success: false,
          error: 'Message not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: message,
      message: 'Message retrieved successfully',
    })
  } catch (error) {
    console.error('Error fetching message:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch message',
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/messages/[id]
 * Update a message (mark as read/replied)
 * Requires authentication
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    // TODO: Add authentication check here when admin auth is fully implemented
    // const session = await getServerSession()
    // if (!session) {
    //   return NextResponse.json(
    //     { success: false, error: 'Unauthorized' },
    //     { status: 401 }
    //   )
    // }

    const { id } = await params
    const body = await request.json()

    // Check if message exists
    const existingMessage = await getMessage(id)
    if (!existingMessage) {
      return NextResponse.json(
        {
          success: false,
          error: 'Message not found',
        },
        { status: 404 }
      )
    }

    // Handle specific actions
    if (body.action === 'mark-read') {
      await markAsRead(id)
    } else if (body.action === 'mark-replied') {
      await markAsReplied(id)
    } else {
      // General update
      await updateMessage(id, body)
    }

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Message updated successfully',
    })
  } catch (error) {
    console.error('Error updating message:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update message',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/messages/[id]
 * Delete a message
 * Requires authentication
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    // TODO: Add authentication check here when admin auth is fully implemented
    // const session = await getServerSession()
    // if (!session) {
    //   return NextResponse.json(
    //     { success: false, error: 'Unauthorized' },
    //     { status: 401 }
    //   )
    // }

    const { id } = await params

    // Check if message exists
    const existingMessage = await getMessage(id)
    if (!existingMessage) {
      return NextResponse.json(
        {
          success: false,
          error: 'Message not found',
        },
        { status: 404 }
      )
    }

    // Delete the message
    await deleteMessage(id)

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Message deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete message',
      },
      { status: 500 }
    )
  }
}
