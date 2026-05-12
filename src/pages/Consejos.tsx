import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ContactForm from "@/components/landing/ContactForm";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ClipboardList,
  HelpCircle,
  Eye,
  UserCheck,
  Repeat,
  Building2,
  Users,
  Volume2,
  BrainCircuit,
  Check,
  Sparkles,
  X,
  ArrowRight,
} from "lucide-react";
import centroEstudios from "@/assets/centro-de-estudios.jpeg";

const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

const metodo = [
  { icon: ClipboardList, title: "Organización del estudio", text: "Planificamos cada sesión con objetivos claros." },
  { icon: HelpCircle, title: "Resolución de dudas", text: "Atendemos cada consulta en el momento que surge." },
  { icon: Eye, title: "Supervisión constante", text: "Acompañamos el progreso de cada alumno de cerca." },
  { icon: UserCheck, title: "Apoyo personalizado", text: "Adaptamos el ritmo a las necesidades de cada uno." },
  { icon: Repeat, title: "Rutinas eficaces", text: "Creamos hábitos sólidos que se mantienen en el tiempo." },
];

const instalaciones = [
  { icon: Building2, title: "Aula principal", text: "Espacio amplio para grupos de trabajo." },
  { icon: Users, title: "Aulas de apoyo", text: "Salas reducidas para refuerzo individual." },
  { icon: Volume2, title: "Espacios tranquilos", text: "Zonas organizadas y silenciosas para estudiar." },
  { icon: BrainCircuit, title: "Concentración real", text: "Ambiente diseñado para el rendimiento." },
];

const checklist = [
  "Mejorar hábitos de estudio",
  "Necesitan seguimiento personalizado",
  "Pierden concentración estudiando solos",
  "Preparar exámenes con planificación",
  "Entorno más organizado y constante",
];

const niveles = ["Primaria", "ESO", "Bachillerato"];

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

export default function Consejos() {
  const [zoomOpen, setZoomOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* HERO */}
          <section className="grid md:grid-cols-5 gap-10 md:gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeCurve }}
              className="md:col-span-2"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Space_Grotesk'] tracking-tight text-foreground mb-3">
                Centro de Estudios Ready2Go
              </h1>
              <p className="text-lg sm:text-xl text-foreground/80 font-medium mb-3">
                Un espacio diseñado para estudiar de verdad
              </p>
              <p className="text-muted-foreground text-base sm:text-lg mb-7 leading-relaxed">
                En Ready2Go hemos creado un entorno donde el objetivo no es dar clases sin más, sino
                ayudar a cada alumno a trabajar con orden, constancia y seguimiento real.
              </p>
              <div className="flex flex-wrap gap-3">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Button
                    onClick={() => scrollTo("contacto-centro")}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-7 h-11 text-sm font-semibold"
                  >
                    Consultar grupos disponibles
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Button
                    onClick={() => scrollTo("como-trabajamos")}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-7 h-11 text-sm font-semibold"
                  >
                    Cómo trabajamos
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: easeCurve, delay: 0.15 }}
              className="md:col-span-3 img-glow group relative rounded-2xl overflow-hidden bg-white border border-border/40 shadow-sm md:-mr-8 lg:-mr-16 cursor-zoom-in"
              onClick={() => setZoomOpen(true)}
            >
              <img
                src={centroEstudios}
                alt="Centro de Estudios Ready2Go: método y entorno para el rendimiento"
                loading="lazy"
                className="w-full h-auto scale-[1.02] transition-transform duration-500 group-hover:scale-[1.05]"
              />
              <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur text-xs font-medium text-foreground/80 opacity-0 group-hover:opacity-100 transition-opacity">
                Ampliar imagen
              </div>
            </motion.div>
          </section>

          {/* CÓMO TRABAJAMOS */}
          <section id="como-trabajamos" className="mt-32 md:mt-56 scroll-mt-20">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease: easeCurve }}
              className="max-w-3xl mb-10"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-['Space_Grotesk'] tracking-tight text-foreground mb-4">
                Cómo trabajamos
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                No creemos en grupos masificados ni en clases improvisadas. Trabajamos con grupos
                reducidos y organizados por niveles.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {metodo.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.article
                    key={item.title}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.5, delay: i * 0.07, ease: easeCurve }}
                    className="rounded-2xl bg-card border border-border/40 p-6 hover:border-primary/30 transition-colors"
                  >
                    <motion.div
                      whileHover={{ y: -14, scale: 1.18, rotate: -8 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5 cursor-pointer"
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                    <h3 className="font-semibold text-foreground font-['Space_Grotesk'] text-lg mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                  </motion.article>
                );
              })}
            </div>
          </section>

          {/* INSTALACIONES */}
          <section id="instalaciones" className="mt-20 md:mt-28 scroll-mt-24">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease: easeCurve }}
              className="max-w-3xl mb-10"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-['Space_Grotesk'] tracking-tight text-foreground mb-4">
                Un entorno que favorece el rendimiento
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Hemos diseñado el centro para que el alumno venga a estudiar en un espacio cómodo,
                moderno y sin distracciones.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {instalaciones.map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.5, delay: i * 0.07, ease: easeCurve }}
                    className="rounded-2xl bg-card border border-border/40 p-6 hover:border-primary/30 transition-colors"
                  >
                    <motion.div
                      whileHover={{ y: -14, scale: 1.18, rotate: -8 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5 cursor-pointer"
                    >
                      <Icon className="w-5 h-5" />
                    </motion.div>
                    <h3 className="font-semibold text-foreground font-['Space_Grotesk'] text-base mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* A QUIÉN VA DIRIGIDO */}
          <section id="a-quien" className="mt-20 md:mt-28 scroll-mt-24">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease: easeCurve }}
              className="rounded-3xl bg-muted/40 border border-border/40 p-8 sm:p-12"
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-['Space_Grotesk'] tracking-tight text-foreground mb-8">
                ¿A quién va dirigido?
              </h2>
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <p className="text-sm uppercase tracking-[0.18em] text-muted-foreground mb-4 font-medium">
                    Niveles
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {niveles.map((n) => (
                      <span
                        key={n}
                        className="px-5 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 font-semibold text-sm"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
                <ul className="space-y-3">
                  {checklist.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 w-6 h-6 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-sm sm:text-base text-foreground/85 leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </section>

          {/* DIFERENCIADORA */}
          <section className="mt-20 md:mt-28">
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, ease: easeCurve }}
              className="rounded-3xl border border-primary/20 bg-primary/5 p-8 sm:p-12 text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-[0.18em] mb-5">
                <Sparkles className="w-3.5 h-3.5" />
                Diferencial
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-['Space_Grotesk'] tracking-tight text-foreground mb-4">
                Grupos reducidos y seguimiento real
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
                Mantenemos grupos limitados y una estructura organizada desde el inicio, evitando la
                sensación de academias masificadas donde el alumno pasa desapercibido.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {["Grupos reducidos", "Seguimiento individual", "Sin masificación"].map((label) => (
                  <span
                    key={label}
                    className="px-5 py-2.5 rounded-full bg-card border border-border/50 text-foreground text-sm font-semibold"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </motion.div>
          </section>

          {/* CTA FINAL */}
          <section id="contacto-centro" className="mt-20 md:mt-28 scroll-mt-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, ease: easeCurve }}
              className="relative rounded-3xl bg-card border border-border/50 p-10 sm:p-16 overflow-hidden"
            >
              {/* Subtle decorative blobs */}
              <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />

              <div className="relative grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-[0.18em] mb-5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Ready2Go
                  </div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Space_Grotesk'] tracking-tight text-foreground mb-5 leading-[1.05]">
                    Más que <span className="text-primary">una academia</span>
                  </h2>
                  <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8 max-w-lg">
                    Un lugar donde estudiar con calma, trabajar con método y avanzar de forma
                    constante. Porque aprender mejor no depende solo de estudiar más.
                  </p>
                  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="inline-block">
                    <Button
                      onClick={() => {
                        const form = document.getElementById("contacto");
                        form?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="group bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-12 text-sm font-semibold gap-2"
                    >
                      Quiero información sobre los grupos
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </motion.div>
                  <p className="text-muted-foreground/80 text-xs sm:text-sm mt-4">
                    Te explicamos el funcionamiento del centro personalmente
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {[
                    { k: "Calma", v: "Sin ruido ni prisas" },
                    { k: "Método", v: "Plan estructurado" },
                    { k: "Constancia", v: "Avance sostenido" },
                    { k: "Cercanía", v: "Trato personal" },
                  ].map((item, i) => (
                    <motion.div
                      key={item.k}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-30px" }}
                      transition={{ duration: 0.5, delay: i * 0.08, ease: easeCurve }}
                      className="rounded-2xl bg-background/60 border border-border/50 p-5 hover:border-primary/40 hover:bg-background transition-all"
                    >
                      <p className="font-semibold text-foreground font-['Space_Grotesk'] mb-1">
                        {item.k}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.v}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </section>
        </div>
      </main>

      {/* Image Lightbox */}
      <AnimatePresence>
        {zoomOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setZoomOpen(false)}
            className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
          >
            <button
              onClick={() => setZoomOpen(false)}
              aria-label="Cerrar"
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-card border border-border/60 flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.img
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: easeCurve }}
              src={centroEstudios}
              alt="Centro de Estudios Ready2Go ampliado"
              onClick={(e) => e.stopPropagation()}
              className="max-w-[95vw] max-h-[90vh] w-auto h-auto rounded-2xl shadow-2xl object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div id="contacto">
        <ContactForm />
      </div>
      <Footer />
    </div>
  );
}
