'use client'

import React from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { IconButton } from '@/components/ui/IconButton'
import { FiEdit, FiTrash2, FiBriefcase } from 'react-icons/fi'
import type { Experience } from '@/types'

interface ExperienceTableProps {
  experiences: Experience[]
  onDelete: (id: string, title: string) => void
  loading?: boolean
}

const typeLabels: Record<string, string> = {
  work: 'Work',
  internship: 'Internship',
  education: 'Education'
}

const typeColors: Record<string, 'primary' | 'success' | 'info' | 'warning' | 'secondary'> = {
  work: 'primary',
  internship: 'warning',
  education: 'success'
}

// Format date range
const formatDateRange = (startDate: Date, endDate: Date | undefined, current: boolean): string => {
  const start = format(new Date(startDate), 'MMM yyyy')
  const end = current ? 'Present' : endDate ? format(new Date(endDate), 'MMM yyyy') : ''
  return `${start} - ${end}`
}

export function ExperienceTable({ experiences, onDelete, loading }: ExperienceTableProps) {
  if (loading) {
    return (
      <GlassCard>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      </GlassCard>
    )
  }

  if (experiences.length === 0) {
    return (
      <GlassCard>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FiBriefcase size={48} className="text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No experience yet</h3>
          <p className="text-muted-foreground mb-6">
            Get started by adding your first experience
          </p>
          <Link href="/admin/experience/new">
            <Button>Add Experience</Button>
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
                  <th className="text-left py-3 px-4 font-medium text-sm">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Title</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Company</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Location</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Date Range</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Technologies</th>
                  <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(experiences) && experiences.map((experience) => (
                  <tr
                    key={experience.id}
                    className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <Badge variant={typeColors[experience.type]} size="sm">
                        {typeLabels[experience.type]}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{experience.title}</p>
                        {experience.current && (
                          <Badge variant="info" size="sm" className="mt-1">
                            Current
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm">{experience.company}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-muted-foreground">{experience.location}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-muted-foreground">
                        {formatDateRange(experience.startDate, experience.endDate, experience.current)}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {experience.technologies && experience.technologies.length > 0 ? (
                          <>
                            {experience.technologies.slice(0, 3).map((tech, index) => (
                              <Badge key={index} variant="secondary" size="sm">
                                {tech}
                              </Badge>
                            ))}
                            {experience.technologies.length > 3 && (
                              <Badge variant="secondary" size="sm">
                                +{experience.technologies.length - 3}
                              </Badge>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground">-</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/experience/${experience.id}/edit`}>
                          <IconButton
                            variant="ghost"
                            size="sm"
                            aria-label="Edit experience"
                          >
                            <FiEdit />
                          </IconButton>
                        </Link>
                        <IconButton
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(experience.id, experience.title)}
                          aria-label="Delete experience"
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
        {Array.isArray(experiences) && experiences.map((experience) => (
          <GlassCard key={experience.id} className="p-4">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={typeColors[experience.type]} size="sm">
                      {typeLabels[experience.type]}
                    </Badge>
                    {experience.current && (
                      <Badge variant="info" size="sm">
                        Current
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-medium truncate">{experience.title}</h3>
                  <p className="text-sm text-muted-foreground">{experience.company}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link href={`/admin/experience/${experience.id}/edit`}>
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
                    onClick={() => onDelete(experience.id, experience.title)}
                    aria-label="Delete"
                    className="text-red-500"
                  >
                    <FiTrash2 />
                  </IconButton>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-1 text-sm">
                <p className="text-muted-foreground">
                  📍 {experience.location}
                </p>
                <p className="text-muted-foreground">
                  📅 {formatDateRange(experience.startDate, experience.endDate, experience.current)}
                </p>
              </div>

              {/* Technologies */}
              {experience.technologies && experience.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {experience.technologies.slice(0, 3).map((tech, index) => (
                    <Badge key={index} variant="secondary" size="sm">
                      {tech}
                    </Badge>
                  ))}
                  {experience.technologies.length > 3 && (
                    <Badge variant="secondary" size="sm">
                      +{experience.technologies.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
