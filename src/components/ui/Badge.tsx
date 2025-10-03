import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Badge({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: BadgeProps) {
  const baseStyles = [
    'inline-flex items-center justify-center font-medium rounded-full',
    'transition-all duration-200'
  ]

  const variants = {
    primary: 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30',
    secondary: 'bg-gray-500/20 text-gray-600 dark:text-gray-400 border border-gray-500/30',
    success: 'bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30',
    info: 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30',
    danger: 'bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30'
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  }

  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
