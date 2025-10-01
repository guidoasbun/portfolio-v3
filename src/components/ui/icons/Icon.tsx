import React from 'react'
import { cn } from '@/lib/utils'

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string
  className?: string
  'aria-label'?: string
}

/**
 * Base Icon component that all other icons extend
 * Provides consistent sizing, accessibility, and styling
 */
export function Icon({
  size = 24,
  className,
  children,
  'aria-label': ariaLabel,
  ...props
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('inline-block', className)}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
      {...props}
    >
      {children}
    </svg>
  )
}
