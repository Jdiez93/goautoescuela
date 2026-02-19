import { motion } from "framer-motion";
import { UserPlus, LogIn, CalendarCheck, CreditCard } from "lucide-react";

const steps = [
  { icon: UserPlus, title: "Regístrate", desc: "Crea tu cuenta con tu nombre, email y contraseña en menos de un minuto." },
  { icon: LogIn, title: "Inicia sesión", desc: "Accede a tu panel personal con tus credenciales de forma segura." },
  { icon: CreditCard, title: "Compra tus clases", desc: "Adquiere un pack de clases con pago seguro mediante Stripe." },
  { icon: CalendarCheck, title: "Reserva tus clases", desc: "Elige profesor, fecha y hora. Máximo 2 sesiones consecutivas de 45 min." },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function HowItWorks() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">Paso a paso</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">¿Cómo funciona?</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            En 4 sencillos pasos tendrás todo configurado para empezar con tus clases prácticas.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative"
        >
          {/* Connection line (desktop) */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-border" />

          {steps.map((step, i) => (
            <motion.div key={step.title} variants={item} className="relative text-center group">
              <motion.div
                whileHover={{ scale: 1.08, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative z-10 mx-auto w-16 h-16 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-center mb-5 group-hover:shadow-[var(--card-shadow-hover)] transition-shadow"
              >
                <step.icon className="w-7 h-7 text-primary" />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-secondary text-secondary-foreground text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </motion.div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
