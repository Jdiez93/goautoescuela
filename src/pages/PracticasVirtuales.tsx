import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ContactForm from "@/components/landing/ContactForm";
import { motion } from "framer-motion";
import iconoInteraccion from "@/assets/icono-interaccion-tecnologia.jpeg";
import iconoTiempoDinero from "@/assets/icono-tiempo-dinero.jpeg";
import iconoConfianza from "@/assets/icono-confianza-preparacion.jpeg";
import iconoExito from "@/assets/icono-exito-primer-intento.jpeg";

const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, ease: easeCurve },
};

const features = [
  { icon: iconoInteraccion, title: "Interacción y Tecnología", text: "Texto...", scale: 1 },
  { icon: iconoTiempoDinero, title: "Tiempo y Dinero", text: "Texto...", scale: 1.65 },
  { icon: iconoConfianza, title: "Confianza y Preparación", text: "Texto...", scale: 1 },
  { icon: iconoExito, title: "Éxito al Primer Intento", text: "Texto...", scale: 1 },
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
              Actualidad
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg mb-8">
              Novedades, tendencias y noticias para moverte con seguridad
            </p>
          </motion.div>

          {/* Hero image placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: easeCurve }}
            className="rounded-3xl bg-[hsl(220,30%,15%)] border border-primary/30 aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] flex items-center justify-center mb-16"
          >
            <span className="text-muted-foreground text-sm">Imagen actualidad</span>
          </motion.div>

          {/* HUD Feature Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: easeCurve }}
            className="grid sm:grid-cols-2 gap-4 sm:gap-5"
          >
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: easeCurve }}
                className="group relative bg-card border border-border/30 rounded-2xl p-8 sm:p-10 transition-all duration-500 hover:bg-primary/[0.03] hover:border-primary/30"
                style={{ cursor: "crosshair" }}
              >
                {/* Icon */}
                <img
                  src={feat.icon}
                  alt={feat.title}
                  style={{ transform: `scale(${feat.scale})`, transformOrigin: "center" }}
                  className="no-glow absolute -top-2 -right-2 w-32 h-32 sm:w-36 sm:h-36 object-contain mix-blend-multiply pointer-events-none"
                />
                <div className="mb-7" />

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
      <ContactForm />
      <motion.div {...fadeUp}>
        <Footer />
      </motion.div>
    </div>
  );
}
