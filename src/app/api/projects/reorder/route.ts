/**
 * Projects Reorder API Route
 *
 * Handles POST request to reorder projects
 */

import { NextResponse } from 'next/server'
import { reorderProjects } from '@/lib/services/projects.service.admin'
import type { ApiResponse } from '@/types'
import { handleError, ValidationError, logError } from '@/lib/errors'

interface ReorderRequest {
  projectIds: string[]
}

/**
 * POST /api/projects/reorder
 * Reorder projects by providing an ordered array of project IDs
 */
export async function POST(request: Request): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const body: ReorderRequest = await request.json()

    // Validate the request body
    if (!body.projectIds || !Array.isArray(body.projectIds)) {
      throw new ValidationError('projectIds must be an array of strings')
    }

    if (body.projectIds.length === 0) {
      throw new ValidationError('projectIds array cannot be empty')
    }

    // Validate all IDs are strings
    if (!body.projectIds.every(id => typeof id === 'string' && id.length > 0)) {
      throw new ValidationError('All project IDs must be non-empty strings')
    }

    // Reorder the projects
    await reorderProjects(body.projectIds)

    return NextResponse.json({
      success: true,
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
