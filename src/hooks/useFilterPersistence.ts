/**
 * useFilterPersistence Hook
 *
 * A generic hook to persist filter state to localStorage and restore on page load.
 * Supports any filter state type with proper TypeScript typing.
 *
 * @example
 * ```tsx
 * interface ProjectFilters {
 *   search: string;
 *   category: string;
 *   sortBy: string;
 * }
 *
 * const [filters, setFilters] = useFilterPersistence<ProjectFilters>(
 *   'admin-projects-filters',
 *   { search: '', category: 'all', sortBy: 'date' }
 * )
 * ```
 */

'use client'

import { useState, useEffect, useCallback } from 'react'

export function useFilterPersistence<T>(
  storageKey: string,
  defaultFilters: T
): [T, (filters: T | ((prev: T) => T)) => void, () => void] {
  const [filters, setFiltersState] = useState<T>(defaultFilters)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load filters from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsed = JSON.parse(stored) as T
        setFiltersState(parsed)
      }
    } catch (error) {
      console.error(`Failed to load filters from localStorage (${storageKey}):`, error)
    } finally {
      setIsLoaded(true)
    }
  }, [storageKey])

  // Save filters to localStorage whenever they change
  const setFilters = useCallback(
    (newFilters: T | ((prev: T) => T)) => {
      setFiltersState((prev) => {
        const updated = typeof newFilters === 'function'
          ? (newFilters as (prev: T) => T)(prev)
          : newFilters

        try {
          localStorage.setItem(storageKey, JSON.stringify(updated))
        } catch (error) {
          console.error(`Failed to save filters to localStorage (${storageKey}):`, error)
        }

        return updated
      })
    },
    [storageKey]
  )

  // Reset filters to defaults
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters)
  }, [defaultFilters, setFilters])

  // Return filters only after they've been loaded from localStorage
  // This prevents flash of default state before loaded state
  return [isLoaded ? filters : defaultFilters, setFilters, resetFilters]
}
