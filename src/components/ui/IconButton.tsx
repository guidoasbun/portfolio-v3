'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { iconButtonHover } from '@/lib/animations/iconAnimations'

interface IconButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onAnimationStart' | 'onDragStart' | 'onDragEnd' | 'onDrag'
> {
  /**
   * The visual style variant of the button
   */
  variant?: 'primary' | 'secondary' | 'ghost' | 'glass' | 'danger'
  /**
   * Size of the button
   */
  size?: 'sm' | 'md' | 'lg'
  /**
   * Accessible label for screen readers (required for icon-only buttons)
   */
  'aria-label': string
  /**
   * Icon component to render inside the button
   */
  children: React.ReactNode
  /**
   * If true, shows a loading spinner
   */
  isLoading?: boolean
  /**
   * Tooltip text to show on hover
   */
  tooltip?: string
  /**
   * If true, button will be rounded in a circle
   */
  rounded?: boolean
}

/**
 * IconButton - A button component optimized for icon-only buttons
 *
 * @example
 * <IconButton aria-label="Settings" variant="ghost">
 *   <SettingsIcon />
 * </IconButton>
 *
 * @example
 * <IconButton aria-label="Delete" variant="danger" size="sm">
 *   <TrashIcon />
 * </IconButton>
 */
export function IconButton({
  variant = 'ghost',
  size = 'md',
  className,
  children,
  isLoading = false,
  tooltip,
  rounded = true,
  disabled,
  'aria-label': ariaLabel,
  ...props
}: IconButtonProps) {
  const baseStyles = [
    'inline-flex items-center justify-center',
    'transition-all duration-200 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'relative group',
  ]

  const variants = {
    primary: [
      'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md',
      'hover:from-blue-600 hover:to-purple-700 hover:shadow-lg',
      'focus:ring-blue-500',
    ],
    secondary: [
      'glass text-foreground border border-foreground/20',
      'hover:glass-heavy hover:bg-foreground/5 hover:shadow-md',
      'focus:ring-blue-500',
    ],
    ghost: [
      'text-foreground hover:bg-foreground/10',
      'focus:ring-blue-500',
    ],
    glass: [
      'glass text-foreground backdrop-blur-md',
      'hover:bg-foreground/10',
      'focus:ring-blue-500',
    ],
    danger: [
      'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950',
      'focus:ring-red-500',
    ],
  }

  const sizes = {
    sm: 'p-1.5 text-sm',
    md: 'p-2 text-base',
    lg: 'p-3 text-lg',
  }

  const roundedStyles = rounded ? 'rounded-full' : 'rounded-lg'

  return (
    <motion.button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        roundedStyles,
        className
      )}
      aria-label={ariaLabel}
      disabled={disabled || isLoading}
      title={tooltip || ariaLabel}
      initial="rest"
      whileHover={!disabled && !isLoading ? 'hover' : 'rest'}
      whileTap={!disabled && !isLoading ? 'tap' : 'rest'}
      variants={iconButtonHover}
      {...props}
    >
      {isLoading ? (
        <motion.div
          className="h-5 w-5"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <svg
            className="h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </motion.div>
      ) : (
        children
      )}

      {/* Tooltip on hover */}
      {tooltip && !disabled && (
        <span
          className={cn(
            'absolute -top-10 left-1/2 -translate-x-1/2',
            'px-2 py-1 text-xs rounded-md',
            'glass text-foreground whitespace-nowrap',
            'opacity-0 group-hover:opacity-100',
            'transition-opacity duration-200',
            'pointer-events-none z-50'
          )}
        >
          {tooltip}
        </span>
      )}
    </motion.button>
  )
}

/**
 * IconButtonGroup - A container for grouping multiple IconButtons
 */
interface IconButtonGroupProps {
  children: React.ReactNode
  className?: string
  /**
   * Spacing between buttons
   */
  spacing?: 'none' | 'sm' | 'md' | 'lg'
  /**
   * Orientation of the group
   */
  orientation?: 'horizontal' | 'vertical'
}

export function IconButtonGroup({
  children,
  className,
  spacing = 'md',
  orientation = 'horizontal',
}: IconButtonGroupProps) {
  const spacingStyles = {
    none: 'gap-0',
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-4',
  }

  const orientationStyles = {
    horizontal: 'flex-row',
    vertical: 'flex-col',
  }

  return (
    <div
      className={cn(
        'inline-flex',
        orientationStyles[orientation],
        spacingStyles[spacing],
        className
      )}
    >
      {children}
    </div>
  )
}
