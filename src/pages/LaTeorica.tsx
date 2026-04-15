import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Monitor, ClipboardCheck, Video, Target } from "lucide-react";

const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

const features = [
  {
    icon: ClipboardCheck,
    title: "Tests por bloques (85%)",
    desc: "4 bloques progresivos + mínimo 85%",
  },
  {
    icon: Monitor,
    title: "Clases online",
    desc: "Disponible 24h en la App",
  },
  {
    icon: BookOpen,
    title: "Clases presenciales",
    desc: "Con tu profe en el aula",
  },
  {
    icon: MessageCircle,
    title: "Dudas en directo",
    desc: "Resuelve tus preguntas al momento",
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
            className="mt-10 rounded-3xl bg-[hsl(var(--foreground))] aspect-[21/9] flex items-center justify-center"
          >
            <span className="text-primary-foreground/60 text-sm font-medium">Imagen si no apruebas no pagas</span>
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
            <div className="rounded-2xl bg-[hsl(var(--foreground))] aspect-[4/3] flex items-center justify-center">
              <span className="text-primary-foreground/60 text-sm font-medium">Imagen chica movil</span>
            </div>
          </motion.div>

          {/* Feature cards */}
          <div className="mt-16 md:mt-24 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: easeCurve }}
                className="group rounded-2xl border border-border/40 bg-card p-6 hover:border-primary/30 transition-colors duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feat.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground font-['Space_Grotesk'] text-base mb-1">{feat.title}</h3>
                <p className="text-sm text-muted-foreground">{feat.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA bottom */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: easeCurve }}
            className="mt-16 text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] tracking-tight text-foreground mb-4">
              Empieza tu teórica hoy
            </h2>
            <Link to="/pagos">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }} className="inline-block">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-11 text-sm font-semibold">
                  Ver packs
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
