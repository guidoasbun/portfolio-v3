/**
 * Firebase Storage Service
 *
 * This file provides utilities for file uploads, downloads, and management
 * in Firebase Storage. Includes image optimization and validation.
 */

import type {
  StorageReference,
  UploadTask,
  UploadTaskSnapshot,
} from 'firebase/storage'
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { storage } from './config'

/**
 * Storage paths as constants
 */
export const STORAGE_PATHS = {
  PROJECTS: 'projects',
  RESUME: 'resume',
  PROFILE: 'profile',
  TEMP: 'temp',
} as const

export type StoragePath = typeof STORAGE_PATHS[keyof typeof STORAGE_PATHS]

/**
 * Allowed file types for uploads
 */
export const ALLOWED_FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  DOCUMENTS: ['application/pdf'],
  ALL: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'],
} as const

/**
 * Maximum file sizes (in bytes)
 */
export const MAX_FILE_SIZES = {
  IMAGE: 5 * 1024 * 1024, // 5MB
  DOCUMENT: 10 * 1024 * 1024, // 10MB
} as const

/**
 * File validation error
 */
export class FileValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FileValidationError'
  }
}

/**
 * Validate file type
 */
export const validateFileType = (file: File, allowedTypes: readonly string[]): void => {
  if (!allowedTypes.includes(file.type)) {
    throw new FileValidationError(
      `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`
    )
  }
}

/**
 * Validate file size
 */
export const validateFileSize = (file: File, maxSize: number): void => {
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2)
    throw new FileValidationError(`File size exceeds ${maxSizeMB}MB limit`)
  }
}

/**
 * Generate a unique filename
 */
export const generateUniqueFilename = (originalFilename: string): string => {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 9)
  const extension = originalFilename.split('.').pop()
  const nameWithoutExtension = originalFilename.replace(/\.[^/.]+$/, '')

  // Sanitize filename (remove special characters)
  const sanitized = nameWithoutExtension.replace(/[^a-zA-Z0-9-_]/g, '_')

  return `${sanitized}_${timestamp}_${randomString}.${extension}`
}

/**
 * Get storage reference for a file path
 */
export const getStorageRef = (path: string): StorageReference => {
  return ref(storage, path)
}

/**
 * Upload progress callback type
 */
export type UploadProgressCallback = (progress: number) => void

/**
 * Upload a file to Firebase Storage
 * @param file - File to upload
 * @param path - Storage path (folder)
 * @param onProgress - Optional progress callback
 * @returns Download URL of the uploaded file
 */
export const uploadFile = async (
  file: File,
  path: StoragePath | string,
  onProgress?: UploadProgressCallback
): Promise<string> => {
  try {
    // Validate file
    if (file.type.startsWith('image/')) {
      validateFileType(file, ALLOWED_FILE_TYPES.IMAGES)
      validateFileSize(file, MAX_FILE_SIZES.IMAGE)
    } else {
      validateFileType(file, ALLOWED_FILE_TYPES.DOCUMENTS)
      validateFileSize(file, MAX_FILE_SIZES.DOCUMENT)
    }

    // Generate unique filename
    const filename = generateUniqueFilename(file.name)
    const fullPath = `${path}/${filename}`

    // Create storage reference
    const storageRef = getStorageRef(fullPath)

    // Upload file with progress tracking
    if (onProgress) {
      const uploadTask: UploadTask = uploadBytesResumable(storageRef, file)

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot: UploadTaskSnapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            onProgress(Math.round(progress))
          },
          (error) => {
            console.error('Upload error:', error)
            reject(new Error('File upload failed'))
          },
          async () => {
            try {
              const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref)
              resolve(downloadUrl)
            } catch {
              reject(new Error('Failed to get download URL'))
            }
          }
        )
      })
    } else {
      // Simple upload without progress tracking
      await uploadBytes(storageRef, file)
      const downloadUrl = await getDownloadURL(storageRef)
      return downloadUrl
    }
  } catch (error) {
    if (error instanceof FileValidationError) {
      throw error
    }
    console.error('Upload error:', error)
    throw new Error('Failed to upload file')
  }
}

/**
 * Delete a file from Firebase Storage
 * @param fileUrl - Download URL or full path of the file
 */
export const deleteFile = async (fileUrl: string): Promise<void> => {
  try {
    // Extract path from URL if it's a download URL
    let path = fileUrl

    if (fileUrl.includes('firebasestorage.googleapis.com')) {
      // Extract path from Firebase Storage URL
      const urlParts = fileUrl.split('/o/')
      if (urlParts.length > 1) {
        const encodedPath = urlParts[1].split('?')[0]
        path = decodeURIComponent(encodedPath)
      }
    }

    const storageRef = getStorageRef(path)
    await deleteObject(storageRef)
  } catch (error) {
    console.error('Delete error:', error)
    throw new Error('Failed to delete file')
  }
}

/**
 * Get download URL for a file
 * @param path - Storage path of the file
 * @returns Download URL
 */
export const getFileUrl = async (path: string): Promise<string> => {
  try {
    const storageRef = getStorageRef(path)
    const downloadUrl = await getDownloadURL(storageRef)
    return downloadUrl
  } catch (error) {
    console.error('Error getting download URL:', error)
    throw new Error('Failed to get file URL')
  }
}

/**
 * Upload multiple files
 * @param files - Array of files to upload
 * @param path - Storage path (folder)
 * @param onProgress - Optional progress callback for each file
 * @returns Array of download URLs
 */
export const uploadMultipleFiles = async (
  files: File[],
  path: StoragePath | string,
  onProgress?: (fileIndex: number, progress: number) => void
): Promise<string[]> => {
  try {
    const uploadPromises = files.map((file, index) => {
      return uploadFile(
        file,
        path,
        onProgress ? (progress) => onProgress(index, progress) : undefined
      )
    })

    const downloadUrls = await Promise.all(uploadPromises)
    return downloadUrls
  } catch (error) {
    console.error('Multiple upload error:', error)
    throw new Error('Failed to upload files')
  }
}

/**
 * Delete multiple files
 * @param fileUrls - Array of file URLs or paths
 */
export const deleteMultipleFiles = async (fileUrls: string[]): Promise<void> => {
  try {
    const deletePromises = fileUrls.map((url) => deleteFile(url))
    await Promise.all(deletePromises)
  } catch {
    throw new Error('Failed to delete files')
  }
}

/**
 * Helper to check if a file is an image
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/')
}

/**
 * Helper to check if a file is a PDF
 */
export const isPdfFile = (file: File): boolean => {
  return file.type === 'application/pdf'
}

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}
