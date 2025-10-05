'use client'

/**
 * Global Error Handler
 *
 * Catches errors that occur in the root layout.
 * This is a special Next.js file that wraps the entire application.
 */

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { FiHome, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi'

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    // Log the error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Global error caught:', error)
    }

    // In production, you would send this to an error reporting service
    // Example: Sentry, LogRocket, etc.
  }, [error])

  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-2xl w-full backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-lg p-8 md:p-12 text-center">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                <FiAlertTriangle className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Something went wrong!
            </h1>

            {/* Description */}
            <p className="text-white/70 text-lg mb-2 max-w-md mx-auto">
              We encountered an unexpected error. Don&apos;t worry, our team has been notified.
            </p>

            {/* Error Digest (if available) */}
            {error.digest && (
              <p className="text-white/50 text-sm mb-8 font-mono">
                Error ID: {error.digest}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
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
            </div>

            {/* Development Mode Error Details */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-left">
                <p className="text-sm font-semibold text-red-400 mb-2">
                  Development Error Details:
                </p>
                <pre className="text-xs text-white/70 overflow-auto max-h-40">
                  {error.message}
                  {error.stack && `\n\n${error.stack}`}
                </pre>
              </div>
            )}

            {/* Help Text */}
            <div className="mt-8 text-white/50 text-sm">
              <p>If this problem persists, please contact support.</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
