'use client'

import React from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { skillFormSchema, type SkillFormValues } from '@/lib/validations'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'
import { Heading } from '@/components/ui/Heading'
import type { Skill } from '@/types'

interface SkillFormProps {
  initialData?: Skill
  onSubmit: SubmitHandler<SkillFormValues>
  onCancel: () => void
  isSubmitting?: boolean
}

const categoryOptions = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'database', label: 'Database' },
  { value: 'tools', label: 'Tools' },
  { value: 'design', label: 'Design' },
  { value: 'other', label: 'Other' }
]

export function SkillForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false
}: SkillFormProps) {
  const isEditMode = !!initialData

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<SkillFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(skillFormSchema) as any,
    defaultValues: initialData
      ? {
          name: initialData.name,
          category: initialData.category,
          proficiency: initialData.proficiency,
          icon: initialData.icon || '',
          color: initialData.color || '',
          featured: initialData.featured || false
        }
      : {
          name: '',
          category: 'frontend',
          proficiency: undefined,
          icon: '',
          color: '',
          featured: false
        }
  })

  const colorValue = watch('color')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <GlassCard>
        <Heading as="h2" className="mb-6">
          {isEditMode ? 'Edit Skill' : 'Add New Skill'}
        </Heading>

        <div className="space-y-6">
          {/* Name */}
          <FormField label="Name" error={errors.name?.message} required>
            <Input
              {...register('name')}
              placeholder="e.g., React, TypeScript, Node.js"
              disabled={isSubmitting}
            />
          </FormField>

          {/* Category */}
          <FormField label="Category" error={errors.category?.message} required>
            <Select {...register('category')} disabled={isSubmitting}>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormField>

          {/* Icon */}
          <FormField
            label="Icon"
            error={errors.icon?.message}
            helperText="Simple Icons name (e.g., SiReact, SiTypescript). Find icons at simpleicons.org"
          >
            <Input
              {...register('icon')}
              placeholder="SiReact"
              disabled={isSubmitting}
            />
          </FormField>

          {/* Color */}
          <FormField
            label="Color"
            error={errors.color?.message}
            helperText="Hex color code (e.g., #61DAFB)"
          >
            <div className="flex gap-3">
              <Input
                {...register('color')}
                placeholder="#61DAFB"
                disabled={isSubmitting}
                className="flex-1"
              />
              {colorValue && (
                <div
                  className="w-12 h-10 rounded border border-foreground/10 flex-shrink-0"
                  style={{ backgroundColor: colorValue }}
                  aria-label="Color preview"
                />
              )}
            </div>
          </FormField>

          {/* Proficiency (Admin Only - Not Displayed to Users) */}
          <FormField
            label="Proficiency (Internal)"
            error={errors.proficiency?.message}
            helperText="1-5 scale for internal tracking only (NOT displayed to public users)"
          >
            <Input
              {...register('proficiency', {
                valueAsNumber: true,
                setValueAs: (v) => v === '' ? undefined : Number(v)
              })}
              type="number"
              min="1"
              max="5"
              step="1"
              placeholder="1-5 (optional)"
              disabled={isSubmitting}
            />
          </FormField>

          {/* Featured */}
          <FormField
            label="Featured"
            error={errors.featured?.message}
            helperText="Featured skills are highlighted on the main portfolio page"
          >
            <div className="flex items-center gap-2">
              <input
                {...register('featured')}
                type="checkbox"
                disabled={isSubmitting}
                className="w-4 h-4 rounded border-foreground/20 text-blue-500 focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm">Show as featured skill</span>
            </div>
          </FormField>
        </div>
      </GlassCard>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent" />
              {isEditMode ? 'Updating...' : 'Creating...'}
            </span>
          ) : (
            isEditMode ? 'Update Skill' : 'Create Skill'
          )}
        </Button>
      </div>
    </form>
  )
}
