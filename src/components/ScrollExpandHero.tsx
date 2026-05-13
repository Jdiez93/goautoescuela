import { useEffect, useRef, useState } from "react";

interface ScrollExpandHeroProps {
  mediaSrc: string;
  bgImageSrc: string;
  title?: string;
  onComplete?: () => void;
}

export default function ScrollExpandHero({
  mediaSrc,
  bgImageSrc,
  title,
  onComplete,
}: ScrollExpandHeroProps) {
  const [isMobile, setIsMobile] = useState(false);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const rafId = useRef<number | null>(null);
  const completedRef = useRef(false);
  const touchStartY = useRef(0);

  const mediaRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const word1Ref = useRef<HTMLHeadingElement>(null);
  const word2Ref = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const mobile = window.innerWidth < 768;
    // Final scale needed to roughly fill viewport from base 300x400 box
    const baseW = mobile ? 240 : 320;
    const baseH = mobile ? 320 : 420;
    const finalScale = Math.max(
      window.innerWidth / baseW,
      window.innerHeight / baseH,
    ) * 1.05;

    const textSpread = mobile ? 45 : 38; // vw

    const tick = () => {
      // Smooth interpolation toward target
      const t = targetProgress.current;
      const c = currentProgress.current;
      const next = c + (t - c) * 0.12;
      currentProgress.current = Math.abs(next - t) < 0.0005 ? t : next;

      const p = currentProgress.current;
      const scale = 1 + (finalScale - 1) * p;

      if (mediaRef.current) {
        mediaRef.current.style.transform = `translate3d(0,0,0) scale(${scale})`;
      }
      if (overlayRef.current) {
        overlayRef.current.style.opacity = `${0.45 - p * 0.4}`;
      }
      if (word1Ref.current) {
        word1Ref.current.style.transform = `translate3d(${-textSpread * p}vw,0,0)`;
      }
      if (word2Ref.current) {
        word2Ref.current.style.transform = `translate3d(${textSpread * p}vw,0,0)`;
      }
      if (containerRef.current) {
        // fade out container near the end
        const fadeStart = 0.92;
        const op = p > fadeStart ? Math.max(0, 1 - (p - fadeStart) / (1 - fadeStart)) : 1;
        containerRef.current.style.opacity = `${op}`;
      }

      if (t >= 1 && c >= 0.999 && !completedRef.current) {
        completedRef.current = true;
        setTimeout(() => onComplete?.(), 250);
      }

      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);

    const updateTarget = (delta: number) => {
      targetProgress.current = Math.min(Math.max(targetProgress.current + delta, 0), 1);
    };

    const handleWheel = (e: WheelEvent) => {
      if (completedRef.current) return;
      e.preventDefault();
      updateTarget(e.deltaY * 0.0015);
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (completedRef.current) return;
      const y = e.touches[0].clientY;
      const dy = touchStartY.current - y;
      touchStartY.current = y;
      e.preventDefault();
      updateTarget(dy * 0.005);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.body.style.overflow = prevOverflow;
      if (rafId.current) cancelAnimationFrame(rafId.current);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [onComplete]);

  const firstWord = title ? title.split(" ")[0] : "";
  const restOfTitle = title ? title.split(" ").slice(1).join(" ") : "";

  const baseW = isMobile ? 240 : 320;
  const baseH = isMobile ? 320 : 420;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] overflow-hidden bg-black"
      style={{ willChange: "opacity" }}
    >
      {/* Background image */}
      <img
        src={bgImageSrc}
        alt="Fondo Ready2Go"
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />
      <div className="absolute inset-0 bg-black/45 pointer-events-none" />

      {/* Centered media that scales */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          ref={mediaRef}
          className="relative rounded-2xl overflow-hidden shadow-2xl"
          style={{
            width: `${baseW}px`,
            height: `${baseH}px`,
            transformOrigin: "center center",
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        >
          <img
            src={mediaSrc}
            alt={title || "Ready2Go"}
            className="w-full h-full object-cover"
            draggable={false}
          />
          <div
            ref={overlayRef}
            className="absolute inset-0 bg-black"
            style={{ opacity: 0.45, willChange: "opacity" }}
          />
        </div>
      </div>

      {/* Title that splits horizontally */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="flex flex-col items-center justify-center gap-2 md:gap-3 text-center"
          style={{ mixBlendMode: "difference" }}
        >
          <h2
            ref={word1Ref}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-white font-['Space_Grotesk'] tracking-tight"
            style={{ willChange: "transform" }}
          >
            {firstWord}
          </h2>
          <h2
            ref={word2Ref}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-white font-['Space_Grotesk'] tracking-tight whitespace-nowrap"
            style={{ willChange: "transform" }}
          >
            {restOfTitle}
          </h2>
        </div>
      </div>
    </div>
  );
}
