import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Smartphone, Clock, ShieldCheck, Trophy } from "lucide-react";

const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, margin: "-60px" },
  transition: { duration: 0.7, ease: easeCurve },
};

const features = [
  {
    icon: Smartphone,
    title: "Interacción y Tecnología",
    text: "Texto...",
    tag: "MOB_01",
    corners: ["top-left", "top-right"],
  },
  {
    icon: Clock,
    title: "Tiempo y Dinero",
    text: "Texto...",
    tag: "SYNC_247",
    corners: [],
  },
  {
    icon: ShieldCheck,
    title: "Confianza y Preparación",
    text: "Texto...",
    tag: "PROT_SAFE",
    corners: [],
  },
  {
    icon: Trophy,
    title: "Éxito al Primer Intento",
    text: "Texto...",
    tag: "RANK_TOP",
    corners: ["bottom-left", "bottom-right"],
  },
];

function CornerBracket({ position }: { position: string }) {
  const classes: Record<string, string> = {
    "top-left": "top-0 left-0 border-t border-l",
    "top-right": "top-0 right-0 border-t border-r",
    "bottom-left": "bottom-0 left-0 border-b border-l",
    "bottom-right": "bottom-0 right-0 border-b border-r",
  };
  return (
    <span
      className={`absolute w-2 h-2 border-primary/50 ${classes[position]}`}
    />
  );
}

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
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, margin: "-40px" }}
            transition={{ duration: 0.6, ease: easeCurve }}
            className="rounded-3xl bg-[hsl(220,30%,15%)] border border-primary/30 aspect-[21/9] flex items-center justify-center mb-16"
          >
            <span className="text-muted-foreground text-sm">Imagen practica virtual</span>
          </motion.div>

          {/* HUD Feature Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-60px" }}
            transition={{ duration: 0.6, ease: easeCurve }}
            className="grid sm:grid-cols-2 gap-px bg-border/20 border border-border/30 rounded-2xl overflow-hidden"
          >
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: easeCurve }}
                className="group relative bg-background p-8 sm:p-10 transition-all duration-500 hover:bg-primary/[0.03]"
                style={{ cursor: "crosshair" }}
              >
                {/* Corner brackets */}
                {feat.corners.map((c) => (
                  <CornerBracket key={c} position={c} />
                ))}

                {/* Top row: icon + tag */}
                <div className="flex justify-between items-start mb-7">
                  <div className="w-12 h-12 rounded-sm border border-primary/30 flex items-center justify-center bg-primary/5 group-hover:bg-primary/15 transition-colors duration-400">
                    <feat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-[10px] text-primary/40 font-mono tracking-tighter select-none">
                    {feat.tag}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-lg font-medium text-foreground mb-2 tracking-wide font-['Space_Grotesk']">
                  {feat.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[32ch] mb-6">
                  {feat.text}
                </p>

                {/* Animated instrument line */}
                <div className="h-px w-12 group-hover:w-full transition-all duration-700 bg-gradient-to-r from-primary to-transparent" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
      <motion.div {...fadeUp}>
        <Footer />
      </motion.div>
    </div>
  );
}
