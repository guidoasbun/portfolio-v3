'use client'

import React from 'react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { FiTrash2, FiCheckCircle, FiCircle, FiDownload } from 'react-icons/fi'
import { formatDate } from '@/lib/date'
import type { Resume } from '@/types'

interface ResumeTableProps {
  resumes: Resume[]
  onSetActive: (id: string) => void
  onDelete: (id: string, version: string) => void
  loading?: boolean
}

export function ResumeTable({
  resumes,
  onSetActive,
  onDelete,
  loading = false
}: ResumeTableProps) {
  if (loading) {
    return (
      <GlassCard className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      </GlassCard>
    )
  }

  if (resumes.length === 0) {
    return (
      <GlassCard className="p-8 text-center">
        <p className="text-muted-foreground">No resumes found</p>
      </GlassCard>
    )
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block">
        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-foreground/10">
                <tr className="text-left">
                  <th className="p-4 font-medium text-sm">Status</th>
                  <th className="p-4 font-medium text-sm">Version</th>
                  <th className="p-4 font-medium text-sm">Filename</th>
                  <th className="p-4 font-medium text-sm">Downloads</th>
                  <th className="p-4 font-medium text-sm">Created</th>
                  <th className="p-4 font-medium text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {resumes.map((resume) => (
                  <tr
                    key={resume.id}
                    className="border-b border-foreground/5 last:border-0 hover:bg-foreground/5 transition-colors"
                  >
                    {/* Status */}
                    <td className="p-4">
                      {resume.active ? (
                        <div className="flex items-center gap-2">
                          <FiCheckCircle size={18} className="text-green-500" />
                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                            Active
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <FiCircle size={18} className="text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Inactive
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Version */}
                    <td className="p-4">
                      <span className="font-medium">{resume.version}</span>
                    </td>

                    {/* Filename */}
                    <td className="p-4">
                      <span className="text-sm truncate max-w-xs block" title={resume.originalName}>
                        {resume.originalName}
                      </span>
                    </td>

                    {/* Downloads */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <FiDownload size={16} className="text-muted-foreground" />
                        <span className="text-sm">{resume.downloadCount}</span>
                      </div>
                    </td>

                    {/* Created */}
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">
                        {formatDate(resume.createdAt)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        {!resume.active && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onSetActive(resume.id)}
                          >
                            <FiCheckCircle size={16} />
                            Set Active
                          </Button>
                        )}
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onDelete(resume.id, resume.version)}
                        >
                          <FiTrash2 size={16} />
                        </Button>
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
      <div className="md:hidden space-y-4">
        {resumes.map((resume) => (
          <GlassCard key={resume.id} className="p-4">
            {/* Header with Status */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {resume.active ? (
                    <>
                      <FiCheckCircle size={18} className="text-green-500" />
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        Active
                      </span>
                    </>
                  ) : (
                    <>
                      <FiCircle size={18} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Inactive
                      </span>
                    </>
                  )}
                </div>
                <h3 className="font-semibold text-lg">{resume.version}</h3>
              </div>
            </div>

            {/* File Info */}
            <div className="space-y-2 mb-4">
              <div>
                <p className="text-xs text-muted-foreground">Filename</p>
                <p className="text-sm truncate" title={resume.originalName}>
                  {resume.originalName}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Downloads</p>
                  <div className="flex items-center gap-1">
                    <FiDownload size={14} className="text-muted-foreground" />
                    <p className="text-sm">{resume.downloadCount}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="text-sm">{formatDate(resume.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-3 border-t border-foreground/10">
              {!resume.active && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onSetActive(resume.id)}
                  className="flex-1"
                >
                  <FiCheckCircle size={16} />
                  Set Active
                </Button>
              )}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onDelete(resume.id, resume.version)}
                className={resume.active ? 'flex-1' : ''}
              >
                <FiTrash2 size={16} />
                Delete
              </Button>
            </div>
          </GlassCard>
        ))}
      </div>
    </>
  )
}
