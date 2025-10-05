'use client'

import React from 'react'
import { useForm, Controller, type SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { projectFormSchema, type ProjectFormValues } from '@/lib/validations'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'
import { Heading } from '@/components/ui/Heading'
import { TagsInput } from '@/components/ui/TagsInput'
import { ImageUploadField } from './ImageUploadField'
import { useImageUpload } from '@/hooks/useImageUpload'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { STORAGE_PATHS } from '@/lib/firebase/storage'
import type { Project } from '@/types'

interface ProjectFormProps {
  initialData?: Project
  onSubmit: (data: ProjectFormValues, imageUrls: string[]) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

const categoryOptions = [
  { value: 'web', label: 'Web Application' },
  { value: 'mobile', label: 'Mobile Application' },
  { value: 'desktop', label: 'Desktop Application' },
  { value: 'ai', label: 'AI/ML Project' },
  { value: 'other', label: 'Other' }
]

export function ProjectForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false
}: ProjectFormProps) {
  const isEditMode = !!initialData

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<ProjectFormValues>({
    resolver: yupResolver(projectFormSchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          longDescription: initialData.longDescription,
          technologies: initialData.technologies,
          category: initialData.category,
          images: initialData.images,
          liveUrl: initialData.liveUrl || '',
          githubUrl: initialData.githubUrl || '',
          featured: initialData.featured
        }
      : {
          title: '',
          description: '',
          longDescription: '',
          technologies: [],
          category: 'web',
          images: [],
          liveUrl: '',
          githubUrl: '',
          featured: false
        }
  })

  const {
    previews,
    addPreviews,
    removePreview,
    uploadImages,
    uploading,
    uploadProgress,
    uploadError
  } = useImageUpload()

  const currentImages = watch('images')

  // Update form images field when previews change (for validation)
  React.useEffect(() => {
    if (!isEditMode && previews.length > 0) {
      // Set placeholder URLs for validation (will be replaced with real URLs on submit)
      // Use valid URL format to pass validation
      setValue('images', previews.map((_, i) => `https://placeholder.com/image-${i}`))
    } else if (!isEditMode && previews.length === 0) {
      // Clear images when all previews are removed
      setValue('images', [])
    }
  }, [previews.length, isEditMode, setValue])

  // Handle form submission
  const onFormSubmit: SubmitHandler<ProjectFormValues> = async (data) => {
    try {
      let imageUrls: string[] = []

      // In edit mode, keep existing images that aren't placeholders
      if (isEditMode) {
        imageUrls = currentImages.filter(url => !url.includes('placeholder.com'))
      }

      // Upload new images if any
      if (previews.length > 0) {
        const newUrls = await uploadImages(STORAGE_PATHS.PROJECTS)
        if (newUrls) {
          imageUrls = [...imageUrls, ...newUrls]
        }
      }

      // Validate we have at least one image
      if (imageUrls.length === 0) {
        alert('Please add at least one image')
        return
      }

      await onSubmit({ ...data, images: imageUrls }, imageUrls)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  // Handle existing image removal
  const handleRemoveExistingImage = (index: number) => {
    const newImages = currentImages.filter((_, i) => i !== index)
    setValue('images', newImages)
  }

  const descriptionLength = watch('description')?.length || 0
  const longDescriptionLength = watch('longDescription')?.length || 0

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <GlassCard>
        <Heading as="h2" className="mb-6">
          {isEditMode ? 'Edit Project' : 'Create New Project'}
        </Heading>

        <div className="space-y-6">
          {/* Title */}
          <FormField label="Project Title" error={errors.title?.message} required>
            <Input
              {...register('title')}
              placeholder="My Awesome Project"
              disabled={isSubmitting || uploading}
            />
          </FormField>

          {/* Category */}
          <FormField label="Category" error={errors.category?.message} required>
            <Select {...register('category')} disabled={isSubmitting || uploading}>
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FormField>

          {/* Short Description */}
          <FormField
            label="Short Description"
            error={errors.description?.message}
            required
            helperText={`${descriptionLength}/500 characters`}
          >
            <Textarea
              {...register('description')}
              placeholder="Brief description for project cards..."
              rows={3}
              maxLength={500}
              disabled={isSubmitting || uploading}
            />
          </FormField>

          {/* Long Description */}
          <FormField
            label="Long Description"
            error={errors.longDescription?.message}
            required
            helperText={`${longDescriptionLength}/5000 characters`}
          >
            <Textarea
              {...register('longDescription')}
              placeholder="Detailed project description with features, challenges, and outcomes..."
              rows={8}
              maxLength={5000}
              disabled={isSubmitting || uploading}
            />
          </FormField>

          {/* Technologies */}
          <FormField
            label="Technologies"
            error={errors.technologies?.message}
            required
            helperText="Press Enter or comma to add tags"
          >
            <Controller
              name="technologies"
              control={control}
              render={({ field }) => (
                <TagsInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="e.g., React, TypeScript, Node.js"
                  disabled={isSubmitting || uploading}
                  maxTags={20}
                />
              )}
            />
          </FormField>

          {/* Live URL */}
          <FormField label="Live URL" error={errors.liveUrl?.message}>
            <Input
              {...register('liveUrl')}
              type="url"
              placeholder="https://example.com"
              disabled={isSubmitting || uploading}
            />
          </FormField>

          {/* GitHub URL */}
          <FormField label="GitHub URL" error={errors.githubUrl?.message}>
            <Input
              {...register('githubUrl')}
              type="url"
              placeholder="https://github.com/username/repo"
              disabled={isSubmitting || uploading}
            />
          </FormField>

          {/* Featured Toggle */}
          <FormField
            label="Featured Project"
            helperText="Featured projects appear on the home page"
          >
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register('featured')}
                disabled={isSubmitting || uploading}
                className="w-5 h-5 rounded border-foreground/20 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-all"
              />
              <span className="text-sm">Mark as featured</span>
            </label>
          </FormField>
        </div>
      </GlassCard>

      {/* Images Section */}
      <GlassCard>
        <Heading as="h3" className="mb-4">
          Project Images
        </Heading>

        {/* Existing Images (Edit Mode) */}
        {isEditMode && currentImages.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-medium mb-3">Current Images</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {currentImages.map((url, index) => (
                <GlassCard key={index} className="relative p-2 group">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-foreground/5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt={`Project ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(index)}
                    disabled={isSubmitting || uploading}
                    className="absolute -top-2 -right-2 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 disabled:opacity-50"
                    aria-label="Remove image"
                  >
                    ×
                  </button>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* New Image Upload */}
        <ImageUploadField
          previews={previews}
          onAddImages={(files) => addPreviews(files)}
          onRemoveImage={removePreview}
          uploading={uploading}
          uploadProgress={uploadProgress}
          error={uploadError}
          maxImages={10}
        />

        {errors.images && currentImages.length === 0 && previews.length === 0 && (
          <p className="text-sm text-red-500 mt-2">{errors.images.message}</p>
        )}
      </GlassCard>

      {/* Form Actions */}
      <div className="flex items-center gap-4">
        <Button
          type="submit"
          disabled={isSubmitting || uploading}
          className="min-w-[120px]"
        >
          {isSubmitting || uploading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              {uploading ? 'Uploading...' : 'Saving...'}
            </>
          ) : (
            <>{isEditMode ? 'Update Project' : 'Create Project'}</>
          )}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting || uploading}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
