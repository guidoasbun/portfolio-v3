'use client'

import React, { useState, useMemo } from 'react'
import { motion, type Variants } from 'framer-motion'
import { SkillCard } from '@/components/ui/SkillCard'
import { mockSkills } from '@/data/skills'
import type { Skill, SkillCategory } from '@/types'
import { cn } from '@/lib/utils'
import {
  FiCode,
  FiServer,
  FiDatabase,
  FiTool,
  FiLayout,
  FiGrid,
} from 'react-icons/fi'

interface SkillsSectionProps {
  skills?: Skill[]
}

type FilterType = 'all' | SkillCategory

interface CategoryFilter {
  label: string
  value: FilterType
  icon: React.ComponentType<{ className?: string }>
  description: string
}

const categories: CategoryFilter[] = [
  {
    label: 'All',
    value: 'all',
    icon: FiGrid,
    description: 'All skills',
  },
  {
    label: 'Frontend',
    value: 'frontend',
    icon: FiCode,
    description: 'UI & client-side',
  },
  {
    label: 'Backend',
    value: 'backend',
    icon: FiServer,
    description: 'Server & APIs',
  },
  {
    label: 'Database',
    value: 'database',
    icon: FiDatabase,
    description: 'Data management',
  },
  {
    label: 'Tools',
    value: 'tools',
    icon: FiTool,
    description: 'Dev tools & platforms',
  },
  {
    label: 'Design',
    value: 'design',
    icon: FiLayout,
    description: 'UI/UX design',
  },
]

export function SkillsSection({ skills = mockSkills }: SkillsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  // Filter skills by category
  const filteredSkills = useMemo(() => {
    if (activeFilter === 'all') {
      return skills
    }
    return skills.filter((skill) => skill.category === activeFilter)
  }, [activeFilter, skills])

  // Get count for each category
  const getCategoryCount = (filter: FilterType): number => {
    if (filter === 'all') return skills.length
    return skills.filter((skill) => skill.category === filter).length
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section id="skills" className="relative py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="max-w-7xl mx-auto"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Skills & Technologies
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Technologies and tools I work with to build modern web applications
            </p>
          </motion.div>

          {/* Filter Tabs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-3 mb-12"
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
                    'relative px-4 sm:px-6 py-3 rounded-lg font-medium transition-all duration-300',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-background',
                    isActive
                      ? 'glass-heavy text-foreground shadow-lg scale-105'
                      : 'glass-light text-foreground/70 hover:text-foreground hover:glass-medium'
                  )}
                  aria-label={`Filter by ${category.label}`}
                  aria-pressed={isActive}
                  title={category.description}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{category.label}</span>
                    <span className="sm:hidden">{category.label.slice(0, 3)}</span>
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
                      layoutId="activeSkillTab"
                      className="absolute inset-0 border-2 border-blue-500 rounded-lg -z-10"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              )
            })}
          </motion.div>

          {/* Skills Grid */}
          <div className="mb-8">
            {filteredSkills.length > 0 ? (
              <motion.div
                key={activeFilter}
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4"
              >
                {filteredSkills.map((skill, index) => (
                  <SkillCard key={skill.id} skill={skill} index={index} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 glass rounded-xl"
              >
                <p className="text-foreground/60 text-lg">
                  No skills found in this category.
                </p>
              </motion.div>
            )}
          </div>

          {/* Show count of filtered results */}
          {filteredSkills.length > 0 && (
            <motion.div
              variants={itemVariants}
              className="text-center text-sm text-foreground/60"
            >
              Showing {filteredSkills.length}{' '}
              {filteredSkills.length === 1 ? 'skill' : 'skills'}
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
