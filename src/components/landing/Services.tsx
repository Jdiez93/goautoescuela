import { motion } from "framer-motion";
import { Car, Bike, FileText, BookOpen, Users, Headphones } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    icon: Car,
    title: "Permiso B",
    description: "Carnet de coche con clases teóricas y prácticas personalizadas.",
  },
  {
    icon: Bike,
    title: "Permiso A",
    description: "Carnet de moto para todas las cilindradas. Circuito propio.",
  },
  {
    icon: FileText,
    title: "Teórico Online",
    description: "Accede a tests y materiales desde cualquier dispositivo, 24/7.",
  },
  {
    icon: BookOpen,
    title: "Clases Teóricas",
    description: "Clases presenciales con profesores expertos y materiales actualizados.",
  },
  {
    icon: Users,
    title: "Clases Prácticas",
    description: "Elige horario y profesor. Rutas por la zona de examen real.",
  },
  {
    icon: Headphones,
    title: "Soporte Total",
    description: "Te acompañamos en todo el proceso hasta obtener tu carnet.",
  },
];

export default function Services() {
  return (
    <section id="servicios" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Nuestros servicios</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">Todo lo que necesitas para tu carnet</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ofrecemos formación completa, flexible y adaptada a ti.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full border-border/50 shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
