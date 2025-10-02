/**
 * Image Optimization Utilities
 *
 * Client-side image optimization utilities for compressing and resizing images
 * before uploading to Firebase Storage.
 */

export interface ImageOptimizationOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number // 0-1
  outputFormat?: 'image/jpeg' | 'image/png' | 'image/webp'
}

const DEFAULT_OPTIONS: Required<ImageOptimizationOptions> = {
  maxWidth: 1920,
  maxHeight: 1080,
  quality: 0.8,
  outputFormat: 'image/jpeg',
}

/**
 * Load an image file as HTMLImageElement
 */
const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }

    img.src = url
  })
}

/**
 * Calculate new dimensions while maintaining aspect ratio
 */
const calculateDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } => {
  let width = originalWidth
  let height = originalHeight

  // Check if resize is needed
  if (width <= maxWidth && height <= maxHeight) {
    return { width, height }
  }

  // Calculate scaling factor
  const widthRatio = maxWidth / width
  const heightRatio = maxHeight / height
  const ratio = Math.min(widthRatio, heightRatio)

  width = Math.round(width * ratio)
  height = Math.round(height * ratio)

  return { width, height }
}

/**
 * Optimize an image file
 * @param file - Image file to optimize
 * @param options - Optimization options
 * @returns Optimized image as File
 */
export const optimizeImage = async (
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<File> => {
  const opts = { ...DEFAULT_OPTIONS, ...options }

  try {
    // Load image
    const img = await loadImage(file)

    // Calculate new dimensions
    const { width, height } = calculateDimensions(
      img.naturalWidth,
      img.naturalHeight,
      opts.maxWidth,
      opts.maxHeight
    )

    // Create canvas
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    // Draw image
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Failed to get canvas context')
    }

    ctx.drawImage(img, 0, 0, width, height)

    // Convert to blob
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (result) {
            resolve(result)
          } else {
            reject(new Error('Failed to create blob'))
          }
        },
        opts.outputFormat,
        opts.quality
      )
    })

    // Create file from blob
    const extension = opts.outputFormat.split('/')[1]
    const filename = file.name.replace(/\.[^/.]+$/, `.${extension}`)
    const optimizedFile = new File([blob], filename, {
      type: opts.outputFormat,
      lastModified: Date.now(),
    })

    return optimizedFile
  } catch (error) {
    console.error('Image optimization failed:', error)
    // Return original file if optimization fails
    return file
  }
}

/**
 * Optimize multiple images
 * @param files - Array of image files
 * @param options - Optimization options
 * @returns Array of optimized files
 */
export const optimizeImages = async (
  files: File[],
  options: ImageOptimizationOptions = {}
): Promise<File[]> => {
  const promises = files.map((file) => optimizeImage(file, options))
  return Promise.all(promises)
}

/**
 * Generate thumbnail for an image
 * @param file - Image file
 * @param size - Thumbnail size (width and height)
 * @returns Thumbnail as File
 */
export const generateThumbnail = async (file: File, size = 200): Promise<File> => {
  return optimizeImage(file, {
    maxWidth: size,
    maxHeight: size,
    quality: 0.7,
    outputFormat: 'image/jpeg',
  })
}

/**
 * Check if a file needs optimization
 * @param file - Image file
 * @param maxSize - Maximum file size in bytes
 * @returns True if optimization is needed
 */
export const needsOptimization = (file: File, maxSize = 1024 * 1024): boolean => {
  // Check file size
  if (file.size > maxSize) {
    return true
  }

  // Check if it's a PNG (could benefit from conversion to JPEG)
  if (file.type === 'image/png' && file.size > 500 * 1024) {
    return true
  }

  return false
}

/**
 * Get image dimensions
 * @param file - Image file
 * @returns Width and height
 */
export const getImageDimensions = async (
  file: File
): Promise<{ width: number; height: number }> => {
  const img = await loadImage(file)
  return {
    width: img.naturalWidth,
    height: img.naturalHeight,
  }
}

/**
 * Validate image dimensions
 * @param file - Image file
 * @param minWidth - Minimum width
 * @param minHeight - Minimum height
 * @param maxWidth - Maximum width
 * @param maxHeight - Maximum height
 * @returns Validation result
 */
export const validateImageDimensions = async (
  file: File,
  minWidth = 0,
  minHeight = 0,
  maxWidth = Infinity,
  maxHeight = Infinity
): Promise<{ valid: boolean; error: string | null; dimensions: { width: number; height: number } }> => {
  try {
    const { width, height } = await getImageDimensions(file)

    if (width < minWidth || height < minHeight) {
      return {
        valid: false,
        error: `Image dimensions must be at least ${minWidth}x${minHeight}px`,
        dimensions: { width, height },
      }
    }

    if (width > maxWidth || height > maxHeight) {
      return {
        valid: false,
        error: `Image dimensions must not exceed ${maxWidth}x${maxHeight}px`,
        dimensions: { width, height },
      }
    }

    return {
      valid: true,
      error: null,
      dimensions: { width, height },
    }
  } catch (error) {
    console.error('Failed to validate image dimensions:', error)
    return {
      valid: false,
      error: 'Failed to load image',
      dimensions: { width: 0, height: 0 },
    }
  }
}

/**
 * Create a data URL from an image file
 * @param file - Image file
 * @returns Data URL
 */
export const createImageDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to create data URL'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}
