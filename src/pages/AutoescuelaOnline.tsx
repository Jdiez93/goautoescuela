import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const features = [
  {
    title: "Tu aula está donde tú quieras",
    desc: "Aprende a tu ritmo con acceso 24/7 a vídeos, test y contenido",
    imageLabel: "Imagen aula virtual",
    imageFirst: false,
  },
  {
    title: "Cada pregunta, un vídeo",
    desc: "Más de 3000 test con vídeos explicativos",
    imageLabel: "Imagen vídeos explicativos",
    imageFirst: true,
  },
];

export default function AutoescuelaOnline() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero banner */}
      <section className="pt-20">
        <div className="w-full bg-[hsl(var(--foreground))] flex items-center justify-center min-h-[280px] md:min-h-[360px]">
          <span className="text-primary-foreground/60 text-lg font-semibold tracking-widest uppercase">
            Imagen Autoescuela Online
          </span>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Space_Grotesk'] tracking-tight mb-16"
          >
            Qué es ready2Go Online
          </motion.h2>

          <div className="space-y-16 md:space-y-24">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${
                  feat.imageFirst ? "" : "md:[direction:rtl]"
                }`}
              >
                {/* Image placeholder */}
                <div className={`${feat.imageFirst ? "order-1 md:order-1" : "order-1 md:order-2"} md:[direction:ltr]`}>
                  <div className="aspect-[4/3] rounded-2xl bg-primary/15 border border-primary/20 flex items-center justify-center">
                    <span className="text-primary font-semibold text-lg">{feat.imageLabel}</span>
                  </div>
                </div>

                {/* Text */}
                <div className={`${feat.imageFirst ? "order-2 md:order-2" : "order-2 md:order-1"} md:[direction:ltr]`}>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight mb-3">{feat.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
