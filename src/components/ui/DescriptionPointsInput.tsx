'use client'

import React, { useState } from 'react'
import { Button } from './Button'
import { Textarea } from './Textarea'
import { cn } from '@/lib/utils'
import { FiPlus, FiTrash2 } from 'react-icons/fi'

interface DescriptionPointsInputProps {
  value: string[]
  onChange: (value: string[]) => void
  disabled?: boolean
  maxPoints?: number
  maxLength?: number
  placeholder?: string
  error?: string
}

export function DescriptionPointsInput({
  value,
  onChange,
  disabled = false,
  maxPoints = 10,
  maxLength = 200,
  placeholder = 'Enter a description point...',
  error
}: DescriptionPointsInputProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  // Add a new point
  const handleAddPoint = () => {
    if (value.length >= maxPoints) return
    onChange([...value, ''])
    setEditingIndex(value.length)
  }

  // Update a point
  const handleUpdatePoint = (index: number, text: string) => {
    const newValue = [...value]
    newValue[index] = text
    onChange(newValue)
  }

  // Remove a point
  const handleRemovePoint = (index: number) => {
    const newValue = value.filter((_, i) => i !== index)
    onChange(newValue)
    if (editingIndex === index) {
      setEditingIndex(null)
    }
  }

  return (
    <div className="space-y-3">
      {/* Points List */}
      <div className="space-y-2">
        {value.map((point, index) => (
          <div
            key={index}
            className={cn(
              'flex items-start gap-2 p-3 rounded-lg',
              'glass-light border border-border-glass',
              'transition-all duration-200',
              editingIndex === index && 'ring-2 ring-accent-blue/20'
            )}
          >
            {/* Point Number */}
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent-blue/10 text-accent-blue flex items-center justify-center text-xs font-medium mt-1">
              {index + 1}
            </div>

            {/* Point Content */}
            <div className="flex-1 min-w-0">
              <Textarea
                value={point}
                onChange={(e) => handleUpdatePoint(index, e.target.value)}
                onFocus={() => setEditingIndex(index)}
                onBlur={() => setEditingIndex(null)}
                placeholder={placeholder}
                disabled={disabled}
                maxLength={maxLength}
                rows={2}
                className="text-sm resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {point.length}/{maxLength} characters
              </p>
            </div>

            {/* Remove Button */}
            <button
              type="button"
              onClick={() => handleRemovePoint(index)}
              disabled={disabled || value.length <= 1}
              className={cn(
                'flex-shrink-0 p-2 rounded-lg',
                'text-red-500 hover:bg-red-500/10',
                'transition-colors duration-200',
                'disabled:opacity-30 disabled:cursor-not-allowed',
                'mt-1'
              )}
              aria-label="Remove point"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Add Point Button */}
      {value.length < maxPoints && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleAddPoint}
          disabled={disabled}
          className="w-full"
        >
          <FiPlus className="mr-2" />
          Add Description Point ({value.length}/{maxPoints})
        </Button>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-500 mt-2">{error}</p>
      )}

      {/* Helper Text */}
      <p className="text-xs text-muted-foreground">
        Add 1-{maxPoints} bullet points describing your responsibilities and achievements
      </p>
    </div>
  )
}
