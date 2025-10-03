/**
 * Admin Experience List Page
 *
 * Displays all experience entries with CRUD operations.
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'
import { ExperienceTable } from '@/components/admin/ExperienceTable'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { useModal } from '@/hooks/useModal'
import { FiPlus, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'
import type { Experience, ExperienceType } from '@/types'

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | ExperienceType>('all')
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const { isOpen: isDeleteModalOpen, open: openDeleteModal, close: closeDeleteModal } = useModal()

  // Fetch experiences
  const fetchExperiences = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const url = filter === 'all'
        ? '/api/experience'
        : `/api/experience?type=${filter}`

      const response = await fetch(url)

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
  }, [filter])

  useEffect(() => {
    fetchExperiences()
  }, [fetchExperiences])

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
              All ({experiences.length})
            </Button>
            <Button
              variant={filter === 'work' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('work')}
            >
              Work ({countByType('work')})
            </Button>
            <Button
              variant={filter === 'internship' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('internship')}
            >
              Internships ({countByType('internship')})
            </Button>
            <Button
              variant={filter === 'education' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('education')}
            >
              Education ({countByType('education')})
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Experience Table */}
      <ExperienceTable
        experiences={experiences}
        onDelete={handleDeleteClick}
        loading={loading}
      />

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
