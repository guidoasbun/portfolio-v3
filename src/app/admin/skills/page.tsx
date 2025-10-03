/**
 * Admin Skills List Page
 *
 * Displays all skills with CRUD operations.
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'
import { SkillsTable } from '@/components/admin/SkillsTable'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { useModal } from '@/hooks/useModal'
import { FiPlus, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'
import type { Skill, SkillCategory } from '@/types'

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'featured' | SkillCategory>('all')
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const { isOpen: isDeleteModalOpen, open: openDeleteModal, close: closeDeleteModal } = useModal()

  // Fetch skills
  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let url = '/api/skills'

      if (filter === 'featured') {
        url += '?featured=true'
      } else if (filter !== 'all') {
        url += `?category=${filter}`
      }

      const response = await fetch(url)

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
  }, [filter])

  useEffect(() => {
    fetchSkills()
  }, [fetchSkills])

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

      {/* Filters */}
      <GlassCard>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm font-medium">Filter:</span>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filter === 'all' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({skills.length})
            </Button>
            <Button
              variant={filter === 'featured' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('featured')}
            >
              Featured ({countFeatured()})
            </Button>
            <Button
              variant={filter === 'frontend' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('frontend')}
            >
              Frontend ({countByCategory('frontend')})
            </Button>
            <Button
              variant={filter === 'backend' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('backend')}
            >
              Backend ({countByCategory('backend')})
            </Button>
            <Button
              variant={filter === 'database' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('database')}
            >
              Database ({countByCategory('database')})
            </Button>
            <Button
              variant={filter === 'tools' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('tools')}
            >
              Tools ({countByCategory('tools')})
            </Button>
            <Button
              variant={filter === 'design' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('design')}
            >
              Design ({countByCategory('design')})
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Skills Table */}
      <SkillsTable
        skills={skills}
        onDelete={handleDeleteClick}
        loading={loading}
      />

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
