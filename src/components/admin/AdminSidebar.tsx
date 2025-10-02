/**
 * Admin Sidebar Component
 *
 * Reusable sidebar navigation for admin panel with user info,
 * navigation links, and logout functionality.
 */

'use client'

import { useAuth } from '@/hooks/useAuth'
import { LogoutButton } from '@/components/auth/LogoutButton'
import { GlassCard } from '@/components/ui/GlassCard'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { NavItem } from '@/types/admin'

interface AdminSidebarProps {
  navItems: NavItem[];
  onLinkClick?: () => void;
}

export function AdminSidebar({ navItems, onLinkClick }: AdminSidebarProps) {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
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
              onClick={onLinkClick}
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
  )
}
