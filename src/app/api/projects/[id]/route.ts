/**
 * Projects API Route - Single Project
 *
 * Handles GET (single project), PUT (update), and DELETE operations
 */

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getProject, updateProject, deleteProject } from '@/lib/services/projects.service.admin'
import { projectFormSchema } from '@/lib/validations'
import type { ApiResponse, Project } from '@/types'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

/**
 * GET /api/projects/[id]
 * Get a single project by ID
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<Project>>> {
  try {
    const { id } = await params

    const project = await getProject(id)

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: 'Project not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: project,
      message: 'Project retrieved successfully',
    })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch project',
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/projects/[id]
 * Update a project
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
    const validatedData = await projectFormSchema.validate(body, {
      abortEarly: false,
    })

    // Transform null values to undefined for optional fields
    const updateData = {
      ...validatedData,
      liveUrl: validatedData.liveUrl || undefined,
      githubUrl: validatedData.githubUrl || undefined,
    }

    // Check if project exists
    const existingProject = await getProject(id)
    if (!existingProject) {
      return NextResponse.json(
        {
          success: false,
          error: 'Project not found',
        },
        { status: 404 }
      )
    }

    // Update the project
    await updateProject(id, updateData)

    // Revalidate the home page to show updated data
    revalidatePath('/')

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Project updated successfully',
    })
  } catch (error) {
    console.error('Error updating project:', error)

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
        error: error instanceof Error ? error.message : 'Failed to update project',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/projects/[id]
 * Delete a project
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

    // Check if project exists
    const existingProject = await getProject(id)
    if (!existingProject) {
      return NextResponse.json(
        {
          success: false,
          error: 'Project not found',
        },
        { status: 404 }
      )
    }

    // Delete the project
    await deleteProject(id)

    // Revalidate the home page to reflect deletion
    revalidatePath('/')

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Project deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete project',
      },
      { status: 500 }
    )
  }
}
