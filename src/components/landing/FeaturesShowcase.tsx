import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import {
  LayoutDashboard, Calendar, CreditCard, User, Shield, Clock, BookOpen, Bell,
  CheckCircle2, ArrowRight
} from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "Panel de control",
    desc: "Vista general con acceso rápido a todas las secciones: reservas, pagos y perfil. Adaptado según tu rol (alumno, profesor o administrador).",
    highlights: ["Acceso rápido a secciones", "Diseño adaptado por rol", "Información actualizada"],
    accent: "primary" as const,
  },
  {
    icon: Calendar,
    title: "Reserva de clases",
    desc: "Sistema intuitivo de 3 pasos: elige tu profesor asignado, selecciona fecha y hora. Sesiones de 45 minutos con cancelación flexible hasta 24h antes.",
    highlights: ["Selección de profesor", "Calendario interactivo", "Cancelación hasta 24h antes"],
    accent: "secondary" as const,
  },
  {
    icon: CreditCard,
    title: "Gestión de pagos",
    desc: "Compra packs de clases de forma segura con Stripe. Consulta tu saldo de clases disponibles y todo tu historial de transacciones.",
    highlights: ["Pago seguro con Stripe", "Packs de clases", "Historial completo"],
    accent: "primary" as const,
  },
  {
    icon: User,
    title: "Perfil personal",
    desc: "Mantén tus datos siempre actualizados: nombre, teléfono, DNI, dirección y más. Todo en un formulario claro y sencillo.",
    highlights: ["Datos personales", "Edición sencilla", "Información segura"],
    accent: "secondary" as const,
  },
  {
    icon: Shield,
    title: "Seguridad y privacidad",
    desc: "Tu información está protegida con autenticación segura, recuperación de contraseña y políticas de privacidad estrictas.",
    highlights: ["Autenticación segura", "Recuperación de contraseña", "Datos encriptados"],
    accent: "primary" as const,
  },
  {
    icon: Clock,
    title: "Disponibilidad en tiempo real",
    desc: "Los horarios se actualizan en tiempo real. Consulta los huecos disponibles al instante y nunca te quedes sin tu clase.",
    highlights: ["Huecos en tiempo real", "Horarios L-V 9:00-20:00", "Sin solapamientos"],
    accent: "secondary" as const,
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function FeaturesShowcase() {
  return (
    <section id="funcionalidades" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">Funcionalidades</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">Todo lo que la plataforma ofrece</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Descubre cada herramienta diseñada para que tu experiencia sea la mejor posible.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feat) => (
            <motion.div key={feat.title} variants={cardVariant}>
              <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className="h-full border-border/50 bg-card hover:shadow-[var(--card-shadow-hover)] transition-all duration-300 overflow-hidden group">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                      feat.accent === "secondary"
                        ? "bg-secondary/10 text-secondary"
                        : "bg-accent text-primary"
                    }`}>
                      <feat.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feat.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{feat.desc}</p>
                    <ul className="space-y-1.5">
                      {feat.highlights.map((h) => (
                        <li key={h} className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${
                            feat.accent === "secondary" ? "text-secondary" : "text-primary"
                          }`} />
                          {h}
                        </li>
                      ))}
                    </ul>
                    <div className={`h-0.5 w-0 group-hover:w-full transition-all duration-300 mt-4 rounded-full ${
                      feat.accent === "secondary" ? "bg-secondary" : "bg-primary"
                    }`} />
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
