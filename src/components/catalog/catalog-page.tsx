"use client";

import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { catalogPageTransition } from "@/lib/motion";

export default function CatalogPage({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={catalogPageTransition}
    >
      {children}
    </motion.div>
  );
}
