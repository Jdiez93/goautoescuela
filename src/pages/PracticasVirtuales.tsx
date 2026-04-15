import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Smartphone, Clock, ShieldCheck, Trophy } from "lucide-react";

const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

const features = [
  {
    icon: Smartphone,
    title: "Interacción y Tecnología",
    text: "Texto...",
  },
  {
    icon: Clock,
    title: "Tiempo y Dinero",
    text: "Texto...",
  },
  {
    icon: ShieldCheck,
    title: "Confianza y Preparación",
    text: "Texto...",
  },
  {
    icon: Trophy,
    title: "Éxito al Primer Intento",
    text: "Texto...",
  },
];

export default function PracticasVirtuales() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeCurve }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Space_Grotesk'] tracking-tight text-foreground mb-3">
              Prácticas Virtuales
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg mb-8">
              Prepárate antes de subirte al coche
            </p>
          </motion.div>

          {/* Hero image placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: easeCurve, delay: 0.1 }}
            className="rounded-3xl bg-[hsl(220,30%,15%)] border border-primary/30 aspect-[21/9] flex items-center justify-center mb-16"
          >
            <span className="text-muted-foreground text-sm">Imagen practica virtual</span>
          </motion.div>

          {/* Feature cards 2x2 */}
          <div className="grid sm:grid-cols-2 gap-5">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: easeCurve }}
                className="group rounded-2xl border border-border/40 bg-card p-6 hover:border-primary/30 transition-colors duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-foreground font-['Space_Grotesk'] text-base">
                    {feat.title}
                  </h3>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <feat.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feat.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
