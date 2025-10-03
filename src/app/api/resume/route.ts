/**
 * Resume API Route
 *
 * Handles GET (list all resumes) and POST (create new resume)
 */

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getResumes, addResume } from '@/lib/services/resume.service.admin'
import { resumeFormSchema } from '@/lib/validations'
import type { ApiResponse, Resume } from '@/types'

/**
 * GET /api/resume
 * Get all resumes
 * Requires authentication
 */
export async function GET(_request: NextRequest): Promise<NextResponse<ApiResponse<Resume[]>>> {
  try {
    // TODO: Add authentication check here when admin auth is fully implemented
    // const session = await getServerSession()
    // if (!session) {
    //   return NextResponse.json(
    //     { success: false, error: 'Unauthorized' },
    //     { status: 401 }
    //   )
    // }

    const resumes = await getResumes()

    return NextResponse.json({
      success: true,
      data: resumes,
      message: 'Resumes retrieved successfully',
    })
  } catch (error) {
    console.error('Error fetching resumes:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch resumes',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/resume
 * Create a new resume
 * Requires authentication
 */
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<{ id: string }>>> {
  try {
    // TODO: Add authentication check here when admin auth is fully implemented
    // const session = await getServerSession()
    // if (!session) {
    //   return NextResponse.json(
    //     { success: false, error: 'Unauthorized' },
    //     { status: 401 }
    //   )
    // }

    const body = await request.json()

    // Validate the request body
    const validatedData = await resumeFormSchema.validate(body, {
      abortEarly: false,
    })

    // Add the resume to the database
    const id = await addResume(validatedData)

    return NextResponse.json({
      success: true,
      data: { id },
      message: 'Resume created successfully',
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating resume:', error)

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
        error: error instanceof Error ? error.message : 'Failed to create resume',
      },
      { status: 500 }
    )
  }
}
