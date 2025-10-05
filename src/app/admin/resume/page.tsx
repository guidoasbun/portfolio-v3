/**
 * Admin Resume Management Page
 *
 * Displays all resumes with CRUD operations.
 * Allows uploading new PDFs, setting active resume, and tracking downloads.
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'
import { ResumeTable } from '@/components/admin/ResumeTable'
import { ResumeUploadForm } from '@/components/admin/ResumeUploadForm'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { useModal } from '@/hooks/useModal'
import { FiPlus, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'
import type { Resume } from '@/types'

export default function AdminResumePage() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'active'>('all')
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; version: string } | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const { isOpen: isDeleteModalOpen, open: openDeleteModal, close: closeDeleteModal } = useModal()

  // Fetch resumes
  const fetchResumes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/resume')

      if (!response.ok) {
        throw new Error('Failed to fetch resumes')
      }

      const result = await response.json()
      const fetchedResumes = result.data || []

      // Apply filter
      const filteredResumes = filter === 'active'
        ? fetchedResumes.filter((r: Resume) => r.active)
        : fetchedResumes

      setResumes(filteredResumes)
    } catch (err) {
      console.error('Error fetching resumes:', err)
      setError(err instanceof Error ? err.message : 'Failed to load resumes')
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    fetchResumes()
  }, [fetchResumes])

  // Handle upload submit
  const handleUploadSubmit = async (data: {
    filename: string
    originalName: string
    fileUrl: string
    version: string
    active: boolean
  }) => {
    try {
      setSubmitting(true)
      setError(null)

      const response = await fetch('/api/resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload resume')
      }

      setSuccessMessage(`Resume "${data.version}" uploaded successfully`)
      setTimeout(() => setSuccessMessage(null), 5000)

      // Refresh resumes list and close form
      await fetchResumes()
      setShowUploadForm(false)
    } catch (err) {
      console.error('Error uploading resume:', err)
      setError(err instanceof Error ? err.message : 'Failed to upload resume')
      throw err // Re-throw to let form handle it
    } finally {
      setSubmitting(false)
    }
  }

  // Handle set active
  const handleSetActive = async (id: string) => {
    try {
      setError(null)

      const response = await fetch(`/api/resume/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ active: true })
      })

      if (!response.ok) {
        throw new Error('Failed to set resume as active')
      }

      setSuccessMessage('Resume set as active successfully')
      setTimeout(() => setSuccessMessage(null), 5000)

      // Refresh resumes list
      await fetchResumes()
    } catch (err) {
      console.error('Error setting resume as active:', err)
      setError(err instanceof Error ? err.message : 'Failed to set resume as active')
    }
  }

  // Handle delete confirmation
  const handleDeleteClick = (id: string, version: string) => {
    setDeleteTarget({ id, version })
    openDeleteModal()
  }

  // Handle delete
  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      setDeleting(true)
      const response = await fetch(`/api/resume/${deleteTarget.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete resume')
      }

      setSuccessMessage(`Resume "${deleteTarget.version}" deleted successfully`)
      setTimeout(() => setSuccessMessage(null), 5000)

      // Refresh resumes list
      await fetchResumes()

      closeDeleteModal()
      setDeleteTarget(null)
    } catch (err) {
      console.error('Error deleting resume:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete resume')
    } finally {
      setDeleting(false)
    }
  }

  const filteredResumes = resumes

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <Heading as="h2" className="mb-2">
            Resume Management
          </Heading>
          <p className="text-muted-foreground">
            Upload and manage resume versions
          </p>
        </div>
        {!showUploadForm && (
          <Button variant="primary" size="md" onClick={() => setShowUploadForm(true)}>
            <FiPlus size={20} />
            Upload New Resume
          </Button>
        )}
      </div>

      {/* Success Message */}
      {successMessage && (
        <GlassCard className="border-green-500/20 bg-green-500/10 p-4">
          <div className="flex items-center gap-3">
            <FiCheckCircle size={20} className="text-green-600 dark:text-green-400 shrink-0" />
            <p className="text-sm text-green-600 dark:text-green-400">{successMessage}</p>
          </div>
        </GlassCard>
      )}

      {/* Error Message */}
      {error && (
        <GlassCard className="border-red-500/20 bg-red-500/10 p-4">
          <div className="flex items-center gap-3">
            <FiAlertCircle size={20} className="text-red-600 dark:text-red-400 shrink-0" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        </GlassCard>
      )}

      {/* Upload Form */}
      {showUploadForm && (
        <ResumeUploadForm
          onSubmit={handleUploadSubmit}
          onCancel={() => setShowUploadForm(false)}
          isSubmitting={submitting}
        />
      )}

      {/* Filter Tabs */}
      {!showUploadForm && (
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All ({resumes.length})
          </Button>
          <Button
            variant={filter === 'active' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter('active')}
          >
            Active ({resumes.filter(r => r.active).length})
          </Button>
        </div>
      )}

      {/* Resume Table */}
      {!showUploadForm && (
        <ResumeTable
          resumes={filteredResumes}
          onSetActive={handleSetActive}
          onDelete={handleDeleteClick}
          loading={loading}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Delete Resume"
        message={`Are you sure you want to delete resume "${deleteTarget?.version}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
        loading={deleting}
      />
    </div>
  )
}
