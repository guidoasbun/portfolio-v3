/**
 * Resume API Route - Single Resume
 *
 * Handles GET (single resume), PUT (update), and DELETE operations
 */

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getResume, updateResume, deleteResume } from '@/lib/services/resume.service.admin'
import { resumeUpdateSchema } from '@/lib/validations'
import type { ApiResponse, Resume } from '@/types'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

/**
 * GET /api/resume/[id]
 * Get a single resume by ID
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<Resume>>> {
  try {
    const { id } = await params

    const resume = await getResume(id)

    if (!resume) {
      return NextResponse.json(
        {
          success: false,
          error: 'Resume not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: resume,
      message: 'Resume retrieved successfully',
    })
  } catch (error) {
    console.error('Error fetching resume:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch resume',
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/resume/[id]
 * Update a resume
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

    // Validate the request body (partial validation for updates)
    const validatedData = await resumeUpdateSchema.validate(body, {
      abortEarly: false,
    })

    // Check if resume exists
    const existingResume = await getResume(id)
    if (!existingResume) {
      return NextResponse.json(
        {
          success: false,
          error: 'Resume not found',
        },
        { status: 404 }
      )
    }

    // Update the resume
    await updateResume(id, validatedData)

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Resume updated successfully',
    })
  } catch (error) {
    console.error('Error updating resume:', error)

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
        error: error instanceof Error ? error.message : 'Failed to update resume',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/resume/[id]
 * Delete a resume
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

    // Check if resume exists
    const existingResume = await getResume(id)
    if (!existingResume) {
      return NextResponse.json(
        {
          success: false,
          error: 'Resume not found',
        },
        { status: 404 }
      )
    }

    // Delete the resume
    await deleteResume(id)

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Resume deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting resume:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete resume',
      },
      { status: 500 }
    )
  }
}
