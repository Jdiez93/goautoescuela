import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Clock, Award } from "lucide-react";
import { Link } from "react-router-dom";

const badges = [
  { icon: Shield, label: "100% aprobados" },
  { icon: Clock, label: "Horarios flexibles" },
  { icon: Award, label: "+15 años de experiencia" },
];

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-hero-gradient opacity-[0.03]" />
      <div className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-secondary/5 blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex flex-wrap gap-2 mb-6">
              {badges.map((badge) => (
                <span
                  key={badge.label}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-medium"
                >
                  <badge.icon className="w-3.5 h-3.5" />
                  {badge.label}
                </span>
              ))}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              Tu carnet de conducir
              <br />
              <span className="text-secondary">empieza aquí</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mb-8 leading-relaxed">
              En AutoescuelaGO, Villanueva del Pardillo, te acompañamos en cada paso. 
              Clases prácticas personalizadas, profesores expertos y la mejor tecnología.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/registro">
                <Button size="lg" className="bg-hero-gradient text-primary-foreground text-base px-8 h-12 hover:opacity-90">
                  Empieza tu carnet
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <a href="#precios">
                <Button variant="outline" size="lg" className="text-base px-8 h-12">
                  Ver precios
                </Button>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-16 grid grid-cols-3 gap-6 max-w-md"
          >
            {[
              { value: "98%", label: "Tasa de aprobados" },
              { value: "+500", label: "Alumnos formados" },
              { value: "15+", label: "Años de experiencia" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl sm:text-3xl font-bold text-secondary">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
