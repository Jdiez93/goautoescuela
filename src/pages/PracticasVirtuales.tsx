import Navbar from "@/components/centro/CentroNavbar";
import Footer from "@/components/centro/CentroFooter";
import ContactForm from "@/components/landing/ContactForm";
import { motion } from "framer-motion";
import {
  Cpu,
  Gamepad2,
  Package,
  FlaskConical,
  Bot,
  Users,
  Target,
  Sparkles,
  Code2,
  Brain,
  Puzzle,
  Rocket,
} from "lucide-react";
import banner from "@/assets/robotica-banner.jpg.asset.json";
import img2d from "@/assets/robotica-videojuegos-2d.jpg.asset.json";
import img3d from "@/assets/robotica-videojuegos-3d.jpg.asset.json";
import imgKodu from "@/assets/robotica-kodu.jpg.asset.json";
import imgWinner from "@/assets/robotica-winner.jpg.asset.json";
import imgTablet from "@/assets/robotica-tablet-game.jpg.asset.json";
import imgLego from "@/assets/robotica-lego.jpg.asset.json";
import imgArduino from "@/assets/robotica-arduino.jpg.asset.json";

const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, ease: easeCurve },
};

const pillars = [
  { icon: Code2, title: "Metodología de programación", text: "Aprenderán a pensar como programadores: lógica, secuencias, bucles y resolución de problemas." },
  { icon: Gamepad2, title: "Videojuegos 2D y 3D", text: "Diseñarán sus propios videojuegos utilizando herramientas profesionales adaptadas a su edad." },
  { icon: Package, title: "Todo el material incluido", text: "Ordenadores, tablets, placas, robots y software: nosotros lo aportamos todo." },
  { icon: FlaskConical, title: "Actividades STEM", text: "Ciencia, tecnología, ingeniería y matemáticas aplicadas de forma práctica y divertida." },
];

const tools = [
  "Lego WeDo 2.0",
  "Lego Spike",
  "Scratch",
  "Makey Makey",
  "MCA",
  "Kodu",
  "Megamind",
  "Microbit",
  "Codey Rocky",
  "Arduino",
];

const techSkills = ["Lógica", "Matemáticas", "Informática", "Creatividad", "Entorno", "Inteligencia espacial"];
const behaviorSkills = ["Trabajo cooperativo", "Aprendizaje significativo", "Gestión de la frustración", "Resolución de problemas", "Prueba y error", "Compartir y respetar"];

export default function PracticasVirtuales() {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-background overflow-hidden">
      <Navbar />
      <main className="pt-24 pb-20">
        {/* HERO with banner */}
        <section className="relative">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: easeCurve }}
              className="relative rounded-[2rem] overflow-hidden border border-primary/20 shadow-[0_30px_80px_-30px_hsl(var(--primary)/0.4)]"
            >
              <img
                src={banner.url}
                alt="Robótica Educativa y Programación de Videojuegos"
                className="w-full h-auto object-cover"
              />
              {/* Glow orbs */}
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-primary/30 blur-3xl pointer-events-none"
              />
              <motion.div
                animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-accent/30 blur-3xl pointer-events-none"
              />
            </motion.div>

            {/* Floating tag */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: easeCurve }}
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-xs font-medium text-primary">
                <Sparkles className="w-3.5 h-3.5" /> Centro de Formación Ready2Go
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 border border-accent/20 px-4 py-1.5 text-xs font-medium text-accent-foreground">
                <Bot className="w-3.5 h-3.5" /> STEM · Programación · Robótica
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: easeCurve }}
              className="mt-6 text-center text-4xl sm:text-5xl lg:text-6xl font-black font-['Space_Grotesk'] tracking-tight text-foreground"
            >
              Robótica y Programación
              <br />
              <span className="bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                de Videojuegos
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: easeCurve }}
              className="mt-4 text-center text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Una nueva forma de aprender jugando: tecnología, creatividad y trabajo en equipo.
            </motion.p>
          </div>
        </section>

        {/* PILLARS */}
        <section className="mt-24 max-w-7xl mx-auto px-4">
          <motion.div {...fadeUp} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: easeCurve }}
                whileHover={{ y: -6 }}
                className="group relative bg-card border border-border/50 rounded-2xl p-6 overflow-hidden hover:border-primary/40 hover:shadow-[0_20px_50px_-20px_hsl(var(--primary)/0.3)] transition-all duration-500"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                    <p.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-primary/70">0{i + 1}</span>
                    <div className="h-px flex-1 bg-border/50" />
                  </div>
                  <h3 className="font-bold font-['Space_Grotesk'] text-foreground mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.text}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* QUE ES */}
        <section className="mt-28 max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div {...fadeUp}>
              <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary mb-4">
                <Bot className="w-4 h-4" /> ¿Qué es?
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] text-foreground mb-6 leading-tight">
                Aprender jugando con robots y videojuegos
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                La <strong className="text-foreground">robótica educativa</strong> es una nueva forma de aprender a
                través de la utilización de diferentes dispositivos robóticos y recursos tecnológicos.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                En nuestras clases también <strong className="text-foreground">diseñamos y programamos videojuegos en 2D y 3D</strong> a través
                de distintas herramientas, combinando creatividad, lógica y trabajo en equipo.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease: easeCurve }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden border border-border/60 shadow-2xl">
                <img src={img2d.url} alt="Programación de videojuegos 2D con Scratch" className="w-full h-auto" />
              </div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -right-4 bg-card border border-primary/30 rounded-2xl px-4 py-3 shadow-xl backdrop-blur"
              >
                <div className="flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-primary" />
                  <span className="text-xs font-bold text-foreground">Videojuegos 2D</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* MATERIAL */}
        <section className="mt-28 max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, ease: easeCurve }}
              className="relative lg:order-1 order-2"
            >
              <div className="relative rounded-3xl overflow-hidden border border-border/60 shadow-2xl">
                <img src={imgLego.url} alt="Robot construido con Lego" className="w-full h-auto" />
              </div>
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -left-4 bg-primary text-primary-foreground rounded-2xl px-4 py-3 shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  <span className="text-xs font-bold">Todo incluido</span>
                </div>
              </motion.div>
            </motion.div>
            <motion.div {...fadeUp} className="lg:order-2 order-1">
              <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary mb-4">
                <Package className="w-4 h-4" /> Material
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] text-foreground mb-6 leading-tight">
                ¿Tengo que llevar material?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <strong className="text-foreground">No es necesario</strong> que las familias aporten ningún tipo de
                material. Todo lo necesario — ordenadores, tablets, placas, robots y software — lo facilitamos nosotros.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                En algunos casos los colegios también colaboran con material adicional. Una habilidad clave que
                trabajamos es el <strong className="text-foreground">trabajo cooperativo</strong>: el alumnado
                trabaja en parejas, y si el grupo es impar se forma un trío rotativo.
              </p>
              <div className="flex items-center gap-3 rounded-2xl bg-primary/5 border border-primary/20 px-4 py-3">
                <Users className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm text-foreground font-medium">Aprender en equipo, avanzar en equipo.</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* METODOLOGIA */}
        <section className="mt-28 max-w-7xl mx-auto px-4">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary mb-4">
              <Brain className="w-4 h-4" /> Metodología
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] text-foreground mb-4">
              Aprender resolviendo retos
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Trabajamos los conceptos básicos de programación mediante retos y herramientas tecnológicas.
              Aprendizaje práctico: experimentando, probando y aplicando los conocimientos de forma activa.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: Puzzle, title: "Retos progresivos", text: "Cada sesión propone un desafío nuevo adaptado al nivel del grupo." },
              { icon: Rocket, title: "Aprendizaje activo", text: "Prueba y error: experimentar es la mejor forma de descubrir." },
              { icon: Bot, title: "Robots reales", text: "Trabajamos con dispositivos físicos que responden a su código." },
            ].map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: easeCurve }}
                className="group relative rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50 p-6 hover:border-primary/40 transition-all duration-500"
              >
                <s.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold font-['Space_Grotesk'] text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* OBJETIVOS - Skills */}
        <section className="mt-28 max-w-7xl mx-auto px-4">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary mb-4">
              <Target className="w-4 h-4" /> Objetivos y aprendizaje
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] text-foreground mb-4">
              Habilidades que desarrollan
            </h2>
            <p className="text-muted-foreground">
              Combinamos <strong className="text-foreground">competencias técnicas</strong> con
              {" "}<strong className="text-foreground">habilidades de comportamiento</strong> para un aprendizaje integral.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, ease: easeCurve }}
              className="rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Cpu className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold font-['Space_Grotesk'] text-foreground">Habilidades técnicas</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {techSkills.map((s, i) => (
                  <motion.span
                    key={s}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="rounded-full bg-background border border-primary/30 px-4 py-1.5 text-sm font-medium text-foreground"
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.7, ease: easeCurve }}
              className="rounded-3xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/30 p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Users className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-bold font-['Space_Grotesk'] text-foreground">Habilidades de comportamiento</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {behaviorSkills.map((s, i) => (
                  <motion.span
                    key={s}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="rounded-full bg-background border border-accent/40 px-4 py-1.5 text-sm font-medium text-foreground"
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* QUE HACEMOS - Gallery */}
        <section className="mt-28 max-w-7xl mx-auto px-4">
          <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary mb-4">
              <Sparkles className="w-4 h-4" /> En clase
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] text-foreground mb-4">
              ¿Qué hacemos en nuestras clases?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              De forma lúdica y progresiva, adaptándonos al ritmo del grupo. Cada mes y medio evaluamos el aprendizaje
              y rotamos el material para mantener el interés y avanzar con nuevos contenidos.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { src: img3d.url, label: "Videojuegos 3D" },
              { src: imgKodu.url, label: "Programación visual" },
              { src: imgTablet.url, label: "Diseño de niveles" },
              { src: imgArduino.url, label: "Arduino y circuitos" },
              { src: imgWinner.url, label: "Retos gamificados" },
              { src: imgLego.url, label: "Robótica Lego" },
              { src: img2d.url, label: "Scratch 2D" },
              { src: banner.url, label: "STEM completo" },
            ].map((img, i) => (
              <motion.div
                key={img.label + i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: easeCurve }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group relative aspect-video rounded-2xl overflow-hidden border border-border/50 shadow-lg"
              >
                <img
                  src={img.src}
                  alt={img.label}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-3 left-3 right-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <span className="text-xs font-bold text-foreground bg-background/90 backdrop-blur px-2.5 py-1 rounded-md">
                    {img.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tools marquee */}
          <motion.div {...fadeUp} className="mt-12 rounded-3xl bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border border-border/50 p-8">
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold font-['Space_Grotesk'] text-foreground mb-1">
                Herramientas que utilizamos
              </h3>
              <p className="text-sm text-muted-foreground">
                Kits reales, software profesional y plataformas adaptadas a cada edad.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {tools.map((t, i) => (
                <motion.span
                  key={t}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  whileHover={{ scale: 1.08, y: -2 }}
                  className="rounded-full bg-card border border-primary/20 px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:border-primary/50 hover:shadow-md transition-all"
                >
                  {t}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </section>
      </main>
      <ContactForm />
      <motion.div {...fadeUp}>
        <Footer />
      </motion.div>
    </div>
  );
}
