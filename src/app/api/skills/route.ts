/**
 * Skills API Route
 *
 * Handles GET (list all skills) and POST (create new skill)
 */

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getSkills, addSkill } from '@/lib/services'
import { skillFormSchema } from '@/lib/validations'
import type { ApiResponse, Skill, SkillCategory } from '@/types'

/**
 * GET /api/skills
 * Get all skills with optional filtering
 */
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<Skill[]>>> {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category') as SkillCategory | null
    const featured = searchParams.get('featured')
      ? searchParams.get('featured') === 'true'
      : undefined

    const skills = await getSkills(category || undefined, featured)

    return NextResponse.json({
      success: true,
      data: skills,
      message: 'Skills retrieved successfully',
    })
  } catch (error) {
    console.error('Error fetching skills:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch skills',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/skills
 * Create a new skill
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
    const validatedData = await skillFormSchema.validate(body, {
      abortEarly: false,
    })

    // Add the skill to the database
    const id = await addSkill(validatedData)

    return NextResponse.json({
      success: true,
      data: { id },
      message: 'Skill created successfully',
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating skill:', error)

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
        error: error instanceof Error ? error.message : 'Failed to create skill',
      },
      { status: 500 }
    )
  }
}
