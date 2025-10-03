'use client'

import React, { useState } from 'react'
import { format } from 'date-fns'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { GlassCard } from '@/components/ui/GlassCard'
import { FiMail, FiUser, FiCalendar, FiCopy, FiCheck, FiTrash2 } from 'react-icons/fi'
import type { Message } from '@/types'

interface MessageDetailModalProps {
  isOpen: boolean
  onClose: () => void
  message: Message | null
  onMarkAsRead: (id: string) => Promise<void>
  onMarkAsReplied: (id: string) => Promise<void>
  onDelete: (id: string, subject: string) => void
}

export function MessageDetailModal({
  isOpen,
  onClose,
  message,
  onMarkAsRead,
  onMarkAsReplied,
  onDelete,
}: MessageDetailModalProps) {
  const [copied, setCopied] = useState(false)
  const [markingAsRead, setMarkingAsRead] = useState(false)
  const [markingAsReplied, setMarkingAsReplied] = useState(false)

  if (!message) return null

  // Copy email to clipboard
  const copyEmailToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(message.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy email:', error)
    }
  }

  // Handle mark as read
  const handleMarkAsRead = async () => {
    try {
      setMarkingAsRead(true)
      await onMarkAsRead(message.id)
    } catch (error) {
      console.error('Failed to mark as read:', error)
    } finally {
      setMarkingAsRead(false)
    }
  }

  // Handle mark as replied
  const handleMarkAsReplied = async () => {
    try {
      setMarkingAsReplied(true)
      await onMarkAsReplied(message.id)
    } catch (error) {
      console.error('Failed to mark as replied:', error)
    } finally {
      setMarkingAsReplied(false)
    }
  }

  // Handle delete
  const handleDelete = () => {
    onDelete(message.id, message.subject)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title="Message Details">
      <ModalBody>
        <div className="space-y-4">
          {/* Status Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {!message.read && (
              <Badge variant="info" size="sm">
                Unread
              </Badge>
            )}
            {message.replied ? (
              <Badge variant="success" size="sm">
                Replied
              </Badge>
            ) : (
              <Badge variant="warning" size="sm">
                Not Replied
              </Badge>
            )}
          </div>

          {/* Sender Info */}
          <GlassCard className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FiUser className="text-muted-foreground" size={18} />
                <div>
                  <p className="text-xs text-muted-foreground">From</p>
                  <p className="font-medium">{message.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <FiMail className="text-muted-foreground" size={18} />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium">{message.email}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyEmailToClipboard}
                  className="flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <FiCheck size={16} />
                      Copied
                    </>
                  ) : (
                    <>
                      <FiCopy size={16} />
                      Copy
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <FiCalendar className="text-muted-foreground" size={18} />
                <div>
                  <p className="text-xs text-muted-foreground">Received</p>
                  <p className="font-medium">
                    {format(new Date(message.createdAt), 'MMMM dd, yyyy h:mm a')}
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Subject */}
          <div>
            <p className="text-xs text-muted-foreground mb-1">Subject</p>
            <p className="font-semibold text-lg">{message.subject}</p>
          </div>

          {/* Message Content */}
          <div>
            <p className="text-xs text-muted-foreground mb-2">Message</p>
            <GlassCard className="p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {message.message}
              </p>
            </GlassCard>
          </div>

          {/* Timestamps */}
          {(message.readAt || message.repliedAt) && (
            <div className="text-xs text-muted-foreground space-y-1">
              {message.readAt && (
                <p>
                  Read on: {format(new Date(message.readAt), 'MMM dd, yyyy h:mm a')}
                </p>
              )}
              {message.repliedAt && (
                <p>
                  Replied on: {format(new Date(message.repliedAt), 'MMM dd, yyyy h:mm a')}
                </p>
              )}
            </div>
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="flex items-center justify-between gap-3 flex-wrap w-full">
          <div className="flex items-center gap-2 flex-wrap">
            {!message.read && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleMarkAsRead}
                disabled={markingAsRead}
              >
                {markingAsRead ? 'Marking...' : 'Mark as Read'}
              </Button>
            )}
            {!message.replied && (
              <Button
                variant="primary"
                size="sm"
                onClick={handleMarkAsReplied}
                disabled={markingAsReplied}
              >
                {markingAsReplied ? 'Marking...' : 'Mark as Replied'}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-red-500 hover:text-red-600"
            >
              <FiTrash2 className="mr-2" size={16} />
              Delete
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </ModalFooter>
    </Modal>
  )
}
