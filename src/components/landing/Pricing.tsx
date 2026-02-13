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

export default function Pricing() {
  return (
    <section id="precios" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Precios</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">Elige tu plan de clases</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Clases sueltas o packs con descuento. Tú decides cómo avanzar.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`h-full relative border-border/50 shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-all duration-300 ${plan.popular ? "border-primary ring-2 ring-primary/20" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-hero-gradient text-primary-foreground text-xs font-semibold">
                      <Zap className="w-3 h-3" /> Más popular
                    </span>
                  </div>
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
                    <Button
                      className={`w-full ${plan.popular ? "bg-hero-gradient text-primary-foreground hover:opacity-90" : ""}`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Elegir plan
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
