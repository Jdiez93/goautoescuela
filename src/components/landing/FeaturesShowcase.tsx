import { motion } from "framer-motion";
import {
  LayoutDashboard, Calendar, CreditCard, User, Shield, Clock,
  CheckCircle2, ArrowUpRight
} from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "Panel de control",
    desc: "Vista general con acceso rápido a todas las secciones. Adaptado según tu rol: alumno, profesor o administrador.",
    highlights: ["Acceso rápido a secciones", "Diseño adaptado por rol", "Información en tiempo real"],
    accent: "primary" as const,
    span: "md:col-span-2" as const,
  },
  {
    icon: Calendar,
    title: "Reserva de clases",
    desc: "Sistema intuitivo de 3 pasos: elige profesor, fecha y hora. Sesiones de 45 min con cancelación flexible hasta 24h antes.",
    highlights: ["Selección de profesor", "Calendario interactivo", "Cancelación flexible"],
    accent: "secondary" as const,
    span: "" as const,
  },
  {
    icon: CreditCard,
    title: "Gestión de pagos",
    desc: "Compra packs de clases de forma segura con Stripe. Consulta tu saldo y todo tu historial de transacciones.",
    highlights: ["Pago seguro con Stripe", "Packs de clases", "Historial completo"],
    accent: "primary" as const,
    span: "" as const,
  },
  {
    icon: User,
    title: "Perfil personal",
    desc: "Mantén tus datos actualizados: nombre, teléfono, DNI, dirección y más. Todo en un formulario claro y sencillo.",
    highlights: ["Datos personales", "Edición sencilla", "Información segura"],
    accent: "secondary" as const,
    span: "" as const,
  },
  {
    icon: Shield,
    title: "Seguridad avanzada",
    desc: "Tu información protegida con autenticación segura, recuperación de contraseña y políticas de privacidad estrictas.",
    highlights: ["Autenticación segura", "Recuperación de contraseña", "Datos encriptados"],
    accent: "primary" as const,
    span: "" as const,
  },
  {
    icon: Clock,
    title: "Disponibilidad en tiempo real",
    desc: "Los horarios se actualizan al instante. Consulta los huecos disponibles y nunca te quedes sin tu clase.",
    highlights: ["Huecos en tiempo real", "Horarios L-V 9:00-20:00", "Sin solapamientos"],
    accent: "secondary" as const,
    span: "md:col-span-2" as const,
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function FeaturesShowcase() {
  return (
    <section id="funcionalidades" className="py-32 relative cv-auto">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.02] to-background" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <motion.span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold uppercase tracking-wider mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            Funcionalidades
          </motion.span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mt-4 mb-6">
            Todo lo que{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              necesitas
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Cada herramienta diseñada para que tu experiencia sea impecable.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-5 max-w-6xl mx-auto"
        >
          {features.map((feat) => (
            <motion.div key={feat.title} variants={cardVariant} className={feat.span}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="h-full"
              >
                <div className="relative h-full p-5 sm:p-8 rounded-3xl bg-card/70 backdrop-blur-sm border border-border/40 hover:border-primary/25 transition-all duration-500 group overflow-hidden">
                  {/* Hover gradient */}
                  <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                    feat.accent === "secondary"
                      ? "bg-gradient-to-br from-secondary/[0.04] to-transparent"
                      : "bg-gradient-to-br from-primary/[0.04] to-transparent"
                  }`} />

                  {/* Corner accent */}
                  <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${
                    feat.accent === "secondary"
                      ? "bg-secondary/[0.03]"
                      : "bg-primary/[0.03]"
                  }`} />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-5">
                      <motion.div
                        whileHover={{ y: -14, scale: 1.18, rotate: -8 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 ${
                          feat.accent === "secondary"
                            ? "bg-gradient-to-br from-secondary/15 to-secondary/5 group-hover:shadow-lg group-hover:shadow-secondary/10"
                            : "bg-gradient-to-br from-primary/15 to-primary/5 group-hover:shadow-lg group-hover:shadow-primary/10"
                        }`}
                      >
                        <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                          <feat.icon className={`w-6 h-6 ${
                            feat.accent === "secondary" ? "text-secondary" : "text-primary"
                          }`} />
                        </motion.div>
                      </motion.div>
                      <ArrowUpRight className="w-5 h-5 text-muted-foreground/30 group-hover:text-primary/50 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </div>

                    <h3 className="text-xl font-bold mb-3 tracking-tight">{feat.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">{feat.desc}</p>

                    <ul className="space-y-2">
                      {feat.highlights.map((h) => (
                        <li key={h} className="flex items-center gap-2.5 text-sm text-muted-foreground/80">
                          <CheckCircle2 className={`w-4 h-4 shrink-0 ${
                            feat.accent === "secondary" ? "text-secondary/70" : "text-primary/70"
                          }`} />
                          {h}
                        </li>
                      ))}
                    </ul>

                    {/* Bottom line animation */}
                    <div className="mt-6 h-px w-full bg-border/50 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${
                          feat.accent === "secondary"
                            ? "bg-gradient-to-r from-secondary/60 to-secondary/20"
                            : "bg-gradient-to-r from-primary/60 to-primary/20"
                        }`}
                        initial={{ width: "0%" }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
