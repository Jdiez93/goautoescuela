"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

interface AnimatedCardBgProps {
  outerDotsCount?: number;
  innerDotsCount?: number;
  blurColorA?: string;
  blurColorB?: string;
  dotColor?: string;
  className?: string;
}

/**
 * Decorative animated background: two concentric rings of dots + two soft blurs.
 * Render as the first child of a `relative overflow-hidden` card. It sits
 * behind the content (z-0) and is purely visual — content stays untouched.
 */
export function AnimatedCardBg({
  outerDotsCount = 40,
  innerDotsCount = 30,
  blurColorA = "bg-primary/10",
  blurColorB = "bg-blue-400/10",
  dotColor = "bg-primary/40",
  className = "",
}: AnimatedCardBgProps) {
  const shouldReduceMotion = useReducedMotion();

  const { outerDots, innerDots } = useMemo(() => {
    const gen = (count: number, radius: number) =>
      Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * 2 * Math.PI;
        return {
          x: 50 + radius * Math.cos(angle),
          y: 50 + radius * Math.sin(angle),
          delay: i * 0.02,
        };
      });
    return { outerDots: gen(outerDotsCount, 46), innerDots: gen(innerDotsCount, 36) };
  }, [outerDotsCount, innerDotsCount]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
    >
      {/* soft blurs */}
      <div className={`absolute -top-10 -left-10 w-48 h-48 rounded-full blur-3xl ${blurColorA}`} />
      <div className={`absolute -bottom-10 -right-10 w-48 h-48 rounded-full blur-3xl ${blurColorB}`} />

      {/* dots */}
      <div className="absolute inset-0">
        {[...outerDots, ...innerDots].map((d, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 0.55, scale: 1 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.5, delay: d.delay, ease: "easeOut" }
            }
            className={`absolute w-1 h-1 rounded-full ${dotColor}`}
            style={{ left: `${d.x}%`, top: `${d.y}%`, transform: "translate(-50%,-50%)" }}
          />
        ))}
      </div>
    </div>
  );
}
