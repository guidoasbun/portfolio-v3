'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { FiHome, FiArrowLeft } from 'react-icons/fi'

export default function NotFound() {
  return (
    <Container className="min-h-screen flex items-center justify-center">
      <GlassCard variant="medium" className="max-w-2xl w-full p-8 md:p-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* 404 Number */}
          <motion.h1
            className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-[#00274C] to-[#E17000] bg-clip-text text-transparent mb-4"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
          >
            404
          </motion.h1>

          {/* Title */}
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Page Not Found
          </motion.h2>

          {/* Description */}
          <motion.p
            className="text-foreground/70 text-lg mb-8 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Oops! The page you&apos;re looking for doesn&apos;t exist. It might have been moved or deleted.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Link href="/">
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                <FiHome className="mr-2 w-5 h-5" />
                Go Home
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => window.history.back()}
            >
              <FiArrowLeft className="mr-2 w-5 h-5" />
              Go Back
            </Button>
          </motion.div>

          {/* Decorative Element */}
          <motion.div
            className="mt-12 text-foreground/30 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p>Lost? Try these helpful links:</p>
            <div className="flex flex-wrap gap-4 justify-center mt-4">
              <Link href="/#projects" className="hover:text-blue-500 transition-colors">
                Projects
              </Link>
              <Link href="/#experience" className="hover:text-blue-500 transition-colors">
                Experience
              </Link>
              <Link href="/#contact" className="hover:text-blue-500 transition-colors">
                Contact
              </Link>
              <Link href="/resume" className="hover:text-blue-500 transition-colors">
                Resume
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </GlassCard>
    </Container>
  )
}
