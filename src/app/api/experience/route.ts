/**
 * Experience API Route
 *
 * Handles GET (list all experiences) and POST (create new experience)
 */

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getExperiences, addExperience } from '@/lib/services'
import { experienceFormSchema } from '@/lib/validations'
import type { ApiResponse, Experience, ExperienceType, ExperienceFormData } from '@/types'

/**
 * GET /api/experience
 * Get all experiences with optional filtering
 */
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<Experience[]>>> {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') as ExperienceType | null

    const experiences = await getExperiences(type || undefined)

    return NextResponse.json({
      success: true,
      data: experiences,
      message: 'Experiences retrieved successfully',
    })
  } catch (error) {
    console.error('Error fetching experiences:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch experiences',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/experience
 * Create a new experience
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
    const validatedData = await experienceFormSchema.validate(body, {
      abortEarly: false,
    })

    // Add the experience to the database (cast to proper type after validation)
    const id = await addExperience(validatedData as ExperienceFormData)

    return NextResponse.json({
      success: true,
      data: { id },
      message: 'Experience created successfully',
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating experience:', error)

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
        error: error instanceof Error ? error.message : 'Failed to create experience',
      },
      { status: 500 }
    )
  }
}
