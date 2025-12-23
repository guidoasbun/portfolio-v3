/**
 * Admin Projects List Page
 *
 * Displays all projects with CRUD operations.
 * Features: search, technology filtering, sorting, and pagination.
 */

'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import Link from 'next/link'
import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { ProjectsTable } from '@/components/admin/ProjectsTable'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { Pagination } from '@/components/ui/Pagination'
import { useModal } from '@/hooks/useModal'
import { useFilterPersistence } from '@/hooks/useFilterPersistence'
import { FiPlus, FiAlertCircle, FiCheckCircle, FiSearch, FiX, FiSave } from 'react-icons/fi'
import type { Project } from '@/types'

type SortOption = 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc' | 'featured' | 'custom'

interface ProjectFilters {
  search: string
  category: 'all' | 'featured'
  technology: string
  sortBy: SortOption
  page: number
}

const ITEMS_PER_PAGE = 10

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [reorderedProjects, setReorderedProjects] = useState<Project[] | null>(null)
  const [savingOrder, setSavingOrder] = useState(false)
  const originalOrderRef = useRef<string[]>([])

  const { isOpen: isDeleteModalOpen, open: openDeleteModal, close: closeDeleteModal } = useModal()

  // Persisted filters
  const [filters, setFilters] = useFilterPersistence<ProjectFilters>('admin-projects-filters', {
    search: '',
    category: 'all',
    technology: 'all',
    sortBy: 'date-desc',
    page: 1,
  })

  // Fetch projects (fetch all, filter client-side for better UX)
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/projects')

      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }

      const result = await response.json()
      setProjects(result.data || [])
    } catch (err) {
      console.error('Error fetching projects:', err)
      setError(err instanceof Error ? err.message : 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  // Extract unique technologies
  const allTechnologies = useMemo(() => {
    const techSet = new Set<string>()
    projects.forEach((project) => {
      project.technologies.forEach((tech) => techSet.add(tech))
    })
    return Array.from(techSet).sort()
  }, [projects])

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects

    // Apply category filter
    if (filters.category === 'featured') {
      filtered = filtered.filter((p) => p.featured)
    }

    // Apply technology filter
    if (filters.technology !== 'all') {
      filtered = filtered.filter((p) => p.technologies.includes(filters.technology))
    }

    // Apply search filter
    if (filters.search.trim()) {
      const query = filters.search.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.longDescription.toLowerCase().includes(query) ||
          p.technologies.some((tech) => tech.toLowerCase().includes(query))
      )
    }

    // Apply sorting
    const sorted = [...filtered]
    switch (filters.sortBy) {
      case 'date-desc':
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'date-asc':
        sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'title-asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'title-desc':
        sorted.sort((a, b) => b.title.localeCompare(a.title))
        break
      case 'featured':
        sorted.sort((a, b) => {
          if (a.featured === b.featured) return 0
          return a.featured ? -1 : 1
        })
        break
      case 'custom':
        // Sort by order field (ascending), then by createdAt for projects without order
        sorted.sort((a, b) => {
          if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order
          }
          if (a.order !== undefined) return -1
          if (b.order !== undefined) return 1
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })
        break
    }

    return sorted
  }, [projects, filters])

  // Paginate projects
  const paginatedProjects = useMemo(() => {
    const startIndex = (filters.page - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return filteredAndSortedProjects.slice(startIndex, endIndex)
  }, [filteredAndSortedProjects, filters.page])

  const totalPages = Math.ceil(filteredAndSortedProjects.length / ITEMS_PER_PAGE)

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
      const response = await fetch(`/api/projects/${deleteTarget.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete project')
      }

      setSuccessMessage(`Project "${deleteTarget.title}" deleted successfully`)
      setTimeout(() => setSuccessMessage(null), 5000)

      // Refresh projects list
      await fetchProjects()

      closeDeleteModal()
      setDeleteTarget(null)
    } catch (err) {
      console.error('Error deleting project:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete project')
    } finally {
      setDeleting(false)
    }
  }

  // Handle reorder from drag-and-drop
  const handleReorder = useCallback((newOrder: Project[]) => {
    setReorderedProjects(newOrder)
  }, [])

  // Check if order has changed
  const hasOrderChanged = useMemo(() => {
    if (!reorderedProjects) return false
    const currentOrder = reorderedProjects.map(p => p.id)
    return currentOrder.some((id, index) => id !== originalOrderRef.current[index])
  }, [reorderedProjects])

  // Store original order when entering custom sort mode
  useEffect(() => {
    if (filters.sortBy === 'custom' && !reorderedProjects) {
      originalOrderRef.current = filteredAndSortedProjects.map(p => p.id)
    }
    if (filters.sortBy !== 'custom') {
      setReorderedProjects(null)
      originalOrderRef.current = []
    }
  }, [filters.sortBy, filteredAndSortedProjects, reorderedProjects])

  // Save reordered projects
  const handleSaveOrder = async () => {
    if (!reorderedProjects) return

    try {
      setSavingOrder(true)
      setError(null)

      const orderedData = reorderedProjects.map((project, index) => ({
        id: project.id,
        order: index,
      }))

      const response = await fetch('/api/projects/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects: orderedData }),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to save order')
      }

      setSuccessMessage('Project order saved successfully')
      setTimeout(() => setSuccessMessage(null), 5000)

      // Refresh to get updated order from server
      await fetchProjects()
      setReorderedProjects(null)
      originalOrderRef.current = []
    } catch (err) {
      console.error('Error saving order:', err)
      setError(err instanceof Error ? err.message : 'Failed to save order')
    } finally {
      setSavingOrder(false)
    }
  }

  // Cancel reorder changes
  const handleCancelReorder = () => {
    setReorderedProjects(null)
  }

  // Get the projects to display (use reordered if in custom mode and changed)
  const displayProjects = useMemo(() => {
    if (filters.sortBy === 'custom') {
      // In custom mode, show all projects (no pagination) for drag-and-drop
      if (reorderedProjects) {
        return reorderedProjects
      }
      return filteredAndSortedProjects
    }
    return paginatedProjects
  }, [filters.sortBy, reorderedProjects, paginatedProjects, filteredAndSortedProjects])

  // Check if reorder is enabled
  const isReorderEnabled = filters.sortBy === 'custom' &&
    filters.search === '' &&
    filters.category === 'all' &&
    filters.technology === 'all'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <Heading as="h1" className="mb-2">
            Projects
          </Heading>
          <p className="text-muted-foreground">
            Manage your portfolio projects
          </p>
        </div>
        <Link href="/admin/projects/new">
          <Button>
            <FiPlus className="mr-2" />
            Create Project
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
            placeholder="Search by title, description, or technology..."
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
          {/* Category Filter */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium">Category:</span>
            <div className="flex gap-2">
              <Button
                variant={filters.category === 'all' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilters((prev) => ({ ...prev, category: 'all', page: 1 }))}
              >
                All ({projects.length})
              </Button>
              <Button
                variant={filters.category === 'featured' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilters((prev) => ({ ...prev, category: 'featured', page: 1 }))}
              >
                Featured ({projects.filter((p) => p.featured).length})
              </Button>
            </div>
          </div>

          {/* Technology Filter */}
          {allTechnologies.length > 0 && (
            <div className="flex items-center gap-3 flex-1 min-w-[200px]">
              <span className="text-sm font-medium whitespace-nowrap">Technology:</span>
              <Select
                value={filters.technology}
                onChange={(e) => setFilters((prev) => ({ ...prev, technology: e.target.value, page: 1 }))}
                className="flex-1"
              >
                <option value="all">All Technologies</option>
                {allTechnologies.map((tech) => (
                  <option key={tech} value={tech}>
                    {tech}
                  </option>
                ))}
              </Select>
            </div>
          )}

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
              <option value="featured">Featured First</option>
              <option value="custom">Custom Order (Drag to reorder)</option>
            </Select>
          </div>
        </div>
      </GlassCard>

      {/* Reorder Mode Info and Actions */}
      {filters.sortBy === 'custom' && (
        <GlassCard className={isReorderEnabled ? 'border-blue-500/20 bg-blue-500/5' : 'border-yellow-500/20 bg-yellow-500/5'}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              {isReorderEnabled ? (
                <p className="text-sm text-muted-foreground">
                  Drag the handle on each row to reorder projects. Changes will be saved when you click &quot;Save Order&quot;.
                </p>
              ) : (
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  Clear search and filters to enable drag-and-drop reordering.
                </p>
              )}
            </div>
            {hasOrderChanged && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelReorder}
                  disabled={savingOrder}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveOrder}
                  disabled={savingOrder}
                >
                  {savingOrder ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  ) : (
                    <FiSave className="mr-2" />
                  )}
                  {savingOrder ? 'Saving...' : 'Save Order'}
                </Button>
              </div>
            )}
          </div>
        </GlassCard>
      )}

      {/* Projects Table */}
      <ProjectsTable
        projects={displayProjects}
        onDelete={handleDeleteClick}
        onReorder={handleReorder}
        loading={loading}
        reorderEnabled={isReorderEnabled}
      />

      {/* Pagination - hide in custom order mode */}
      {!loading && filteredAndSortedProjects.length > ITEMS_PER_PAGE && filters.sortBy !== 'custom' && (
        <GlassCard>
          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            totalItems={filteredAndSortedProjects.length}
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
        title="Delete Project"
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
