import React from 'react'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectOptionGroup {
  label: string
  options: SelectOption[]
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  variant?: 'default' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  error?: boolean
  placeholder?: string
  options?: SelectOption[]
  optionGroups?: SelectOptionGroup[]
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({
    className,
    variant = 'default',
    size = 'md',
    error = false,
    placeholder,
    options = [],
    optionGroups = [],
    children,
    ...props
  }, ref) => {
    const baseStyles = [
      'w-full rounded-lg border transition-all duration-200',
      'text-foreground appearance-none',
      'focus:outline-none focus:ring-2 focus:ring-offset-0',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'cursor-pointer',
      // Custom arrow styles
      'bg-[url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")]',
      'bg-no-repeat bg-right-3 bg-[length:16px_16px]'
    ]

    const variants = {
      default: [
        'glass-light',
        'border-border-glass',
        'focus:glass-medium focus:border-accent-blue/50 focus:ring-accent-blue/20',
        error && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20'
      ],
      ghost: [
        'bg-transparent border-transparent',
        'focus:glass-light focus:border-border-glass focus:ring-accent-blue/20',
        error && 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20'
      ]
    }

    const sizes = {
      sm: 'h-8 px-3 pr-8 text-sm',
      md: 'h-10 px-4 pr-10 text-sm',
      lg: 'h-12 px-4 pr-12 text-base'
    }

    const renderOptions = () => {
      if (optionGroups.length > 0) {
        return optionGroups.map((group, groupIndex) => (
          <optgroup key={groupIndex} label={group.label}>
            {group.options.map((option, optionIndex) => (
              <option
                key={`${groupIndex}-${optionIndex}`}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </optgroup>
        ))
      }

      return options.map((option, index) => (
        <option
          key={index}
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </option>
      ))
    }

    return (
      <select
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children || renderOptions()}
      </select>
    )
  }
)

Select.displayName = 'Select'

export { Select, type SelectOption, type SelectOptionGroup }