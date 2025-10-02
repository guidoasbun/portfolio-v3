/**
 * Admin Stats Hook
 *
 * Fetches real-time statistics for the admin dashboard.
 */

import { useState, useEffect } from 'react'
import {
  getProjects,
  getExperiences,
  getMessages,
} from '@/lib/services'
import type { AdminStats } from '@/types/admin'

export function useAdminStats() {
  const [stats, setStats] = useState<AdminStats>({
    projectsCount: 0,
    experienceCount: 0,
    messagesCount: 0,
    unreadMessagesCount: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch all data in parallel
        const [projects, experiences, messages] = await Promise.all([
          getProjects(),
          getExperiences(),
          getMessages(),
        ])

        // Calculate stats
        const unreadMessages = messages.filter((msg) => !msg.read)

        setStats({
          projectsCount: projects.length,
          experienceCount: experiences.length,
          messagesCount: messages.length,
          unreadMessagesCount: unreadMessages.length,
        })
      } catch (err) {
        console.error('Error fetching admin stats:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch stats')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return { stats, loading, error }
}
