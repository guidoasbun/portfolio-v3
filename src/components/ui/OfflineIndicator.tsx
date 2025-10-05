'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { FiWifiOff, FiWifi } from 'react-icons/fi'

export function OfflineIndicator() {
  const isOnline = useOnlineStatus()
  const [showOnlineMessage, setShowOnlineMessage] = useState(false)
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true)
    } else if (wasOffline) {
      // Show "back online" message briefly
      setShowOnlineMessage(true)
      const timer = setTimeout(() => {
        setShowOnlineMessage(false)
        setWasOffline(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOnline, wasOffline])

  return (
    <AnimatePresence>
      {(!isOnline || showOnlineMessage) && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
        >
          <div
            className={`
              flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl
              backdrop-blur-md border
              ${
                isOnline
                  ? 'bg-green-500/90 border-green-400/50 text-white'
                  : 'bg-red-500/90 border-red-400/50 text-white'
              }
            `}
            role="alert"
            aria-live="polite"
          >
            {isOnline ? (
              <FiWifi className="w-5 h-5" aria-hidden="true" />
            ) : (
              <FiWifiOff className="w-5 h-5" aria-hidden="true" />
            )}
            <span className="font-medium text-sm">
              {isOnline ? 'Back online' : 'No internet connection'}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
