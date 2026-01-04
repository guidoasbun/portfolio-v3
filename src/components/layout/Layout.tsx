'use client'

import React, { useState } from 'react'
import { Navbar } from './Navbar'
import { MobileMenu } from './MobileMenu'
import { Footer } from './Footer'
import { ScrollToTop } from './ScrollToTop'
import { GradientBackground } from './GradientBackground'
import { SkipNav } from './SkipNav'
import { OfflineIndicator } from '@/components/ui/OfflineIndicator'
import { ClientOnly } from '@/components/ui/ClientOnly'

interface LayoutProps {
  children: React.ReactNode
}

// Static placeholder navbar for SSR to avoid hydration mismatch
function NavbarPlaceholder() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <span className="text-xl font-bold bg-gradient-to-r from-[#00274C] to-[#E17000] bg-clip-text text-transparent">
            Portfolio
          </span>
        </div>
      </div>
    </nav>
  )
}

export function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleMenuOpen = () => {
    setIsMobileMenuOpen(true)
  }

  const handleMenuClose = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <SkipNav />
      <ClientOnly>
        <GradientBackground />
      </ClientOnly>
      <OfflineIndicator />
      <div className="relative min-h-screen flex flex-col">
        <ClientOnly fallback={<NavbarPlaceholder />}>
          <Navbar onMenuClick={handleMenuOpen} />
        </ClientOnly>
        <MobileMenu isOpen={isMobileMenuOpen} onClose={handleMenuClose} />

        <main id="main-content" className="flex-grow pt-16" tabIndex={-1}>
          {children}
        </main>

        <ClientOnly>
          <Footer />
        </ClientOnly>
        <ScrollToTop />
      </div>
    </>
  )
}
