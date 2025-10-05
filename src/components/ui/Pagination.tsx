/**
 * Pagination Component
 *
 * A glass morphism styled pagination component with:
 * - Page numbers with ellipsis for large page counts
 * - Previous/Next buttons
 * - First/Last page buttons
 * - Showing range (e.g., "1-10 of 50")
 * - Theme-aware styling (light/dark/system)
 * - Mobile responsive
 */

'use client'

import React from 'react'
import { IconButton } from '@/components/ui/IconButton'
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'
import { cn } from '@/lib/utils'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  showFirstLast?: boolean
  showItemRange?: boolean
  maxPageButtons?: number
}

/**
 * Calculate the range of page numbers to display
 */
function getPageRange(
  currentPage: number,
  totalPages: number,
  maxButtons: number
): (number | 'ellipsis')[] {
  if (totalPages <= maxButtons) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const halfMax = Math.floor(maxButtons / 2)
  let startPage = Math.max(1, currentPage - halfMax)
  const endPage = Math.min(totalPages, startPage + maxButtons - 1)

  // Adjust if we're near the end
  if (endPage - startPage < maxButtons - 1) {
    startPage = Math.max(1, endPage - maxButtons + 1)
  }

  const pages: (number | 'ellipsis')[] = []

  // Add first page
  if (startPage > 1) {
    pages.push(1)
    if (startPage > 2) {
      pages.push('ellipsis')
    }
  }

  // Add middle pages
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  // Add last page
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages.push('ellipsis')
    }
    pages.push(totalPages)
  }

  return pages
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showFirstLast = true,
  showItemRange = true,
  maxPageButtons = 5,
}: PaginationProps) {
  const pages = getPageRange(currentPage, totalPages, maxPageButtons)

  // Calculate item range
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Item range */}
      {showItemRange && (
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{startItem}</span> to{' '}
          <span className="font-medium text-foreground">{endItem}</span> of{' '}
          <span className="font-medium text-foreground">{totalItems}</span> items
        </div>
      )}

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        {/* First page button */}
        {showFirstLast && (
          <IconButton
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={!canGoPrevious}
            aria-label="First page"
          >
            <FiChevronsLeft />
          </IconButton>
        )}

        {/* Previous page button */}
        <IconButton
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          aria-label="Previous page"
        >
          <FiChevronLeft />
        </IconButton>

        {/* Page number buttons */}
        <div className="flex items-center gap-1">
          {pages.map((page, index) => {
            if (page === 'ellipsis') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 text-muted-foreground"
                  aria-hidden="true"
                >
                  ...
                </span>
              )
            }

            const isActive = page === currentPage

            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={cn(
                  'min-w-[2.5rem] h-10 px-3 rounded-lg font-medium text-sm transition-all duration-200',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  isActive
                    ? 'glass-heavy text-foreground shadow-lg scale-105 border-blue-500 border'
                    : 'glass-light text-foreground/70 hover:text-foreground hover:glass-medium'
                )}
                aria-label={`Page ${page}`}
                aria-current={isActive ? 'page' : undefined}
              >
                {page}
              </button>
            )
          })}
        </div>

        {/* Next page button */}
        <IconButton
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          aria-label="Next page"
        >
          <FiChevronRight />
        </IconButton>

        {/* Last page button */}
        {showFirstLast && (
          <IconButton
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={!canGoNext}
            aria-label="Last page"
          >
            <FiChevronsRight />
          </IconButton>
        )}
      </div>
    </div>
  )
}
