/**
 * Admin Layout
 *
 * Protected layout for all admin pages.
 * Includes sidebar navigation and logout functionality.
 */

'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { GlassCard } from '@/components/ui/GlassCard'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  FiHome,
  FiBriefcase,
  FiFolder,
  FiMail,
  FiFileText,
  FiMenu,
  FiX
} from 'react-icons/fi'
import { useState } from 'react'

interface AdminLayoutProps {
  children: React.ReactNode
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: FiHome },
  { href: '/admin/projects', label: 'Projects', icon: FiFolder },
  { href: '/admin/experience', label: 'Experience', icon: FiBriefcase },
  { href: '/admin/messages', label: 'Messages', icon: FiMail },
  { href: '/admin/resume', label: 'Resume', icon: FiFileText }
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const { user } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Don't show admin layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-transparent">
        {/* Mobile menu button */}
        <div className="lg:hidden fixed top-20 left-4 z-50">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg glass hover:glass-heavy transition-all"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Sidebar */}
        <aside
          className={cn(
            'fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 p-4 transition-transform duration-300 z-40',
            'lg:translate-x-0',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <GlassCard className="h-full flex flex-col">
            {/* User info */}
            <div className="p-4 border-b border-foreground/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Admin</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all',
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                        : 'text-foreground hover:bg-foreground/5'
                    )}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Logout button */}
            <div className="p-4 border-t border-foreground/10">
              <LogoutButton
                variant="secondary"
                size="md"
                className="w-full"
                showConfirm
              />
            </div>
          </GlassCard>
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
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
