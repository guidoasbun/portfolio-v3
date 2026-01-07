/**
 * Admin Projects List Page
 *
 * Displays all projects with CRUD operations.
 * Features: search, technology filtering, sorting, and pagination.
 */

'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
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
import { FiPlus, FiAlertCircle, FiCheckCircle, FiSearch, FiX, FiMove } from 'react-icons/fi'
import { SortableProjectList } from '@/components/admin/SortableProjectList'
import type { Project } from '@/types'

type SortOption = 'date-desc' | 'date-asc' | 'title-asc' | 'title-desc' | 'featured'

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
  const [isReorderMode, setIsReorderMode] = useState(false)

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

  // Handle reorder
  const handleReorder = async (projectIds: string[]) => {
    try {
      setError(null)
      const response = await fetch('/api/projects/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectIds }),
      })

      if (!response.ok) {
        throw new Error('Failed to reorder projects')
      }

      setSuccessMessage('Projects reordered successfully')
      setTimeout(() => setSuccessMessage(null), 5000)

      // Refresh projects and exit reorder mode
      await fetchProjects()
      setIsReorderMode(false)
    } catch (err) {
      console.error('Error reordering projects:', err)
      setError(err instanceof Error ? err.message : 'Failed to reorder projects')
    }
  }

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
        <div className="flex gap-3">
          <Button
            variant={isReorderMode ? 'primary' : 'secondary'}
            onClick={() => setIsReorderMode(!isReorderMode)}
            disabled={loading || projects.length < 2}
          >
            <FiMove className="mr-2" />
            {isReorderMode ? 'Exit Reorder' : 'Reorder'}
          </Button>
          <Link href="/admin/projects/new">
            <Button>
              <FiPlus className="mr-2" />
              Create Project
            </Button>
          </Link>
        </div>
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

      {/* Search - hidden in reorder mode */}
      {!isReorderMode && (
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
      )}

      {/* Filters and Sort - hidden in reorder mode */}
      {!isReorderMode && <GlassCard>
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
            </Select>
          </div>
        </div>
      </GlassCard>}

      {/* Projects Table or Reorder Mode */}
      {isReorderMode ? (
        <GlassCard>
          <SortableProjectList
            projects={projects}
            onReorder={handleReorder}
            onCancel={() => setIsReorderMode(false)}
          />
        </GlassCard>
      ) : (
        <>
          <ProjectsTable
            projects={paginatedProjects}
            onDelete={handleDeleteClick}
            loading={loading}
          />

          {/* Pagination */}
          {!loading && filteredAndSortedProjects.length > ITEMS_PER_PAGE && (
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
        </>
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
