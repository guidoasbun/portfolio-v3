'use client'

import dynamic from 'next/dynamic'
import { Scene } from './Scene'
import { useTheme } from '@/context/theme-context'
import type { ThreeTheme } from '@/types/three'

// Dynamically import InteractiveElements to avoid SSR issues
const InteractiveElements = dynamic(
  () => import('./InteractiveElements').then((mod) => ({ default: mod.InteractiveElements })),
  { ssr: false }
)

interface InteractiveSceneProps {
  className?: string
  objectCount?: number
  enableScrollAnimation?: boolean
  enableParallax?: boolean
}

/**
 * Interactive 3D scene wrapper with theme integration
 * Can be used anywhere in the app to add interactive 3D elements
 */
export function InteractiveScene({
  className = 'w-full h-full',
  objectCount = 8,
  enableScrollAnimation = true,
  enableParallax = true,
}: InteractiveSceneProps) {
  const { actualTheme } = useTheme()

  return (
    <Scene className={className}>
      <InteractiveElements
        theme={actualTheme as ThreeTheme}
        objectCount={objectCount}
        enableScrollAnimation={enableScrollAnimation}
        enableParallax={enableParallax}
      />
    </Scene>
  )
}
