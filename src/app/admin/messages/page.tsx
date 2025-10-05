/**
 * Admin Messages List Page
 *
 * Displays all contact form messages with filtering, search, sorting, and pagination.
 */

'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/Button'
import { GlassCard } from '@/components/ui/GlassCard'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { MessagesTable } from '@/components/admin/MessagesTable'
import { MessageDetailModal } from '@/components/admin/MessageDetailModal'
import { ConfirmModal } from '@/components/ui/ConfirmModal'
import { Pagination } from '@/components/ui/Pagination'
import { useModal } from '@/hooks/useModal'
import { useFilterPersistence } from '@/hooks/useFilterPersistence'
import { FiAlertCircle, FiCheckCircle, FiSearch, FiX, FiDownload } from 'react-icons/fi'
import type { Message } from '@/types'

type FilterType = 'all' | 'unread' | 'unreplied' | 'read' | 'replied'
type SortOption = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc'

interface MessageFilters {
  search: string
  filter: FilterType
  sortBy: SortOption
  page: number
}

const ITEMS_PER_PAGE = 15

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; subject: string } | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Persisted filters
  const [filters, setFilters] = useFilterPersistence<MessageFilters>('admin-messages-filters', {
    search: '',
    filter: 'all',
    sortBy: 'date-desc',
    page: 1,
  })

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

  // Filter, sort, and paginate messages
  const filteredAndSortedMessages = useMemo(() => {
    let filtered = messages

    // Apply filter
    switch (filters.filter) {
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
    if (filters.search.trim()) {
      const query = filters.search.toLowerCase()
      filtered = filtered.filter(
        (msg) =>
          msg.name.toLowerCase().includes(query) ||
          msg.email.toLowerCase().includes(query) ||
          msg.subject.toLowerCase().includes(query) ||
          msg.message.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    const sorted = [...filtered]
    switch (filters.sortBy) {
      case 'date-desc':
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'date-asc':
        sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name))
        break
    }

    return sorted
  }, [messages, filters])

  // Paginate messages
  const paginatedMessages = useMemo(() => {
    const startIndex = (filters.page - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return filteredAndSortedMessages.slice(startIndex, endIndex)
  }, [filteredAndSortedMessages, filters.page])

  const totalPages = Math.ceil(filteredAndSortedMessages.length / ITEMS_PER_PAGE)

  // Reset to page 1 when filters change
  useEffect(() => {
    if (filters.page > totalPages && totalPages > 0) {
      setFilters((prev) => ({ ...prev, page: 1 }))
    }
  }, [filters.page, totalPages, setFilters])

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
    if (filteredAndSortedMessages.length === 0) return

    // CSV headers
    const headers = ['Date', 'Name', 'Email', 'Subject', 'Message', 'Status']

    // CSV rows
    const rows = filteredAndSortedMessages.map((msg) => {
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
        <Button onClick={exportToCSV} disabled={filteredAndSortedMessages.length === 0}>
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

      {/* Search */}
      <GlassCard>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, email, subject, or message..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))}
            className="pl-10 pr-10"
          />
          {filters.search && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, search: '', page: 1 }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <FiX size={18} />
            </button>
          )}
        </div>
      </GlassCard>

      {/* Filters and Sort */}
      <GlassCard>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Status Filter */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium">Status:</span>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filters.filter === 'all' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilters((prev) => ({ ...prev, filter: 'all', page: 1 }))}
              >
                All ({countByFilter('all')})
              </Button>
              <Button
                variant={filters.filter === 'unread' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilters((prev) => ({ ...prev, filter: 'unread', page: 1 }))}
              >
                Unread ({countByFilter('unread')})
              </Button>
              <Button
                variant={filters.filter === 'unreplied' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilters((prev) => ({ ...prev, filter: 'unreplied', page: 1 }))}
              >
                Unreplied ({countByFilter('unreplied')})
              </Button>
              <Button
                variant={filters.filter === 'read' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilters((prev) => ({ ...prev, filter: 'read', page: 1 }))}
              >
                Read ({countByFilter('read')})
              </Button>
              <Button
                variant={filters.filter === 'replied' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilters((prev) => ({ ...prev, filter: 'replied', page: 1 }))}
              >
                Replied ({countByFilter('replied')})
              </Button>
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-3 flex-1 min-w-[200px]">
            <span className="text-sm font-medium whitespace-nowrap">Sort by:</span>
            <Select
              value={filters.sortBy}
              onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as SortOption }))}
              className="flex-1"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </Select>
          </div>
        </div>
      </GlassCard>

      {/* Messages Table */}
      <MessagesTable
        messages={paginatedMessages}
        onView={handleViewMessage}
        onDelete={handleDeleteClick}
        loading={loading}
      />

      {/* Pagination */}
      {!loading && filteredAndSortedMessages.length > ITEMS_PER_PAGE && (
        <GlassCard>
          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            totalItems={filteredAndSortedMessages.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          />
        </GlassCard>
      )}

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
