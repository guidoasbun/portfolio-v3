/**
 * Admin Edit Project Page
 *
 * Form for editing an existing project.
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Heading } from '@/components/ui/Heading'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { ProjectForm } from '@/components/admin/ProjectForm'
import { FiArrowLeft, FiAlertCircle } from 'react-icons/fi'
import Link from 'next/link'
import type { Project } from '@/types'
import type { ProjectFormValues } from '@/lib/validations'

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/projects/${projectId}`)

        if (!response.ok) {
          throw new Error('Failed to fetch project')
        }

        const result = await response.json()

        // API returns data wrapped in ApiResponse format: { success, data, message }
        if (result.success && result.data) {
          setProject(result.data)
        } else {
          throw new Error(result.error || 'Failed to fetch project')
        }
      } catch (err) {
        console.error('Error fetching project:', err)
        setError(err instanceof Error ? err.message : 'Failed to load project')
      } finally {
        setLoading(false)
      }
    }

    if (projectId) {
      fetchProject()
    }
  }, [projectId])

  const handleSubmit = async (data: ProjectFormValues, imageUrls: string[]) => {
    try {
      setSubmitting(true)
      setError(null)

      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          images: imageUrls
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update project')
      }

      // Redirect to projects list
      router.push('/admin/projects')
    } catch (err) {
      console.error('Error updating project:', err)
      setError(err instanceof Error ? err.message : 'Failed to update project')
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/projects')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/projects">
            <Button variant="ghost" size="sm">
              <FiArrowLeft className="mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>

        <GlassCard>
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        </GlassCard>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/projects">
            <Button variant="ghost" size="sm">
              <FiArrowLeft className="mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>

        <GlassCard className="border-red-500/20 bg-red-500/10">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <FiAlertCircle size={24} />
            <div>
              <p className="font-medium">Error loading project</p>
              <p className="text-sm opacity-80">{error || 'Project not found'}</p>
            </div>
          </div>
        </GlassCard>

        <Link href="/admin/projects">
          <Button>Return to Projects</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/projects">
          <Button variant="ghost" size="sm">
            <FiArrowLeft className="mr-2" />
            Back to Projects
          </Button>
        </Link>
      </div>

      <div>
        <Heading as="h1" className="mb-2">
          Edit Project
        </Heading>
        <p className="text-muted-foreground">
          Update project details and information
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <GlassCard className="border-red-500/20 bg-red-500/10">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <FiAlertCircle size={24} />
            <div>
              <p className="font-medium">Error updating project</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Project Form */}
      <ProjectForm
        initialData={project}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={submitting}
      />
    </div>
  )
}
