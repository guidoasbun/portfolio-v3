'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface SkipNavLinkProps {
  href: string
  children: React.ReactNode
}

function SkipNavLink({ href, children }: SkipNavLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        'skip-nav-link',
        'absolute left-0 top-0 z-[100]',
        'px-4 py-2 rounded-md',
        'bg-blue-600 text-white font-medium',
        'transform -translate-y-full',
        'focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'transition-transform duration-200'
      )}
    >
      {children}
    </a>
  )
}

export function SkipNav() {
  return (
    <div className="skip-nav-container">
      <SkipNavLink href="#main-content">
        Skip to main content
      </SkipNavLink>
      <SkipNavLink href="#navigation">
        Skip to navigation
      </SkipNavLink>
    </div>
  )
}
