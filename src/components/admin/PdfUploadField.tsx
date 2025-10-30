'use client'

import React, { useCallback } from 'react'
import { cn } from '@/lib/utils'
import { FiUpload, FiX, FiFileText } from 'react-icons/fi'
import { GlassCard } from '@/components/ui/GlassCard'

interface PdfUploadFieldProps {
  preview: { name: string; size: number } | null
  onFileSelect: (file: File | null) => void
  onRemove: () => void
  uploading?: boolean
  uploadProgress?: number
  error?: string | null
  className?: string
}

export function PdfUploadField({
  preview,
  onFileSelect,
  onRemove,
  uploading = false,
  uploadProgress = 0,
  error,
  className
}: PdfUploadFieldProps) {
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
        const file = e.dataTransfer.files[0]
        if (file.type === 'application/pdf') {
          onFileSelect(file)
        }
      }
    },
    [onFileSelect]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      if (e.target.files && e.target.files.length > 0) {
        onFileSelect(e.target.files[0])
      }
    },
    [onFileSelect]
  )

  const openFileDialog = () => {
    inputRef.current?.click()
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Zone */}
      {!preview && (
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
            accept="application/pdf"
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
                {dragActive ? 'Drop PDF here' : 'Upload Resume PDF'}
              </p>
              <p className="text-sm text-muted-foreground">
                Drag and drop or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports: PDF only (max 10MB)
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

      {/* PDF Preview */}
      {preview && (
        <GlassCard className="p-4">
          <div className="flex items-start gap-4">
            {/* PDF Icon */}
            <div className="p-3 rounded-lg bg-blue-500/20 shrink-0">
              <FiFileText size={32} className="text-blue-500" />
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate" title={preview.name}>
                {preview.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {(preview.size / (1024 * 1024)).toFixed(2)} MB
              </p>

              {/* Upload Progress */}
              {uploading && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Uploading...</span>
                    <span className="font-medium">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-foreground/10 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#00274C] to-[#E17000] transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Remove Button */}
            {!uploading && (
              <button
                onClick={onRemove}
                className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shrink-0"
                aria-label="Remove PDF"
              >
                <FiX size={20} />
              </button>
            )}
          </div>
        </GlassCard>
      )}

      {/* Empty State */}
      {!preview && !error && (
        <div className="text-center py-4">
          <FiFileText size={48} className="mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No PDF selected</p>
        </div>
      )}
    </div>
  )
}
