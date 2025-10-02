/**
 * Resume API Route - Active Resume
 *
 * Handles GET to retrieve the currently active resume
 */

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { getActiveResume } from '@/lib/services'
import type { ApiResponse, Resume } from '@/types'

/**
 * GET /api/resume/active
 * Get the currently active resume
 * Public endpoint - no authentication required
 */
export async function GET(_request: NextRequest): Promise<NextResponse<ApiResponse<Resume | null>>> {
  try {
    const activeResume = await getActiveResume()

    if (!activeResume) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'No active resume found',
      })
    }

    return NextResponse.json({
      success: true,
      data: activeResume,
      message: 'Active resume retrieved successfully',
    })
  } catch (error) {
    console.error('Error fetching active resume:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch active resume',
      },
      { status: 500 }
    )
  }
}
