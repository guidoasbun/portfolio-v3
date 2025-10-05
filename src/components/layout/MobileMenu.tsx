'use client'

import React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { drawerVariants, backdropVariants, staggerContainer, staggerItem } from '@/lib/animations'
import { SOCIAL_LINKS } from '@/lib/constants'
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa'
import { useFocusTrap } from '@/hooks/useFocusTrap'

interface NavLink {
  label: string
  href: string
}

const navLinks: NavLink[] = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' }
]

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const iconMap: Record<string, React.ReactElement> = {
  github: <FaGithub className="w-5 h-5" />,
  linkedin: <FaLinkedin className="w-5 h-5" />,
  twitter: <FaTwitter className="w-5 h-5" />,
  mail: <FaEnvelope className="w-5 h-5" />
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const focusTrapRef = useFocusTrap({
    isActive: isOpen,
    onEscape: onClose
  }) as React.RefObject<HTMLDivElement>

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    onClose()

    // Small delay to allow menu to close before scrolling
    setTimeout(() => {
      const targetId = href.substring(1)
      const element = document.getElementById(targetId)

      if (element) {
        const offsetTop = element.offsetTop - 80
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        })
      } else if (targetId === 'home') {
        // If home link and element not found, scroll to top
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
      }
    }, 300)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            ref={focusTrapRef}
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] glass-heavy shadow-2xl z-50 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <div className="p-6">
              {/* Header with close button */}
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Menu
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-foreground/10 transition-colors"
                  aria-label="Close menu"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation Links */}
              <motion.nav
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-2 mb-8"
              >
                {navLinks.map((link) => (
                  <motion.div key={link.href} variants={staggerItem}>
                    <Link
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className={cn(
                        'block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200',
                        'hover:bg-foreground/10 hover:translate-x-2',
                        'text-foreground/80 hover:text-foreground'
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>

              {/* Theme Toggle */}
              <div className="mb-8 px-4">
                <p className="text-sm text-foreground/60 mb-3">Theme</p>
                <ThemeToggle />
              </div>

              {/* Social Links */}
              <div className="border-t border-foreground/10 pt-6">
                <p className="text-sm text-foreground/60 mb-4 px-4">Connect</p>
                <div className="flex items-center space-x-4 px-4">
                  {SOCIAL_LINKS.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-foreground/10 transition-colors text-foreground/70 hover:text-foreground"
                      aria-label={social.name}
                    >
                      {iconMap[social.icon]}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
