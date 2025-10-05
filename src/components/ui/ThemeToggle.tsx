'use client'

import React, { useState } from 'react'
import { useTheme } from '@/context/theme-context'
import { cn } from '@/lib/utils'
import { GlassCard } from './GlassCard'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

  const themes = [
    {
      value: 'light' as const,
      label: 'Light',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      value: 'dark' as const,
      label: 'Dark',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )
    },
    {
      value: 'system' as const,
      label: 'System',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
        </svg>
      )
    }
  ]

  const currentTheme = themes.find(t => t.value === theme)

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme)
    setIsOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      setIsOpen(false)
    } else if (e.key === 'ArrowDown' && isOpen) {
      e.preventDefault()
      const firstButton = dropdownRef.current?.querySelector('button')
      firstButton?.focus()
    }
  }

  React.useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={cn(
          'glass flex items-center gap-2 px-3 py-2 rounded-lg',
          'transition-all duration-200 hover:glass-medium',
          'focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-opacity-50'
        )}
        aria-label="Toggle theme"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {currentTheme?.icon}
        <span className="text-sm font-medium">{currentTheme?.label}</span>
        <svg
          className={cn(
            'w-3 h-3 transition-transform duration-200',
            isOpen && 'transform rotate-180'
          )}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Dropdown */}
          <GlassCard
            variant="medium"
            className="absolute right-0 top-full mt-2 w-48 z-20 p-2 animate-fade-in"
          >
            <div className="space-y-1">
              {themes.map((themeOption) => (
                <button
                  key={themeOption.value}
                  onClick={() => handleThemeChange(themeOption.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setIsOpen(false)
                    }
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 rounded-md text-left',
                    'transition-all duration-200',
                    'hover:glass-light',
                    'focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-inset',
                    theme === themeOption.value && 'glass-medium text-accent-blue'
                  )}
                  role="menuitemradio"
                  aria-checked={theme === themeOption.value}
                >
                  {themeOption.icon}
                  <span className="text-sm">{themeOption.label}</span>
                  {theme === themeOption.value && (
                    <svg className="w-3 h-3 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </GlassCard>
        </>
      )}
    </div>
  )
}