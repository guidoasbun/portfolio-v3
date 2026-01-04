'use client'

import React, { useState, useMemo } from 'react'
import { ProjectCard } from '@/components/ui/ProjectCard'
import { ProjectDetailsModal } from '@/components/sections/ProjectDetailsModal'
import { mockProjects } from '@/data/projects'
import type { Project, ProjectCategory } from '@/types'
import { cn } from '@/lib/utils'
import { useAnalytics } from '@/hooks/useAnalytics'

interface ProjectsSectionProps {
  projects?: Project[]
}

type FilterCategory = 'all' | ProjectCategory

const categories: { label: string; value: FilterCategory }[] = [
  { label: 'All Projects', value: 'all' },
  { label: 'Web', value: 'web' },
  { label: 'Mobile', value: 'mobile' },
  { label: 'Desktop', value: 'desktop' },
  { label: 'AI/ML', value: 'ai' },
  { label: 'Other', value: 'other' },
]

export function ProjectsSection({ projects = mockProjects }: ProjectsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { trackEvent } = useAnalytics()

  // Filter projects based on active category
  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') {
      return projects
    }
    return projects.filter((project) => project.category === activeCategory)
  }, [activeCategory, projects])

  // Get count for each category
  const getCategoryCount = (category: FilterCategory): number => {
    if (category === 'all') return projects.length
    return projects.filter((project) => project.category === category).length
  }

  const handleProjectClick = (project: Project) => {
    // Track project view
    trackEvent('project_view', {
      project_id: project.id,
      project_title: project.title,
      project_category: project.category,
    })

    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const handleCategoryChange = (category: FilterCategory) => {
    // Track filter change
    trackEvent('project_filter_change', {
      filter_type: 'category',
      filter_value: category,
    })

    setActiveCategory(category)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    // Delay clearing selected project until modal animation completes
    setTimeout(() => {
      setSelectedProject(null)
    }, 300)
  }

  return (
    <section id="projects" className="relative py-12 sm:py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-10 lg:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-[#00274C] to-[#E17000] bg-clip-text text-transparent">
              Projects
            </h2>
            <p className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto px-4 sm:px-0">
              Explore my latest work and side projects. Each project showcases
              different technologies and problem-solving approaches.
            </p>
          </div>

          {/* Filter Tabs - Static, no animations */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 lg:mb-12 px-2 sm:px-0">
            {categories.map((category) => {
              const count = getCategoryCount(category.value)
              const isActive = activeCategory === category.value

              // Don't show category if there are no projects in it (except 'all')
              if (count === 0 && category.value !== 'all') {
                return null
              }

              return (
                <button
                  key={category.value}
                  onClick={() => handleCategoryChange(category.value)}
                  className={cn(
                    'relative px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-all duration-300',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    'min-h-[44px] text-sm sm:text-base',
                    isActive
                      ? 'glass-heavy text-foreground shadow-lg border-2 border-blue-500'
                      : 'glass-light text-foreground/70 hover:text-foreground hover:glass-medium'
                  )}
                  aria-label={`Filter by ${category.label}`}
                  aria-pressed={isActive}
                >
                  <span className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
                    {category.label}
                    <span
                      className={cn(
                        'text-xs px-1.5 sm:px-2 py-0.5 rounded-full',
                        isActive
                          ? 'bg-blue-500 text-white'
                          : 'bg-foreground/10 text-foreground/60'
                      )}
                    >
                      {count}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>

          {/* Projects Grid - No motion wrappers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onClick={() => handleProjectClick(project)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-foreground/60 text-lg">
                  No projects found in this category.
                </p>
              </div>
            )}
          </div>

          {/* Show count of filtered results */}
          {filteredProjects.length > 0 && (
            <div className="text-center mt-8 text-sm text-foreground/60">
              Showing {filteredProjects.length}{' '}
              {filteredProjects.length === 1 ? 'project' : 'projects'}
              {activeCategory !== 'all' && (
                <> in {categories.find((c) => c.value === activeCategory)?.label}</>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Project Details Modal */}
      <ProjectDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        project={selectedProject}
      />
    </section>
  )
}
