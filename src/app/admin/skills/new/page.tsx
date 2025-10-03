/**
 * Admin Create Skill Page
 *
 * Form for creating a new skill.
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heading } from '@/components/ui/Heading'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { SkillForm } from '@/components/admin/SkillForm'
import { FiArrowLeft, FiAlertCircle } from 'react-icons/fi'
import Link from 'next/link'
import type { SkillFormValues } from '@/lib/validations'

export default function NewSkillPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: SkillFormValues) => {
    try {
      setSubmitting(true)
      setError(null)

      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create skill')
      }

      // Redirect to skills list
      router.push('/admin/skills')
    } catch (err) {
      console.error('Error creating skill:', err)
      setError(err instanceof Error ? err.message : 'Failed to create skill')
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/skills')
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
          Add New Skill
        </Heading>
        <p className="text-muted-foreground">
          Add a new skill to your portfolio
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <GlassCard className="border-red-500/20 bg-red-500/10">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <FiAlertCircle size={24} />
            <div>
              <p className="font-medium">Error creating skill</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Skill Form */}
      <SkillForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isSubmitting={submitting}
      />
    </div>
  )
}
