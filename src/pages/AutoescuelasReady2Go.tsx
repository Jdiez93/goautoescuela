import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ContactForm from "@/components/landing/ContactForm";
import { motion } from "framer-motion";
import { MapPin, Clock, Car } from "lucide-react";

const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, margin: "-60px" },
  transition: { duration: 0.7, ease: easeCurve },
};

const locations = [
  {
    name: "Villanueva del Pardillo",
    address: "C/ Concepción, 61, 28229 Villanueva del Pardillo (Madrid)",
    mapSrc:
      "https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=C.+Concepción+61+Local+9+28229+Villanueva+del+Pardillo+Madrid+Spain&zoom=17",
    schedule: "Martes y Jueves",
    hours: "11:00 - 13:00 / 17:00 - 20:00",
    practicas: "8:00 - 22:00",
    imagePlaceholder: "Imagen Pardillo",
  },
  {
    name: "Valdemorillo",
    address: "C. Covachuelas, 18, 28210 Valdemorillo, Madrid",
    mapSrc:
      "https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=C.+Covachuelas+18+28210+Valdemorillo+Madrid+Spain&zoom=17",
    schedule: "Lunes, Miércoles y Viernes",
    hours: "11:00 - 13:00 / 17:00 - 20:00",
    practicas: "8:00 - 22:00",
    imagePlaceholder: "Imagen Valdemorillo",
  },
];

export default function AutoescuelasReady2Go() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-32 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div {...fadeUp} className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] text-foreground mb-2">
              Nuestras Autoescuelas
            </h1>
            <p className="text-muted-foreground text-lg">
              Encuentra tu centro más cercano
            </p>
          </motion.div>

          {/* Locations grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {locations.map((loc, i) => (
              <motion.div
                key={loc.name}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: easeCurve }}
                className="group relative rounded-3xl border border-border/40 bg-card/30 backdrop-blur-sm p-6 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_40px_-12px_hsl(var(--primary)/0.3)]"
              >
                {/* Header with location name */}
                <div className="mb-6">
                  <h2 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-foreground mb-2">
                    {loc.name}
                  </h2>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="w-5 h-5 mt-0.5 text-primary shrink-0" />
                    <p className="text-sm leading-relaxed">{loc.address}</p>
                  </div>
                </div>

                {/* Info cards grid */}
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  {/* Schedule card */}
                  <div className="rounded-2xl bg-primary/5 border border-primary/20 p-4 hover:bg-primary/10 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-foreground">Horario presencial</h3>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">{loc.schedule}</p>
                    <p className="text-sm text-foreground font-semibold">{loc.hours}</p>
                  </div>

                  {/* Practices card */}
                  <div className="rounded-2xl bg-primary/5 border border-primary/20 p-4 hover:bg-primary/10 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <Car className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-foreground">Prácticas</h3>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Lunes a Viernes</p>
                    <p className="text-sm text-foreground font-semibold">{loc.practicas}</p>
                  </div>
                </div>

                {/* Google Maps embed */}
                <div className="rounded-2xl overflow-hidden border border-border/60 aspect-[16/10] mb-4 shadow-lg">
                  <iframe
                    src={loc.mapSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Mapa ${loc.name}`}
                  />
                </div>

                {/* Image placeholder */}
                <div className="rounded-2xl overflow-hidden bg-primary/80 aspect-[16/9] flex items-center justify-center shadow-lg">
                  <span className="text-primary-foreground font-semibold text-lg">
                    {loc.imagePlaceholder}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <ContactForm />
      <Footer />
    </div>
  );
}
