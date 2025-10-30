import React from 'react'
import { cn } from '@/lib/utils'

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement | HTMLSpanElement> {
  as?: 'p' | 'span'
  size?: 'sm' | 'base' | 'lg' | 'xl'
  variant?: 'default' | 'muted' | 'accent'
  children: React.ReactNode
}

export function Text({
  as: Component = 'p',
  size = 'base',
  variant = 'default',
  className,
  children,
  ...props
}: TextProps) {
  const baseStyles = [
    'leading-relaxed'
  ]

  const sizes = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  const variants = {
    default: 'text-foreground',
    muted: 'text-foreground/70',
    accent: 'text-transparent bg-gradient-to-r from-[#00274C] to-[#E17000] bg-clip-text'
  }

  return (
    <Component
      className={cn(
        baseStyles,
        sizes[size],
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}