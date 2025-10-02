/**
 * Resume API Route - Download Tracking
 *
 * Handles POST to track resume downloads
 */

import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { incrementDownloadCount, getResume } from '@/lib/services'
import type { ApiResponse } from '@/types'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

/**
 * POST /api/resume/[id]/download
 * Increment the download count for a resume
 * Public endpoint - tracks download statistics
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const { id } = await params

    // Check if resume exists
    const resume = await getResume(id)
    if (!resume) {
      return NextResponse.json(
        {
          success: false,
          error: 'Resume not found',
        },
        { status: 404 }
      )
    }

    // Increment the download count
    await incrementDownloadCount(id)

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Download tracked successfully',
    })
  } catch (error) {
    console.error('Error tracking download:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to track download',
      },
      { status: 500 }
    )
  }
}
