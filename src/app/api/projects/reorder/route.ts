/**
 * Projects Reorder API Route
 *
 * Handles POST (batch reorder projects)
 */

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { reorderProjects } from '@/lib/services/projects.service.admin'
import type { ApiResponse } from '@/types'
import { handleError, ValidationError, logError } from '@/lib/errors'

interface ReorderRequest {
  projects: { id: string; order: number }[]
}

/**
 * POST /api/projects/reorder
 * Batch update project order
 */
export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<null>>> {
  try {
    // TODO: Add authentication check here when admin auth is fully implemented
    // const session = await getServerSession()
    // if (!session) {
    //   throw new AuthenticationError('Unauthorized')
    // }

    const body: ReorderRequest = await request.json()

    // Validate the request body
    if (!body.projects || !Array.isArray(body.projects)) {
      throw new ValidationError('Invalid request: projects array is required')
    }

    if (body.projects.length === 0) {
      throw new ValidationError('Invalid request: projects array cannot be empty')
    }

    // Validate each project entry
    for (const project of body.projects) {
      if (!project.id || typeof project.id !== 'string') {
        throw new ValidationError('Invalid request: each project must have a valid id')
      }
      if (typeof project.order !== 'number' || project.order < 0) {
        throw new ValidationError('Invalid request: each project must have a valid order (non-negative number)')
      }
    }

    // Perform the batch reorder
    await reorderProjects(body.projects)

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Projects reordered successfully',
    })
  } catch (error) {
    const appError = handleError(error)
    logError(appError, { endpoint: 'POST /api/projects/reorder' })
    return NextResponse.json(
      {
        success: false,
        error: appError.message,
      },
      { status: appError.statusCode }
    )
  }
}
