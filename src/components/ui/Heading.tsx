import React from 'react'
import { cn } from '@/lib/utils'

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as: 'h1' | 'h2' | 'h3'
  gradient?: boolean
  children: React.ReactNode
}

export function Heading({
  as: Component,
  gradient = false,
  className,
  children,
  ...props
}: HeadingProps) {
  const baseStyles = [
    'font-bold tracking-tight',
    'animate-fade-in'
  ]

  const variants = {
    h1: [
      'text-4xl sm:text-5xl md:text-6xl',
      'leading-tight'
    ],
    h2: [
      'text-3xl sm:text-4xl md:text-5xl',
      'leading-tight'
    ],
    h3: [
      'text-2xl sm:text-3xl md:text-4xl',
      'leading-snug'
    ]
  }

  const gradientStyles = gradient ? [
    'bg-gradient-to-r from-[#00274C] to-[#E17000]',
    'bg-clip-text text-transparent'
  ] : []

  return (
    <Component
      className={cn(
        baseStyles,
        variants[Component],
        gradientStyles,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}