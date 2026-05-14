import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ContactForm from "@/components/landing/ContactForm";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import icono85 from "@/assets/icono-85.png";
import heroSiNoApruebas from "@/assets/si-no-apruebas-no-pagas.jpeg";
import metodoReadyImg from "@/assets/teorica-metodo-ready.jpeg";
import iconoTest from "@/assets/icono-test.png";
import iconoVideoPregunta from "@/assets/icono-video-pregunta.png";
import iconoVideoTemario from "@/assets/icono-video-temario.png";
import { AnimatedCardBg } from "@/components/ui/animated-card-bg";

const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

const features = [
  {
    icon: icono85,
    title: "Supera los bloques de tests con el 85% de aptos",
    bullets: [
      "El método se organiza en 4 bloques de test progresivos",
      "Para avanzar, debes alcanzar al menos un 85% de aptos en cada bloque",
      "Así garantizamos que tu aprendizaje sea sólido y sin lagunas",
    ],
    imageLabel: "Imagen Tests",
  },
  {
    icon: iconoVideoTemario,
    title: "Clases 100% online, prepárate donde y cuando quieras",
    bullets: [
      "NO necesitas asistir a clases presenciales",
      "Todas las explicaciones están grabadas en nuestra App, disponibles las 24h",
      "Cada pregunta de test incluye un vídeo explicativo corto, para que entiendas por qué aciertas o fallas",
    ],
    imageLabel: "Imagen Video-Temario",
  },
  {
    icon: iconoVideoPregunta,
    title: "Tendrás un video explicativo en cada pregunta",
    bullets: [
      "Cada pregunta de test incluye un vídeo explicativo corto, para que entiendas por qué aciertas o fallas",
    ],
    imageLabel: "Imagen Video-Pregunta",
  },
  {
    icon: iconoTest,
    title: "Simulacros antes del examen",
    bullets: [
      "Una vez superados los bloques, toca la fase final",
      "Realiza al menos 30 simulacros de examen reales",
      "Mantén el 85% de aptos en tu barómetro",
      "Completa el proceso en menos de 2 meses desde que te apuntaste en Ready2Go",
    ],
    imageLabel: "Imagen Estadísticas",
  },
];

export default function LaTeorica() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Hero text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeCurve }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Space_Grotesk'] tracking-tight text-foreground mb-3">
              Una autoescuela diferente
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg mb-6">
              La forma más fácil, rápida y económica de conseguir tu libertad
            </p>
            <Link to="/registro">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }} className="inline-block">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-11 text-sm font-semibold">
                  ¡Lo quiero!
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Hero image placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: easeCurve, delay: 0.15 }}
            className="img-glow mt-10 relative rounded-2xl overflow-hidden bg-white aspect-[16/9] border border-border/40 shadow-sm"
          >
            <img src={heroSiNoApruebas} alt="La teórica online 100% guiada. Y si no apruebas, no pagas" className="absolute inset-0 w-full h-full object-contain" loading="eager" />
          </motion.div>

          {/* ¿Qué es el método Ready? */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: easeCurve }}
            className="mt-20 md:mt-28 grid md:grid-cols-2 gap-10 md:gap-14 items-center"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-['Space_Grotesk'] tracking-tight text-foreground mb-4">
                ¿Qué es el método Ready?
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Un aprendizaje estructurado, flexible y eficaz que te prepara para aprobar el teórico a la primera.
              </p>
            </div>
            <div className="img-glow relative rounded-2xl overflow-hidden bg-white border border-border/40 shadow-sm">
              <img src={metodoReadyImg} alt="Método Ready: aprendizaje guiado en la app" loading="lazy" className="w-full h-auto" />
            </div>
          </motion.div>

          {/* Feature cards - grid 2x2 */}
          <div className="mt-16 md:mt-24 grid sm:grid-cols-2 gap-5">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: easeCurve }}
                className="relative overflow-hidden group rounded-2xl border border-border/40 bg-card p-6 hover:border-primary/30 transition-colors duration-300"
              >
                <AnimatedCardBg />
                <div className="relative z-10 flex items-center gap-5 mb-4 min-h-[10rem]">
                  <motion.div whileHover={{ y: -14, scale: 1.15, rotate: -8 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} className="cursor-pointer shrink-0">
                    <motion.img
                      src={feat.icon}
                      alt={feat.title}
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                      className="no-glow w-40 h-40 sm:w-44 sm:h-44 object-contain"
                    />
                  </motion.div>
                  <h3 className="font-semibold text-foreground font-['Space_Grotesk'] text-base leading-snug flex-1">{feat.title}</h3>
                </div>
                <div className="rounded-xl bg-primary/15 border border-primary/20 h-36 flex items-center justify-center mb-4">
                  <span className="text-primary font-medium text-xs">{feat.imageLabel}</span>
                </div>
                <ul className="space-y-1">
                  {feat.bullets.map((b, j) => (
                    <li key={j} className="text-xs text-muted-foreground leading-relaxed">• {b}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Bottom image + CTA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: easeCurve }}
            className="mt-10 relative rounded-3xl bg-primary aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] flex items-center justify-center overflow-hidden"
          >
            <span className="text-primary-foreground/60 text-sm font-medium">Imagen chica portátil</span>
            <div className="absolute bottom-5 left-5">
            <Link to="/matriculate">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                <Button className="bg-[hsl(var(--foreground))] text-background hover:opacity-90 rounded-xl px-6 h-10 text-sm font-semibold">
                  Ver packs
                </Button>
              </motion.div>
            </Link>
            </div>
          </motion.div>

          {/* Legal notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: easeCurve }}
            className="mt-12"
          >
            <Alert className="border-border/50 bg-muted/30">
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs leading-relaxed text-muted-foreground">
                *Aplicable al curso teórico. Requiere cumplir el itinerario del método, asistencia/uso de plataforma según programa y alcanzar un 85% en el barómetro general en un plazo máximo de 2 meses desde el alta. Devolución sobre el importe abonado del teórico. No incluye tasas ni clases prácticas.
              </AlertDescription>
            </Alert>
          </motion.div>
        </div>
      </main>
      <ContactForm />
      <Footer />
    </div>
  );
}
