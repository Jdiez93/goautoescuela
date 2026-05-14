"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface ScrollExpansionHeroProps {
  mediaSrc: string;
  bgImageSrc: string;
  titleStart?: string;
  titleAccent?: string;
  startExpanded?: boolean;
  onComplete?: () => void;
  onCollapse?: () => void;
}

const ScrollExpansionHero = ({
  mediaSrc,
  bgImageSrc,
  titleStart,
  titleAccent,
  startExpanded = false,
  onComplete,
  onCollapse,
}: ScrollExpansionHeroProps) => {
  const [scrollProgress, setScrollProgress] = useState(startExpanded ? 1 : 0);
  const [isMobileState, setIsMobileState] = useState(false);
  const completedRef = useRef(false);
  const collapsedRef = useRef(false);
  const touchYRef = useRef(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const scrollDelta = e.deltaY * 0.0009;
      setScrollProgress((prev) => {
        const next = Math.min(Math.max(prev + scrollDelta, 0), 1);
        if (next >= 1 && !completedRef.current) {
          completedRef.current = true;
          collapsedRef.current = false;
          onComplete?.();
        }
        if (next <= 0 && !collapsedRef.current && completedRef.current) {
          collapsedRef.current = true;
          completedRef.current = false;
          onCollapse?.();
        }
        if (next < 1) completedRef.current = false;
        if (next > 0) collapsedRef.current = false;
        return next;
      });
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchYRef.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      const deltaY = touchYRef.current - touchY;
      e.preventDefault();
      const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
      const scrollDelta = deltaY * scrollFactor;
      setScrollProgress((prev) => {
        const next = Math.min(Math.max(prev + scrollDelta, 0), 1);
        if (next >= 1 && !completedRef.current) {
          completedRef.current = true;
          collapsedRef.current = false;
          onComplete?.();
        }
        if (next <= 0 && !collapsedRef.current && completedRef.current) {
          collapsedRef.current = true;
          completedRef.current = false;
          onCollapse?.();
        }
        if (next < 1) completedRef.current = false;
        if (next > 0) collapsedRef.current = false;
        return next;
      });
      touchYRef.current = touchY;
    };

    const handleScroll = () => {
      window.scrollTo(0, 0);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [onComplete, onCollapse]);

  useEffect(() => {
    const checkIfMobile = () => setIsMobileState(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const mediaWidth = 300 + scrollProgress * (isMobileState ? 650 : 1250);
  const mediaHeight = 400 + scrollProgress * (isMobileState ? 200 : 400);
  const textTranslateX = scrollProgress * (isMobileState ? 180 : 150);

  // Fade out the entire intro as it nears completion to blend into home
  const introOpacity = scrollProgress >= 0.92 ? Math.max(0, 1 - (scrollProgress - 0.92) / 0.08) : 1;

  return (
    <motion.div
      style={{ opacity: introOpacity }}
      className="fixed inset-0 z-[60] overflow-hidden bg-background"
    >
      <div className="relative w-full h-full">
        <motion.div
          className="absolute inset-0 z-0"
          animate={{ opacity: 1 - scrollProgress * 0.6 }}
          transition={{ duration: 0.1 }}
        >
          <img
            src={bgImageSrc}
            alt="Fondo"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/10" />
        </motion.div>

        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <div
            className="absolute z-10 flex items-center justify-center"
            style={{
              width: `${mediaWidth}px`,
              height: `${mediaHeight}px`,
              maxWidth: "98vw",
              maxHeight: "92vh",
              boxShadow: "0px 0px 50px rgba(0,0,0,0.3)",
            }}
          >
            <div className="relative w-full h-full">
              <img
                src={mediaSrc}
                alt={titleStart || "Media"}
                className="w-full h-full object-cover rounded-xl"
              />
              <motion.div
                className="absolute inset-0 bg-black/40 rounded-xl"
                animate={{ opacity: 0.7 - scrollProgress * 0.5 }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </div>

          <div className="flex items-center justify-center text-center gap-4 w-full relative z-20 flex-col pointer-events-none">
            {titleStart && (
              <motion.h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)] font-['Space_Grotesk']"
                style={{ transform: `translateX(-${textTranslateX}vw)` }}
              >
                {titleStart}
              </motion.h2>
            )}
            {titleAccent && (
              <motion.h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-center drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)] font-['Space_Grotesk'] text-primary"
                style={{ transform: `translateX(${textTranslateX}vw)` }}
              >
                {titleAccent}
              </motion.h2>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ScrollExpansionHero;
