"use client";

import { useEffect, useRef, useState, ReactNode } from "react";
import { motion } from "framer-motion";

interface ScrollExpansionHeroProps {
  mediaSrc: string;
  bgImageSrc: string;
  title?: string;
  textBlend?: boolean;
  onComplete?: () => void;
  children?: ReactNode;
}

const ScrollExpansionHero = ({
  mediaSrc,
  bgImageSrc,
  title,
  textBlend,
  onComplete,
  children,
}: ScrollExpansionHeroProps) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isMobileState, setIsMobileState] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (mediaFullyExpanded) return;
      e.preventDefault();
      const scrollDelta = e.deltaY * 0.0009;
      setScrollProgress((prev) => {
        const newProgress = Math.min(Math.max(prev + scrollDelta, 0), 1);
        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
          onComplete?.();
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
        return newProgress;
      });
    };

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (mediaFullyExpanded || !touchStartY) return;
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      e.preventDefault();
      const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
      const scrollDelta = deltaY * scrollFactor;
      setScrollProgress((prev) => {
        const newProgress = Math.min(Math.max(prev + scrollDelta, 0), 1);
        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
          onComplete?.();
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
        return newProgress;
      });
      setTouchStartY(touchY);
    };

    const handleTouchEnd = () => setTouchStartY(0);

    const handleScroll = () => {
      if (!mediaFullyExpanded) window.scrollTo(0, 0);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [mediaFullyExpanded, touchStartY, onComplete]);

  useEffect(() => {
    const checkIfMobile = () => setIsMobileState(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const mediaWidth = 300 + scrollProgress * (isMobileState ? 650 : 1250);
  const mediaHeight = 400 + scrollProgress * (isMobileState ? 200 : 400);
  const textTranslateX = scrollProgress * (isMobileState ? 180 : 150);

  const firstWord = title ? title.split(" ")[0] : "";
  const restOfTitle = title ? title.split(" ").slice(1).join(" ") : "";

  return (
    <div ref={sectionRef} className="transition-colors duration-700 ease-in-out overflow-x-hidden">
      <section className="relative flex flex-col items-center justify-start min-h-[100dvh]">
        <div className="relative w-full flex flex-col items-center min-h-[100dvh]">
          <motion.div
            className="absolute inset-0 z-0 h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 - scrollProgress }}
            transition={{ duration: 0.1 }}
          >
            <img
              src={bgImageSrc}
              alt="Fondo"
              className="w-full h-screen object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/10" />
          </motion.div>

          <div className="container mx-auto flex flex-col items-center justify-start relative z-10">
            <div className="flex flex-col items-center justify-center w-full h-[100dvh] relative">
              <div
                className="absolute z-10 flex flex-col items-center justify-center transition-none"
                style={{
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  maxWidth: "95vw",
                  maxHeight: "85vh",
                  boxShadow: "0px 0px 50px rgba(0,0,0,0.3)",
                }}
              >
                <div className="relative w-full h-full">
                  <img
                    src={mediaSrc}
                    alt={title || "Media"}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <motion.div
                    className="absolute inset-0 bg-black/40 rounded-xl"
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: 0.7 - scrollProgress * 0.3 }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </div>

              <div
                className={`flex items-center justify-center text-center gap-4 w-full relative z-10 transition-none flex-col ${
                  textBlend ? "mix-blend-difference" : "mix-blend-normal"
                }`}
              >
                <motion.h2
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)] transition-none font-['Space_Grotesk']"
                  style={{ transform: `translateX(-${textTranslateX}vw)` }}
                >
                  {firstWord}
                </motion.h2>
                <motion.h2
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)] transition-none font-['Space_Grotesk']"
                  style={{ transform: `translateX(${textTranslateX}vw)` }}
                >
                  {restOfTitle}
                </motion.h2>
              </div>
            </div>

            <motion.section
              className="flex flex-col w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              {children}
            </motion.section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpansionHero;
