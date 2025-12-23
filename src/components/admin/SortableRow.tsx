'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FiMenu } from 'react-icons/fi'

interface SortableRowProps {
  id: string
  children: React.ReactNode
  disabled?: boolean
}

export function SortableRow({ id, children, disabled = false }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 1 : 0,
  }

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-b border-foreground/5 hover:bg-foreground/5 transition-colors ${
        isDragging ? 'bg-foreground/10 shadow-lg' : ''
      }`}
    >
      {/* Drag Handle Cell */}
      <td className="py-3 px-2 w-10">
        {!disabled && (
          <button
            type="button"
            className="p-1.5 rounded hover:bg-foreground/10 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors touch-none"
            {...attributes}
            {...listeners}
            aria-label="Drag to reorder"
          >
            <FiMenu size={16} />
          </button>
        )}
      </td>
      {children}
    </tr>
  )
}

interface SortableCardProps {
  id: string
  children: React.ReactNode
  disabled?: boolean
  className?: string
}

export function SortableCard({ id, children, disabled = false, className = '' }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative ${isDragging ? 'shadow-lg z-10' : ''} ${className}`}
    >
      {/* Drag Handle */}
      {!disabled && (
        <button
          type="button"
          className="absolute top-4 left-4 p-1.5 rounded hover:bg-foreground/10 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors touch-none z-10"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
        >
          <FiMenu size={16} />
        </button>
      )}
      {children}
    </div>
  )
}
