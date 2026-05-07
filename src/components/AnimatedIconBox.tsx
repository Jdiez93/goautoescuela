import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimatedIconBoxProps {
  children: ReactNode;
  className?: string;
  /** When true, parent has `group` class — animation triggers on group hover */
  groupHover?: boolean;
}

/**
 * Reusable bouncing/floating icon container.
 * Floats subtly on idle and jumps + scales out of its box on hover.
 */
export function AnimatedIconBox({ children, className, groupHover = false }: AnimatedIconBoxProps) {
  return (
    <motion.div
      whileHover={!groupHover ? { y: -14, scale: 1.18, rotate: -8 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className={cn("cursor-pointer", className)}
    >
      <motion.div
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="w-full h-full flex items-center justify-center"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
