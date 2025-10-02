'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { fadeIn } from '@/lib/animations'

interface SceneTransitionProps {
  children: React.ReactNode
  className?: string
  fallback?: React.ReactNode
  loadingDelay?: number
}

/**
 * Scene Transition Component
 * Provides smooth transitions for 3D scenes with loading states
 */
export function SceneTransition({
  children,
  className = '',
  fallback,
  loadingDelay = 100,
}: SceneTransitionProps) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Add a small delay to allow scene to initialize
    const timer = setTimeout(() => {
      setIsReady(true)
    }, loadingDelay)

    return () => clearTimeout(timer)
  }, [loadingDelay])

  if (!isReady && fallback) {
    return <>{fallback}</>
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * Fade Wrapper for smoother 3D canvas mounting
 */
export function CanvasFadeIn({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
