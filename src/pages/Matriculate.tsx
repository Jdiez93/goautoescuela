import { useEffect } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Sparkles,
  GraduationCap,
  Car,
  Trophy,
  ArrowDown,
} from "lucide-react";

const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Pack = {
  id: string;
  name: string;
  tagline: string;
  price: string;
  badge?: string;
  highlight?: boolean;
  icon: typeof GraduationCap;
  features: string[];
};

const packs: Pack[] = [
  {
    id: "basico",
    name: "Pack Básico",
    tagline: "Empieza tu carnet sin complicaciones",
    price: "—",
    icon: GraduationCap,
    features: [
      "Matrícula y apertura de expediente",
      "Acceso a la teórica online",
      "Tests ilimitados",
      "Soporte por email",
    ],
  },
  {
    id: "premium",
    name: "Pack Premium",
    tagline: "El más completo, el favorito de nuestros alumnos",
    price: "—",
    badge: "Más popular",
    highlight: true,
    icon: Trophy,
    features: [
      "Todo lo del Pack Básico",
      "Clases prácticas incluidas",
      "Tutor personal asignado",
      "Simulacros de examen",
      "Gestión completa de tasas",
      "Soporte prioritario 7 días",
    ],
  },
  {
    id: "intensivo",
    name: "Pack Intensivo",
    tagline: "Saca tu carnet en tiempo récord",
    price: "—",
    icon: Car,
    features: [
      "Todo lo del Pack Premium",
      "Clases prácticas reforzadas",
      "Plan acelerado personalizado",
      "Examen garantizado",
      "Coche para el día del examen",
    ],
  },
];

const steps = [
  { n: "01", title: "Elige tu pack", desc: "Selecciona el plan que mejor encaje con tu objetivo y tu ritmo." },
  { n: "02", title: "Completa tu matrícula", desc: "Rellena tus datos y confirma tu pago de forma 100% segura." },
  { n: "03", title: "Empieza ya", desc: "Accede a tu cuenta y comienza con la teórica al instante." },
];

export default function Matriculate() {
  // Smooth scroll behavior + restore on unmount
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "smooth";
    return () => {
      html.style.scrollBehavior = prev;
    };
  }, []);

  const scrollToPacks = () => {
    document.getElementById("packs")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />

      {/* HERO + PACKS PEEK */}
      <section className="relative pt-24 md:pt-28 pb-8 overflow-hidden">
        {/* Decorative background (estático, sin parallax para evitar lag) */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[600px] bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.18),transparent_60%)]" />
        </div>

        <div className="container mx-auto px-4">
          {/* Compact hero */}
          <motion.div
            style={{ y: heroTextY, opacity: heroOpacity }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeCurve }}
            className="max-w-3xl mx-auto text-center mb-10 md:mb-14"
          >
            <h1 className="text-4xl md:text-6xl font-bold font-['Space_Grotesk'] tracking-tight mb-5 leading-[1.05]">
              Matricúlate y empieza{" "}
              <span className="text-primary">tu carnet hoy</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Elige el pack que mejor se adapta a ti. Sin papeleos, sin colas y con todo lo necesario
              para conseguir tu permiso cuanto antes.
            </p>
          </motion.div>

          {/* PACKS – visible immediately */}
          <div id="packs" className="grid md:grid-cols-3 gap-5 lg:gap-7 max-w-6xl mx-auto scroll-mt-24">
            {packs.map((pack, i) => {
              const Icon = pack.icon;
              return (
                <motion.div
                  key={pack.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.15 + i * 0.12,
                    ease: easeCurve,
                  }}
                  whileHover={{ y: -6, transition: { duration: 0.3, ease: easeCurve } }}
                >
                  <Card
                    className={`relative h-full p-7 md:p-8 rounded-2xl transition-shadow duration-300 ${
                      pack.highlight
                        ? "border-primary/50 shadow-[0_24px_70px_-20px_hsl(var(--primary)/0.45)] bg-primary/5"
                        : "hover:shadow-xl"
                    }`}
                  >
                    {pack.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground border-0 px-3 py-1 shadow-lg">
                          <Sparkles className="w-3 h-3 mr-1" />
                          {pack.badge}
                        </Badge>
                      </div>
                    )}

                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                        pack.highlight
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <h3 className="text-2xl font-bold font-['Space_Grotesk'] mb-2">{pack.name}</h3>
                    <p className="text-sm text-muted-foreground mb-6 min-h-[40px]">{pack.tagline}</p>

                    <div className="mb-6 pb-6 border-b border-border/60">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold">{pack.price}</span>
                        <span className="text-muted-foreground text-sm">€ /pago único</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Precio próximamente</p>
                    </div>

                    <ul className="space-y-3 mb-8">
                      {pack.features.map((f) => (
                        <li key={f} className="flex items-start gap-3 text-sm">
                          <span
                            className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                              pack.highlight
                                ? "bg-primary/15 text-primary"
                                : "bg-muted text-foreground/70"
                            }`}
                          >
                            <Check className="w-3 h-3" strokeWidth={3} />
                          </span>
                          <span className="text-foreground/85">{f}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className="w-full rounded-xl font-semibold"
                      variant={pack.highlight ? "default" : "outline"}
                    >
                      Elegir {pack.name.replace("Pack ", "")}
                    </Button>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Scroll cue */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex justify-center mt-12 mb-2"
          >
            <button
              onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })}
              className="group flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              aria-label="Ver cómo funciona"
            >
              <span className="text-xs uppercase tracking-[0.2em] font-medium">
                Cómo funciona
              </span>
              <motion.span
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="w-9 h-9 rounded-full border border-border/60 flex items-center justify-center group-hover:border-primary/60 transition-colors"
              >
                <ArrowDown className="w-4 h-4" />
              </motion.span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how"
        className="relative py-20 md:py-28 bg-muted/30 border-y border-border/50 scroll-mt-24 overflow-hidden"
      >
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,hsl(var(--primary)/0.08),transparent_70%)] blur-3xl" />
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.4 }}
            transition={{ duration: 0.7, ease: easeCurve }}
            className="max-w-2xl mx-auto text-center mb-14"
          >
            <span className="inline-block text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-4">
              Proceso simple
            </span>
            <h2 className="text-3xl md:text-5xl font-bold font-['Space_Grotesk'] tracking-tight mb-4">
              Así de fácil es matricularte
            </h2>
            <p className="text-muted-foreground text-lg">
              En tres pasos estarás listo para empezar tu formación.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto relative">
            {/* Connecting line (desktop) */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 1.1, ease: easeCurve, delay: 0.2 }}
              style={{ transformOrigin: "left" }}
              className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
            />

            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.15, ease: easeCurve }}
                className="relative"
              >
                <Card className="p-7 rounded-2xl h-full border-border/60 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 bg-background/80 backdrop-blur">
                  <div className="text-5xl font-bold font-['Space_Grotesk'] text-primary mb-3">
                    {s.n}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA back to packs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.4, ease: easeCurve }}
            className="text-center mt-14"
          >
            <Button
              onClick={scrollToPacks}
              size="lg"
              className="rounded-xl font-semibold shadow-[0_12px_40px_-10px_hsl(var(--primary)/0.5)]"
            >
              Ver packs disponibles
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
