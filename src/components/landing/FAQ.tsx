import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "¿Cuánto tiempo se tarda en sacar el carnet?", a: "Depende de cada alumno, pero de media nuestros alumnos obtienen el permiso B en 2-3 meses combinando clases teóricas y prácticas." },
  { q: "¿Puedo elegir el horario de mis clases prácticas?", a: "¡Sí! A través de nuestra plataforma puedes reservar tus clases en el horario que más te convenga y con el profesor que prefieras." },
  { q: "¿Qué pasa si suspendo el examen?", a: "No te preocupes, te seguimos preparando sin coste adicional en las clases teóricas. Solo pagarías las clases prácticas adicionales que necesites." },
  { q: "¿Ofrecéis financiación o facilidades de pago?", a: "Sí, disponemos de packs de clases con descuento y opciones de pago flexible. Consúltanos sin compromiso." },
  { q: "¿Dónde se realizan los exámenes prácticos?", a: "Los exámenes se realizan en la zona de Villanueva del Pardillo y alrededores. Practicamos por las rutas reales de examen." },
  { q: "¿Puedo cancelar una clase reservada?", a: "Sí, puedes cancelar hasta 24 horas antes de la clase sin ningún cargo." },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

export default function FAQ() {
  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold text-secondary uppercase tracking-wider">FAQ</span>
          <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-4">Preguntas frecuentes</h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="max-w-2xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <motion.div key={i} variants={itemVariants}>
                <AccordionItem value={`item-${i}`} className="border rounded-xl px-4 bg-card shadow-sm hover:shadow-md transition-shadow duration-300">
                  <AccordionTrigger className="text-left text-sm font-medium hover:no-underline">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
