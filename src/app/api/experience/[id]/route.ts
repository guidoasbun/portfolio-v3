/**
 * Experience API Route - Single Experience
 *
 * Handles GET (single experience), PUT (update), and DELETE operations
 */

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getExperience, updateExperience, deleteExperience } from '@/lib/services'
import { experienceFormSchema } from '@/lib/validations'
import type { ApiResponse, Experience, ExperienceFormData } from '@/types'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

/**
 * GET /api/experience/[id]
 * Get a single experience by ID
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<Experience>>> {
  try {
    const { id } = await params

    const experience = await getExperience(id)

    if (!experience) {
      return NextResponse.json(
        {
          success: false,
          error: 'Experience not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: experience,
      message: 'Experience retrieved successfully',
    })
  } catch (error) {
    console.error('Error fetching experience:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch experience',
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/experience/[id]
 * Update an experience
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

    // Validate the request body
    const validatedData = await experienceFormSchema.validate(body, {
      abortEarly: false,
    })

    // Check if experience exists
    const existingExperience = await getExperience(id)
    if (!existingExperience) {
      return NextResponse.json(
        {
          success: false,
          error: 'Experience not found',
        },
        { status: 404 }
      )
    }

    // Update the experience (cast to proper type after validation)
    await updateExperience(id, validatedData as Partial<ExperienceFormData>)

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Experience updated successfully',
    })
  } catch (error) {
    console.error('Error updating experience:', error)

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
        error: error instanceof Error ? error.message : 'Failed to update experience',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/experience/[id]
 * Delete an experience
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

    // Check if experience exists
    const existingExperience = await getExperience(id)
    if (!existingExperience) {
      return NextResponse.json(
        {
          success: false,
          error: 'Experience not found',
        },
        { status: 404 }
      )
    }

    // Delete the experience
    await deleteExperience(id)

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Experience deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting experience:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete experience',
      },
      { status: 500 }
    )
  }
}
