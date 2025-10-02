/**
 * Skills API Route - Single Skill
 *
 * Handles GET (single skill), PUT (update), and DELETE operations
 */

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSkill, updateSkill, deleteSkill } from '@/lib/services'
import { skillFormSchema } from '@/lib/validations'
import type { ApiResponse, Skill } from '@/types'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

/**
 * GET /api/skills/[id]
 * Get a single skill by ID
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<Skill>>> {
  try {
    const { id } = await params

    const skill = await getSkill(id)

    if (!skill) {
      return NextResponse.json(
        {
          success: false,
          error: 'Skill not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: skill,
      message: 'Skill retrieved successfully',
    })
  } catch (error) {
    console.error('Error fetching skill:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch skill',
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/skills/[id]
 * Update a skill
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
    const validatedData = await skillFormSchema.validate(body, {
      abortEarly: false,
    })

    // Check if skill exists
    const existingSkill = await getSkill(id)
    if (!existingSkill) {
      return NextResponse.json(
        {
          success: false,
          error: 'Skill not found',
        },
        { status: 404 }
      )
    }

    // Update the skill
    await updateSkill(id, validatedData)

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Skill updated successfully',
    })
  } catch (error) {
    console.error('Error updating skill:', error)

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
        error: error instanceof Error ? error.message : 'Failed to update skill',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/skills/[id]
 * Delete a skill
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

    // Check if skill exists
    const existingSkill = await getSkill(id)
    if (!existingSkill) {
      return NextResponse.json(
        {
          success: false,
          error: 'Skill not found',
        },
        { status: 404 }
      )
    }

    // Delete the skill
    await deleteSkill(id)

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Skill deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting skill:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete skill',
      },
      { status: 500 }
    )
  }
}
