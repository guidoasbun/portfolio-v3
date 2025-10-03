/**
 * Admin Edit Experience Page
 *
 * Edit an existing experience entry.
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Heading } from '@/components/ui/Heading'
import { GlassCard } from '@/components/ui/GlassCard'
import { ExperienceForm } from '@/components/admin/ExperienceForm'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { FiAlertCircle } from 'react-icons/fi'
import type { Experience } from '@/types'
import type { ExperienceFormValues } from '@/lib/validations'

export default function EditExperiencePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [experience, setExperience] = useState<Experience | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch experience data
  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/experience/${id}`)

        if (!response.ok) {
          throw new Error('Failed to fetch experience')
        }

        const result = await response.json()

        // Handle both direct data and ApiResponse format
        const data = result.data || result

        setExperience(data)
      } catch (err) {
        console.error('Error fetching experience:', err)
        setError(err instanceof Error ? err.message : 'Failed to load experience')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchExperience()
    }
  }, [id])

  const handleSubmit = async (data: ExperienceFormValues) => {
    try {
      setIsSubmitting(true)
      setError(null)

      const response = await fetch(`/api/experience/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update experience')
      }

      // Redirect to experience list on success
      router.push('/admin/experience')
    } catch (err) {
      console.error('Error updating experience:', err)
      setError(err instanceof Error ? err.message : 'Failed to update experience')
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/experience')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error && !experience) {
    return (
      <div className="space-y-6">
        <Heading as="h1">Edit Experience</Heading>
        <GlassCard className="border-red-500/20 bg-red-500/10">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <FiAlertCircle size={24} />
            <div>
              <p className="font-medium">Error</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          </div>
        </GlassCard>
      </div>
    )
  }

  if (!experience) {
    return (
      <div className="space-y-6">
        <Heading as="h1">Edit Experience</Heading>
        <GlassCard>
          <p className="text-muted-foreground">Experience not found</p>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Heading as="h1" className="mb-2">
          Edit Experience
        </Heading>
        <p className="text-muted-foreground">
          Update experience details
        </p>
      </div>

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

      {/* Form */}
      <ExperienceForm
        initialData={experience}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
