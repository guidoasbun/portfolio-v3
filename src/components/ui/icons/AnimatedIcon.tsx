'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Icon } from './Icon'
import type { IconProps } from './Icon'
import {
  iconHover,
  iconRotate,
  iconBounce,
  iconShake,
  iconPulse,
  iconGlow,
  iconSpin,
  iconFloat,
  iconWiggle,
  iconSlideLeft,
  iconSlideRight,
  iconSlideUp,
  iconSlideDown,
} from '@/lib/animations/iconAnimations'

export type IconAnimation =
  | 'hover'
  | 'rotate'
  | 'bounce'
  | 'shake'
  | 'pulse'
  | 'glow'
  | 'spin'
  | 'float'
  | 'wiggle'
  | 'slide-left'
  | 'slide-right'
  | 'slide-up'
  | 'slide-down'
  | 'none'

interface AnimatedIconProps extends IconProps {
  animation?: IconAnimation
  /**
   * If true, animation plays continuously. If false, animation plays on hover/interaction.
   * Default: false (hover-based)
   */
  continuous?: boolean
  /**
   * Custom animation delay in milliseconds
   */
  delay?: number
  children: React.ReactNode
}

const animationVariants = {
  hover: iconHover,
  rotate: iconRotate,
  bounce: iconBounce,
  shake: iconShake,
  pulse: iconPulse,
  glow: iconGlow,
  spin: iconSpin,
  float: iconFloat,
  wiggle: iconWiggle,
  'slide-left': iconSlideLeft,
  'slide-right': iconSlideRight,
  'slide-up': iconSlideUp,
  'slide-down': iconSlideDown,
  none: {},
}

/**
 * AnimatedIcon - A wrapper component that adds motion animations to icons
 *
 * @example
 * // Hover-based rotation
 * <AnimatedIcon animation="rotate">
 *   <GithubIcon />
 * </AnimatedIcon>
 *
 * @example
 * // Continuous floating animation
 * <AnimatedIcon animation="float" continuous>
 *   <HeartIcon />
 * </AnimatedIcon>
 */
export function AnimatedIcon({
  animation = 'hover',
  continuous = false,
  delay = 0,
  children,
  size = 24,
  className,
  'aria-label': ariaLabel,
  ...props
}: AnimatedIconProps) {
  const variants = animationVariants[animation]

  // For continuous animations, use animate state
  // For hover animations, use initial/whileHover
  if (continuous && animation !== 'none') {
    return (
      <motion.span
        initial="rest"
        animate="animate"
        variants={variants}
        transition={{
          delay: delay / 1000,
        }}
        style={{
          display: 'inline-block',
          lineHeight: 0,
        }}
      >
        <Icon
          size={size}
          className={className}
          aria-label={ariaLabel}
          {...props}
        >
          {children}
        </Icon>
      </motion.span>
    )
  }

  // Hover-based animations
  return (
    <motion.span
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      variants={variants}
      transition={{
        delay: delay / 1000,
      }}
      style={{
        display: 'inline-block',
        lineHeight: 0,
        cursor: animation !== 'none' ? 'pointer' : 'default',
      }}
    >
      <Icon
        size={size}
        className={className}
        aria-label={ariaLabel}
        {...props}
      >
        {children}
      </Icon>
    </motion.span>
  )
}

/**
 * Helper component to wrap any icon with animation
 */
export function withAnimation<P extends IconProps>(
  IconComponent: React.ComponentType<P>,
  animation: IconAnimation = 'hover',
  continuous = false
) {
  return function AnimatedIconWrapper(props: P) {
    const iconElement = <IconComponent {...props} />
    return (
      <AnimatedIcon animation={animation} continuous={continuous} {...props}>
        {iconElement}
      </AnimatedIcon>
    )
  }
}
