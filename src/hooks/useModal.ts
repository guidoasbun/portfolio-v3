'use client'

import { useState, useCallback } from 'react'

interface UseModalReturn {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

/**
 * Hook for managing modal state
 * @param initialState - Initial open state of the modal (default: false)
 * @returns Object with isOpen state and control functions
 */
export function useModal(initialState = false): UseModalReturn {
  const [isOpen, setIsOpen] = useState(initialState)

  const open = useCallback(() => {
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  return {
    isOpen,
    open,
    close,
    toggle
  }
}

/**
 * Hook for managing modal state with data
 * Useful when you need to pass data to the modal when opening it
 */
export function useModalWithData<T = unknown>() {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<T | null>(null)

  const open = useCallback((modalData?: T) => {
    if (modalData !== undefined) {
      setData(modalData)
    }
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    // Clear data after animation completes
    setTimeout(() => setData(null), 300)
  }, [])

  const toggle = useCallback((modalData?: T) => {
    if (!isOpen && modalData !== undefined) {
      setData(modalData)
    }
    setIsOpen((prev) => !prev)
  }, [isOpen])

  return {
    isOpen,
    data,
    open,
    close,
    toggle
  }
}
