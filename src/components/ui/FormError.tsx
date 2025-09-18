import React from 'react'
import { cn } from '@/lib/utils'

interface FormErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string
  show?: boolean
  icon?: React.ReactNode
}

const FormError = React.forwardRef<HTMLDivElement, FormErrorProps>(
  ({ className, message, show = true, icon, children, ...props }, ref) => {
    if (!show || (!message && !children)) {
      return null
    }

    const defaultIcon = (
      <svg
        className="h-4 w-4 shrink-0"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    )

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 text-sm text-red-500',
          'animate-[fadeIn_0.2s_ease-in-out]',
          className
        )}
        role="alert"
        aria-live="polite"
        {...props}
      >
        {icon !== undefined ? icon : defaultIcon}
        <span>{message || children}</span>
      </div>
    )
  }
)

FormError.displayName = 'FormError'

export { FormError }