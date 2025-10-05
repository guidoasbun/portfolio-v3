import React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  error?: boolean
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', size = 'md', error = false, icon, type, ...props }, ref) => {
    const baseStyles = [
      'w-full rounded-lg border transition-all duration-200',
      'placeholder:text-muted-foreground',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      'disabled:cursor-not-allowed disabled:opacity-50'
    ]

    const variants = {
      default: [
        'glass-light',
        'border-border-glass',
        'text-foreground',
        'focus:glass-medium focus:border-accent-blue/50 focus:ring-accent-blue/20',
        error && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20'
      ],
      ghost: [
        'bg-transparent border-transparent',
        'text-foreground',
        'focus:glass-light focus:border-border-glass focus:ring-accent-blue/20',
        error && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20'
      ]
    }

    const sizes = {
      sm: 'h-10 px-3 text-sm', // Increased from h-8 for better touch targets (40px)
      md: 'h-11 px-4 text-sm', // Increased from h-10 to h-11 for 44px minimum touch target
      lg: 'h-12 px-4 text-base'
    }

    const iconPadding = {
      sm: icon ? 'pl-9' : '',
      md: icon ? 'pl-10' : '',
      lg: icon ? 'pl-12' : ''
    }

    return (
      <div className="relative">
        {icon && (
          <div className={cn(
            'absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground',
            size === 'sm' && 'left-2',
            size === 'lg' && 'left-4'
          )}>
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            baseStyles,
            variants[variant],
            sizes[size],
            iconPadding[size],
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }