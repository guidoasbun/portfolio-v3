/**
 * Admin Create Project Page
 *
 * Form for creating a new project.
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heading } from '@/components/ui/Heading'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { ProjectForm } from '@/components/admin/ProjectForm'
import { FiArrowLeft, FiAlertCircle } from 'react-icons/fi'
import Link from 'next/link'
import type { ProjectFormValues } from '@/lib/validations'

export default function NewProjectPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: ProjectFormValues, imageUrls: string[]) => {
    try {
      setSubmitting(true)
      setError(null)

      const response = await fetch('/api/projects', {
        method: 'POST',
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
        throw new Error(errorData.error || 'Failed to create project')
      }

      // Redirect to projects list
      router.push('/admin/projects')
    } catch (err) {
      console.error('Error creating project:', err)
      setError(err instanceof Error ? err.message : 'Failed to create project')
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/projects')
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
          Create New Project
        </Heading>
        <p className="text-muted-foreground">
          Add a new project to your portfolio
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <GlassCard className="border-red-500/20 bg-red-500/10">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <FiAlertCircle size={24} />
            <div>
              <p className="font-medium">Error creating project</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Project Form */}
      <ProjectForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={submitting}
      />
    </div>
  )
}
