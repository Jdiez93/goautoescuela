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
  ShieldCheck,
  Clock,
  CreditCard,
  HeadphonesIcon,
  ArrowRight,
} from "lucide-react";

const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

type Pack = {
  id: string;
  name: string;
  tagline: string;
  price: string;
  oldPrice?: string;
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

const benefits = [
  { icon: ShieldCheck, title: "Sin sorpresas", desc: "Precio cerrado y todo incluido en cada pack." },
  { icon: Clock, title: "Flexible", desc: "Estudia a tu ritmo, online y desde donde quieras." },
  { icon: CreditCard, title: "Pago seguro", desc: "Pasarela cifrada con múltiples métodos." },
  { icon: HeadphonesIcon, title: "Soporte real", desc: "Profesores y tutores cuando los necesites." },
];

const steps = [
  { n: "01", title: "Elige tu pack", desc: "Selecciona el plan que mejor encaje con tu objetivo y tu ritmo." },
  { n: "02", title: "Completa tu matrícula", desc: "Rellena tus datos y confirma tu pago de forma 100% segura." },
  { n: "03", title: "Empieza ya", desc: "Accede a tu cuenta y comienza con la teórica al instante." },
];

const faqs = [
  { q: "¿Qué incluye la matrícula?", a: "Próximamente detallaremos exactamente qué cubre cada pack." },
  { q: "¿Puedo cambiar de pack?", a: "Sí, podrás ampliar tu pack en cualquier momento desde tu panel." },
  { q: "¿Hay financiación?", a: "Estamos preparando opciones de pago a plazos para hacerlo aún más fácil." },
];

export default function Matriculate() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-28 md:pt-36 pb-16 md:pb-24 overflow-hidden">
        {/* Decorative gradients */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[600px] bg-[radial-gradient(ellipse_at_center,hsl(174_72%_45%/0.18),transparent_60%)]" />
          <div className="absolute top-40 -left-32 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,hsl(220_90%_60%/0.12),transparent_70%)] blur-3xl" />
          <div className="absolute top-20 -right-32 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,hsl(0_85%_60%/0.10),transparent_70%)] blur-3xl" />
        </div>

        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeCurve }}
            className="max-w-3xl mx-auto text-center"
          >
            <Badge
              variant="outline"
              className="mb-6 border-[hsl(174,72%,45%)]/40 text-[hsl(174,72%,45%)] bg-[hsl(174,72%,45%)]/5 backdrop-blur-sm px-4 py-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Matriculación 2026
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-['Space_Grotesk'] tracking-tight mb-6 leading-[1.05]">
              Matricúlate y empieza{" "}
              <span className="bg-gradient-to-r from-[hsl(174,72%,45%)] via-[hsl(190,80%,55%)] to-[hsl(220,85%,60%)] bg-clip-text text-transparent">
                tu carnet hoy
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Elige el pack que mejor se adapta a ti. Sin papeleos, sin colas y con todo lo necesario
              para conseguir tu permiso de conducir cuanto antes.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="rounded-xl bg-gradient-to-r from-[hsl(174,72%,45%)] to-[hsl(190,80%,50%)] hover:shadow-[0_8px_30px_-8px_hsl(174_80%_45%/0.6)] text-white font-semibold px-8"
              >
                Ver packs <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-xl px-8">
                Hablar con asesor
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PACKS */}
      <section className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: easeCurve }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <h2 className="text-3xl md:text-5xl font-bold font-['Space_Grotesk'] tracking-tight mb-4">
              Elige tu pack de matriculación
            </h2>
            <p className="text-muted-foreground text-lg">
              Tres planes pensados para distintos ritmos y objetivos. Todos incluyen acceso completo a
              nuestra plataforma online.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {packs.map((pack, i) => {
              const Icon = pack.icon;
              return (
                <motion.div
                  key={pack.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: easeCurve }}
                >
                  <Card
                    className={`relative h-full p-7 md:p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1 ${
                      pack.highlight
                        ? "border-[hsl(174,72%,45%)]/50 shadow-[0_20px_60px_-20px_hsl(174_80%_45%/0.35)] bg-gradient-to-b from-[hsl(174,72%,45%)]/5 to-transparent"
                        : "hover:border-foreground/20 hover:shadow-xl"
                    }`}
                  >
                    {pack.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-[hsl(174,72%,45%)] to-[hsl(190,80%,50%)] text-white border-0 px-3 py-1 shadow-lg">
                          <Sparkles className="w-3 h-3 mr-1" />
                          {pack.badge}
                        </Badge>
                      </div>
                    )}

                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${
                        pack.highlight
                          ? "bg-gradient-to-br from-[hsl(174,72%,45%)] to-[hsl(190,80%,50%)] text-white"
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
                                ? "bg-[hsl(174,72%,45%)]/15 text-[hsl(174,72%,45%)]"
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
                      className={`w-full rounded-xl font-semibold ${
                        pack.highlight
                          ? "bg-gradient-to-r from-[hsl(174,72%,45%)] to-[hsl(190,80%,50%)] hover:shadow-[0_8px_24px_-8px_hsl(174_80%_45%/0.6)] text-white"
                          : ""
                      }`}
                      variant={pack.highlight ? "default" : "outline"}
                    >
                      Elegir {pack.name.replace("Pack ", "")}
                    </Button>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-8">
            * Los precios y contenidos finales se publicarán próximamente.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 md:py-24 bg-muted/30 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold font-['Space_Grotesk'] tracking-tight mb-4">
              Así de fácil es matricularte
            </h2>
            <p className="text-muted-foreground text-lg">
              En tres pasos estarás listo para empezar tu formación.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: easeCurve }}
                className="relative"
              >
                <Card className="p-7 rounded-2xl h-full border-border/60 hover:border-[hsl(174,72%,45%)]/40 transition-colors">
                  <div className="text-5xl font-bold font-['Space_Grotesk'] bg-gradient-to-br from-[hsl(174,72%,45%)] to-[hsl(220,85%,60%)] bg-clip-text text-transparent mb-3">
                    {s.n}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold font-['Space_Grotesk'] tracking-tight mb-4">
              ¿Por qué matricularte con nosotros?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={b.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: easeCurve }}
                >
                  <Card className="p-6 rounded-2xl h-full text-center border-border/60 hover:border-foreground/20 hover:shadow-lg transition-all">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-[hsl(174,72%,45%)]/15 to-[hsl(220,85%,60%)]/15 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-[hsl(174,72%,45%)]" />
                    </div>
                    <h3 className="font-bold mb-1.5">{b.title}</h3>
                    <p className="text-sm text-muted-foreground">{b.desc}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-muted/30 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold font-['Space_Grotesk'] tracking-tight mb-4">
                Preguntas frecuentes
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((f, i) => (
                <motion.div
                  key={f.q}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Card className="p-6 rounded-2xl border-border/60">
                    <h3 className="font-bold mb-2">{f.q}</h3>
                    <p className="text-sm text-muted-foreground">{f.a}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(174_72%_45%/0.15),transparent_70%)]" />
        </div>
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: easeCurve }}
          >
            <h2 className="text-3xl md:text-5xl font-bold font-['Space_Grotesk'] tracking-tight mb-5">
              Tu carnet te está esperando
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Da el primer paso hoy y conduce antes de lo que crees.
            </p>
            <Button
              size="lg"
              className="rounded-xl bg-gradient-to-r from-[hsl(174,72%,45%)] to-[hsl(190,80%,50%)] hover:shadow-[0_8px_30px_-8px_hsl(174_80%_45%/0.6)] text-white font-semibold px-10"
            >
              Matricularme ahora <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
