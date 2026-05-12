import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ContactForm from "@/components/landing/ContactForm";
import { motion } from "framer-motion";
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
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* HERO */}
          <section className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeCurve }}
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
                    variant="ghost"
                    onClick={() => scrollTo("como-trabajamos")}
                    className="rounded-full px-7 h-11 text-sm font-semibold text-foreground hover:bg-primary/10"
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
              className="img-glow relative rounded-2xl overflow-hidden bg-white border border-border/40 shadow-sm"
            >
              <img
                src={centroEstudios}
                alt="Centro de Estudios Ready2Go: método y entorno para el rendimiento"
                loading="lazy"
                className="w-full h-auto"
              />
            </motion.div>
          </section>

          {/* CÓMO TRABAJAMOS */}
          <section id="como-trabajamos" className="mt-20 md:mt-28 scroll-mt-24">
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
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, ease: easeCurve }}
              className="rounded-3xl bg-primary p-10 sm:p-14 text-center overflow-hidden"
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Space_Grotesk'] tracking-tight text-primary-foreground mb-4">
                Más que una academia
              </h2>
              <p className="text-primary-foreground/85 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
                Un lugar donde estudiar con calma, trabajar con método y avanzar de forma constante.
                Porque aprender mejor no depende solo de estudiar más.
              </p>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="inline-block">
                <Button
                  onClick={() => {
                    const form = document.getElementById("contacto");
                    form?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-[hsl(var(--foreground))] text-background hover:opacity-90 rounded-full px-8 h-12 text-sm font-semibold"
                >
                  Quiero información sobre los grupos
                </Button>
              </motion.div>
              <p className="text-primary-foreground/70 text-xs sm:text-sm mt-5">
                Te explicamos el funcionamiento del centro personalmente
              </p>
            </motion.div>
          </section>
        </div>
      </main>
      <div id="contacto">
        <ContactForm />
      </div>
      <Footer />
    </div>
  );
}
