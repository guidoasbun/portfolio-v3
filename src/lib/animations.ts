import type { Variants } from "framer-motion"
import { ANIMATION_DURATION } from "./constants"

export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATION.normal / 1000,
      ease: "easeInOut",
    },
  },
}

export const slideUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION.normal / 1000,
      ease: "easeOut",
    },
  },
}

export const slideDown: Variants = {
  hidden: {
    opacity: 0,
    y: -30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION.normal / 1000,
      ease: "easeOut",
    },
  },
}

export const slideLeft: Variants = {
  hidden: {
    opacity: 0,
    x: 30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: ANIMATION_DURATION.normal / 1000,
      ease: "easeOut",
    },
  },
}

export const slideRight: Variants = {
  hidden: {
    opacity: 0,
    x: -30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: ANIMATION_DURATION.normal / 1000,
      ease: "easeOut",
    },
  },
}

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: ANIMATION_DURATION.normal / 1000,
      ease: "easeOut",
    },
  },
}

export const scaleOut: Variants = {
  hidden: {
    opacity: 1,
    scale: 1,
  },
  visible: {
    opacity: 0,
    scale: 0.8,
    transition: {
      duration: ANIMATION_DURATION.fast / 1000,
      ease: "easeIn",
    },
  },
}

export const float: Variants = {
  hidden: {
    y: 0,
  },
  visible: {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop",
    },
  },
}

export const staggerContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION.normal / 1000,
      ease: "easeOut",
    },
  },
}

export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    y: 50,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION.normal / 1000,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    y: 50,
    transition: {
      duration: ANIMATION_DURATION.fast / 1000,
      ease: "easeIn",
    },
  },
}

export const backdropVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATION.fast / 1000,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: ANIMATION_DURATION.fast / 1000,
    },
  },
}

export const drawerVariants: Variants = {
  hidden: {
    x: "-100%",
  },
  visible: {
    x: 0,
    transition: {
      duration: ANIMATION_DURATION.normal / 1000,
      ease: "easeOut",
    },
  },
  exit: {
    x: "-100%",
    transition: {
      duration: ANIMATION_DURATION.fast / 1000,
      ease: "easeIn",
    },
  },
}

export const cardHover: Variants = {
  rest: {
    scale: 1,
    y: 0,
    transition: {
      duration: ANIMATION_DURATION.fast / 1000,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.05,
    y: -5,
    transition: {
      duration: ANIMATION_DURATION.fast / 1000,
      ease: "easeOut",
    },
  },
}

export const buttonPress: Variants = {
  rest: {
    scale: 1,
  },
  press: {
    scale: 0.95,
    transition: {
      duration: 0.1,
      ease: "easeInOut",
    },
  },
}

export const typewriter = {
  hidden: { width: 0 },
  visible: {
    width: "100%",
    transition: {
      duration: 2,
      ease: "linear",
    },
  },
}

export const glowPulse: Variants = {
  initial: {
    boxShadow: "0 0 0 rgba(59, 130, 246, 0)",
  },
  animate: {
    boxShadow: [
      "0 0 0 rgba(59, 130, 246, 0)",
      "0 0 20px rgba(59, 130, 246, 0.3)",
      "0 0 0 rgba(59, 130, 246, 0)",
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
}

export const pageTransition: Variants = {
  hidden: {
    opacity: 0,
    x: -200,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: ANIMATION_DURATION.normal / 1000,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    x: 200,
    transition: {
      duration: ANIMATION_DURATION.fast / 1000,
      ease: "easeIn",
    },
  },
}

export const revealVariants: Variants = {
  hidden: {
    clipPath: "inset(0 100% 0 0)",
  },
  visible: {
    clipPath: "inset(0 0% 0 0)",
    transition: {
      duration: 0.8,
      ease: "easeInOut",
    },
  },
}