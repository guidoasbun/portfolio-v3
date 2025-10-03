'use client'

import React, { useCallback } from 'react'
import { cn } from '@/lib/utils'
import { FiUpload, FiX, FiImage } from 'react-icons/fi'
import { GlassCard } from '@/components/ui/GlassCard'
import Image from 'next/image'

interface ImageUploadFieldProps {
  previews: Array<{ preview: string; name: string; size: number }>
  onAddImages: (files: FileList) => void
  onRemoveImage: (index: number) => void
  uploading?: boolean
  uploadProgress?: Record<number, number>
  error?: string | null
  maxImages?: number
  className?: string
}

export function ImageUploadField({
  previews,
  onAddImages,
  onRemoveImage,
  uploading = false,
  uploadProgress = {},
  error,
  maxImages,
  className
}: ImageUploadFieldProps) {
  const [dragActive, setDragActive] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        onAddImages(e.dataTransfer.files)
      }
    },
    [onAddImages]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      if (e.target.files && e.target.files.length > 0) {
        onAddImages(e.target.files)
      }
    },
    [onAddImages]
  )

  const openFileDialog = () => {
    inputRef.current?.click()
  }

  const isMaxReached = maxImages !== undefined && previews.length >= maxImages

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Zone */}
      {!isMaxReached && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
          className={cn(
            'glass rounded-lg border-2 border-dashed border-foreground/20 p-8 text-center cursor-pointer transition-all duration-300',
            'hover:glass-heavy hover:border-blue-500/50',
            dragActive && 'glass-heavy border-blue-500',
            uploading && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleChange}
            className="hidden"
            disabled={uploading}
          />
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 rounded-full bg-blue-500/20">
              <FiUpload size={32} className="text-blue-500" />
            </div>
            <div>
              <p className="text-lg font-medium mb-1">
                {dragActive ? 'Drop images here' : 'Upload Images'}
              </p>
              <p className="text-sm text-muted-foreground">
                Drag and drop or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports: JPG, PNG, WebP, GIF (max 5MB)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <GlassCard className="border-red-500/20 bg-red-500/10">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </GlassCard>
      )}

      {/* Image Previews */}
      {previews.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              {previews.length} {previews.length === 1 ? 'Image' : 'Images'}
              {maxImages && ` (max ${maxImages})`}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <GlassCard key={index} className="relative p-2 group">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-foreground/5">
                  <Image
                    src={preview.preview}
                    alt={preview.name}
                    fill
                    className="object-cover"
                  />
                  {/* Progress Overlay */}
                  {uploading && uploadProgress[index] !== undefined && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-white text-sm font-medium">
                        {uploadProgress[index]}%
                      </div>
                    </div>
                  )}
                </div>
                {/* Remove Button */}
                {!uploading && (
                  <button
                    onClick={() => onRemoveImage(index)}
                    className="absolute -top-2 -right-2 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                    aria-label="Remove image"
                  >
                    <FiX size={16} />
                  </button>
                )}
                {/* File Info */}
                <div className="mt-2">
                  <p className="text-xs truncate" title={preview.name}>
                    {preview.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(preview.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {previews.length === 0 && !isMaxReached && (
        <div className="text-center py-4">
          <FiImage size={48} className="mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No images added yet</p>
        </div>
      )}

      {/* Max Reached Message */}
      {isMaxReached && (
        <GlassCard className="border-yellow-500/20 bg-yellow-500/10">
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            Maximum number of images reached ({maxImages})
          </p>
        </GlassCard>
      )}
    </div>
  )
}
