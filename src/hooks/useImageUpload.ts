/**
 * useImageUpload Hook
 *
 * React hook for managing image uploads with preview functionality.
 * Handles image validation, preview generation, and cleanup.
 */

import { useState, useCallback, useEffect } from 'react'
import { useStorage } from './useStorage'
import type { StoragePath } from '@/lib/firebase/storage'
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZES } from '@/lib/firebase/storage'

interface ImagePreview {
  file: File
  preview: string
  name: string
  size: number
}

interface UseImageUploadReturn {
  // Preview management
  previews: ImagePreview[]
  addPreviews: (files: FileList | File[]) => void
  removePreview: (index: number) => void
  clearPreviews: () => void

  // Upload management
  uploading: boolean
  uploadProgress: Record<number, number>
  uploadError: string | null
  uploadedUrls: string[]

  // Actions
  uploadImages: (path: StoragePath | string) => Promise<string[] | null>
  resetUpload: () => void

  // Validation
  validateImage: (file: File) => { valid: boolean; error: string | null }
}

/**
 * Hook for managing image uploads with previews
 */
export const useImageUpload = (): UseImageUploadReturn => {
  const [previews, setPreviews] = useState<ImagePreview[]>([])
  const { multipleUploadState, uploadFiles, resetMultipleUploadState, validateFile } =
    useStorage()

  // Clean up preview URLs on unmount
  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        URL.revokeObjectURL(preview.preview)
      })
    }
  }, [previews])

  // Validate image file
  const validateImage = useCallback(
    (file: File): { valid: boolean; error: string | null } => {
      return validateFile(file, ALLOWED_FILE_TYPES.IMAGES, MAX_FILE_SIZES.IMAGE)
    },
    [validateFile]
  )

  // Add image previews
  const addPreviews = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files)
      const validFiles: ImagePreview[] = []

      fileArray.forEach((file) => {
        const validation = validateImage(file)
        if (validation.valid) {
          const preview = URL.createObjectURL(file)
          validFiles.push({
            file,
            preview,
            name: file.name,
            size: file.size,
          })
        } else {
          console.warn(`Skipping invalid file ${file.name}: ${validation.error}`)
        }
      })

      setPreviews((prev) => [...prev, ...validFiles])
    },
    [validateImage]
  )

  // Remove preview by index
  const removePreview = useCallback((index: number) => {
    setPreviews((prev) => {
      const updated = [...prev]
      const removed = updated.splice(index, 1)[0]
      // Clean up object URL
      if (removed) {
        URL.revokeObjectURL(removed.preview)
      }
      return updated
    })
  }, [])

  // Clear all previews
  const clearPreviews = useCallback(() => {
    previews.forEach((preview) => {
      URL.revokeObjectURL(preview.preview)
    })
    setPreviews([])
  }, [previews])

  // Upload images
  const uploadImages = useCallback(
    async (path: StoragePath | string): Promise<string[] | null> => {
      if (previews.length === 0) {
        return null
      }

      const files = previews.map((p) => p.file)
      const urls = await uploadFiles(files, path)

      // Clear previews on successful upload
      if (urls) {
        clearPreviews()
      }

      return urls
    },
    [previews, uploadFiles, clearPreviews]
  )

  // Reset upload state
  const resetUpload = useCallback(() => {
    resetMultipleUploadState()
    clearPreviews()
  }, [resetMultipleUploadState, clearPreviews])

  return {
    // Preview management
    previews,
    addPreviews,
    removePreview,
    clearPreviews,

    // Upload management
    uploading: multipleUploadState.uploading,
    uploadProgress: multipleUploadState.progress,
    uploadError: multipleUploadState.error,
    uploadedUrls: multipleUploadState.urls,

    // Actions
    uploadImages,
    resetUpload,

    // Validation
    validateImage,
  }
}

/**
 * Hook for managing single image upload with preview
 */
export const useSingleImageUpload = (): {
  preview: ImagePreview | null
  setPreview: (file: File | null) => void
  clearPreview: () => void
  uploading: boolean
  uploadProgress: number
  uploadError: string | null
  uploadedUrl: string | null
  uploadImage: (path: StoragePath | string) => Promise<string | null>
  resetUpload: () => void
  validateImage: (file: File) => { valid: boolean; error: string | null }
} => {
  const [preview, setPreviewState] = useState<ImagePreview | null>(null)
  const { uploadState, uploadSingleFile, resetUploadState, validateFile } = useStorage()

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview.preview)
      }
    }
  }, [preview])

  // Validate image file
  const validateImage = useCallback(
    (file: File): { valid: boolean; error: string | null } => {
      return validateFile(file, ALLOWED_FILE_TYPES.IMAGES, MAX_FILE_SIZES.IMAGE)
    },
    [validateFile]
  )

  // Set preview
  const setPreview = useCallback(
    (file: File | null) => {
      // Clean up previous preview
      if (preview) {
        URL.revokeObjectURL(preview.preview)
      }

      if (!file) {
        setPreviewState(null)
        return
      }

      const validation = validateImage(file)
      if (!validation.valid) {
        console.warn(`Invalid file: ${validation.error}`)
        setPreviewState(null)
        return
      }

      const previewUrl = URL.createObjectURL(file)
      setPreviewState({
        file,
        preview: previewUrl,
        name: file.name,
        size: file.size,
      })
    },
    [preview, validateImage]
  )

  // Clear preview
  const clearPreview = useCallback(() => {
    if (preview) {
      URL.revokeObjectURL(preview.preview)
    }
    setPreviewState(null)
  }, [preview])

  // Upload image
  const uploadImage = useCallback(
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
    uploadImage,
    resetUpload,
    validateImage,
  }
}
