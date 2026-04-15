import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { CalendarCheck, Video, MapPin, TrendingUp, Car, Package, RefreshCw } from "lucide-react";

const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

const features = [
  {
    icon: CalendarCheck,
    title: "Prácticas a un click",
    bullets: ["Reserva desde tu móvil", "Elige día y hora", "Cancela si no puedes asistir"],
  },
  {
    icon: Video,
    title: "Maniobras de examen",
    bullets: ["Vídeos explicativos"],
  },
  {
    icon: MapPin,
    title: "Recorridos reales",
    bullets: ["Itinerarios detallados", "Reconoce zonas", "Interioriza hábitos"],
  },
  {
    icon: TrendingUp,
    title: "Tu progreso",
    bullets: ["Coche Ready2Go", "Evolución"],
  },
  {
    icon: Car,
    title: "TestDrive",
    bullets: ["Simulacros reales", "Simulacros 100%", "Sin nervios"],
  },
  {
    icon: Package,
    title: "Ahorra con packs",
    bullets: ["Mejor precio por clase", "Desde el alta", "Empieza de cero"],
  },
  {
    icon: RefreshCw,
    title: "Reciclaje",
    bullets: ["Recupera seguridad", "Disfruta volver a conducir"],
  },
];

function FeatureCard({ icon: Icon, title, bullets, index }: { icon: typeof CalendarCheck; title: string; bullets: string[]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: easeCurve }}
      className="group relative rounded-2xl bg-card p-6 cursor-default overflow-hidden"
    >
      {/* Animated border */}
      <div className="absolute inset-0 rounded-2xl border border-border/40 group-hover:border-transparent transition-colors duration-300" />
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect
            x="0.5" y="0.5"
            width="calc(100% - 1px)" height="calc(100% - 1px)"
            rx="16" ry="16"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeDasharray="800"
            strokeDashoffset="800"
            className="group-hover:animate-[borderDraw_1.2s_ease-out_forwards]"
          />
        </svg>
      </div>

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground font-['Space_Grotesk'] text-lg mb-3">{title}</h3>
          <ul className="space-y-1.5">
            {bullets.map((b) => (
              <li key={b} className="text-sm text-muted-foreground">{b}</li>
            ))}
          </ul>
        </div>
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>
    </motion.div>
  );
}

export default function LasPracticas() {
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
            <h1 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] tracking-tight text-foreground mb-2">
              Libertad sin barreras
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg mb-8">
              Disfruta de la flexibilidad que necesitas
            </p>
          </motion.div>

          {/* Hero image placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: easeCurve, delay: 0.1 }}
            className="rounded-3xl bg-primary/80 aspect-[21/9] flex items-center justify-center mb-16"
          >
            <span className="text-primary-foreground/60 text-sm">Imagen Las Prácticas</span>
          </motion.div>

          {/* Feature cards grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat, i) => (
              <FeatureCard key={feat.title} {...feat} index={i} />
            ))}
          </div>
        </div>
      </main>
      <Footer />

      {/* Keyframe for border draw animation */}
      <style>{`
        @keyframes borderDraw {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}
