'use client'

import React, { useState, useMemo } from 'react'
import { motion, type Variants } from 'framer-motion'
import { TimelineItem } from '@/components/ui/TimelineItem'
import type { Experience, ExperienceType } from '@/types'
import { cn } from '@/lib/utils'
import { FiBriefcase, FiAward, FiBookOpen, FiGrid } from 'react-icons/fi'

interface ExperienceSectionProps {
  experiences?: Experience[]
}

type FilterType = 'all' | ExperienceType

interface CategoryFilter {
  label: string
  value: FilterType
  icon: React.ComponentType<{ className?: string }>
}

const categories: CategoryFilter[] = [
  { label: 'All', value: 'all', icon: FiGrid },
  { label: 'Work', value: 'work', icon: FiBriefcase },
  { label: 'Internships', value: 'internship', icon: FiAward },
  { label: 'Education', value: 'education', icon: FiBookOpen },
]

export function ExperienceSection({ experiences = [] }: ExperienceSectionProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  // Filter and sort experiences
  const filteredExperiences = useMemo(() => {
    const filtered =
      activeFilter === 'all'
        ? experiences
        : experiences.filter((exp: Experience) => exp.type === activeFilter)

    // Sort: current experiences first, then by start date descending
    return [...filtered].sort((a, b) => {
      if (a.current && !b.current) return -1
      if (!a.current && b.current) return 1
      const aDate = new Date(a.startDate)
      const bDate = new Date(b.startDate)
      return bDate.getTime() - aDate.getTime()
    })
  }, [activeFilter, experiences])

  // Get count for each category
  const getCategoryCount = (filter: FilterType): number => {
    if (filter === 'all') return experiences.length
    return experiences.filter((exp: Experience) => exp.type === filter).length
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  return (
    <section id="experience" className="relative py-12 sm:py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="max-w-5xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-[#00274C] to-[#E17000] bg-clip-text text-transparent">
              Experience
            </h2>
            <p className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto px-4 sm:px-0">
              My professional journey, education, and career milestones
            </p>
          </motion.div>

          {/* Filter Tabs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 lg:mb-12 px-2 sm:px-0"
          >
            {categories.map((category) => {
              const count = getCategoryCount(category.value)
              const isActive = activeFilter === category.value
              const Icon = category.icon

              // Don't show category if there are no items in it (except 'all')
              if (count === 0 && category.value !== 'all') {
                return null
              }

              return (
                <button
                  key={category.value}
                  onClick={() => setActiveFilter(category.value)}
                  className={cn(
                    'relative px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium transition-all duration-300',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background',
                    isActive
                      ? 'glass-heavy text-foreground shadow-lg scale-105'
                      : 'glass-light text-foreground/70 hover:text-foreground hover:glass-medium'
                  )}
                  aria-label={`Filter by ${category.label}`}
                  aria-pressed={isActive}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {category.label}
                    <span
                      className={cn(
                        'text-xs px-2 py-0.5 rounded-full',
                        isActive
                          ? 'bg-blue-500 text-white'
                          : 'bg-foreground/10 text-foreground/60'
                      )}
                    >
                      {count}
                    </span>
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeExperienceTab"
                      className="absolute inset-0 border-2 border-blue-500 rounded-lg -z-10"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              )
            })}
          </motion.div>

          {/* Timeline */}
          <motion.div variants={itemVariants} className="relative">
            {filteredExperiences.length > 0 ? (
              <div className="space-y-0">
                {filteredExperiences.map((experience, index) => (
                  <TimelineItem
                    key={experience.id}
                    experience={experience}
                    index={index}
                    isLast={index === filteredExperiences.length - 1}
                  />
                ))}
              </div>
            ) : (
              <motion.div
                variants={itemVariants}
                className="text-center py-12 glass rounded-xl"
              >
                <p className="text-foreground/60 text-lg">
                  No experiences found in this category.
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Show count of filtered results */}
          {filteredExperiences.length > 0 && (
            <motion.div
              variants={itemVariants}
              className="text-center mt-8 text-sm text-foreground/60"
            >
              Showing {filteredExperiences.length}{' '}
              {filteredExperiences.length === 1 ? 'experience' : 'experiences'}
              {activeFilter !== 'all' && (
                <>
                  {' '}
                  in {categories.find((c) => c.value === activeFilter)?.label.toLowerCase()}
                </>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
