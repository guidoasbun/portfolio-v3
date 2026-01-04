'use client'

import { ProjectCard } from '@/components/ui/ProjectCard'
import { mockProjects } from '@/data/projects'
import type { Project } from '@/types'

interface ProjectsSectionProps {
  projects?: Project[]
}

export function ProjectsSection({ projects = mockProjects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="py-12 sm:py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#00274C] to-[#E17000] bg-clip-text text-transparent">
              Projects
            </h2>
            <p className="text-base sm:text-lg text-foreground/70 max-w-2xl mx-auto">
              Explore my latest work and side projects.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
