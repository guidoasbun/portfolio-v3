'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { IoCloseOutline, IoChevronBack, IoChevronForward, IoDownloadOutline } from 'react-icons/io5'
import Image from 'next/image'

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  images: string[]
  initialIndex?: number
  alt?: string
  showDownload?: boolean
  onDownload?: (imageUrl: string, index: number) => void
}

export function ImageModal({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  alt = 'Image',
  showDownload = true,
  onDownload
}: ImageModalProps) {
  const [mounted, setMounted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [isLoading, setIsLoading] = useState(true)

  // Handle portal mounting
  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  // Reset index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
      setIsLoading(true)
    }
  }, [isOpen, initialIndex])

  // Navigation handlers (defined before useEffect that uses them)
  const handlePrevious = useCallback(() => {
    setIsLoading(true)
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  const handleNext = useCallback(() => {
    setIsLoading(true)
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }, [images.length])

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        handlePrevious()
      } else if (e.key === 'ArrowRight') {
        handleNext()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose, handleNext, handlePrevious])

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [isOpen])

  const handleDownload = () => {
    if (onDownload) {
      onDownload(images[currentIndex], currentIndex)
    } else {
      // Default download behavior
      const link = document.createElement('a')
      link.href = images[currentIndex]
      link.download = `image-${currentIndex + 1}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const modalContent = (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={handleBackdropClick}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90"
          />

          {/* Content */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={onClose}
              className={cn(
                'absolute top-4 right-4 z-10 p-2 rounded-lg',
                'bg-black/50 backdrop-blur-sm border border-white/20',
                'text-white hover:bg-black/70 transition-colors'
              )}
              aria-label="Close image viewer"
            >
              <IoCloseOutline className="w-6 h-6" />
            </button>

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                <div className="px-4 py-2 rounded-lg bg-black/50 backdrop-blur-sm border border-white/20">
                  <p className="text-white text-sm font-medium">
                    {currentIndex + 1} / {images.length}
                  </p>
                </div>
              </div>
            )}

            {/* Download Button */}
            {showDownload && (
              <button
                onClick={handleDownload}
                className={cn(
                  'absolute top-4 left-4 z-10 p-2 rounded-lg',
                  'bg-black/50 backdrop-blur-sm border border-white/20',
                  'text-white hover:bg-black/70 transition-colors'
                )}
                aria-label="Download image"
              >
                <IoDownloadOutline className="w-6 h-6" />
              </button>
            )}

            {/* Navigation Buttons */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className={cn(
                    'absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full',
                    'bg-black/50 backdrop-blur-sm border border-white/20',
                    'text-white hover:bg-black/70 transition-all',
                    'hover:scale-110 active:scale-95'
                  )}
                  aria-label="Previous image"
                >
                  <IoChevronBack className="w-6 h-6" />
                </button>

                <button
                  onClick={handleNext}
                  className={cn(
                    'absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full',
                    'bg-black/50 backdrop-blur-sm border border-white/20',
                    'text-white hover:bg-black/70 transition-all',
                    'hover:scale-110 active:scale-95'
                  )}
                  aria-label="Next image"
                >
                  <IoChevronForward className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative max-w-7xl max-h-[90vh] w-full"
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src={images[currentIndex]}
                    alt={`${alt} ${currentIndex + 1}`}
                    width={1920}
                    height={1080}
                    className={cn(
                      'max-w-full max-h-[90vh] w-auto h-auto object-contain',
                      'rounded-lg shadow-2xl',
                      isLoading && 'opacity-0'
                    )}
                    onLoad={() => setIsLoading(false)}
                    priority
                  />
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  if (!mounted) return null

  return createPortal(modalContent, document.body)
}
