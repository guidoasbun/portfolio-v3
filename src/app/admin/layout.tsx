/**
 * Admin Layout
 *
 * Protected layout for all admin pages.
 * Uses extracted components for better maintainability.
 */

'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { Breadcrumb } from '@/components/admin/Breadcrumb'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { createErrorBoundaryHandler } from '@/lib/errors'
import {
  FiHome,
  FiBriefcase,
  FiFolder,
  FiMail,
  FiFileText,
  FiCode,
  FiBarChart2
} from 'react-icons/fi'
import { useState } from 'react'
import type { NavItem } from '@/types/admin'

interface AdminLayoutProps {
  children: React.ReactNode
}

const navItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: FiHome },
  { href: '/admin/projects', label: 'Projects', icon: FiFolder },
  { href: '/admin/experience', label: 'Experience', icon: FiBriefcase },
  { href: '/admin/skills', label: 'Skills', icon: FiCode },
  { href: '/admin/messages', label: 'Messages', icon: FiMail },
  { href: '/admin/resume', label: 'Resume', icon: FiFileText },
  { href: '/admin/analytics', label: 'Analytics', icon: FiBarChart2 }
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Don't show admin layout on public auth pages
  const publicAuthPages = ['/admin/login', '/admin/forgot-password']
  if (publicAuthPages.includes(pathname)) {
    return <>{children}</>
  }

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-transparent">
        {/* Mobile header with menu button and breadcrumb */}
        <AdminHeader
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Sidebar */}
        <aside
          className={cn(
            'fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 p-4 transition-transform duration-300 z-40',
            'lg:translate-x-0',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <AdminSidebar
            navItems={navItems}
            onLinkClick={() => setIsSidebarOpen(false)}
          />
        </aside>

        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="lg:ml-64 pt-20 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Desktop breadcrumb */}
            <div className="hidden lg:block mb-6">
              <Breadcrumb />
            </div>

            <ErrorBoundary onError={createErrorBoundaryHandler('AdminLayout')}>
              {children}
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
