import { stagger, type Variants } from "motion/react";

export const catalogPageTransition = {
  duration: 0.35,
  ease: [0.22, 1, 0.36, 1] as const,
};

export const productGridVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: stagger(0.05, { startDelay: 0.04 }),
    },
  },
};

export const productGridItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export const productCardVariants: Variants = {
  rest: { y: 0 },
  hover: { y: -4 },
  tap: { scale: 0.985 },
};

export const productImageVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
};
