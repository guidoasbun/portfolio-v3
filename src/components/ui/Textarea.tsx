import React from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'ghost'
  error?: boolean
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
  showCharCount?: boolean
  maxCharCount?: number
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    className,
    variant = 'default',
    error = false,
    resize = 'vertical',
    showCharCount = false,
    maxCharCount,
    value,
    onChange,
    ...props
  }, ref) => {
    const [charCount, setCharCount] = React.useState(0)

    React.useEffect(() => {
      if (typeof value === 'string') {
        setCharCount(value.length)
      }
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length)
      onChange?.(e)
    }

    const baseStyles = [
      'w-full rounded-lg border transition-all duration-200',
      'placeholder:text-muted-foreground',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'px-3 sm:px-4 py-3 text-sm sm:text-base min-h-[100px] sm:min-h-[120px]' // Increased min-height for better mobile UX
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

    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize'
    }

    const isOverLimit = maxCharCount && charCount > maxCharCount

    return (
      <div className="relative">
        <textarea
          className={cn(
            baseStyles,
            variants[variant],
            resizeClasses[resize],
            showCharCount && 'pb-8',
            className
          )}
          ref={ref}
          value={value}
          onChange={handleChange}
          {...props}
        />
        {showCharCount && (
          <div className={cn(
            'absolute bottom-2 right-3 text-xs',
            isOverLimit ? 'text-red-500' : 'text-muted-foreground'
          )}>
            {charCount}{maxCharCount && `/${maxCharCount}`}
          </div>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export { Textarea }