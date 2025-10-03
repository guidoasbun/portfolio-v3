'use client'

import React from 'react'
import Link from 'next/link'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { IconButton } from '@/components/ui/IconButton'
import { FiEdit, FiTrash2, FiCode } from 'react-icons/fi'
import type { Skill } from '@/types'

interface SkillsTableProps {
  skills: Skill[]
  onDelete: (id: string, name: string) => void
  loading?: boolean
}

const categoryLabels: Record<string, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  tools: 'Tools',
  design: 'Design',
  other: 'Other'
}

const categoryColors: Record<string, 'primary' | 'success' | 'info' | 'warning' | 'secondary'> = {
  frontend: 'primary',
  backend: 'success',
  database: 'info',
  tools: 'warning',
  design: 'secondary',
  other: 'secondary'
}

export function SkillsTable({ skills, onDelete, loading }: SkillsTableProps) {
  if (loading) {
    return (
      <GlassCard>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      </GlassCard>
    )
  }

  if (skills.length === 0) {
    return (
      <GlassCard>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FiCode size={48} className="text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No skills yet</h3>
          <p className="text-muted-foreground mb-6">
            Get started by adding your first skill
          </p>
          <Link href="/admin/skills/new">
            <Button>Add Skill</Button>
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
                  <th className="text-left py-3 px-4 font-medium text-sm">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Icon</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Color</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Featured</th>
                  <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(skills) && skills.map((skill) => (
                  <tr
                    key={skill.id}
                    className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <p className="font-medium">{skill.name}</p>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={categoryColors[skill.category]} size="sm">
                        {categoryLabels[skill.category]}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <code className="text-xs text-muted-foreground bg-foreground/5 px-2 py-1 rounded">
                        {skill.icon || '-'}
                      </code>
                    </td>
                    <td className="py-3 px-4">
                      {skill.color ? (
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded border border-foreground/10"
                            style={{ backgroundColor: skill.color }}
                          />
                          <code className="text-xs text-muted-foreground">
                            {skill.color}
                          </code>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {skill.featured ? (
                        <Badge variant="success" size="sm">
                          Featured
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/skills/${skill.id}/edit`}>
                          <IconButton
                            variant="ghost"
                            size="sm"
                            aria-label="Edit skill"
                          >
                            <FiEdit />
                          </IconButton>
                        </Link>
                        <IconButton
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(skill.id, skill.name)}
                          aria-label="Delete skill"
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
        {Array.isArray(skills) && skills.map((skill) => (
          <GlassCard key={skill.id} className="p-4">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{skill.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={categoryColors[skill.category]} size="sm">
                      {categoryLabels[skill.category]}
                    </Badge>
                    {skill.featured && (
                      <Badge variant="success" size="sm">
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link href={`/admin/skills/${skill.id}/edit`}>
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
                    onClick={() => onDelete(skill.id, skill.name)}
                    aria-label="Delete"
                    className="text-red-500"
                  >
                    <FiTrash2 />
                  </IconButton>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                {skill.icon && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Icon:</span>
                    <code className="text-xs bg-foreground/5 px-2 py-1 rounded">
                      {skill.icon}
                    </code>
                  </div>
                )}
                {skill.color && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Color:</span>
                    <div
                      className="w-6 h-6 rounded border border-foreground/10"
                      style={{ backgroundColor: skill.color }}
                    />
                    <code className="text-xs text-muted-foreground">
                      {skill.color}
                    </code>
                  </div>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
