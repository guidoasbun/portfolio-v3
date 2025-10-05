'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { FiHome, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error boundary caught:', error)
  }, [error])

  return (
    <Container className="min-h-screen flex items-center justify-center">
      <GlassCard variant="medium" className="max-w-2xl w-full p-8 md:p-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Error Icon */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <FiAlertTriangle className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Something went wrong!
          </motion.h1>

          {/* Description */}
          <motion.p
            className="text-foreground/70 text-lg mb-2 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            We encountered an unexpected error. Don&apos;t worry, our team has been notified.
          </motion.p>

          {/* Error Digest (if available) */}
          {error.digest && (
            <motion.p
              className="text-foreground/50 text-sm mb-8 font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              Error ID: {error.digest}
            </motion.p>
          )}

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              variant="primary"
              size="lg"
              onClick={reset}
              className="w-full sm:w-auto"
            >
              <FiRefreshCw className="mr-2 w-5 h-5" />
              Try Again
            </Button>
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => window.location.href = '/'}
            >
              <FiHome className="mr-2 w-5 h-5" />
              Go Home
            </Button>
          </motion.div>

          {/* Development Mode Error Details */}
          {process.env.NODE_ENV === 'development' && (
            <motion.div
              className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-left"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">
                Development Error Details:
              </p>
              <pre className="text-xs text-foreground/70 overflow-auto max-h-40">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </motion.div>
          )}

          {/* Help Text */}
          <motion.div
            className="mt-8 text-foreground/50 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <p>If this problem persists, please contact support.</p>
          </motion.div>
        </motion.div>
      </GlassCard>
    </Container>
  )
}
