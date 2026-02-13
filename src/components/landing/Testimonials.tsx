import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Laura García",
    text: "Aprobé a la primera gracias a los profesores de AutoescuelaGO. Las clases prácticas por la zona de examen fueron clave.",
    rating: 5,
    permit: "Permiso B",
  },
  {
    name: "Carlos Martínez",
    text: "Horarios súper flexibles, pude compaginar con mi trabajo sin problema. La plataforma online para el teórico es genial.",
    rating: 5,
    permit: "Permiso B",
  },
  {
    name: "Ana Rodríguez",
    text: "Me saqué el carnet de moto en tiempo récord. El circuito propio y la paciencia de los profes hicieron la diferencia.",
    rating: 5,
    permit: "Permiso A",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-primary uppercase tracking-wider">Testimonios</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">Lo que dicen nuestros alumnos</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full border-border/50 shadow-[var(--card-shadow)]">
                <CardContent className="p-6">
                  <Quote className="w-8 h-8 text-primary/20 mb-4" />
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">"{t.text}"</p>
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.permit}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
