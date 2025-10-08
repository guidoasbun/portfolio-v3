/**
 * Icon Mapping Utility
 *
 * Maps icon name strings to React Icon components from react-icons library.
 * Used primarily for dynamically rendering skill icons from database.
 */

import * as SiIcons from 'react-icons/si'
import * as FiIcons from 'react-icons/fi'
import type { IconType } from 'react-icons'

/**
 * Get a React Icon component from an icon name string
 *
 * @param iconName - Icon name (e.g., 'SiReact', 'FiCode')
 * @returns React Icon component or null if not found
 *
 * @example
 * ```tsx
 * const Icon = getSkillIcon('SiReact')
 * return Icon ? <Icon className="w-6 h-6" /> : null
 * ```
 */
export const getSkillIcon = (iconName?: string): IconType | null => {
  if (!iconName) return null

  // Try Simple Icons (Si prefix)
  if (iconName.startsWith('Si')) {
    const IconComponent = SiIcons[iconName as keyof typeof SiIcons]
    if (IconComponent) return IconComponent as IconType
  }

  // Try Feather Icons (Fi prefix)
  if (iconName.startsWith('Fi')) {
    const IconComponent = FiIcons[iconName as keyof typeof FiIcons]
    if (IconComponent) return IconComponent as IconType
  }

  // Fallback: Try without prefix
  const fallbackName = `Si${iconName}`
  const FallbackComponent = SiIcons[fallbackName as keyof typeof SiIcons]
  if (FallbackComponent) return FallbackComponent as IconType

  return null
}

/**
 * Check if an icon name exists in the icon libraries
 *
 * @param iconName - Icon name to check
 * @returns true if icon exists, false otherwise
 */
export const hasIcon = (iconName?: string): boolean => {
  return getSkillIcon(iconName) !== null
}
