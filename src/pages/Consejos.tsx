import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ContactForm from "@/components/landing/ContactForm";
import { motion } from "framer-motion";
import { Lightbulb, Route, ShieldCheck, Gauge } from "lucide-react";

const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

const tips = [
  {
    icon: Lightbulb,
    title: "Antes del examen",
    text: "Repasa señales, descansa bien y llega con tiempo para empezar con la mente despejada.",
  },
  {
    icon: Route,
    title: "Durante tus prácticas",
    text: "Convierte cada clase en una rutina: mira lejos, anticipa y pregunta todo lo que necesites.",
  },
  {
    icon: ShieldCheck,
    title: "Conducción segura",
    text: "Mantén distancia, observa espejos con frecuencia y evita decisiones bruscas en ciudad.",
  },
  {
    icon: Gauge,
    title: "Confianza al volante",
    text: "La seguridad llega con constancia: analiza errores, corrige y celebra cada avance.",
  },
];

export default function Consejos() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeCurve }}
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Space_Grotesk'] tracking-tight text-foreground mb-3">
              Consejos
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg mb-8">
              Claves prácticas para aprender, mejorar y conducir con más seguridad.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: easeCurve, delay: 0.1 }}
            className="rounded-3xl bg-primary/10 border border-primary/20 aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] flex items-center justify-center mb-12 sm:mb-16"
          >
            <span className="text-muted-foreground text-sm">Imagen consejos</span>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {tips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <motion.article
                  key={tip.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: index * 0.08, ease: easeCurve }}
                  className="rounded-2xl bg-card border border-border/40 p-6 hover:border-primary/30 transition-colors"
                >
                  <motion.div
                    whileHover={{ y: -14, scale: 1.18, rotate: -8 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5 cursor-pointer"
                  >
                    <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                      <Icon className="w-5 h-5" />
                    </motion.div>
                  </motion.div>
                  <h2 className="font-semibold text-foreground font-['Space_Grotesk'] text-lg mb-2">{tip.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tip.text}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </main>
      <ContactForm />
      <Footer />
    </div>
  );
}
