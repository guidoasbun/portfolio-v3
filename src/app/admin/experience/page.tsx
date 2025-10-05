/**
 * Admin Experience List Page
 *
 * Displays all experience entries with CRUD operations.
 * Features: search, type filtering, sorting, and pagination.
 */

'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { ExperienceTable } from '@/components/admin/ExperienceTable'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { Pagination } from '@/components/ui/Pagination'
import { useModal } from '@/hooks/useModal'
import { useFilterPersistence } from '@/hooks/useFilterPersistence'
import { FiPlus, FiAlertCircle, FiCheckCircle, FiSearch, FiX } from 'react-icons/fi'
import type { Experience, ExperienceType } from '@/types'

type SortOption = 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc'

interface ExperienceFilters {
  search: string
  type: 'all' | ExperienceType
  sortBy: SortOption
  page: number
}

const ITEMS_PER_PAGE = 10

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const { isOpen: isDeleteModalOpen, open: openDeleteModal, close: closeDeleteModal } = useModal()

  // Persisted filters
  const [filters, setFilters] = useFilterPersistence<ExperienceFilters>('admin-experience-filters', {
    search: '',
    type: 'all',
    sortBy: 'date-desc',
    page: 1,
  })

  // Fetch experiences (fetch all, filter client-side)
  const fetchExperiences = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/experience')

      if (!response.ok) {
        throw new Error('Failed to fetch experiences')
      }

      const result = await response.json()

      // Handle both direct array and ApiResponse format
      const data = Array.isArray(result) ? result : result.data

      setExperiences(data)
    } catch (err) {
      console.error('Error fetching experiences:', err)
      setError(err instanceof Error ? err.message : 'Failed to load experiences')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchExperiences()
  }, [fetchExperiences])

  // Filter and sort experiences
  const filteredAndSortedExperiences = useMemo(() => {
    let filtered = experiences

    // Apply type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter((exp) => exp.type === filters.type)
    }

    // Apply search filter
    if (filters.search.trim()) {
      const query = filters.search.toLowerCase()
      filtered = filtered.filter(
        (exp) =>
          exp.title.toLowerCase().includes(query) ||
          exp.company.toLowerCase().includes(query) ||
          exp.location.toLowerCase().includes(query) ||
          exp.description.some((desc) => desc.toLowerCase().includes(query))
      )
    }

    // Apply sorting
    const sorted = [...filtered]
    switch (filters.sortBy) {
      case 'date-desc':
        // Current first, then by end date (or start date if no end date)
        sorted.sort((a, b) => {
          if (a.current && !b.current) return -1
          if (!a.current && b.current) return 1
          const aDate = a.endDate ? new Date(a.endDate) : new Date(a.startDate)
          const bDate = b.endDate ? new Date(b.endDate) : new Date(b.startDate)
          return bDate.getTime() - aDate.getTime()
        })
        break
      case 'date-asc':
        sorted.sort((a, b) => {
          const aDate = new Date(a.startDate)
          const bDate = new Date(b.startDate)
          return aDate.getTime() - bDate.getTime()
        })
        break
      case 'title-asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'title-desc':
        sorted.sort((a, b) => b.title.localeCompare(a.title))
        break
    }

    return sorted
  }, [experiences, filters])

  // Paginate experiences
  const paginatedExperiences = useMemo(() => {
    const startIndex = (filters.page - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return filteredAndSortedExperiences.slice(startIndex, endIndex)
  }, [filteredAndSortedExperiences, filters.page])

  const totalPages = Math.ceil(filteredAndSortedExperiences.length / ITEMS_PER_PAGE)

  // Reset to page 1 when filters change
  useEffect(() => {
    if (filters.page > totalPages && totalPages > 0) {
      setFilters((prev) => ({ ...prev, page: 1 }))
    }
  }, [filters.page, totalPages, setFilters])

  // Handle delete confirmation
  const handleDeleteClick = (id: string, title: string) => {
    setDeleteTarget({ id, title })
    openDeleteModal()
  }

  // Handle delete
  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      setDeleting(true)
      const response = await fetch(`/api/experience/${deleteTarget.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete experience')
      }

      setSuccessMessage(`Experience "${deleteTarget.title}" deleted successfully`)
      setTimeout(() => setSuccessMessage(null), 5000)

      // Refresh experiences list
      await fetchExperiences()

      closeDeleteModal()
      setDeleteTarget(null)
    } catch (err) {
      console.error('Error deleting experience:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete experience')
    } finally {
      setDeleting(false)
    }
  }

  // Count by type
  const countByType = (type: ExperienceType) => {
    return experiences.filter(exp => exp.type === type).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <Heading as="h1" className="mb-2">
            Experience
          </Heading>
          <p className="text-muted-foreground">
            Manage your work experience, internships, and education
          </p>
        </div>
        <Link href="/admin/experience/new">
          <Button>
            <FiPlus className="mr-2" />
            Add Experience
          </Button>
        </Link>
      </div>

      {/* Success Message */}
      {successMessage && (
        <GlassCard className="border-green-500/20 bg-green-500/10">
          <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
            <FiCheckCircle size={24} />
            <p>{successMessage}</p>
          </div>
        </GlassCard>
      )}

      {/* Error Message */}
      {error && (
        <GlassCard className="border-red-500/20 bg-red-500/10">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <FiAlertCircle size={24} />
            <div>
              <p className="font-medium">Error</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Search */}
      <GlassCard>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by title, company, location, or description..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))}
            className="pl-10 pr-10"
          />
          {filters.search && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, search: '', page: 1 }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <FiX size={18} />
            </button>
          )}
        </div>
      </GlassCard>

      {/* Filters and Sort */}
      <GlassCard>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Type Filter */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium">Type:</span>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filters.type === 'all' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilters((prev) => ({ ...prev, type: 'all', page: 1 }))}
              >
                All ({experiences.length})
              </Button>
              <Button
                variant={filters.type === 'work' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilters((prev) => ({ ...prev, type: 'work', page: 1 }))}
              >
                Work ({countByType('work')})
              </Button>
              <Button
                variant={filters.type === 'internship' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilters((prev) => ({ ...prev, type: 'internship', page: 1 }))}
              >
                Internships ({countByType('internship')})
              </Button>
              <Button
                variant={filters.type === 'education' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilters((prev) => ({ ...prev, type: 'education', page: 1 }))}
              >
                Education ({countByType('education')})
              </Button>
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-3 flex-1 min-w-[200px]">
            <span className="text-sm font-medium whitespace-nowrap">Sort by:</span>
            <Select
              value={filters.sortBy}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as SortOption }))}
              className="flex-1"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
            </Select>
          </div>
        </div>
      </GlassCard>

      {/* Experience Table */}
      <ExperienceTable
        experiences={paginatedExperiences}
        onDelete={handleDeleteClick}
        loading={loading}
      />

      {/* Pagination */}
      {!loading && filteredAndSortedExperiences.length > ITEMS_PER_PAGE && (
        <GlassCard>
          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            totalItems={filteredAndSortedExperiences.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          />
        </GlassCard>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Delete Experience"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone.`
            : ''
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleting}
      />
    </div>
  )
}
