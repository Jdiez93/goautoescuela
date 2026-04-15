import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";

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
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d756.9!2d-3.9713!3d40.4975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd41890c9a7d3b3b%3A0x8e0e4c1e1e6a2f0!2sAutoescuela+Ready2Go!5e0!3m2!1ses!2ses!4v1700000000000",
    schedule: "Martes y Jueves: 11:00 - 13:00 / 17:30 - 20:30",
    practicas: "Prácticas: 8:00 - 22:00",
    imagePlaceholder: "Imagen Pardillo",
  },
  {
    name: "Valdemorillo",
    address: "C. Covachuelas, 18, 28210 Valdemorillo, Madrid",
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3036.5!2d-4.0697!3d40.4869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd418a1b2c3d4e5f%3A0xfedcba0987654321!2sC.%20Covachuelas%2C%2018%2C%2028210%20Valdemorillo%2C%20Madrid!5e0!3m2!1ses!2ses!4v1700000000000",
    schedule: "Lunes, Miércoles y Viernes: 11:00 - 13:00 / 17:30 - 20:30",
    practicas: "Prácticas: 8:00 - 22:00",
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
          <div className="grid md:grid-cols-2 gap-10">
            {locations.map((loc, i) => (
              <motion.div
                key={loc.name}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: easeCurve }}
              >
                <h2 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-foreground mb-4 text-center">
                  {loc.name}
                </h2>

                {/* Google Maps embed */}
                <div className="rounded-2xl overflow-hidden border border-border/60 aspect-[16/10] mb-4">
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

                {/* Schedule */}
                <div className="mb-4 space-y-1">
                  <p className="text-sm text-muted-foreground">{loc.schedule}</p>
                  <p className="text-sm text-muted-foreground">{loc.practicas}</p>
                </div>

                {/* Image placeholder */}
                <div className="rounded-2xl overflow-hidden bg-primary/80 aspect-[16/9] flex items-center justify-center">
                  <span className="text-primary-foreground font-semibold text-lg">
                    {loc.imagePlaceholder}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
