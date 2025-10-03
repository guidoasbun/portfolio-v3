/**
 * Projects API Route
 *
 * Handles GET (list all projects) and POST (create new project)
 */

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getProjects, addProject } from '@/lib/services'
import { projectFormSchema } from '@/lib/validations'
import type { ApiResponse, Project } from '@/types'

/**
 * GET /api/projects
 * Get all projects with optional filtering
 */
export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<Project[]>>> {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category') || undefined
    const featured = searchParams.get('featured')
      ? searchParams.get('featured') === 'true'
      : undefined

    const projects = await getProjects(category, featured)

    return NextResponse.json({
      success: true,
      data: projects,
      message: 'Projects retrieved successfully',
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch projects',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/projects
 * Create a new project
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
    const validatedData = await projectFormSchema.validate(body, {
      abortEarly: false,
    })

    // Transform null values to undefined for optional fields
    const projectData = {
      ...validatedData,
      liveUrl: validatedData.liveUrl || undefined,
      githubUrl: validatedData.githubUrl || undefined,
    }

    // Add the project to the database
    const id = await addProject(projectData)

    return NextResponse.json({
      success: true,
      data: { id },
      message: 'Project created successfully',
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)

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
        error: error instanceof Error ? error.message : 'Failed to create project',
      },
      { status: 500 }
    )
  }
}
