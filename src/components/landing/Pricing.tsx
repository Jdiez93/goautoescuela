import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Clase Suelta",
    price: "35€",
    unit: "/clase",
    features: ["1 clase práctica de 45 min", "Elige profesor y horario", "Cancelación flexible"],
    popular: false,
  },
  {
    name: "Pack 10 Clases",
    price: "299€",
    unit: "/pack",
    features: ["10 clases prácticas", "Ahorra 51€", "Elige profesor y horario", "Seguimiento personalizado", "Prioridad de reserva"],
    popular: true,
  },
  {
    name: "Pack 20 Clases",
    price: "549€",
    unit: "/pack",
    features: ["20 clases prácticas", "Ahorra 151€", "Elige profesor y horario", "Seguimiento personalizado", "Prioridad de reserva", "Clase extra de regalo"],
    popular: false,
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function Pricing() {
  return (
    <section id="precios" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Precios</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">Elige tu plan de clases</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Clases sueltas o packs con descuento. Tú decides cómo avanzar.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {plans.map((plan) => (
            <motion.div key={plan.name} variants={cardVariants}>
              <motion.div whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 300 }}>
                <Card className={`h-full relative border-border/50 shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-all duration-300 ${plan.popular ? "border-secondary ring-2 ring-secondary/20" : ""}`}>
                  {plan.popular && (
                    <motion.div
                      className="absolute -top-3 left-1/2 -translate-x-1/2"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", delay: 0.4 }}
                    >
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold shadow-lg shadow-secondary/20">
                        <Zap className="w-3 h-3" /> Más popular
                      </span>
                    </motion.div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-lg">{plan.name}</CardTitle>
                    <div className="mt-2">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground text-sm">{plan.unit}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/registro">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          className={`w-full ${plan.popular ? "bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg shadow-secondary/20" : ""}`}
                          variant={plan.popular ? "default" : "outline"}
                        >
                          Elegir plan
                        </Button>
                      </motion.div>
                    </Link>
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
