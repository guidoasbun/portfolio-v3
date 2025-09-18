import React from 'react'
import { cn } from '@/lib/utils'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'muted'
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required = false, size = 'md', variant = 'default', children, ...props }, ref) => {
    const baseStyles = [
      'font-medium leading-none',
      'peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
    ]

    const variants = {
      default: 'text-foreground',
      muted: 'text-muted-foreground'
    }

    const sizes = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base'
    }

    return (
      <label
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
        {required && (
          <span className="ml-1 text-red-500" aria-label="required">
            *
          </span>
        )}
      </label>
    )
  }
)

Label.displayName = 'Label'

export { Label }