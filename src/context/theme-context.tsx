'use client'

import React, { createContext, useContext, useEffect, useState, useRef } from 'react'
import { trackEvent } from '@/lib/firebase/analytics'

type Theme = 'dark' | 'light' | 'system'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  actualTheme: 'dark' | 'light'
  mounted: boolean
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
  actualTheme: 'light',
  mounted: false
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'portfolio-theme',
  ...props
}: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [actualTheme, setActualTheme] = useState<'dark' | 'light'>('light')
  const previousThemeRef = useRef<Theme>(defaultTheme)

  // DEBUG: Track theme provider lifecycle
  console.log("[ThemeProvider] Render - mounted:", mounted, "theme:", theme, "actualTheme:", actualTheme)

  // Mark as mounted after hydration
  useEffect(() => {
    console.log("[ThemeProvider] Mount effect - setting mounted=true")
    setMounted(true)
    return () => {
      console.log("[ThemeProvider] Unmounting!")
    }
  }, [])

  useEffect(() => {
    // Get theme from localStorage or use default
    const storedTheme = localStorage.getItem(storageKey) as Theme
    if (storedTheme) {
      setTheme(storedTheme)
    }
  }, [storageKey])

  useEffect(() => {
    const updateActualTheme = () => {
      let resolvedTheme: 'dark' | 'light'

      if (theme === 'system') {
        resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
      } else {
        resolvedTheme = theme
      }

      setActualTheme(resolvedTheme)

      const root = window.document.documentElement
      root.classList.remove('light', 'dark')
      root.classList.add(resolvedTheme)
    }

    // Update theme immediately
    updateActualTheme()

    // Listen for system theme changes if theme is 'system'
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => updateActualTheme()

      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }
  }, [theme])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      const previousTheme = previousThemeRef.current

      // Track theme change
      trackEvent('theme_change', {
        theme_mode: newTheme,
        previous_theme: previousTheme,
      })

      // Update refs
      previousThemeRef.current = newTheme

      // Save and apply theme
      localStorage.setItem(storageKey, newTheme)
      setTheme(newTheme)
    },
    actualTheme,
    mounted
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}