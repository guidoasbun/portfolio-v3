'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { FormField } from '@/components/ui/FormField'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'
import { Heading } from '@/components/ui/Heading'
import { PdfUploadField } from './PdfUploadField'
import { usePdfUpload } from '@/hooks/usePdfUpload'
import { STORAGE_PATHS } from '@/lib/firebase/storage'
import { FiUpload, FiX } from 'react-icons/fi'

interface ResumeUploadFormData {
  version: string
  active: boolean
}

const uploadFormSchema = yup.object({
  version: yup
    .string()
    .required('Version is required')
    .min(1, 'Version must not be empty')
    .max(50, 'Version must be less than 50 characters')
    .trim(),
  active: yup.boolean().required(),
})

interface ResumeUploadFormProps {
  onSubmit: (data: {
    filename: string
    originalName: string
    fileUrl: string
    version: string
    active: boolean
  }) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function ResumeUploadForm({
  onSubmit,
  onCancel,
  isSubmitting = false
}: ResumeUploadFormProps) {
  const [uploadError, setUploadError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<ResumeUploadFormData>({
    resolver: yupResolver(uploadFormSchema),
    defaultValues: {
      version: '',
      active: false
    }
  })

  const {
    preview,
    setPreview,
    clearPreview,
    uploading,
    uploadProgress,
    uploadError: pdfUploadError,
    uploadPdf,
    resetUpload
  } = usePdfUpload()

  const handleFileSelect = (file: File | null) => {
    setUploadError(null)
    setPreview(file)
  }

  const handleFormSubmit = async (data: ResumeUploadFormData) => {
    if (!preview) {
      setUploadError('Please select a PDF file')
      return
    }

    try {
      setUploadError(null)

      // Upload the PDF to Firebase Storage
      const fileUrl = await uploadPdf(STORAGE_PATHS.RESUME)

      if (!fileUrl) {
        throw new Error('Failed to upload PDF file')
      }

      // Submit the form with the uploaded file URL
      await onSubmit({
        filename: preview.file.name,
        originalName: preview.file.name,
        fileUrl,
        version: data.version,
        active: data.active
      })

      // Reset form on success
      clearPreview()
      resetUpload()
    } catch (error) {
      console.error('Error submitting resume:', error)
      setUploadError(
        error instanceof Error ? error.message : 'Failed to upload resume'
      )
    }
  }

  const isActive = watch('active')

  return (
    <GlassCard className="p-6">
      <div className="mb-6">
        <Heading as="h3" className="mb-2">
          Upload New Resume
        </Heading>
        <p className="text-sm text-muted-foreground">
          Upload a PDF file and set the version information
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* PDF Upload Field */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Resume PDF <span className="text-red-500">*</span>
          </label>
          <PdfUploadField
            preview={preview}
            onFileSelect={handleFileSelect}
            onRemove={clearPreview}
            uploading={uploading}
            uploadProgress={uploadProgress}
            error={pdfUploadError || uploadError}
          />
        </div>

        {/* Version Input */}
        <FormField
          label="Version"
          error={errors.version?.message}
          required
        >
          <Input
            {...register('version')}
            placeholder="e.g., v2.1, 2024-Q1, Latest"
            disabled={isSubmitting || uploading}
          />
        </FormField>

        {/* Active Toggle */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="active"
            {...register('active')}
            className="w-4 h-4 rounded border-foreground/20 bg-transparent checked:bg-blue-500 focus:ring-2 focus:ring-blue-500/50"
            disabled={isSubmitting || uploading}
          />
          <label htmlFor="active" className="text-sm font-medium cursor-pointer">
            Set as active resume
          </label>
        </div>

        {isActive && (
          <GlassCard className="border-yellow-500/20 bg-yellow-500/10 p-3">
            <p className="text-xs text-yellow-600 dark:text-yellow-400">
              Setting this as active will deactivate all other resumes
            </p>
          </GlassCard>
        )}

        {/* Form Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSubmitting || uploading || !preview}
            className="flex-1"
          >
            <FiUpload size={18} />
            {uploading ? `Uploading... ${uploadProgress}%` : isSubmitting ? 'Saving...' : 'Upload Resume'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onCancel}
            disabled={isSubmitting || uploading}
          >
            <FiX size={18} />
            Cancel
          </Button>
        </div>
      </form>
    </GlassCard>
  )
}
