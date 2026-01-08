/**
 * Projects API Route
 *
 * Handles GET (list all projects) and POST (create new project)
 */

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getProjects, addProject, getFeaturedProjects, getProjectsByCategory } from '@/lib/services/projects.service.admin'
import { projectFormSchema } from '@/lib/validations'
import type { ApiResponse, Project } from '@/types'
import { handleError, ValidationError, logError } from '@/lib/errors'

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

    let projects: Project[]

    if (featured) {
      projects = await getFeaturedProjects()
    } else if (category) {
      projects = await getProjectsByCategory(category)
    } else {
      projects = await getProjects()
    }

    return NextResponse.json({
      success: true,
      data: projects,
      message: 'Projects retrieved successfully',
    })
  } catch (error) {
    const appError = handleError(error)
    logError(appError, { endpoint: 'GET /api/projects' })
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
 * POST /api/projects
 * Create a new project
 * Requires authentication
 */
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<{ id: string }>>> {
  try {
    // TODO: Add authentication check here when admin auth is fully implemented
    // const session = await getServerSession()
    // if (!session) {
    //   throw new AuthenticationError('Unauthorized')
    // }

    const body = await request.json()

    // Validate the request body
    try {
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

      // Revalidate the home page to show new project
      revalidatePath('/')

      return NextResponse.json({
        success: true,
        data: { id },
        message: 'Project created successfully',
      }, { status: 201 })
    } catch (validationError) {
      if (validationError instanceof Error && validationError.name === 'ValidationError') {
        throw new ValidationError(validationError.message)
      }
      throw validationError
    }
  } catch (error) {
    const appError = handleError(error)
    logError(appError, { endpoint: 'POST /api/projects' })
    return NextResponse.json(
      {
        success: false,
        error: appError.message,
      },
      { status: appError.statusCode }
    )
  }
}
