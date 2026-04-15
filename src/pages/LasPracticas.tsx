import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Video, MapPin, TrendingUp, Car, Package, RefreshCw } from "lucide-react";

const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

const features = [
  {
    icon: CalendarCheck,
    title: "¡Tus prácticas a un click!",
    bullets: [
      "Resérvalas fácilmente desde tu móvil",
      "Elige día y hora en tu espacio personal",
      "Y si no puedes asistir, recuerda cancelar con 24h de antelación",
    ],
  },
  {
    icon: Video,
    title: "Maniobras de examen",
    bullets: [
      "Tendrás acceso a videos de cada maniobra con su explicación y los errores habituales que suelen cometerse en el examen",
    ],
  },
  {
    icon: MapPin,
    title: "Recorridos de Examen, al detalle",
    bullets: [
      "Accede a los vídeos de los itinerarios más habituales",
      "Reconoce las zonas y sus intersecciones antes de enfrentarte a ellas",
      "Interioriza buenos hábitos de conducción para ir más seguro, más tranquilo y aprobar con más facilidad",
    ],
  },
  {
    icon: TrendingUp,
    title: "Tu progreso siempre contigo",
    bullets: [
      "Cada coche Ready2Go lleva una tablet donde tu profe evalúa la clase",
      "Tendrás tu evolución guardada al instante, para que veas cómo mejoras día a día",
    ],
  },
  {
    icon: Car,
    title: "TestDrive!",
    bullets: [
      "Ponemos a prueba tu nivel como si fuera el día oficial",
      "Simulacros 100% reales para que llegues con confianza",
      "Sin nervios, sin sorpresas… y con muchas más opciones de aprobar a la primera",
    ],
  },
  {
    icon: Package,
    title: "AHORRA CON LOS PACKS",
    bullets: [
      "Elige uno de nuestros packs y paga menos por cada clase",
      "En cuanto te des de alta podrás empezar a reservar",
      "¿Empiezas de cero? Llévate un pack completo de teórica + prácticas y ahorra todavía más",
    ],
  },
  {
    icon: RefreshCw,
    title: "Prácticas de Reciclaje",
    bullets: [
      "Recupera la seguridad con nuestras clases de reciclaje personalizadas",
      "Con Ready2Go volverás a disfrutar de conducir",
    ],
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
      {/* Static border */}
      <div className="absolute inset-0 rounded-2xl border border-border/40 group-hover:border-transparent transition-colors duration-300 pointer-events-none" />

      {/* Animated border using conic-gradient approach */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            padding: "2px",
            background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary)/0.3), hsl(var(--primary)))",
            backgroundSize: "200% 100%",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            animation: "borderShimmer 2s linear infinite",
          }}
        />
      </div>

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground font-['Space_Grotesk'] text-lg mb-3">{title}</h3>
          <ul className="space-y-1.5">
            {bullets.map((b, i) => (
              <li key={i} className="text-sm text-muted-foreground leading-relaxed">{b}</li>
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

          {/* CTA + image bottom section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-40px" }}
            transition={{ duration: 0.6, ease: easeCurve }}
            className="mt-16 text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] tracking-tight text-foreground mb-4">
              Empieza tus prácticas hoy
            </h2>
            <Link to="/pagos">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }} className="inline-block">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-11 text-sm font-semibold">
                  Ver packs
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, margin: "-40px" }}
            transition={{ duration: 0.7, ease: easeCurve }}
            className="mt-10 rounded-3xl bg-[hsl(220,30%,15%)] aspect-[21/9] flex items-center justify-center"
          >
            <span className="text-primary-foreground/60 text-sm">Imagen chicos práctica</span>
          </motion.div>
        </div>
      </main>
      <Footer />

      <style>{`
        @keyframes borderShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
