/**
 * usePdfUpload Hook
 *
 * React hook for managing PDF file uploads with preview functionality.
 * Handles PDF validation, preview generation, and cleanup.
 */

import { useState, useCallback, useEffect } from 'react'
import { useStorage } from './useStorage'
import type { StoragePath } from '@/lib/firebase/storage'
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZES } from '@/lib/firebase/storage'

interface PdfPreview {
  file: File
  name: string
  size: number
}

interface UsePdfUploadReturn {
  // Preview management
  preview: PdfPreview | null
  setPreview: (file: File | null) => void
  clearPreview: () => void

  // Upload management
  uploading: boolean
  uploadProgress: number
  uploadError: string | null
  uploadedUrl: string | null

  // Actions
  uploadPdf: (path: StoragePath | string) => Promise<string | null>
  resetUpload: () => void

  // Validation
  validatePdf: (file: File) => { valid: boolean; error: string | null }
}

/**
 * Hook for managing single PDF upload with preview
 */
export const usePdfUpload = (): UsePdfUploadReturn => {
  const [preview, setPreviewState] = useState<PdfPreview | null>(null)
  const { uploadState, uploadSingleFile, resetUploadState, validateFile } = useStorage()

  // Clean up on unmount
  useEffect(() => {
    return () => {
      // No URL cleanup needed for PDF (no object URL created)
    }
  }, [])

  // Validate PDF file
  const validatePdf = useCallback(
    (file: File): { valid: boolean; error: string | null } => {
      return validateFile(file, ALLOWED_FILE_TYPES.DOCUMENTS, MAX_FILE_SIZES.DOCUMENT)
    },
    [validateFile]
  )

  // Set preview
  const setPreview = useCallback(
    (file: File | null) => {
      if (!file) {
        setPreviewState(null)
        return
      }

      const validation = validatePdf(file)
      if (!validation.valid) {
        console.warn(`Invalid file: ${validation.error}`)
        setPreviewState(null)
        return
      }

      setPreviewState({
        file,
        name: file.name,
        size: file.size,
      })
    },
    [validatePdf]
  )

  // Clear preview
  const clearPreview = useCallback(() => {
    setPreviewState(null)
  }, [])

  // Upload PDF
  const uploadPdf = useCallback(
    async (path: StoragePath | string): Promise<string | null> => {
      if (!preview) {
        return null
      }

      const url = await uploadSingleFile(preview.file, path)

      // Clear preview on successful upload
      if (url) {
        clearPreview()
      }

      return url
    },
    [preview, uploadSingleFile, clearPreview]
  )

  // Reset upload state
  const resetUpload = useCallback(() => {
    resetUploadState()
    clearPreview()
  }, [resetUploadState, clearPreview])

  return {
    preview,
    setPreview,
    clearPreview,
    uploading: uploadState.uploading,
    uploadProgress: uploadState.progress,
    uploadError: uploadState.error,
    uploadedUrl: uploadState.url,
    uploadPdf,
    resetUpload,
    validatePdf,
  }
}
