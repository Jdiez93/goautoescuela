import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Clock, Award } from "lucide-react";
import { Link } from "react-router-dom";

const badges = [
  { icon: Shield, label: "100% aprobados" },
  { icon: Clock, label: "Horarios flexibles" },
  { icon: Award, label: "+15 años de experiencia" },
];

const stats = [
  { value: "98%", label: "Tasa de aprobados" },
  { value: "+500", label: "Alumnos formados" },
  { value: "15+", label: "Años de experiencia" },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden pt-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-hero-gradient opacity-[0.03]" />
      <motion.div
        className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      {/* Decorative floating dots */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-2 h-2 rounded-full bg-secondary/30"
        animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 right-1/3 w-3 h-3 rounded-full bg-primary/20"
        animate={{ y: [10, -10, 10], x: [5, -5, 5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badges */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mb-6">
              {badges.map((badge, i) => (
                <motion.span
                  key={badge.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-medium border border-border/50"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <badge.icon className="w-3.5 h-3.5" />
                  {badge.label}
                </motion.span>
              ))}
            </motion.div>

            {/* Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
            >
              Tu carnet de conducir
              <br />
              <span className="text-secondary relative">
                empieza aquí
                <motion.span
                  className="absolute -bottom-2 left-0 h-1 bg-secondary/30 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
                />
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-muted-foreground max-w-xl mb-8 leading-relaxed"
            >
              En AutoescuelaGO, Villanueva del Pardillo, te acompañamos en cada paso.
              Clases prácticas personalizadas, profesores expertos y la mejor tecnología.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
              <Link to="/registro">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Button size="lg" className="bg-hero-gradient text-primary-foreground text-base px-8 h-12 hover:opacity-90 shadow-lg shadow-primary/20">
                    Empieza tu carnet
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </motion.div>
              </Link>
              <a href="#precios">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" size="lg" className="text-base px-8 h-12">
                    Ver precios
                  </Button>
                </motion.div>
              </a>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mt-16 grid grid-cols-3 gap-6 max-w-md"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ y: -4 }}
                className="group cursor-default"
              >
                <div className="text-2xl sm:text-3xl font-bold text-secondary group-hover:scale-105 transition-transform origin-left">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
