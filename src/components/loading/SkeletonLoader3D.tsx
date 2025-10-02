'use client'

import { motion } from 'framer-motion'
import { useTheme } from '@/context/theme-context'
import { cn } from '@/lib/utils'

interface SkeletonLoader3DProps {
  className?: string
  height?: string
  showSpinner?: boolean
}

/**
 * Skeleton Loader for 3D Content
 * Displays a gradient placeholder while 3D content loads
 */
export function SkeletonLoader3D({
  className = '',
  height = 'h-full',
  showSpinner = true,
}: SkeletonLoader3DProps) {
  const { actualTheme } = useTheme()

  const gradients = {
    light: 'from-slate-200 via-slate-100 to-slate-200',
    dark: 'from-slate-800 via-slate-700 to-slate-800',
  }

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-lg',
        height,
        className
      )}
    >
      {/* Animated gradient background */}
      <motion.div
        className={cn(
          'absolute inset-0 bg-gradient-to-r',
          gradients[actualTheme]
        )}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          backgroundSize: '200% 100%',
        }}
      />

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Loading spinner */}
      {showSpinner && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className={cn(
              'h-12 w-12 rounded-full border-4',
              actualTheme === 'dark'
                ? 'border-slate-600 border-t-blue-400'
                : 'border-slate-300 border-t-blue-500'
            )}
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>
      )}

      {/* Loading text */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <motion.p
          className={cn(
            'text-sm font-medium',
            actualTheme === 'dark' ? 'text-slate-400' : 'text-slate-600'
          )}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          Loading 3D scene...
        </motion.p>
      </div>
    </div>
  )
}

/**
 * Minimal skeleton for better performance
 */
export function MinimalSkeleton({ className = '' }: { className?: string }) {
  const { actualTheme } = useTheme()

  return (
    <div
      className={cn(
        'w-full h-full rounded-lg',
        actualTheme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-200/50',
        className
      )}
    >
      <div className="flex items-center justify-center h-full">
        <div
          className={cn(
            'h-8 w-8 rounded-full border-2 border-t-transparent animate-spin',
            actualTheme === 'dark'
              ? 'border-slate-600'
              : 'border-slate-300'
          )}
        />
      </div>
    </div>
  )
}
