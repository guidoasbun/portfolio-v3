'use client'

import React from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { experienceFormSchema, type ExperienceFormValues } from '@/lib/validations'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'
import { Heading } from '@/components/ui/Heading'
import { TagsInput } from '@/components/ui/TagsInput'
import { DescriptionPointsInput } from '@/components/ui/DescriptionPointsInput'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import type { Experience } from '@/types'

interface ExperienceFormProps {
  initialData?: Experience
  onSubmit: (data: ExperienceFormValues) => void | Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

const typeOptions = [
  { value: 'work', label: 'Work Experience' },
  { value: 'internship', label: 'Internship' },
  { value: 'education', label: 'Education' }
]

export function ExperienceForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false
}: ExperienceFormProps) {
  const isEditMode = !!initialData

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<ExperienceFormValues>({
    // @ts-expect-error - Yup resolver type mismatch with optional fields
    resolver: yupResolver(experienceFormSchema),
    defaultValues: initialData
      ? {
          type: initialData.type,
          title: initialData.title,
          company: initialData.company,
          location: initialData.location,
          startDate: initialData.startDate instanceof Date
            ? initialData.startDate
            : new Date(initialData.startDate),
          endDate: initialData.endDate
            ? (initialData.endDate instanceof Date
                ? initialData.endDate
                : new Date(initialData.endDate))
            : undefined,
          current: initialData.current,
          description: initialData.description,
          technologies: initialData.technologies || []
        }
      : {
          type: 'work',
          title: '',
          company: '',
          location: '',
          startDate: new Date(),
          endDate: undefined,
          current: false,
          description: [''],
          technologies: []
        }
  })

  const currentStatus = watch('current')
  const experienceType = watch('type')

  // Handle current toggle change
  const handleCurrentChange = (checked: boolean) => {
    setValue('current', checked)
    if (checked) {
      setValue('endDate', undefined)
    }
  }

  // Format date for input (YYYY-MM-DD)
  const formatDateForInput = (date: Date | undefined): string => {
    if (!date) return ''
    const d = date instanceof Date ? date : new Date(date)
    return d.toISOString().split('T')[0]
  }

  // Parse date from input
  const parseDateFromInput = (dateString: string): Date | undefined => {
    if (!dateString) return undefined
    return new Date(dateString)
  }

  // Get placeholder text based on type
  const getCompanyPlaceholder = () => {
    if (experienceType === 'education') return 'University/School Name'
    if (experienceType === 'internship') return 'Company Name'
    return 'Company Name'
  }

  const getTitlePlaceholder = () => {
    if (experienceType === 'education') return 'Degree/Program'
    if (experienceType === 'internship') return 'Internship Role'
    return 'Job Title'
  }

  return (
    <form onSubmit={handleSubmit(onSubmit as never)} className="space-y-6">
      <GlassCard>
        <Heading as="h2" className="mb-6">
          {isEditMode ? 'Edit Experience' : 'Add New Experience'}
        </Heading>

        <div className="space-y-6">
          {/* Type */}
          <FormField label="Type" error={errors.type?.message} required>
            <Select {...register('type')} disabled={isSubmitting}>
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormField>

          {/* Title */}
          <FormField label="Title/Position" error={errors.title?.message} required>
            <Input
              {...register('title')}
              placeholder={getTitlePlaceholder()}
              disabled={isSubmitting}
            />
          </FormField>

          {/* Company/Institution */}
          <FormField
            label={experienceType === 'education' ? 'Institution' : 'Company'}
            error={errors.company?.message}
            required
          >
            <Input
              {...register('company')}
              placeholder={getCompanyPlaceholder()}
              disabled={isSubmitting}
            />
          </FormField>

          {/* Location */}
          <FormField label="Location" error={errors.location?.message} required>
            <Input
              {...register('location')}
              placeholder="City, Country"
              disabled={isSubmitting}
            />
          </FormField>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date */}
            <FormField label="Start Date" error={errors.startDate?.message} required>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <Input
                    type="date"
                    value={formatDateForInput(field.value)}
                    onChange={(e) => field.onChange(parseDateFromInput(e.target.value))}
                    disabled={isSubmitting}
                  />
                )}
              />
            </FormField>

            {/* End Date */}
            <FormField
              label="End Date"
              error={errors.endDate?.message}
              required={!currentStatus}
            >
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <Input
                    type="date"
                    value={formatDateForInput(field.value)}
                    onChange={(e) => field.onChange(parseDateFromInput(e.target.value))}
                    disabled={isSubmitting || currentStatus}
                  />
                )}
              />
            </FormField>
          </div>

          {/* Current Toggle */}
          <FormField
            label={experienceType === 'education' ? 'Currently Studying' : 'Currently Working Here'}
          >
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={currentStatus}
                onChange={(e) => handleCurrentChange(e.target.checked)}
                disabled={isSubmitting}
                className="w-5 h-5 rounded border-foreground/20 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-all"
              />
              <span className="text-sm">
                {experienceType === 'education'
                  ? 'I am currently studying here'
                  : 'I currently work here'}
              </span>
            </label>
          </FormField>

          {/* Description Points */}
          <FormField
            label="Description"
            error={errors.description?.message}
            required
            helperText="Add bullet points describing your responsibilities and achievements"
          >
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <DescriptionPointsInput
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isSubmitting}
                  maxPoints={10}
                  maxLength={200}
                  placeholder="Describe your responsibilities, achievements, or coursework..."
                />
              )}
            />
          </FormField>

          {/* Technologies */}
          <FormField
            label="Technologies/Skills"
            error={errors.technologies?.message}
            helperText="Press Enter or comma to add tags (optional)"
          >
            <Controller
              name="technologies"
              control={control}
              render={({ field }) => (
                <TagsInput
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="e.g., React, TypeScript, Python"
                  disabled={isSubmitting}
                  maxTags={20}
                />
              )}
            />
          </FormField>
        </div>
      </GlassCard>

      {/* Form Actions */}
      <div className="flex items-center gap-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-w-[120px]"
        >
          {isSubmitting ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Saving...
            </>
          ) : (
            <>{isEditMode ? 'Update Experience' : 'Add Experience'}</>
          )}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
