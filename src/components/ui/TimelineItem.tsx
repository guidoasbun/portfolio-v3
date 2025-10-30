'use client'

import React, { memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from './GlassCard'
import type { Experience } from '@/types'
import { formatDateRange, calculateDuration } from '@/data/experiences'
import {
  FiBriefcase,
  FiAward,
  FiBookOpen,
  FiMapPin,
  FiCalendar,
  FiClock,
} from 'react-icons/fi'
import { cn } from '@/lib/utils'

interface TimelineItemProps {
  experience: Experience
  index: number
  isLast?: boolean
}

function TimelineItemComponent({ experience, index, isLast = false }: TimelineItemProps) {
  const {
    type,
    title,
    company,
    location,
    startDate,
    endDate,
    current,
    description,
    technologies,
  } = experience

  // Get icon based on experience type
  const getIcon = () => {
    switch (type) {
      case 'work':
        return FiBriefcase
      case 'internship':
        return FiAward
      case 'education':
        return FiBookOpen
      default:
        return FiBriefcase
    }
  }

  // Get color based on experience type
  const getColor = () => {
    switch (type) {
      case 'work':
        return 'text-[#00274C] bg-[#00274C]/10 border-[#00274C]/20'
      case 'internship':
        return 'text-[#E17000] bg-[#E17000]/10 border-[#E17000]/20'
      case 'education':
        return 'text-green-500 bg-green-500/10 border-green-500/20'
      default:
        return 'text-[#00274C] bg-[#00274C]/10 border-[#00274C]/20'
    }
  }

  // Get dot color for timeline
  const getDotColor = () => {
    switch (type) {
      case 'work':
        return 'bg-[#00274C]'
      case 'internship':
        return 'bg-[#E17000]'
      case 'education':
        return 'bg-green-500'
      default:
        return 'bg-[#00274C]'
    }
  }

  // Memoize computed values to prevent recalculation on every render
  const Icon = useMemo(() => getIcon(), [type])
  const dateRange = useMemo(() => formatDateRange(startDate, endDate, current), [startDate, endDate, current])
  const duration = useMemo(() => calculateDuration(startDate, endDate, current), [startDate, endDate, current])

  return (
    <div className="relative flex gap-6">
      {/* Timeline Line and Dot */}
      <div className="flex flex-col items-center">
        {/* Dot */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="relative z-10"
        >
          <div
            className={cn(
              'w-4 h-4 rounded-full ring-4 ring-background',
              getDotColor(),
              current && 'animate-pulse'
            )}
          />
          {current && (
            <div
              className={cn(
                'absolute inset-0 w-4 h-4 rounded-full animate-ping',
                getDotColor(),
                'opacity-75'
              )}
            />
          )}
        </motion.div>

        {/* Connecting Line */}
        {!isLast && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            whileInView={{ height: '100%', opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
            className="w-0.5 flex-1 bg-gradient-to-b from-foreground/20 to-foreground/5 mt-2"
          />
        )}
      </div>

      {/* Content Card */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="flex-1 pb-8"
      >
        <GlassCard hover className="p-6 group">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            {/* Icon */}
            <div
              className={cn(
                'p-3 rounded-lg border transition-all duration-300',
                getColor(),
                'group-hover:scale-110'
              )}
            >
              <Icon className="w-5 h-5" />
            </div>

            {/* Title and Company */}
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-blue-500 transition-colors">
                {title}
              </h3>
              <p className="text-lg font-medium text-foreground/80 mb-2">{company}</p>

              {/* Meta Information */}
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-foreground/60">
                <span className="flex items-center gap-1">
                  <FiMapPin className="w-4 h-4" />
                  {location}
                </span>
                <span className="flex items-center gap-1">
                  <FiCalendar className="w-4 h-4" />
                  {dateRange}
                </span>
                <span className="flex items-center gap-1">
                  <FiClock className="w-4 h-4" />
                  {duration}
                </span>
              </div>

              {/* Current Badge */}
              {current && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  Currently Working
                </motion.div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2 mb-4">
            {description.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + idx * 0.05 }}
                className="flex gap-2 text-foreground/70"
              >
                <span className="text-blue-500 mt-1.5 flex-shrink-0">•</span>
                <span>{item}</span>
              </motion.div>
            ))}
          </div>

          {/* Technologies */}
          {technologies && technologies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="flex flex-wrap gap-2"
            >
              {technologies.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 text-xs font-medium rounded-full glass-light border border-foreground/10 text-foreground/70 hover:glass-medium hover:text-foreground transition-all duration-200"
                >
                  {tech}
                </span>
              ))}
            </motion.div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  )
}

// Memoize component to prevent unnecessary re-renders
export const TimelineItem = memo(TimelineItemComponent)
