import { motion } from "framer-motion";
import { UserPlus, LogIn, CalendarCheck, CreditCard, ChevronRight } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "Regístrate", desc: "Crea tu cuenta con nombre, email y contraseña en menos de un minuto.", color: "primary" as const },
  { icon: LogIn, title: "Inicia sesión", desc: "Accede a tu panel personal con tus credenciales de forma segura.", color: "primary" as const },
  { icon: CreditCard, title: "Compra tus clases", desc: "Adquiere un pack de clases con pago seguro mediante Stripe.", color: "secondary" as const },
  { icon: CalendarCheck, title: "Reserva tus clases", desc: "Elige profesor, fecha y hora. Máximo 2 sesiones consecutivas de 45 min.", color: "secondary" as const },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

export default function HowItWorks() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/40 via-muted/20 to-background" />
      <div className="absolute inset-0 opacity-[0.012]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
        backgroundSize: '32px 32px',
      }} />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <motion.span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-semibold uppercase tracking-wider mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            Paso a paso
          </motion.span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mt-4 mb-6">
            Empieza en{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              4 pasos
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
            En minutos tendrás todo configurado para empezar con tus clases prácticas.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-4 gap-6 lg:gap-8 relative max-w-6xl mx-auto"
        >
          {/* Desktop connection line */}
          <div className="hidden md:block absolute top-20 left-[15%] right-[15%] h-px">
            <motion.div
              className="h-full bg-gradient-to-r from-primary/30 via-secondary/30 to-secondary/30"
              initial={{ scaleX: 0, originX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            />
          </div>

          {steps.map((step, i) => (
            <motion.div key={step.title} variants={item} className="relative group">
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative"
              >
                {/* Card */}
                <div className="relative p-8 rounded-3xl bg-card/80 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/[0.08] text-center h-full">
                  {/* Glow on hover */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-primary/[0.05] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Step number */}
                  <div className="relative z-10">
                    <div className="relative mx-auto w-16 h-16 mb-6">
                      <motion.div
                        whileHover={{ y: -14, scale: 1.18, rotate: -8 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center cursor-pointer ${
                          step.color === "secondary"
                            ? "bg-gradient-to-br from-secondary/15 to-secondary/5"
                            : "bg-gradient-to-br from-primary/15 to-primary/5"
                        }`}
                      >
                        <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                          <step.icon className={`w-7 h-7 ${step.color === "secondary" ? "text-secondary" : "text-primary"}`} />
                        </motion.div>
                      </motion.div>
                      <span className={`absolute -top-2 -right-2 w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center shadow-lg ${
                        step.color === "secondary"
                          ? "bg-secondary text-secondary-foreground shadow-secondary/30"
                          : "bg-primary text-primary-foreground shadow-primary/30"
                      }`}>
                        {i + 1}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 tracking-tight">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </motion.div>

              {/* Arrow between cards (mobile hidden) */}
              {i < 3 && (
                <div className="hidden md:flex absolute -right-4 lg:-right-5 top-20 z-20 w-8 h-8 items-center justify-center">
                  <ChevronRight className="w-5 h-5 text-muted-foreground/40" />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
