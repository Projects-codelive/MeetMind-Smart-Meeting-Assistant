import { Variants } from "framer-motion";

// Stagger container for children animations
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Stagger item for children
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// Fade and slide up
export const fadeSlideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.23, 1, 0.32, 1],
    },
  },
};

// Fade and slide down
export const fadeSlideDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.23, 1, 0.32, 1],
    },
  },
};

// Scale and fade
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// Number counter animation
export const counterAnimation = {
  from: 0,
  to: 100,
  transition: {
    duration: 2,
    ease: "easeOut",
  },
};

// Hover lift effect
export const hoverLift = {
  whileHover: {
    y: -8,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  whileTap: {
    y: -4,
    transition: { duration: 0.2 },
  },
};

// Hover scale
export const hoverScale = {
  whileHover: {
    scale: 1.02,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  whileTap: {
    scale: 0.98,
    transition: { duration: 0.2 },
  },
};

// Glow pulse
export const glowPulse: Variants = {
  animate: {
    boxShadow: [
      "0 0 0 0 rgba(37, 99, 235, 0.4)",
      "0 0 0 10px rgba(37, 99, 235, 0)",
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeOut",
    },
  },
};

// Breathing animation
export const breathing: Variants = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Shimmer effect
export const shimmer: Variants = {
  animate: {
    backgroundPosition: ["200% 0%", "-200% 0%"],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// Slide right
export const slideRight: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// Slide left
export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 20 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// Rotate in
export const rotateIn: Variants = {
  hidden: { opacity: 0, rotate: -10 },
  show: {
    opacity: 1,
    rotate: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// Bounce in
export const bounceIn: Variants = {
  hidden: { opacity: 0, scale: 0.3 },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};

// Magnetic button effect
export const magneticButton = {
  whileHover: {
    scale: 1.05,
    boxShadow: "0 20px 40px rgba(37, 99, 235, 0.3)",
  },
  whileTap: {
    scale: 0.95,
  },
};

// Tilt effect
export const tiltEffect = {
  whileHover: {
    rotateX: 5,
    rotateY: -5,
    transition: { duration: 0.3 },
  },
};

// Float animation
export const float: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Pulse animation
export const pulse: Variants = {
  animate: {
    opacity: [1, 0.5, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};
