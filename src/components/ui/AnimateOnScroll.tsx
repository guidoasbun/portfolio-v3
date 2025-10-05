'use client'

import React from 'react'
import { motion, type Variants } from 'framer-motion'
import { useInView } from '@/hooks/useInView'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface AnimateOnScrollProps {
  children: React.ReactNode
  className?: string
  delay?: number
  threshold?: number
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
}

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
    },
  },
}

/**
 * Component that animates children when they scroll into view
 * Respects prefers-reduced-motion setting
 */
export function AnimateOnScroll({
  children,
  className,
  delay = 0,
  threshold = 0.1,
}: AnimateOnScrollProps) {
  const { ref, hasBeenInView } = useInView({
    threshold,
    triggerOnce: true,
  })
  const prefersReducedMotion = useReducedMotion()

  // Use simple fade if user prefers reduced motion, otherwise fade up
  const variants = prefersReducedMotion ? fadeIn : fadeInUp

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={hasBeenInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
