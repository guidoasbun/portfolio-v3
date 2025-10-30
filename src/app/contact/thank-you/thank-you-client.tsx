'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { FiCheckCircle, FiHome, FiMail, FiClock } from 'react-icons/fi'

export default function ThankYouPageClient() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <GlassCard className="p-8 md:p-12 text-center">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-6 flex justify-center"
          >
            <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/20 flex items-center justify-center">
              <FiCheckCircle className="text-green-500 text-4xl" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#00274C] to-[#E17000] bg-clip-text text-transparent"
          >
            Thank You!
          </motion.h1>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-foreground/70 mb-8"
          >
            Your message has been sent successfully. I appreciate you taking the time to reach out!
          </motion.p>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
          >
            <div className="p-4 rounded-lg glass-light">
              <FiMail className="text-2xl text-accent-blue mb-2 mx-auto" />
              <h3 className="font-semibold mb-1 text-foreground">Check Your Email</h3>
              <p className="text-sm text-foreground/60">
                You&apos;ll receive a confirmation email shortly.
              </p>
            </div>

            <div className="p-4 rounded-lg glass-light">
              <FiClock className="text-2xl text-[#E17000] mb-2 mx-auto" />
              <h3 className="font-semibold mb-1 text-foreground">Response Time</h3>
              <p className="text-sm text-foreground/60">
                I typically respond within 24-48 hours.
              </p>
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <h3 className="text-lg font-semibold mb-3 text-foreground">What Happens Next?</h3>
            <ul className="text-left space-y-2 text-foreground/70 max-w-md mx-auto">
              <li className="flex items-start gap-2">
                <span className="text-accent-blue mt-1">•</span>
                <span>I&apos;ll review your message carefully</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-blue mt-1">•</span>
                <span>You&apos;ll receive a personalized response via email</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent-blue mt-1">•</span>
                <span>We can discuss your project or inquiry in detail</span>
              </li>
            </ul>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/">
              <Button variant="primary" size="lg">
                <FiHome className="mr-2" />
                Back to Home
              </Button>
            </Link>

            <Link href="/#projects">
              <Button variant="secondary" size="lg">
                View My Projects
              </Button>
            </Link>
          </motion.div>
        </GlassCard>
      </motion.div>
    </div>
  )
}
