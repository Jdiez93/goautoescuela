import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ContactForm from "@/components/landing/ContactForm";
import { motion } from "framer-motion";

const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, ease: easeCurve },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.92 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: "-40px" },
  transition: { duration: 0.6, ease: easeCurve },
};

const features = [
  {
    title: "Tu aula está donde tú quieras",
    bullets: [
      "Olvídate de horarios fijos",
      "Con nuestra App tienes acceso 24/7 al curso teórico completo: esquemas, vídeos explicativos y test actualizados",
      "Aprende a tu ritmo, cuándo y dónde quieras",
    ],
    imageLabel: "Imagen Tu aula",
  },
  {
    title: "Cada pregunta, un vídeo",
    bullets: [
      "Más de 3.000 test y miles de preguntas explicadas con vídeos de 1 minuto y medio",
      "Te enseñamos por qué una respuesta es correcta y por qué las otras no lo son",
      "Así aprendes de verdad y no memorizas al azar",
    ],
    imageLabel: "Imagen Pregunta video",
  },
  {
    title: "Tu profe, siempre contigo",
    bullets: [
      "Accede a clases grabadas para repasar los temas más importantes, las veces que quieras",
      "Nuestro método te guía paso a paso hasta alcanzar el nivel ideal para aprobar",
    ],
    imageLabel: "Imagen Tu profe",
  },
  {
    title: "Si alcanzas el 85% en el barómetro general y no apruebas, te devolvemos el dinero",
    bullets: [
      "Porque creemos en ti y en nuestro método",
      "Consigue al menos el 85% en el barómetro general y, si no apruebas a la primera, te reembolsamos el curso teórico",
    ],
    imageLabel: "Imagen Método 85",
  },
  {
    title: "Una App, todo lo que necesitas",
    bullets: [
      "Matricúlate, estudia, haz test, mira vídeos y gestiona todo desde tu móvil",
      "Llévate la autoescuela contigo",
    ],
    imageLabel: "Imagen Nuestra App",
  },
];

export default function AutoescuelaOnline() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero banner */}
      <section className="pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: easeCurve }}
          className="w-full bg-[hsl(var(--foreground))] flex items-center justify-center min-h-[280px] md:min-h-[360px]"
        >
          <span className="text-primary-foreground/60 text-lg font-semibold tracking-widest uppercase">
            Imagen Autoescuela Online
          </span>
        </motion.div>
      </section>

      {/* Content */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.h2
            {...fadeUp}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Space_Grotesk'] tracking-tight mb-16"
          >
            Qué es ready2Go Online
          </motion.h2>

          <div className="space-y-16 md:space-y-24">
            {features.map((feat, i) => {
              const textFirst = i % 2 === 0;
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: 0.1, ease: easeCurve }}
                  className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
                >
                  {/* Text */}
                  <motion.div
                    className={textFirst ? "md:order-1" : "md:order-2"}
                    initial={{ opacity: 0, x: textFirst ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, delay: 0.2, ease: easeCurve }}
                  >
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-3">{feat.title}</h3>
                    <ul className="space-y-2 text-muted-foreground leading-relaxed">
                      {feat.bullets.map((b, j) => (
                        <li key={j}>• {b}</li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Image placeholder */}
                  <motion.div
                    className={textFirst ? "md:order-2" : "md:order-1"}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, delay: 0.15, ease: easeCurve }}
                    whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                  >
                    <div className="aspect-[4/3] rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center">
                      <span className="text-primary font-semibold text-lg">{feat.imageLabel}</span>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: easeCurve }}
            className="grid md:grid-cols-2 gap-8 md:gap-12 items-center rounded-3xl bg-gradient-to-br from-secondary/10 to-secondary/5 p-8 md:p-12 border border-secondary/20"
          >
            {/* Text Content */}
            <motion.div
              className="order-2 md:order-1 text-center md:text-left"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.2, ease: easeCurve }}
            >
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                Tu carnet empieza aquí
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-2">
                Miles de alumnos ya se han sacado la teórica con nuestro método
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Ahora te toca a ti
              </p>
              <a href="/registro" className="inline-block w-full sm:w-auto">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  className="w-full sm:w-auto px-6 sm:px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  Empieza ahora tu curso teórico
                </motion.button>
              </a>
            </motion.div>

            {/* Image placeholder */}
            <motion.div
              className="order-1 md:order-2"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.15, ease: easeCurve }}
            >
              <div className="aspect-square rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center">
                <span className="text-primary font-semibold text-lg">Imagen chicos móvil</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <ContactForm />

      <motion.div {...fadeUp}>
        <Footer />
      </motion.div>
    </div>
  );
}
