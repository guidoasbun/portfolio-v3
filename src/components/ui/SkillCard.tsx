'use client'

import React, { memo } from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from './GlassCard'
import type { Skill } from '@/types'
import { cn } from '@/lib/utils'
import { getSkillIcon } from '@/lib/icon-map'

interface SkillCardProps {
  skill: Skill
  index: number
}

function SkillCardComponent({ skill, index }: SkillCardProps) {
  const { name, color, icon } = skill
  const IconComponent = getSkillIcon(icon)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="h-full"
    >
      <GlassCard
        variant="light"
        className={cn(
          'group relative h-full flex items-center justify-center p-4 sm:p-6',
          'transition-all duration-300 cursor-default',
          'hover:shadow-lg hover:border-foreground/20'
        )}
      >
        {/* Skill Icon and Name */}
        <div className="text-center flex flex-col items-center gap-2">
          {/* Icon */}
          {IconComponent && (
            <IconComponent
              className={cn(
                'w-8 h-8 sm:w-10 sm:h-10 transition-all duration-300',
                'group-hover:scale-110'
              )}
              style={{ color: color || '#3B82F6' }}
              aria-hidden="true"
            />
          )}

          {/* Skill Name */}
          <h3
            className={cn(
              'text-sm sm:text-base font-semibold text-foreground',
              'transition-colors duration-300',
              'group-hover:text-blue-500'
            )}
          >
            {name}
          </h3>

          {/* Optional: Colored accent line on hover */}
          <motion.div
            initial={{ width: 0 }}
            whileHover={{ width: '100%' }}
            transition={{ duration: 0.3 }}
            className="h-0.5 mt-1 mx-auto rounded-full"
            style={{
              backgroundColor: color || '#3B82F6',
            }}
          />
        </div>

        {/* Subtle glow effect on hover */}
        <div
          className={cn(
            'absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20',
            'transition-opacity duration-300 blur-xl -z-10'
          )}
          style={{
            backgroundColor: color || '#3B82F6',
          }}
        />
      </GlassCard>
    </motion.div>
  )
}

// Memoize component to prevent unnecessary re-renders
export const SkillCard = memo(SkillCardComponent)
