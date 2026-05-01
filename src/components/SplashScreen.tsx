import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car } from "lucide-react";
import logoReady2Go from "@/assets/logo-ready2go.jpeg";

const tips = [
  "Ajustando espejos…",
  "Abrochando cinturón…",
  "Arrancando el motor…",
  "Preparando la ruta…",
  "¡Listos para conducir!",
];

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const duration = 2400;
    const interval = 30;
    const step = 100 / (duration / interval);
    const timer = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + step + Math.random() * 0.5, 100);
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 400);
        }
        return next;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [onFinish]);

  useEffect(() => {
    const tipTimer = setInterval(() => {
      setTipIndex((i) => (i < tips.length - 1 ? i + 1 : i));
    }, 500);
    return () => clearInterval(tipTimer);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/8 rounded-full blur-3xl" />
      </div>

      <div className="relative flex flex-col items-center gap-8">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex items-center gap-3"
        >
          <motion.img
            src={logoReady2Go}
            alt="Ready2Go"
            className="h-16 w-auto object-contain"
            animate={{ rotate: [0, -3, 3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="text-3xl font-bold font-['Space_Grotesk'] tracking-tight">
            <span className="text-gradient">Ready2Go</span>
          </span>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-64 sm:w-80"
        >
          <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-hero-gradient"
              style={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
            {/* Car icon riding the bar */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
              style={{ left: `${progress}%` }}
            >
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-md">
                <Car className="w-3 h-3 text-primary-foreground" />
              </div>
            </motion.div>
          </div>

          {/* Tip text */}
          <div className="mt-4 h-6 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={tipIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="text-sm text-muted-foreground font-medium"
              >
                {tips[tipIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
