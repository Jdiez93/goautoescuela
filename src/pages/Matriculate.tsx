import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  Coins,
  Clock,
  Sparkles,
  GraduationCap,
  Crown,
  Trophy,
  Rocket,
  ArrowDown,
} from "lucide-react";
import { RandomLetterSwapPingPong } from "@/components/ui/random-letter-swap";

const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Pack = {
  id: string;
  name: string;
  tagline: string;
  subtitle?: string;
  price: string;
  badge?: string;
  highlight?: boolean;
  icon: typeof GraduationCap;
  features: string[];
  cta?: string;
};

const packs: Pack[] = [
  {
    id: "basico",
    name: "Pack Básico",
    tagline: "Matrícula + 3 Clases",
    price: "69",
    icon: GraduationCap,
    features: [
      "Manual Online Permiso B",
      "Aula Virtual",
      "Test online ilimitados",
      "Clases en DIRECTO",
      "3 Clases prácticas (45 min.)",
    ],
  },
  {
    id: "avanzado",
    name: "Pack Avanzado",
    tagline: "Matrícula + 5 Clases + 1 Examen Práctico",
    price: "229",
    badge: "Más popular",
    highlight: true,
    icon: Rocket,
    features: [
      "Manual Online Permiso B",
      "Aula Virtual",
      "Test online ilimitados",
      "Clases en DIRECTO",
      "5 Clases prácticas (45 min.)",
      "1 Examen Práctico",
    ],
  },
  {
    id: "completo",
    name: "Pack Completo",
    tagline: "Matrícula TODO INCLUIDO",
    price: "944",
    icon: Crown,
    features: [
      "Manual Online Permiso B",
      "Aula Virtual",
      "Clases teóricas online en directo",
      "Clases en DIRECTO",
      "2 tramitaciones",
      "20 Clases prácticas (45 min.)",
      "1 Examen Práctico",
      "Tasa DGT (94,05€)",
    ],
  },
  {
    id: "premium",
    name: "Pack Premium (Ávila)",
    tagline: "Apto para Villanueva del Pardillo y Valdemorillo",
    subtitle: "Sin lista de espera",
    price: "1350",
    badge: "Premium",
    icon: Trophy,
    cta: "Elegir premium",
    features: [
      "Manual Online Permiso B",
      "Aula Virtual",
      "Clases teóricas online en directo",
      "Test online ilimitados",
      "2 tramitaciones",
      "Tasa DGT (94,05 €)",
      "20 clases prácticas",
      "1 examen práctico",
    ],
  },
];

const otrosPrecios = [
  { label: "Clase práctica individual (45 min.)", price: "38,50€" },
  { label: "Bono 6 clases prácticas", price: "222€" },
  { label: "Bono 11 clases prácticas", price: "390€" },
  { label: "Examen práctico", price: "100€" },
  { label: "Tasas de tráfico", price: "94,05€" },
  { label: "Gestión y tramitación", price: "50€" },
];

const steps = [
  { n: "01", title: "Elige tu pack", desc: "Selecciona el plan que mejor encaje con tu objetivo y tu ritmo." },
  { n: "02", title: "Completa tu matrícula", desc: "Rellena tus datos y confirma tu pago de forma 100% segura." },
  { n: "03", title: "Regístrate en el área virtual", desc: "Crea tu cuenta usando el mismo correo electrónico con el que has realizado la matrícula para acceder al área virtual del alumno." },
  { n: "04", title: "Empieza ya", desc: "Accede a tu cuenta y comienza con tu carnet!" },
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
    <div className="min-h-screen min-h-[100dvh] bg-background overflow-x-hidden">
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
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeCurve }}
            className="max-w-3xl mx-auto text-center mb-10 md:mb-14"
          >
            <h1 className="text-4xl md:text-6xl font-bold font-['Space_Grotesk'] tracking-tight mb-5 leading-[1.05] flex flex-wrap justify-center gap-x-3">
              <RandomLetterSwapPingPong label="Matricúlate y empieza" />
              <RandomLetterSwapPingPong label="tu carnet hoy" className="text-primary" />
            </h1>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Elige el pack que mejor se adapta a ti. Sin papeleos, sin colas y con todo lo necesario
              para conseguir tu permiso cuanto antes.
            </p>
          </motion.div>

          {/* Scroll cue – Cómo funciona */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex justify-center mb-8 md:mb-10"
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

          {/* Subheader exámenes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: easeCurve }}
            className="text-center mb-8 md:mb-10"
          >
            <span className="inline-block text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-3">
              Permiso B
            </span>
            <h2 className="text-2xl md:text-3xl font-bold font-['Space_Grotesk']">
              Exámenes en <span className="underline decoration-primary decoration-2 underline-offset-4">Ávila</span> y{" "}
              <span className="underline decoration-primary decoration-2 underline-offset-4">Móstoles</span>
            </h2>
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-sm max-w-md mx-auto">
              <span className="font-bold text-amber-600">*</span>
              <span>Si decides examinarte en <span className="font-semibold">Ávila</span>, tanto la prueba teórica como la prueba práctica deberán realizarse ahí.</span>
            </div>
          </motion.div>

          {/* PACKS – visible immediately */}
          <div id="packs" className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 max-w-7xl mx-auto scroll-mt-24">
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
                    className={`group relative h-full p-7 md:p-8 rounded-2xl transition-shadow duration-300 ${
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

                    <motion.div
                      whileHover={{ y: -14, scale: 1.18, rotate: -8 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 cursor-pointer ${
                        pack.highlight
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/40"
                          : "bg-muted text-foreground group-hover:bg-primary/10"
                      }`}
                    >
                      <motion.div
                        animate={{ y: [0, -2, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <Icon className="w-6 h-6" />
                      </motion.div>
                    </motion.div>

                    <h3 className="text-2xl font-bold font-['Space_Grotesk'] mb-1">{pack.name}</h3>
                    <p className="text-sm text-muted-foreground">{pack.tagline}</p>
                    {pack.subtitle && (
                      <p className="text-sm font-medium text-primary mt-1 mb-4">{pack.subtitle}</p>
                    )}
                    {!pack.subtitle && <div className="mb-4" />}
                    <div className="mb-6 pb-6 border-b border-border/60">
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl md:text-6xl font-bold tracking-tight">{pack.price}</span>
                        <span className="text-3xl md:text-4xl font-bold text-foreground/80">€</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">IVA incluido · Pago único</p>
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
                      asChild
                      className="w-full rounded-xl font-semibold"
                      variant={pack.highlight ? "default" : "outline"}
                    >
                      <Link to={`/matricula?pack=pack_${pack.id}`}>
                        {pack.cta || `Elegir ${pack.name.replace("Pack ", "")}`}
                      </Link>
                    </Button>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* OTROS PRECIOS + HORARIO */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: easeCurve }}
            className="mt-16 md:mt-20 max-w-6xl mx-auto grid md:grid-cols-2 gap-6 lg:gap-8"
          >
            {/* Otros precios */}
            <Card className="p-7 md:p-8 rounded-2xl border-border/60">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/60">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Coins className="w-5 h-5" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold font-['Space_Grotesk']">Otros precios</h3>
              </div>
              <ul className="space-y-3">
                {otrosPrecios.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center justify-between gap-4 py-2 border-b border-border/30 last:border-0"
                  >
                    <span className="text-sm md:text-base text-foreground/85">{item.label}</span>
                    <span className="font-bold text-primary whitespace-nowrap">{item.price}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Horario */}
            <Card className="p-7 md:p-8 rounded-2xl border-border/60 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/60">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold font-['Space_Grotesk'] flex-1 flex flex-wrap items-baseline gap-x-2">
                  <span>Horario de oficina</span>
                  <span className="text-sm font-medium text-muted-foreground">(Villanueva del Pardillo y Valdemorillo)</span>
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mb-5">De lunes a viernes</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-background/60 border border-border/50">
                  <span className="font-semibold">Mañanas</span>
                  <span className="text-lg font-bold text-primary">11:00 — 13:00</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-background/60 border border-border/50">
                  <span className="font-semibold">Tardes</span>
                  <span className="text-lg font-bold text-primary">17:00 — 20:00</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-6 text-center">
                Precios con IVA incluido. Esta información puede actualizarse periódicamente.
              </p>
            </Card>
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
            viewport={{ once: true, amount: 0.4 }}
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

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto relative">
            {/* Connecting line (desktop) */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.1, ease: easeCurve, delay: 0.2 }}
              style={{ transformOrigin: "left" }}
              className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
            />

            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
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
            viewport={{ once: true, amount: 0.5 }}
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
