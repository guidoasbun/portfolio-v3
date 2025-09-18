import React from 'react'
import { cn } from '@/lib/utils'

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: 'sm' | 'md' | 'lg' | 'xl'
  background?: 'transparent' | 'glass' | 'gradient'
  children: React.ReactNode
}

export function Section({
  spacing = 'lg',
  background = 'transparent',
  className,
  children,
  ...props
}: SectionProps) {
  const spacings = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16',
    xl: 'py-24'
  }

  const backgrounds = {
    transparent: '',
    glass: 'glass-light border-y border-glass-dark',
    gradient: 'bg-gradient-to-br from-accent-blue/10 via-transparent to-accent-purple/10'
  }

  return (
    <section
      className={cn(
        'relative',
        spacings[spacing],
        backgrounds[background],
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
}