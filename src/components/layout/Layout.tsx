'use client'

import React, { useState } from 'react'
import { Navbar } from './Navbar'
import { MobileMenu } from './MobileMenu'
import { Footer } from './Footer'
import { ScrollToTop } from './ScrollToTop'
import { GradientBackground } from './GradientBackground'

interface LayoutProps {
  children: React.ReactNode
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
      <GradientBackground />
      <div className="relative min-h-screen flex flex-col">
        <Navbar onMenuClick={handleMenuOpen} />
        <MobileMenu isOpen={isMobileMenuOpen} onClose={handleMenuClose} />

        <main className="flex-grow pt-16">
          {children}
        </main>

        <Footer />
        <ScrollToTop />
      </div>
    </>
  )
}
