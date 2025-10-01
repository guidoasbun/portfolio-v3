import type { Variants } from 'framer-motion'
import { ANIMATION_DURATION } from '../constants'

/**
 * Icon animation variants for hover, tap, and other interactions
 */

export const iconHover: Variants = {
  rest: {
    scale: 1,
    rotate: 0,
    transition: {
      duration: ANIMATION_DURATION.fast / 1000,
      ease: 'easeOut',
    },
  },
  hover: {
    scale: 1.1,
    transition: {
      duration: ANIMATION_DURATION.fast / 1000,
      ease: 'easeOut',
    },
  },
}

export const iconTap: Variants = {
  rest: {
    scale: 1,
  },
  tap: {
    scale: 0.9,
    transition: {
      duration: 0.1,
      ease: 'easeInOut',
    },
  },
}

export const iconRotate: Variants = {
  rest: {
    rotate: 0,
  },
  hover: {
    rotate: 180,
    transition: {
      duration: ANIMATION_DURATION.normal / 1000,
      ease: 'easeInOut',
    },
  },
}

export const iconBounce: Variants = {
  rest: {
    y: 0,
  },
  hover: {
    y: [-2, -8, 0],
    transition: {
      duration: 0.4,
      ease: 'easeInOut',
    },
  },
}

export const iconShake: Variants = {
  rest: {
    x: 0,
    rotate: 0,
  },
  hover: {
    x: [0, -2, 2, -2, 2, 0],
    rotate: [0, -5, 5, -5, 5, 0],
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
}

export const iconPulse: Variants = {
  rest: {
    scale: 1,
    opacity: 1,
  },
  animate: {
    scale: [1, 1.1, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

export const iconGlow: Variants = {
  rest: {
    filter: 'drop-shadow(0 0 0px rgba(59, 130, 246, 0))',
  },
  hover: {
    filter: [
      'drop-shadow(0 0 0px rgba(59, 130, 246, 0))',
      'drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))',
      'drop-shadow(0 0 12px rgba(59, 130, 246, 0.4))',
    ],
    transition: {
      duration: 0.4,
      ease: 'easeInOut',
    },
  },
}

export const iconSpin: Variants = {
  rest: {
    rotate: 0,
  },
  animate: {
    rotate: 360,
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'linear',
    },
  },
}

export const iconFloat: Variants = {
  rest: {
    y: 0,
  },
  animate: {
    y: [-3, 3, -3],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
}

export const iconWiggle: Variants = {
  rest: {
    rotate: 0,
  },
  hover: {
    rotate: [0, -10, 10, -10, 10, 0],
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    },
  },
}

export const iconSlideLeft: Variants = {
  rest: {
    x: 0,
  },
  hover: {
    x: -4,
    transition: {
      duration: ANIMATION_DURATION.fast / 1000,
      ease: 'easeOut',
    },
  },
}

export const iconSlideRight: Variants = {
  rest: {
    x: 0,
  },
  hover: {
    x: 4,
    transition: {
      duration: ANIMATION_DURATION.fast / 1000,
      ease: 'easeOut',
    },
  },
}

export const iconSlideUp: Variants = {
  rest: {
    y: 0,
  },
  hover: {
    y: -4,
    transition: {
      duration: ANIMATION_DURATION.fast / 1000,
      ease: 'easeOut',
    },
  },
}

export const iconSlideDown: Variants = {
  rest: {
    y: 0,
  },
  hover: {
    y: 4,
    transition: {
      duration: ANIMATION_DURATION.fast / 1000,
      ease: 'easeOut',
    },
  },
}

export const iconFadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATION.normal / 1000,
      ease: 'easeInOut',
    },
  },
}

export const iconStagger: Variants = {
  hidden: {
    opacity: 0,
    scale: 0,
  },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: ANIMATION_DURATION.fast / 1000,
      ease: 'easeOut',
    },
  }),
}

// Combined animations for icon buttons
export const iconButtonHover: Variants = {
  rest: {
    scale: 1,
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: ANIMATION_DURATION.fast / 1000,
      ease: 'easeOut',
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: 'easeInOut',
    },
  },
}
