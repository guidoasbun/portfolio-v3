'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { IconButton } from '@/components/ui/IconButton'
import { FiEdit, FiTrash2, FiExternalLink, FiFolder } from 'react-icons/fi'
import type { Project } from '@/types'

interface ProjectsTableProps {
  projects: Project[]
  onDelete: (id: string, title: string) => void
  loading?: boolean
}

const categoryLabels: Record<string, string> = {
  web: 'Web',
  mobile: 'Mobile',
  desktop: 'Desktop',
  ai: 'AI/ML',
  other: 'Other'
}

const categoryColors: Record<string, 'primary' | 'success' | 'info' | 'warning' | 'secondary'> = {
  web: 'primary',
  mobile: 'success',
  desktop: 'info',
  ai: 'warning',
  other: 'secondary'
}

export function ProjectsTable({ projects, onDelete, loading }: ProjectsTableProps) {
  if (loading) {
    return (
      <GlassCard>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      </GlassCard>
    )
  }

  if (projects.length === 0) {
    return (
      <GlassCard>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FiFolder size={48} className="text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No projects yet</h3>
          <p className="text-muted-foreground mb-6">
            Get started by creating your first project
          </p>
          <Link href="/admin/projects/new">
            <Button>Create Project</Button>
          </Link>
        </div>
      </GlassCard>
    )
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-foreground/10">
                  <th className="text-left py-3 px-4 font-medium text-sm">Image</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Title</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Technologies</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(projects) && projects.map((project) => (
                  <tr
                    key={project.id}
                    className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-foreground/5">
                        {project.images[0] ? (
                          <Image
                            src={project.images[0]}
                            alt={project.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FiFolder className="text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{project.title}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {project.description}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={categoryColors[project.category]} size="sm">
                        {categoryLabels[project.category]}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 3).map((tech, index) => (
                          <Badge key={index} variant="secondary" size="sm">
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies.length > 3 && (
                          <Badge variant="secondary" size="sm">
                            +{project.technologies.length - 3}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {project.featured && (
                        <Badge variant="warning" size="sm">
                          Featured
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="View live project"
                          >
                            <IconButton
                              variant="ghost"
                              size="sm"
                              aria-label="View live"
                            >
                              <FiExternalLink />
                            </IconButton>
                          </a>
                        )}
                        <Link href={`/admin/projects/${project.id}/edit`}>
                          <IconButton
                            variant="ghost"
                            size="sm"
                            aria-label="Edit project"
                          >
                            <FiEdit />
                          </IconButton>
                        </Link>
                        <IconButton
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(project.id, project.title)}
                          aria-label="Delete project"
                          className="text-red-500 hover:text-red-600"
                        >
                          <FiTrash2 />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {Array.isArray(projects) && projects.map((project) => (
          <GlassCard key={project.id} className="p-4">
            <div className="flex gap-4">
              {/* Thumbnail */}
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-foreground/5 flex-shrink-0">
                {project.images[0] ? (
                  <Image
                    src={project.images[0]}
                    alt={project.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FiFolder className="text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-medium truncate">{project.title}</h3>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="View live"
                      >
                        <IconButton
                          variant="ghost"
                          size="sm"
                          aria-label="View live"
                        >
                          <FiExternalLink />
                        </IconButton>
                      </a>
                    )}
                    <Link href={`/admin/projects/${project.id}/edit`}>
                      <IconButton
                        variant="ghost"
                        size="sm"
                        aria-label="Edit"
                      >
                        <FiEdit />
                      </IconButton>
                    </Link>
                    <IconButton
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(project.id, project.title)}
                      aria-label="Delete"
                      className="text-red-500"
                    >
                      <FiTrash2 />
                    </IconButton>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  <Badge variant={categoryColors[project.category]} size="sm">
                    {categoryLabels[project.category]}
                  </Badge>
                  {project.featured && (
                    <Badge variant="warning" size="sm">
                      Featured
                    </Badge>
                  )}
                  {project.technologies.slice(0, 2).map((tech, index) => (
                    <Badge key={index} variant="secondary" size="sm">
                      {tech}
                    </Badge>
                  ))}
                  {project.technologies.length > 2 && (
                    <Badge variant="secondary" size="sm">
                      +{project.technologies.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
