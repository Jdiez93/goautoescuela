"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface Tilt3DProps extends React.HTMLAttributes<HTMLDivElement> {
  maxTilt?: number;
  scale?: number;
  children: React.ReactNode;
}

/**
 * Wrapper that adds a 3D mouse-tracking tilt effect to its children.
 * Uses perspective + rotateX/rotateY based on cursor position.
 */
export function Tilt3D({
  className,
  children,
  maxTilt = 8,
  scale = 1.04,
  style: styleProp,
  ...props
}: Tilt3DProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [style, setStyle] = React.useState<React.CSSProperties>({
    transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)",
    transition: "transform 0.4s ease-out",
    willChange: "transform",
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const rotateX = ((y - height / 2) / (height / 2)) * -maxTilt;
    const rotateY = ((x - width / 2) / (width / 2)) * maxTilt;
    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale},${scale},${scale})`,
      transition: "transform 0.1s ease-out",
      willChange: "transform",
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)",
      transition: "transform 0.5s ease-out",
      willChange: "transform",
    });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ ...style, ...styleProp, transformStyle: "preserve-3d" }}
      className={cn(className)}
      {...props}
    >
      {children}
    </div>
  );
}
