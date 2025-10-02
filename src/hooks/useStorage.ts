/**
 * useStorage Hook
 *
 * React hook for managing file uploads to Firebase Storage.
 * Provides state management, progress tracking, and error handling.
 */

import { useState, useCallback } from 'react'
import {
  uploadFile,
  deleteFile,
  uploadMultipleFiles,
  deleteMultipleFiles,
  validateFileType,
  validateFileSize,
  FileValidationError,
  type StoragePath,
  type UploadProgressCallback,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZES,
} from '@/lib/firebase/storage'

interface UploadState {
  uploading: boolean
  progress: number
  error: string | null
  url: string | null
}

interface MultipleUploadState {
  uploading: boolean
  progress: Record<number, number>
  error: string | null
  urls: string[]
}

export interface UseStorageReturn {
  // Single file upload
  uploadState: UploadState
  uploadSingleFile: (file: File, path: StoragePath | string) => Promise<string | null>
  deleteSingleFile: (fileUrl: string) => Promise<boolean>
  resetUploadState: () => void

  // Multiple files upload
  multipleUploadState: MultipleUploadState
  uploadFiles: (files: File[], path: StoragePath | string) => Promise<string[] | null>
  deleteFiles: (fileUrls: string[]) => Promise<boolean>
  resetMultipleUploadState: () => void

  // Validation
  validateFile: (
    file: File,
    allowedTypes?: readonly string[],
    maxSize?: number
  ) => { valid: boolean; error: string | null }
}

const initialUploadState: UploadState = {
  uploading: false,
  progress: 0,
  error: null,
  url: null,
}

const initialMultipleUploadState: MultipleUploadState = {
  uploading: false,
  progress: {},
  error: null,
  urls: [],
}

/**
 * Hook for managing Firebase Storage uploads
 */
export const useStorage = (): UseStorageReturn => {
  const [uploadState, setUploadState] = useState<UploadState>(initialUploadState)
  const [multipleUploadState, setMultipleUploadState] =
    useState<MultipleUploadState>(initialMultipleUploadState)

  // Reset single upload state
  const resetUploadState = useCallback(() => {
    setUploadState(initialUploadState)
  }, [])

  // Reset multiple upload state
  const resetMultipleUploadState = useCallback(() => {
    setMultipleUploadState(initialMultipleUploadState)
  }, [])

  // Validate file helper
  const validateFile = useCallback(
    (
      file: File,
      allowedTypes?: readonly string[],
      maxSize?: number
    ): { valid: boolean; error: string | null } => {
      try {
        // Determine defaults based on file type
        const types = allowedTypes || (file.type.startsWith('image/')
          ? ALLOWED_FILE_TYPES.IMAGES
          : ALLOWED_FILE_TYPES.DOCUMENTS)
        const size = maxSize || (file.type.startsWith('image/')
          ? MAX_FILE_SIZES.IMAGE
          : MAX_FILE_SIZES.DOCUMENT)

        validateFileType(file, types)
        validateFileSize(file, size)
        return { valid: true, error: null }
      } catch (error) {
        if (error instanceof FileValidationError) {
          return { valid: false, error: error.message }
        }
        return { valid: false, error: 'File validation failed' }
      }
    },
    []
  )

  // Upload single file
  const uploadSingleFile = useCallback(
    async (file: File, path: StoragePath | string): Promise<string | null> => {
      setUploadState({
        uploading: true,
        progress: 0,
        error: null,
        url: null,
      })

      try {
        const onProgress: UploadProgressCallback = (progress) => {
          setUploadState((prev) => ({ ...prev, progress }))
        }

        const url = await uploadFile(file, path, onProgress)

        setUploadState({
          uploading: false,
          progress: 100,
          error: null,
          url,
        })

        return url
      } catch (error) {
        const errorMessage =
          error instanceof FileValidationError
            ? error.message
            : 'Failed to upload file'

        setUploadState({
          uploading: false,
          progress: 0,
          error: errorMessage,
          url: null,
        })

        return null
      }
    },
    []
  )

  // Delete single file
  const deleteSingleFile = useCallback(async (fileUrl: string): Promise<boolean> => {
    try {
      await deleteFile(fileUrl)
      return true
    } catch (error) {
      console.error('Failed to delete file:', error)
      return false
    }
  }, [])

  // Upload multiple files
  const uploadFiles = useCallback(
    async (files: File[], path: StoragePath | string): Promise<string[] | null> => {
      setMultipleUploadState({
        uploading: true,
        progress: {},
        error: null,
        urls: [],
      })

      try {
        const onProgress = (fileIndex: number, progress: number) => {
          setMultipleUploadState((prev) => ({
            ...prev,
            progress: { ...prev.progress, [fileIndex]: progress },
          }))
        }

        const urls = await uploadMultipleFiles(files, path, onProgress)

        setMultipleUploadState({
          uploading: false,
          progress: {},
          error: null,
          urls,
        })

        return urls
      } catch (error) {
        const errorMessage =
          error instanceof FileValidationError
            ? error.message
            : 'Failed to upload files'

        setMultipleUploadState({
          uploading: false,
          progress: {},
          error: errorMessage,
          urls: [],
        })

        return null
      }
    },
    []
  )

  // Delete multiple files
  const deleteFiles = useCallback(async (fileUrls: string[]): Promise<boolean> => {
    try {
      await deleteMultipleFiles(fileUrls)
      return true
    } catch (error) {
      console.error('Failed to delete files:', error)
      return false
    }
  }, [])

  return {
    uploadState,
    uploadSingleFile,
    deleteSingleFile,
    resetUploadState,
    multipleUploadState,
    uploadFiles,
    deleteFiles,
    resetMultipleUploadState,
    validateFile,
  }
}
