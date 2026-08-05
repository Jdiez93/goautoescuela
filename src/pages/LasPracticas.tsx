import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ContactForm from "@/components/landing/ContactForm";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import iconoAppPracticas from "@/assets/icono-app-practicas.png";
import iconoManiobras from "@/assets/icono-maniobras.png";
import iconoRecorridoExamen from "@/assets/icono-recorrido-examen.png";
import iconoProgreso from "@/assets/icono-progreso.png";
import iconoSimulacro from "@/assets/icono-simulacro.png";
import iconoAhorro from "@/assets/icono-ahorro.png";
import iconoReciclaje from "@/assets/icono-reciclaje.png";
import { AnimatedCardBg } from "@/components/ui/animated-card-bg";
import { RandomLetterSwapPingPong } from "@/components/ui/random-letter-swap";
import { Tilt3D } from "@/components/ui/tilt-3d";
import practicasHero from "@/assets/practicas-hero.png";
import practicasChicos from "@/assets/practicas-chicos.png.asset.json";

const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

const features = [
  {
    icon: iconoAppPracticas,
    title: "¡Tus prácticas a un click!",
    bullets: [
      "Resérvalas fácilmente desde tu móvil",
      "Elige día y hora en tu espacio personal",
      "Y si no puedes asistir, recuerda cancelar con 24h de antelación",
    ],
  },
  {
    icon: iconoManiobras,
    title: "Maniobras de examen",
    bullets: [
      "Tendrás acceso a videos de cada maniobra con su explicación y los errores habituales que suelen cometerse en el examen",
    ],
  },
  {
    icon: iconoRecorridoExamen,
    title: "Recorridos de Examen, al detalle",
    bullets: [
      "Accede a los vídeos de los itinerarios más habituales",
      "Reconoce las zonas y sus intersecciones antes de enfrentarte a ellas",
      "Interioriza buenos hábitos de conducción para ir más seguro, más tranquilo y aprobar con más facilidad",
    ],
  },
  {
    icon: iconoProgreso,
    title: "Tu progreso siempre contigo",
    bullets: [
      "Cada coche Ready2Go lleva una tablet donde tu profe evalúa la clase",
      "Tendrás tu evolución guardada al instante, para que veas cómo mejoras día a día",
    ],
  },
  {
    icon: iconoSimulacro,
    title: "TestDrive!",
    bullets: [
      "Ponemos a prueba tu nivel como si fuera el día oficial",
      "Simulacros 100% reales para que llegues con confianza",
      "Sin nervios, sin sorpresas… y con muchas más opciones de aprobar a la primera",
    ],
  },
  {
    icon: iconoAhorro,
    iconScale: 1.3,
    title: "AHORRA CON LOS PACKS",
    bullets: [
      "Elige uno de nuestros packs y paga menos por cada clase",
      "En cuanto te des de alta podrás empezar a reservar",
      "¿Empiezas de cero? Llévate un pack completo de teórica + prácticas y ahorra todavía más",
    ],
  },
  {
    icon: iconoReciclaje,
    title: "Prácticas de Reciclaje",
    bullets: [
      "Recupera la seguridad con nuestras clases de reciclaje personalizadas",
      "Con Ready2Go volverás a disfrutar de conducir",
    ],
  },
];

function FeatureCard({ icon, title, bullets, index, iconScale = 1 }: { icon: string; title: string; bullets: string[]; index: number; iconScale?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: easeCurve }}
    >
    <Tilt3D className="group relative rounded-2xl bg-card p-6 cursor-default overflow-hidden block">
      <AnimatedCardBg />
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

      <motion.div
        whileHover={{ y: -14, scale: 1.15, rotate: -8 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        className="absolute -top-4 -right-4 cursor-pointer z-10"
      >
        <motion.img
          src={icon}
          alt={title}
          animate={{ y: [0, -3, 0], scale: iconScale }}
          transition={{ y: { duration: 2.4, repeat: Infinity, ease: "easeInOut" }, scale: { duration: 0 } }}
          className="no-glow w-44 h-44 sm:w-48 sm:h-48 object-contain"
        />
      </motion.div>
      <div className="relative pointer-events-none">
        <h3 className="font-semibold text-foreground font-['Space_Grotesk'] text-lg mb-3 pr-32 sm:pr-36 min-h-[7rem] flex items-center">{title}</h3>
        <ul className="space-y-1.5">
          {bullets.map((b, i) => (
            <li key={i} className="text-sm text-muted-foreground leading-relaxed">{b}</li>
          ))}
        </ul>
      </div>
    </Tilt3D>
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
              <RandomLetterSwapPingPong label="Libertad sin barreras" />
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
            className="img-glow relative rounded-3xl overflow-hidden bg-white aspect-[16/9] border border-border/40 shadow-sm mb-16"
          >
            <img
              src={practicasHero}
              alt="Tus prácticas a tu ritmo. Elige día y hora con un solo click"
              className="absolute inset-0 w-full h-full object-contain"
              loading="eager"
            />
          </motion.div>


          {/* Feature cards grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat, i) => (
              <FeatureCard key={feat.title} {...feat} index={i} />
            ))}
          </div>

          {/* CTA + image bottom section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: easeCurve }}
            className="mt-16 rounded-3xl bg-background aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] relative overflow-hidden"
          >
            <img
              src={practicasChicos.url}
              alt="Conduce hacia tu libertad: aprende con confianza, flexibilidad y profesores con vocación"
              className="absolute inset-0 w-full h-full object-contain"
              loading="lazy"
            />


            {/* Button inside image - discreet */}
            <div className="absolute inset-0 flex items-end justify-end p-6 sm:p-8">
              <Link to="/matriculate">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10 rounded-full px-4 h-8 text-xs font-medium backdrop-blur-sm border border-white/15"
                  >
                    Ver packs
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <ContactForm />
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
