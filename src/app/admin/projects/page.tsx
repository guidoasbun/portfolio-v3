/**
 * Admin Projects List Page
 *
 * Displays all projects with CRUD operations.
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'
import { ProjectsTable } from '@/components/admin/ProjectsTable'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { useModal } from '@/hooks/useModal'
import { FiPlus, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'
import type { Project } from '@/types'

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'featured'>('all')
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const { isOpen: isDeleteModalOpen, open: openDeleteModal, close: closeDeleteModal } = useModal()

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const url = filter === 'all'
        ? '/api/projects'
        : '/api/projects?featured=true'

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }

      const data = await response.json()
      setProjects(data)
    } catch (err) {
      console.error('Error fetching projects:', err)
      setError(err instanceof Error ? err.message : 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

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

      {/* Filters */}
      <GlassCard>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">Filter:</span>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All Projects ({projects.length})
            </Button>
            <Button
              variant={filter === 'featured' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('featured')}
            >
              Featured
            </Button>
          </div>
        </div>
      </GlassCard>

      {/* Projects Table */}
      <ProjectsTable
        projects={projects}
        onDelete={handleDeleteClick}
        loading={loading}
      />

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
