import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ContactForm from "@/components/landing/ContactForm";
import { motion } from "framer-motion";
import { MapPin, Clock, Car } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, ease: easeCurve },
};

export default function AutoescuelaValdemorillo() {
  const name = "Valdemorillo";
  const address = "C. Covachuelas, 18, 28210 Valdemorillo, Madrid";
  const mapSrc =
    "https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=C.+Covachuelas+18+28210+Valdemorillo+Madrid+Spain&zoom=17";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 sm:pt-32 pb-20 sm:pb-24">
        {/* Hero */}
        <section className="px-4 mb-16">
          <div className="max-w-6xl mx-auto">
            <motion.div {...fadeUp} className="text-center mb-10">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
                Autoescuela Ready2Go
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-['Space_Grotesk'] text-foreground mb-4">
                {name}
              </h1>
              <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto">
                Tu autoescuela en la sierra de Madrid, con la opción única de examinarte en Ávila.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: easeCurve }}
              className="rounded-3xl overflow-hidden bg-primary/80 aspect-[21/9] flex items-center justify-center shadow-2xl"
            >
              <span className="text-primary-foreground font-semibold text-2xl">
                Imagen Valdemorillo
              </span>
            </motion.div>
          </div>
        </section>

        {/* Info cards */}
        <section className="px-4 mb-16">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
            <motion.div {...fadeUp} className="rounded-3xl border border-border/40 bg-card/30 backdrop-blur-sm p-6 hover:border-primary/50 transition-all">
              <MapPin className="w-8 h-8 text-primary mb-3" />
              <h3 className="text-lg font-bold font-['Space_Grotesk'] mb-2">Dirección</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{address}</p>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.1, ease: easeCurve }} className="rounded-3xl border border-border/40 bg-card/30 backdrop-blur-sm p-6 hover:border-primary/50 transition-all">
              <Clock className="w-8 h-8 text-primary mb-3" />
              <h3 className="text-lg font-bold font-['Space_Grotesk'] mb-2">Horario presencial</h3>
              <p className="text-sm text-foreground font-semibold mb-1">Lunes, Miércoles y Viernes</p>
              <p className="text-sm text-muted-foreground">11:00 - 13:00 / 17:00 - 20:00</p>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.2, ease: easeCurve }} className="rounded-3xl border border-border/40 bg-card/30 backdrop-blur-sm p-6 hover:border-primary/50 transition-all">
              <Car className="w-8 h-8 text-primary mb-3" />
              <h3 className="text-lg font-bold font-['Space_Grotesk'] mb-2">Prácticas</h3>
              <p className="text-sm text-foreground font-semibold mb-1">Lunes a Viernes</p>
              <p className="text-sm text-muted-foreground">8:00 - 22:00</p>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 mb-16">
          <div className="max-w-4xl mx-auto text-center rounded-3xl bg-primary/5 border border-primary/20 p-8 sm:p-12">
            <motion.div {...fadeUp}>
              <h2 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] mb-4">
                ¿Listo para empezar?
              </h2>
              <p className="text-muted-foreground mb-6 text-lg">
                Matricúlate hoy y comienza tu camino hacia el carnet de conducir.
              </p>
              <Link to="/matriculate">
                <Button size="lg" className="rounded-2xl">Matricúlate ahora</Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Map */}
        <section className="px-4">
          <div className="max-w-6xl mx-auto">
            <motion.h2 {...fadeUp} className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] mb-6 text-center">
              ¿Cómo llegar?
            </motion.h2>
            <motion.div {...fadeUp} className="rounded-3xl overflow-hidden border border-border/60 aspect-[16/9] shadow-2xl">
              <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Mapa ${name}`}
              />
            </motion.div>
          </div>
        </section>
      </main>
      <ContactForm />
      <Footer />
    </div>
  );
}
