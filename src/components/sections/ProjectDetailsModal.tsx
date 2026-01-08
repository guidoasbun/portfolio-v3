'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import type { Project } from '@/types'
import {
  FiExternalLink,
  FiGithub,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProjectDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  project: Project | null
}

export function ProjectDetailsModal({
  isOpen,
  onClose,
  project,
}: ProjectDetailsModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!project) return null

  const {
    title,
    description,
    longDescription,
    technologies,
    images,
    liveUrl,
    githubUrl,
    category,
  } = project

  const hasMultipleImages = images.length > 1

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleImageDotClick = (index: number) => {
    setCurrentImageIndex(index)
  }

  // Reset image index when modal closes
  const handleClose = () => {
    setCurrentImageIndex(0)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      size="xl"
      closeOnBackdrop
      closeOnEsc
    >
      <ModalBody>
        {/* Image Carousel */}
        {images.length > 0 && (
          <div className={cn(
            "relative w-full h-64 sm:h-80 rounded-lg overflow-hidden mb-6",
            category === 'mobile' && "bg-foreground/5"
          )}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full"
              >
                <Image
                  src={images[currentImageIndex]}
                  alt={`${title} - Image ${currentImageIndex + 1}`}
                  fill
                  className={category === 'mobile' ? 'object-contain' : 'object-cover'}
                  sizes="(max-width: 768px) 100vw, 800px"
                  priority={currentImageIndex === 0}
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full glass-heavy hover:bg-foreground/20 transition-colors"
                  aria-label="Previous image"
                >
                  <FiChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full glass-heavy hover:bg-foreground/20 transition-colors"
                  aria-label="Next image"
                >
                  <FiChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            {/* Image Indicators */}
            {hasMultipleImages && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageDotClick(index)}
                    className={cn(
                      'w-2 h-2 rounded-full transition-all duration-300',
                      currentImageIndex === index
                        ? 'bg-white w-6'
                        : 'bg-white/50 hover:bg-white/75'
                    )}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Image Counter */}
            {hasMultipleImages && (
              <div className="absolute top-4 right-4 px-3 py-1 rounded-full glass-heavy text-white text-sm">
                {currentImageIndex + 1} / {images.length}
              </div>
            )}
          </div>
        )}

        {/* Category Badge */}
        <div className="mb-4">
          <span className="inline-block px-3 py-1 text-sm font-medium rounded-md bg-blue-500/20 text-blue-600 dark:text-blue-400 capitalize">
            {category}
          </span>
        </div>

        {/* Short Description */}
        <p className="text-foreground/80 mb-4">{description}</p>

        {/* Long Description */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">
            About This Project
          </h3>
          <div className="text-foreground/70 whitespace-pre-line leading-relaxed">
            {longDescription}
          </div>
        </div>

        {/* Technologies */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-3">
            Technologies Used
          </h3>
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1.5 rounded-lg glass-light text-foreground/80 text-sm font-medium border border-foreground/10 hover:glass-medium transition-all duration-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        {(liveUrl || githubUrl) && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Project Links
            </h3>
            <div className="flex flex-wrap gap-3">
              {liveUrl && (
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View live demo of ${title}`}
                >
                  <Button variant="primary" size="md">
                    <FiExternalLink className="mr-2 w-4 h-4" />
                    View Live Demo
                  </Button>
                </a>
              )}
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View GitHub repository for ${title}`}
                >
                  <Button variant="secondary" size="md">
                    <FiGithub className="mr-2 w-4 h-4" />
                    View on GitHub
                  </Button>
                </a>
              )}
            </div>
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        <Button variant="ghost" onClick={handleClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  )
}
