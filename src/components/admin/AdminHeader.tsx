/**
 * Admin Header Component
 *
 * Top header bar for admin panel with mobile menu toggle and breadcrumbs.
 */

'use client'

import { FiMenu, FiX } from 'react-icons/fi'
import { Breadcrumb } from './Breadcrumb'

interface AdminHeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function AdminHeader({ isSidebarOpen, onToggleSidebar }: AdminHeaderProps) {
  return (
    <div className="lg:hidden fixed top-20 left-4 z-50 flex items-center gap-4">
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-lg glass hover:glass-heavy transition-all"
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Breadcrumb visible on mobile when sidebar is closed */}
      {!isSidebarOpen && (
        <div className="hidden sm:block">
          <Breadcrumb />
        </div>
      )}
    </div>
  )
}
