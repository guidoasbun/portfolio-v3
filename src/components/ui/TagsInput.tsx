'use client'

import React, { useState } from 'react'
import type { KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'
import { FiX } from 'react-icons/fi'

interface TagsInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  maxTags?: number
}

export function TagsInput({
  value = [],
  onChange,
  placeholder = 'Add a tag and press Enter',
  className,
  disabled = false,
  maxTags
}: TagsInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addTag()
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      // Remove last tag when backspace is pressed on empty input
      removeTag(value.length - 1)
    }
  }

  const addTag = () => {
    const trimmedValue = inputValue.trim()

    if (!trimmedValue) return

    // Check if tag already exists
    if (value.includes(trimmedValue)) {
      setInputValue('')
      return
    }

    // Check max tags limit
    if (maxTags && value.length >= maxTags) {
      setInputValue('')
      return
    }

    onChange([...value, trimmedValue])
    setInputValue('')
  }

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div
      className={cn(
        'glass rounded-lg border border-foreground/20 p-2 transition-all duration-300',
        'focus-within:glass-heavy focus-within:border-blue-500/50',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <div className="flex flex-wrap gap-2">
        {value.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-sm rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30"
          >
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
                aria-label={`Remove ${tag}`}
              >
                <FiX size={14} />
              </button>
            )}
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={value.length === 0 ? placeholder : ''}
          disabled={disabled || (maxTags !== undefined && value.length >= maxTags)}
          className={cn(
            'flex-1 min-w-[120px] bg-transparent outline-none',
            'text-foreground placeholder:text-muted-foreground',
            'disabled:cursor-not-allowed'
          )}
        />
      </div>
      {maxTags && (
        <p className="text-xs text-muted-foreground mt-2">
          {value.length}/{maxTags} tags
        </p>
      )}
    </div>
  )
}
