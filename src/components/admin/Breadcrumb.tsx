/**
 * Breadcrumb Navigation Component
 *
 * Shows current location in admin panel with clickable navigation.
 */

'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { FiChevronRight, FiHome } from 'react-icons/fi'
import { cn } from '@/lib/utils'
import type { BreadcrumbItem } from '@/types/admin'

// Mapping of paths to readable labels
const pathLabels: Record<string, string> = {
  '/admin': 'Dashboard',
  '/admin/projects': 'Projects',
  '/admin/projects/new': 'New Project',
  '/admin/experience': 'Experience',
  '/admin/experience/new': 'New Experience',
  '/admin/messages': 'Messages',
  '/admin/resume': 'Resume',
  '/admin/skills': 'Skills',
  '/admin/skills/new': 'New Skill'
}

export function Breadcrumb() {
  const pathname = usePathname()

  // Generate breadcrumb items from pathname
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = []

    // Build breadcrumbs incrementally
    let currentPath = ''
    paths.forEach((path, index) => {
      currentPath += `/${path}`

      // Check if this is an ID (UUID format or edit path)
      const isId = path.length > 20 || path === 'edit'

      if (!isId) {
        const label = pathLabels[currentPath] || path.charAt(0).toUpperCase() + path.slice(1)
        breadcrumbs.push({
          label,
          href: index === paths.length - 1 ? undefined : currentPath
        })
      } else if (path === 'edit') {
        breadcrumbs.push({
          label: 'Edit',
          href: undefined
        })
      }
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  if (breadcrumbs.length === 0) return null

  return (
    <nav className="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
      {/* Home icon */}
      <Link
        href="/admin"
        className="text-muted-foreground hover:text-foreground transition-colors p-1"
        aria-label="Admin home"
      >
        <FiHome size={16} />
      </Link>

      {/* Breadcrumb items */}
      {breadcrumbs.map((item, index) => (
        <div key={item.href || item.label} className="flex items-center space-x-2">
          <FiChevronRight size={14} className="text-muted-foreground" />

          {item.href ? (
            <Link
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className={cn(
              'font-medium',
              index === breadcrumbs.length - 1 ? 'text-foreground' : 'text-muted-foreground'
            )}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}
