import React from 'react'
import { cn } from '@/lib/utils'

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'light' | 'medium' | 'heavy'
  children: React.ReactNode
  hover?: boolean
}

export function GlassCard({
  variant = 'medium',
  hover = false,
  className,
  children,
  ...props
}: GlassCardProps) {
  const baseStyles = [
    'rounded-xl shadow-lg transition-all duration-300',
    'border backdrop-blur-sm'
  ]

  const variants = {
    light: [
      'glass-light',
      hover && 'hover:glass-medium hover:shadow-xl hover:scale-105'
    ],
    medium: [
      'glass',
      hover && 'hover:glass-heavy hover:shadow-xl hover:scale-105'
    ],
    heavy: [
      'glass-heavy',
      hover && 'hover:shadow-2xl hover:scale-105'
    ]
  }

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}