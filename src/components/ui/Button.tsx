import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  const baseStyles = [
    'inline-flex items-center justify-center rounded-lg font-medium',
    'transition-all duration-300 ease-in-out',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'transform hover:scale-105 active:scale-95'
  ]

  const variants = {
    primary: [
      'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg',
      'hover:from-blue-600 hover:to-purple-700 hover:shadow-xl',
      'focus-visible:ring-blue-500 focus-visible:ring-opacity-50',
      'border-0'
    ],
    secondary: [
      'glass text-foreground border border-foreground/20',
      'hover:glass-heavy hover:bg-foreground/5 hover:shadow-md',
      'focus-visible:ring-blue-500 focus-visible:ring-opacity-30'
    ],
    ghost: [
      'text-foreground hover:bg-foreground/10',
      'focus-visible:ring-blue-500 focus-visible:ring-opacity-30',
      'border border-transparent hover:border-foreground/20'
    ]
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}