import React from 'react'
import { cn } from '@/lib/utils'
import { Label } from './Label'
import { FormError } from './FormError'

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  labelProps?: React.ComponentProps<typeof Label>
  error?: string
  helperText?: string
  required?: boolean
  children: React.ReactNode
}

const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({
    className,
    label,
    labelProps,
    error,
    helperText,
    required = false,
    children,
    ...props
  }, ref) => {
    const fieldId = React.useId()
    const errorId = `${fieldId}-error`
    const helperId = `${fieldId}-helper`

    return (
      <div
        ref={ref}
        className={cn('space-y-2', className)}
        {...props}
      >
        {label && (
          <Label
            htmlFor={fieldId}
            required={required}
            {...labelProps}
          >
            {label}
          </Label>
        )}

        {children}

        {helperText && !error && (
          <div
            id={helperId}
            className="text-sm text-muted-foreground"
          >
            {helperText}
          </div>
        )}

        <FormError
          id={errorId}
          message={error}
          show={!!error}
        />
      </div>
    )
  }
)

FormField.displayName = 'FormField'

export { FormField }