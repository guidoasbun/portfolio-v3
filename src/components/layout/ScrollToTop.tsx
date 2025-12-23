'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaArrowUp } from 'react-icons/fa'
import { scaleIn } from '@/lib/animations'

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true })
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          variants={scaleIn}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 p-3 glass rounded-full shadow-lg hover:glass-heavy transition-all duration-300 group"
          aria-label="Scroll to top"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaArrowUp className="w-5 h-5 text-foreground group-hover:text-blue-500 transition-colors" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
