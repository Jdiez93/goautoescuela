import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ContactForm from "@/components/landing/ContactForm";
import { motion } from "framer-motion";
import { MapPin, Clock, Car } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RandomLetterSwapPingPong } from "@/components/ui/random-letter-swap";

const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, ease: easeCurve },
};

export default function AutoescuelaPardillo() {
  const name = "Villanueva del Pardillo";
  const address = "C/ Concepción, 61, 28229 Villanueva del Pardillo (Madrid)";
  const mapSrc =
    "https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=C.+Concepción+61+Local+9+28229+Villanueva+del+Pardillo+Madrid+Spain&zoom=17";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 sm:pt-32 pb-20 sm:pb-24">
        {/* Hero */}
        <section className="px-4 mb-16">
          <div className="max-w-6xl mx-auto">
            <motion.div {...fadeUp} className="text-center mb-10">
              </span>
            </motion.div>
            <motion.div {...fadeUp} className="text-center mb-10" style={{ display: "contents" }}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-['Space_Grotesk'] text-foreground mb-4 inline-flex justify-center">
                <RandomLetterSwapPingPong label={name} />
              </h1>
              <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto">
                Tu centro de confianza para sacarte el carnet en la zona oeste de Madrid.
              </p>
            </motion.div>

            {/* Hero image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: easeCurve }}
              className="rounded-3xl overflow-hidden bg-primary/80 aspect-[21/9] flex items-center justify-center shadow-2xl"
            >
              <span className="text-primary-foreground font-semibold text-2xl">
                Imagen Pardillo
              </span>
            </motion.div>
          </div>
        </section>

        {/* Info cards */}
        <section className="px-4 mb-16">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
            <motion.div {...fadeUp} className="rounded-3xl border border-border/40 bg-card/30 backdrop-blur-sm p-6 hover:border-primary/50 transition-all">
              <motion.div whileHover={{ y: -10, scale: 1.2, rotate: -8 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} className="inline-block mb-3 cursor-pointer">
                <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                  <MapPin className="w-8 h-8 text-primary" />
                </motion.div>
              </motion.div>
              <h3 className="text-lg font-bold font-['Space_Grotesk'] mb-2">Dirección</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{address}</p>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.1, ease: easeCurve }} className="rounded-3xl border border-border/40 bg-card/30 backdrop-blur-sm p-6 hover:border-primary/50 transition-all">
              <motion.div whileHover={{ y: -10, scale: 1.2, rotate: -8 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} className="inline-block mb-3 cursor-pointer">
                <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                  <Clock className="w-8 h-8 text-primary" />
                </motion.div>
              </motion.div>
              <h3 className="text-lg font-bold font-['Space_Grotesk'] mb-2">Horario presencial</h3>
              <p className="text-sm text-foreground font-semibold mb-1">Martes y Jueves</p>
              <p className="text-sm text-muted-foreground">11:00 - 13:00 / 17:00 - 20:00</p>
            </motion.div>

            <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.2, ease: easeCurve }} className="rounded-3xl border border-border/40 bg-card/30 backdrop-blur-sm p-6 hover:border-primary/50 transition-all">
              <motion.div whileHover={{ y: -10, scale: 1.2, rotate: -8 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} className="inline-block mb-3 cursor-pointer">
                <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
                  <Car className="w-8 h-8 text-primary" />
                </motion.div>
              </motion.div>
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
            <motion.h2 {...fadeUp} className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] mb-6 text-center flex justify-center">
              <RandomLetterSwapPingPong label="¿Cómo llegar?" />
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
