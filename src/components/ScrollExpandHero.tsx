import { useEffect, useRef, useState, ReactNode } from "react";
import { motion } from "framer-motion";

interface ScrollExpandHeroProps {
  mediaSrc: string;
  bgImageSrc: string;
  title?: string;
  textBlend?: boolean;
  onComplete?: () => void;
  children?: ReactNode;
}

export default function ScrollExpandHero({
  mediaSrc,
  bgImageSrc,
  title,
  textBlend,
  onComplete,
}: ScrollExpandHeroProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState(false);
  const [isMobileState, setIsMobileState] = useState(false);
  const touchStartY = useRef(0);
  const completedRef = useRef(false);

  useEffect(() => {
    const checkIfMobile = () => setIsMobileState(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    // Lock body scroll while animating
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const handleWheel = (e: WheelEvent) => {
      if (mediaFullyExpanded) return;
      e.preventDefault();
      const delta = e.deltaY * 0.0012;
      setScrollProgress((p) => {
        const next = Math.min(Math.max(p + delta, 0), 1);
        if (next >= 1 && !completedRef.current) {
          completedRef.current = true;
          setMediaFullyExpanded(true);
          setTimeout(() => onComplete?.(), 350);
        }
        return next;
      });
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (mediaFullyExpanded) return;
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY.current - touchY;
      e.preventDefault();
      const delta = deltaY * 0.006;
      setScrollProgress((p) => {
        const next = Math.min(Math.max(p + delta, 0), 1);
        if (next >= 1 && !completedRef.current) {
          completedRef.current = true;
          setMediaFullyExpanded(true);
          setTimeout(() => onComplete?.(), 350);
        }
        return next;
      });
      touchStartY.current = touchY;
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [mediaFullyExpanded, onComplete]);

  const mediaWidth = 300 + scrollProgress * (isMobileState ? 650 : 1250);
  const mediaHeight = 400 + scrollProgress * (isMobileState ? 200 : 400);
  const textTranslateX = scrollProgress * (isMobileState ? 180 : 150);

  const firstWord = title ? title.split(" ")[0] : "";
  const restOfTitle = title ? title.split(" ").slice(1).join(" ") : "";

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-black">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={bgImageSrc}
          alt="Fondo"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Centered content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen w-full">
        <div className="flex flex-col items-center justify-center w-full">
          <div
            className="relative overflow-hidden rounded-2xl shadow-2xl transition-none"
            style={{
              width: `${mediaWidth}px`,
              height: `${mediaHeight}px`,
              maxWidth: "95vw",
              maxHeight: "85vh",
            }}
          >
            <img
              src={mediaSrc}
              alt={title || "Media"}
              className="w-full h-full object-cover"
            />
            <motion.div
              className="absolute inset-0 bg-black/40"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 0.5 - scrollProgress * 0.4 }}
              transition={{ duration: 0.2 }}
            />
          </div>

          <div
            className={`flex items-center justify-center text-center gap-3 md:gap-4 w-full relative z-10 mt-6 flex-col ${
              textBlend ? "mix-blend-difference" : "mix-blend-normal"
            }`}
          >
            <motion.h2
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-white font-['Space_Grotesk'] tracking-tight"
              style={{ transform: `translateX(-${textTranslateX}vw)` }}
            >
              {firstWord}
            </motion.h2>
            <motion.h2
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-white font-['Space_Grotesk'] tracking-tight"
              style={{ transform: `translateX(${textTranslateX}vw)` }}
            >
              {restOfTitle}
            </motion.h2>
          </div>
        </div>
      </div>
    </div>
  );
}
