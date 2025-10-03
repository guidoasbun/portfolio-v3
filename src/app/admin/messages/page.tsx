/**
 * Admin Messages List Page
 *
 * Displays all contact form messages with filtering, search, and CRUD operations.
 */

'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'
import { Input } from '@/components/ui/Input'
import { MessagesTable } from '@/components/admin/MessagesTable'
import { MessageDetailModal } from '@/components/admin/MessageDetailModal'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { useModal } from '@/hooks/useModal'
import { FiAlertCircle, FiCheckCircle, FiSearch, FiX, FiDownload } from 'react-icons/fi'
import type { Message } from '@/types'

type FilterType = 'all' | 'unread' | 'unreplied' | 'read' | 'replied'

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; subject: string } | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    isOpen: isDetailModalOpen,
    open: openDetailModal,
    close: closeDetailModal,
  } = useModal()
  const {
    isOpen: isDeleteModalOpen,
    open: openDeleteModal,
    close: closeDeleteModal,
  } = useModal()

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/messages')

      if (!response.ok) {
        throw new Error('Failed to fetch messages')
      }

      const result = await response.json()

      // Handle both direct array and ApiResponse format
      const data = Array.isArray(result) ? result : result.data

      setMessages(data)
    } catch (err) {
      console.error('Error fetching messages:', err)
      setError(err instanceof Error ? err.message : 'Failed to load messages')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  // Filter messages
  const filteredMessages = useMemo(() => {
    let filtered = messages

    // Apply filter
    switch (filter) {
      case 'unread':
        filtered = filtered.filter((msg) => !msg.read)
        break
      case 'unreplied':
        filtered = filtered.filter((msg) => !msg.replied)
        break
      case 'read':
        filtered = filtered.filter((msg) => msg.read)
        break
      case 'replied':
        filtered = filtered.filter((msg) => msg.replied)
        break
      default:
        // 'all' - no filtering
        break
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (msg) =>
          msg.name.toLowerCase().includes(query) ||
          msg.email.toLowerCase().includes(query) ||
          msg.subject.toLowerCase().includes(query) ||
          msg.message.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [messages, filter, searchQuery])

  // Count by filter type
  const countByFilter = (filterType: FilterType): number => {
    switch (filterType) {
      case 'unread':
        return messages.filter((msg) => !msg.read).length
      case 'unreplied':
        return messages.filter((msg) => !msg.replied).length
      case 'read':
        return messages.filter((msg) => msg.read).length
      case 'replied':
        return messages.filter((msg) => msg.replied).length
      default:
        return messages.length
    }
  }

  // Handle view message
  const handleViewMessage = async (message: Message) => {
    setSelectedMessage(message)
    openDetailModal()

    // Auto-mark as read if unread
    if (!message.read) {
      try {
        await markAsRead(message.id)
      } catch (error) {
        console.error('Failed to auto-mark as read:', error)
      }
    }
  }

  // Mark as read
  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark-read' }),
      })

      if (!response.ok) {
        throw new Error('Failed to mark as read')
      }

      // Update local state
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id ? { ...msg, read: true, readAt: new Date() } : msg
        )
      )

      // Update selected message if it's currently open
      if (selectedMessage?.id === id) {
        setSelectedMessage((prev) =>
          prev ? { ...prev, read: true, readAt: new Date() } : null
        )
      }
    } catch (error) {
      console.error('Error marking as read:', error)
      throw error
    }
  }

  // Mark as replied
  const markAsReplied = async (id: string) => {
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mark-replied' }),
      })

      if (!response.ok) {
        throw new Error('Failed to mark as replied')
      }

      // Update local state
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id ? { ...msg, replied: true, repliedAt: new Date() } : msg
        )
      )

      // Update selected message if it's currently open
      if (selectedMessage?.id === id) {
        setSelectedMessage((prev) =>
          prev ? { ...prev, replied: true, repliedAt: new Date() } : null
        )
      }

      setSuccessMessage('Message marked as replied')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (error) {
      console.error('Error marking as replied:', error)
      throw error
    }
  }

  // Handle delete confirmation
  const handleDeleteClick = (id: string, subject: string) => {
    setDeleteTarget({ id, subject })
    openDeleteModal()
  }

  // Handle delete
  const handleDelete = async () => {
    if (!deleteTarget) return

    try {
      setDeleting(true)
      const response = await fetch(`/api/messages/${deleteTarget.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete message')
      }

      setSuccessMessage(`Message "${deleteTarget.subject}" deleted successfully`)
      setTimeout(() => setSuccessMessage(null), 5000)

      // Refresh messages list
      await fetchMessages()

      closeDeleteModal()
      setDeleteTarget(null)
    } catch (err) {
      console.error('Error deleting message:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete message')
    } finally {
      setDeleting(false)
    }
  }

  // Export to CSV
  const exportToCSV = () => {
    if (filteredMessages.length === 0) return

    // CSV headers
    const headers = ['Date', 'Name', 'Email', 'Subject', 'Message', 'Status']

    // CSV rows
    const rows = filteredMessages.map((msg) => {
      const date = new Date(msg.createdAt).toLocaleString()
      const status = `${msg.read ? 'Read' : 'Unread'}/${msg.replied ? 'Replied' : 'Not Replied'}`
      // Escape quotes and newlines in message
      const message = msg.message.replace(/"/g, '""').replace(/\n/g, ' ')
      return [date, msg.name, msg.email, msg.subject, message, status]
    })

    // Build CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `messages-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setSuccessMessage('Messages exported to CSV successfully')
    setTimeout(() => setSuccessMessage(null), 3000)
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery('')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <Heading as="h1" className="mb-2">
            Messages
          </Heading>
          <p className="text-muted-foreground">
            Manage contact form submissions and inquiries
          </p>
        </div>
        <Button onClick={exportToCSV} disabled={filteredMessages.length === 0}>
          <FiDownload className="mr-2" />
          Export to CSV
        </Button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <GlassCard className="border-green-500/20 bg-green-500/10">
          <div className="flex items-center gap-3 text-green-600 dark:text-green-400">
            <FiCheckCircle size={24} />
            <p>{successMessage}</p>
          </div>
        </GlassCard>
      )}

      {/* Error Message */}
      {error && (
        <GlassCard className="border-red-500/20 bg-red-500/10">
          <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
            <FiAlertCircle size={24} />
            <div>
              <p className="font-medium">Error</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search */}
        <GlassCard>
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name, email, subject, or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <FiX size={18} />
              </button>
            )}
          </div>
        </GlassCard>

        {/* Filters */}
        <GlassCard>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium">Filter:</span>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filter === 'all' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All ({countByFilter('all')})
              </Button>
              <Button
                variant={filter === 'unread' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter('unread')}
              >
                Unread ({countByFilter('unread')})
              </Button>
              <Button
                variant={filter === 'unreplied' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter('unreplied')}
              >
                Unreplied ({countByFilter('unreplied')})
              </Button>
              <Button
                variant={filter === 'read' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter('read')}
              >
                Read ({countByFilter('read')})
              </Button>
              <Button
                variant={filter === 'replied' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter('replied')}
              >
                Replied ({countByFilter('replied')})
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Messages Table */}
      <MessagesTable
        messages={filteredMessages}
        onView={handleViewMessage}
        onDelete={handleDeleteClick}
        loading={loading}
      />

      {/* Message Detail Modal */}
      <MessageDetailModal
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        message={selectedMessage}
        onMarkAsRead={markAsRead}
        onMarkAsReplied={markAsReplied}
        onDelete={handleDeleteClick}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Delete Message"
        message={
          deleteTarget
            ? `Are you sure you want to delete the message "${deleteTarget.subject}"? This action cannot be undone.`
            : ''
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleting}
      />
    </div>
  )
}
