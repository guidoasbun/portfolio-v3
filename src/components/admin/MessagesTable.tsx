'use client'

import React from 'react'
import { format } from 'date-fns'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { IconButton } from '@/components/ui/IconButton'
import { FiMail, FiTrash2, FiEye, FiCheckCircle } from 'react-icons/fi'
import type { Message } from '@/types'

interface MessagesTableProps {
  messages: Message[]
  onView: (message: Message) => void
  onDelete: (id: string, subject: string) => void
  loading?: boolean
}

// Format date
const formatDate = (date: Date): string => {
  return format(new Date(date), 'MMM dd, yyyy h:mm a')
}

export function MessagesTable({ messages, onView, onDelete, loading }: MessagesTableProps) {
  if (loading) {
    return (
      <GlassCard>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      </GlassCard>
    )
  }

  if (messages.length === 0) {
    return (
      <GlassCard>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FiMail size={48} className="text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No messages found</h3>
          <p className="text-muted-foreground">
            Messages from your contact form will appear here
          </p>
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
                  <th className="text-left py-3 px-4 font-medium text-sm w-12">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Subject</th>
                  <th className="text-left py-3 px-4 font-medium text-sm">Date</th>
                  <th className="text-right py-3 px-4 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(messages) && messages.map((message) => (
                  <tr
                    key={message.id}
                    className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        {message.read ? (
                          <FiCheckCircle
                            size={18}
                            className="text-green-500"
                            title="Read"
                          />
                        ) : (
                          <FiMail
                            size={18}
                            className="text-blue-500"
                            title="Unread"
                          />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className={message.read ? 'font-normal' : 'font-bold'}>
                        {message.name}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-muted-foreground">{message.email}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <p className={message.read ? 'font-normal' : 'font-semibold'}>
                          {message.subject}
                        </p>
                        <div className="flex items-center gap-1">
                          {message.replied && (
                            <Badge variant="success" size="sm">
                              Replied
                            </Badge>
                          )}
                          {!message.read && (
                            <Badge variant="info" size="sm">
                              New
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm text-muted-foreground">
                        {formatDate(message.createdAt)}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <IconButton
                          variant="ghost"
                          size="sm"
                          onClick={() => onView(message)}
                          aria-label="View message"
                        >
                          <FiEye />
                        </IconButton>
                        <IconButton
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(message.id, message.subject)}
                          aria-label="Delete message"
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
        {Array.isArray(messages) && messages.map((message) => (
          <GlassCard key={message.id} className="p-4">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {message.read ? (
                      <FiCheckCircle size={16} className="text-green-500" />
                    ) : (
                      <FiMail size={16} className="text-blue-500" />
                    )}
                    {!message.read && (
                      <Badge variant="info" size="sm">
                        New
                      </Badge>
                    )}
                    {message.replied && (
                      <Badge variant="success" size="sm">
                        Replied
                      </Badge>
                    )}
                  </div>
                  <h3 className={`truncate ${message.read ? 'font-normal' : 'font-bold'}`}>
                    {message.name}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">{message.email}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <IconButton
                    variant="ghost"
                    size="sm"
                    onClick={() => onView(message)}
                    aria-label="View"
                  >
                    <FiEye />
                  </IconButton>
                  <IconButton
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(message.id, message.subject)}
                    aria-label="Delete"
                    className="text-red-500"
                  >
                    <FiTrash2 />
                  </IconButton>
                </div>
              </div>

              {/* Subject */}
              <div>
                <p className={`text-sm ${message.read ? 'font-normal' : 'font-semibold'}`}>
                  {message.subject}
                </p>
              </div>

              {/* Date */}
              <div className="text-xs text-muted-foreground">
                {formatDate(message.createdAt)}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
