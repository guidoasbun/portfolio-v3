/**
 * Admin Edit Skill Page
 *
 * Form for editing an existing skill.
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Heading } from '@/components/ui/Heading'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { SkillForm } from '@/components/admin/SkillForm'
import { FiArrowLeft, FiAlertCircle } from 'react-icons/fi'
import Link from 'next/link'
import type { Skill } from '@/types'
import type { SkillFormValues } from '@/lib/validations'

export default function EditSkillPage() {
  const router = useRouter()
  const params = useParams()
  const skillId = params.id as string

  const [skill, setSkill] = useState<Skill | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch skill data
  useEffect(() => {
    const fetchSkill = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/skills/${skillId}`)

        if (!response.ok) {
          throw new Error('Failed to fetch skill')
        }

        const result = await response.json()

        // Handle ApiResponse format
        const data = result.data || result

        setSkill(data)
      } catch (err) {
        console.error('Error fetching skill:', err)
        setError(err instanceof Error ? err.message : 'Failed to load skill')
      } finally {
        setLoading(false)
      }
    }

    if (skillId) {
      fetchSkill()
    }
  }, [skillId])

  const handleSubmit = async (data: SkillFormValues) => {
    try {
      setSubmitting(true)
      setError(null)

      const response = await fetch(`/api/skills/${skillId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update skill')
      }

      // Redirect to skills list
      router.push('/admin/skills')
    } catch (err) {
      console.error('Error updating skill:', err)
      setError(err instanceof Error ? err.message : 'Failed to update skill')
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/skills')
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/skills">
            <Button variant="ghost" size="sm">
              <FiArrowLeft className="mr-2" />
              Back to Skills
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

  if (error || !skill) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/skills">
            <Button variant="ghost" size="sm">
              <FiArrowLeft className="mr-2" />
              Back to Skills
            </Button>
          </Link>
        </div>

        <GlassCard className="border-red-500/20 bg-red-500/10">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <FiAlertCircle size={24} />
            <div>
              <p className="font-medium">Error loading skill</p>
              <p className="text-sm opacity-80">{error || 'Skill not found'}</p>
            </div>
          </div>
        </GlassCard>

        <Link href="/admin/skills">
          <Button>Return to Skills</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/skills">
          <Button variant="ghost" size="sm">
            <FiArrowLeft className="mr-2" />
            Back to Skills
          </Button>
        </Link>
      </div>

      <div>
        <Heading as="h1" className="mb-2">
          Edit Skill
        </Heading>
        <p className="text-muted-foreground">
          Update skill details and information
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <GlassCard className="border-red-500/20 bg-red-500/10">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <FiAlertCircle size={24} />
            <div>
              <p className="font-medium">Error updating skill</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Skill Form */}
      <SkillForm
        initialData={skill}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={submitting}
      />
    </div>
  )
}
