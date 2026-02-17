import { motion } from "framer-motion";
import { Car, Bike, FileText, BookOpen, Users, Headphones } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  { icon: Car, title: "Permiso B", description: "Carnet de coche con clases teóricas y prácticas personalizadas." },
  { icon: Bike, title: "Permiso A", description: "Carnet de moto para todas las cilindradas. Circuito propio." },
  { icon: FileText, title: "Teórico Online", description: "Accede a tests y materiales desde cualquier dispositivo, 24/7." },
  { icon: BookOpen, title: "Clases Teóricas", description: "Clases presenciales con profesores expertos y materiales actualizados." },
  { icon: Users, title: "Clases Prácticas", description: "Elige horario y profesor. Rutas por la zona de examen real." },
  { icon: Headphones, title: "Soporte Total", description: "Te acompañamos en todo el proceso hasta obtener tu carnet." },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function Services() {
  return (
    <section id="servicios" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">Nuestros servicios</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">Todo lo que necesitas para tu carnet</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ofrecemos formación completa, flexible y adaptada a ti.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service) => (
            <motion.div key={service.title} variants={cardVariants}>
              <Card className="h-full border-border/50 shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-all duration-300 hover:-translate-y-1 group">
                <CardContent className="p-6">
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors duration-300"
                    whileHover={{ rotate: [0, -8, 8, 0] }}
                    transition={{ duration: 0.4 }}
                  >
                    <service.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </motion.div>
                  <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
