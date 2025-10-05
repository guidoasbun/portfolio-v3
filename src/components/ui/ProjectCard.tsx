'use client'

import React, { memo } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import type { Project } from '@/types'
import { FiExternalLink, FiGithub, FiStar } from 'react-icons/fi'
import { cn } from '@/lib/utils'
import { getCategoryBlurDataURL } from '@/lib/image-blur'

interface ProjectCardProps {
  project: Project
  onClick?: () => void
  className?: string
}

function ProjectCardComponent({ project, onClick, className }: ProjectCardProps) {
  const {
    title,
    description,
    technologies,
    images,
    liveUrl,
    githubUrl,
    featured,
    category,
  } = project

  // Get first image or use fallback gradient
  const primaryImage = images[0]

  const handleCardClick = () => {
    if (onClick) {
      onClick()
    }
  }

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    url: string
  ) => {
    e.stopPropagation()
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <GlassCard
      variant="light"
      hover
      className={cn(
        'group cursor-pointer overflow-hidden h-full flex flex-col',
        className
      )}
      onClick={handleCardClick}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 right-4 z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-semibold shadow-lg"
          >
            <FiStar className="w-3 h-3" />
            Featured
          </motion.div>
        </div>
      )}

      {/* Project Image */}
      <div className="relative w-full h-48 overflow-hidden rounded-t-xl">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={title}
            fill
            loading="lazy"
            placeholder="blur"
            blurDataURL={getCategoryBlurDataURL(category)}
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 opacity-70" />
        )}
        {/* Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Category Badge */}
        <div className="mb-3">
          <span className="inline-block px-2 py-1 text-xs font-medium rounded-md bg-blue-500/20 text-blue-600 dark:text-blue-400 capitalize">
            {category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-1 group-hover:text-blue-500 transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm text-foreground/70 mb-4 line-clamp-2 flex-1">
          {description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {technologies.slice(0, 4).map((tech, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 rounded-md bg-foreground/5 text-foreground/60 border border-foreground/10"
            >
              {tech}
            </span>
          ))}
          {technologies.length > 4 && (
            <span className="text-xs px-2 py-1 text-foreground/60">
              +{technologies.length - 4} more
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          {liveUrl && (
            <a
              href={liveUrl}
              onClick={(e) => handleLinkClick(e, liveUrl)}
              className="flex-1"
              aria-label={`View live demo of ${title}`}
            >
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <FiExternalLink className="mr-2 w-4 h-4" />
                Live Demo
              </Button>
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              onClick={(e) => handleLinkClick(e, githubUrl)}
              aria-label={`View GitHub repository for ${title}`}
            >
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => e.stopPropagation()}
              >
                <FiGithub className="w-4 h-4" />
              </Button>
            </a>
          )}
        </div>

        {/* Click to view details hint */}
        <div className="mt-3 text-center">
          <span className="text-xs text-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Click to view details
          </span>
        </div>
      </div>
    </GlassCard>
  )
}

// Memoize component to prevent unnecessary re-renders
export const ProjectCard = memo(ProjectCardComponent)
