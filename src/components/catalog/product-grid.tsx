"use client";

import { motion } from "motion/react";
import { productGridItemVariants, productGridVariants } from "@/lib/motion";

export function ProductGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={productGridVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
    >
      {children}
    </motion.div>
  );
}

export function ProductGridItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={productGridItemVariants}>
      {children}
    </motion.div>
  );
}
