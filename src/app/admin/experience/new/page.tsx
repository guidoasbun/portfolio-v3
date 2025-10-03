/**
 * Admin New Experience Page
 *
 * Create a new experience entry.
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heading } from '@/components/ui/Heading'
import { GlassCard } from '@/components/ui/GlassCard'
import { ExperienceForm } from '@/components/admin/ExperienceForm'
import { FiAlertCircle } from 'react-icons/fi'
import type { ExperienceFormValues } from '@/lib/validations'

export default function NewExperiencePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: ExperienceFormValues) => {
    try {
      setIsSubmitting(true)
      setError(null)

      const response = await fetch('/api/experience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create experience')
      }

      // Redirect to experience list on success
      router.push('/admin/experience')
    } catch (err) {
      console.error('Error creating experience:', err)
      setError(err instanceof Error ? err.message : 'Failed to create experience')
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/experience')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Heading as="h1" className="mb-2">
          Add New Experience
        </Heading>
        <p className="text-muted-foreground">
          Add a new work experience, internship, or education entry
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
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
