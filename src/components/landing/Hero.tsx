import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Zap, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 40, filter: "blur(8px)" },
  visible: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <>{count}{suffix}</>;
}

const stats = [
  { icon: Users, value: 500, suffix: "+", label: "Alumnos activos" },
  { icon: Zap, value: 98, suffix: "%", label: "Satisfacción" },
  { icon: Shield, value: 24, suffix: "/7", label: "Acceso seguro" },
];

const FloatingOrb = ({ className, delay = 0 }: { className: string; delay?: number }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl will-change-transform ${className}`}
    animate={{
      scale: [1, 1.15, 0.95, 1.05, 1],
      x: [0, 20, -15, 10, 0],
      y: [0, -15, 10, -8, 0],
    }}
    transition={{ duration: 18, repeat: Infinity, ease: "linear", delay }}
  />
);

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Mesh gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-background to-secondary/[0.03]" />
      
      {/* Animated orbs */}
      <FloatingOrb className="top-20 right-[10%] w-[600px] h-[600px] bg-primary/[0.07]" />
      <FloatingOrb className="-bottom-20 -left-20 w-[500px] h-[500px] bg-secondary/[0.06]" delay={3} />
      <FloatingOrb className="top-1/2 left-1/2 w-[400px] h-[400px] bg-primary/[0.04]" delay={6} />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
        backgroundSize: '48px 48px',
      }} />

      {/* Animated gradient line */}
      <div
        className="absolute top-0 left-0 right-0 h-px opacity-50"
        style={{ background: 'linear-gradient(90deg, transparent, hsl(var(--primary)), hsl(var(--secondary)), transparent)' }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div variants={item} className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-card/80 backdrop-blur-sm text-sm font-medium border border-border/60 mb-10 shadow-sm">
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Plataforma de gestión para alumnos
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={item}
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-[-0.03em] leading-[1.05] mb-8"
          >
            <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
              Tu autoescuela digital
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={item}
            className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed font-light"
          >
            Reserva clases, gestiona pagos y controla tu progreso.
            <span className="text-foreground font-normal"> Todo desde un solo lugar.</span>
          </motion.p>

          {/* CTAs */}
          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link to="/registro">
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Button size="lg" className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground text-base px-10 h-14 rounded-2xl hover:shadow-xl hover:shadow-primary/25 transition-shadow duration-300 font-medium">
                  Crear cuenta
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Button>
              </motion.div>
            </Link>
            <a href="#funcionalidades">
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Button variant="outline" size="lg" className="text-base px-10 h-14 rounded-2xl border-border/80 bg-card/50 backdrop-blur-sm hover:bg-card font-medium">
                  Descubre cómo funciona
                </Button>
              </motion.div>
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={item}
            className="grid grid-cols-3 gap-4 sm:gap-8 max-w-xl mx-auto"
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="relative group"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="relative p-4 sm:p-6 rounded-2xl bg-card/60 backdrop-blur-sm border border-border/40 hover:border-primary/30 transition-colors duration-300">
                  <stat.icon className="w-5 h-5 text-primary/60 mx-auto mb-2 hidden sm:block" />
                  <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
