/**
 * Admin Skills List Page
 *
 * Displays all skills with CRUD operations.
 * Features: search, category/featured filtering, sorting, and pagination.
 */

'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { SkillsTable } from '@/components/admin/SkillsTable'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { Pagination } from '@/components/ui/Pagination'
import { useModal } from '@/hooks/useModal'
import { useFilterPersistence } from '@/hooks/useFilterPersistence'
import { FiPlus, FiAlertCircle, FiCheckCircle, FiSearch, FiX } from 'react-icons/fi'
import type { Skill, SkillCategory } from '@/types'

type SortOption = 'name-asc' | 'name-desc' | 'category' | 'featured'

interface SkillFilters {
  search: string
  category: 'all' | 'featured' | SkillCategory
  sortBy: SortOption
  page: number
}

const ITEMS_PER_PAGE = 15

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const { isOpen: isDeleteModalOpen, open: openDeleteModal, close: closeDeleteModal } = useModal()

  // Persisted filters
  const [filters, setFilters] = useFilterPersistence<SkillFilters>('admin-skills-filters', {
    search: '',
    category: 'all',
    sortBy: 'name-asc',
    page: 1,
  })

  // Fetch skills (fetch all, filter client-side)
  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/skills')

      if (!response.ok) {
        throw new Error('Failed to fetch skills')
      }

      const result = await response.json()

      // Handle ApiResponse format
      const data = result.data || result

      setSkills(data)
    } catch (err) {
      console.error('Error fetching skills:', err)
      setError(err instanceof Error ? err.message : 'Failed to load skills')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSkills()
  }, [fetchSkills])

  // Filter and sort skills
  const filteredAndSortedSkills = useMemo(() => {
    let filtered = skills

    // Apply category filter
    if (filters.category === 'featured') {
      filtered = filtered.filter((skill) => skill.featured)
    } else if (filters.category !== 'all') {
      filtered = filtered.filter((skill) => skill.category === filters.category)
    }

    // Apply search filter
    if (filters.search.trim()) {
      const query = filters.search.toLowerCase()
      filtered = filtered.filter((skill) => skill.name.toLowerCase().includes(query))
    }

    // Apply sorting
    const sorted = [...filtered]
    switch (filters.sortBy) {
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'category':
        sorted.sort((a, b) => {
          if (a.category === b.category) {
            return a.name.localeCompare(b.name)
          }
          return a.category.localeCompare(b.category)
        })
        break
      case 'featured':
        sorted.sort((a, b) => {
          if (a.featured === b.featured) {
            return a.name.localeCompare(b.name)
          }
          return a.featured ? -1 : 1
        })
        break
    }

    return sorted
  }, [skills, filters])

  // Paginate skills
  const paginatedSkills = useMemo(() => {
    const startIndex = (filters.page - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return filteredAndSortedSkills.slice(startIndex, endIndex)
  }, [filteredAndSortedSkills, filters.page])

  const totalPages = Math.ceil(filteredAndSortedSkills.length / ITEMS_PER_PAGE)

  // Reset to page 1 when filters change
  useEffect(() => {
    if (filters.page > totalPages && totalPages > 0) {
      setFilters((prev) => ({ ...prev, page: 1 }))
    }
  }, [filters.page, totalPages, setFilters])

  // Handle delete confirmation
  const handleDeleteClick = (id: string, name: string) => {
    setDeleteTarget({ id, name })
    openDeleteModal()
  }

  // Handle delete
  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      setDeleting(true)
      const response = await fetch(`/api/skills/${deleteTarget.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete skill')
      }

      setSuccessMessage(`Skill "${deleteTarget.name}" deleted successfully`)
      setTimeout(() => setSuccessMessage(null), 5000)

      // Refresh skills list
      await fetchSkills()

      closeDeleteModal()
      setDeleteTarget(null)
    } catch (err) {
      console.error('Error deleting skill:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete skill')
    } finally {
      setDeleting(false)
    }
  }

  // Count by category
  const countByCategory = (category: SkillCategory) => {
    return skills.filter(skill => skill.category === category).length
  }

  // Count featured
  const countFeatured = () => {
    return skills.filter(skill => skill.featured).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <Heading as="h1" className="mb-2">
            Skills
          </Heading>
          <p className="text-muted-foreground">
            Manage your technical skills and expertise
          </p>
        </div>
        <Link href="/admin/skills/new">
          <Button>
            <FiPlus className="mr-2" />
            Add Skill
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
            placeholder="Search by skill name..."
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
        <div className="flex flex-col gap-4">
          {/* Category Filter */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium">Category:</span>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filters.category === 'all' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilters((prev) => ({ ...prev, category: 'all', page: 1 }))}
              >
                All ({skills.length})
              </Button>
              <Button
                variant={filters.category === 'featured' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilters((prev) => ({ ...prev, category: 'featured', page: 1 }))}
              >
                Featured ({countFeatured()})
              </Button>
              <Button
                variant={filters.category === 'frontend' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilters((prev) => ({ ...prev, category: 'frontend', page: 1 }))}
              >
                Frontend ({countByCategory('frontend')})
              </Button>
              <Button
                variant={filters.category === 'backend' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilters((prev) => ({ ...prev, category: 'backend', page: 1 }))}
              >
                Backend ({countByCategory('backend')})
              </Button>
              <Button
                variant={filters.category === 'database' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilters((prev) => ({ ...prev, category: 'database', page: 1 }))}
              >
                Database ({countByCategory('database')})
              </Button>
              <Button
                variant={filters.category === 'tools' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilters((prev) => ({ ...prev, category: 'tools', page: 1 }))}
              >
                Tools ({countByCategory('tools')})
              </Button>
              <Button
                variant={filters.category === 'design' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilters((prev) => ({ ...prev, category: 'design', page: 1 }))}
              >
                Design ({countByCategory('design')})
              </Button>
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-3 flex-1 min-w-[200px]">
            <span className="text-sm font-medium whitespace-nowrap">Sort by:</span>
            <Select
              value={filters.sortBy}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as SortOption }))}
              className="flex-1 max-w-xs"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="category">Category</option>
              <option value="featured">Featured First</option>
            </Select>
          </div>
        </div>
      </GlassCard>

      {/* Skills Table */}
      <SkillsTable
        skills={paginatedSkills}
        onDelete={handleDeleteClick}
        loading={loading}
      />

      {/* Pagination */}
      {!loading && filteredAndSortedSkills.length > ITEMS_PER_PAGE && (
        <GlassCard>
          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            totalItems={filteredAndSortedSkills.length}
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
        title="Delete Skill"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`
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
