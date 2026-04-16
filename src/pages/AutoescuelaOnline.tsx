import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
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
        <div className="w-full bg-[hsl(var(--foreground))] flex items-center justify-center min-h-[280px] md:min-h-[360px]">
          <span className="text-primary-foreground/60 text-lg font-semibold tracking-widest uppercase">
            Imagen Autoescuela Online
          </span>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
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
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className="grid md:grid-cols-2 gap-8 md:gap-12 items-center"
                >
                  {/* Text */}
                  <div className={textFirst ? "md:order-1" : "md:order-2"}>
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-3">{feat.title}</h3>
                    <ul className="space-y-2 text-muted-foreground leading-relaxed">
                      {feat.bullets.map((b, j) => (
                        <li key={j}>• {b}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Image placeholder */}
                  <div className={textFirst ? "md:order-2" : "md:order-1"}>
                    <div className="aspect-[4/3] rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center">
                      <span className="text-primary font-semibold text-lg">{feat.imageLabel}</span>
                    </div>
                  </div>
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
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="rounded-3xl bg-gradient-to-br from-secondary to-secondary/80 p-10 md:p-14"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-secondary-foreground mb-3">
              Tu carnet empieza aquí
            </h3>
            <p className="text-secondary-foreground/80 mb-8">
              Miles de alumnos ya lo han conseguido. Ahora te toca a ti.
            </p>
            <a href="/registro">
              <button className="px-6 py-3 rounded-xl bg-[hsl(var(--foreground))] text-background font-semibold hover:opacity-90 transition-opacity">
                Empieza ahora
              </button>
            </a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
