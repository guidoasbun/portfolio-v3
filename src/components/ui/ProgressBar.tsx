'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface ProgressBarProps {
  value: number // 0-100
  max?: number
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  label?: string
  className?: string
  animated?: boolean
}

const variantStyles = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
}

const sizeMap = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  showLabel = false,
  label,
  className,
  animated = true,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <div className={cn('w-full', className)}>
      {(showLabel || label) && (
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-foreground/70 dark:text-foreground/70">
            {label || 'Progress'}
          </span>
          {showLabel && (
            <span className="font-medium text-foreground dark:text-foreground">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full overflow-hidden rounded-full bg-foreground/10 dark:bg-foreground/10',
          sizeMap[size]
        )}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        {animated ? (
          <motion.div
            className={cn('h-full rounded-full', variantStyles[variant])}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        ) : (
          <div
            className={cn('h-full rounded-full transition-all duration-300', variantStyles[variant])}
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
    </div>
  )
}

interface IndeterminateProgressBarProps {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const IndeterminateProgressBar: React.FC<IndeterminateProgressBarProps> = ({
  variant = 'primary',
  size = 'md',
  className,
}) => {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-full bg-foreground/10 dark:bg-foreground/10',
        sizeMap[size],
        className
      )}
      role="progressbar"
      aria-busy="true"
      aria-valuetext="Loading"
    >
      <motion.div
        className={cn('absolute h-full w-1/3 rounded-full', variantStyles[variant])}
        animate={{
          x: ['-100%', '400%'],
        }}
        transition={{
          duration: 1.5,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      />
    </div>
  )
}

export default ProgressBar
