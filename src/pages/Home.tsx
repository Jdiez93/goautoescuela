import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import SplashScreen from "@/components/SplashScreen";

const carouselSlides = [
  {
    id: 1,
    bg: "from-primary to-primary/80",
    title: "Tu carnet de conducir empieza aquí",
    subtitle: "Clases prácticas online y presenciales en Villanueva del Pardillo",
  },
  {
    id: 2,
    bg: "from-secondary to-secondary/80",
    title: "Packs de clases con los mejores precios",
    subtitle: "Ahorra comprando packs de 5, 10 o 20 clases prácticas",
  },
];

function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % carouselSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + carouselSlides.length) % carouselSlides.length);
  const next = () => setCurrent((c) => (c + 1) % carouselSlides.length);

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 pt-8">
      <div className="relative overflow-hidden rounded-3xl aspect-[16/7] sm:aspect-[16/6]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute inset-0 bg-gradient-to-br ${carouselSlides[current].bg} flex flex-col justify-end p-6 sm:p-10 lg:p-14`}
          >
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground font-['Space_Grotesk'] tracking-tight mb-2 sm:mb-3 max-w-xl">
              {carouselSlides[current].title}
            </h2>
            <p className="text-sm sm:text-lg text-primary-foreground/80 max-w-md mb-6 sm:mb-8">
              {carouselSlides[current].subtitle}
            </p>

            <div className="flex gap-3">
              <Link to="/registro">
                <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 rounded-xl px-6 sm:px-8 h-11 sm:h-13 text-sm sm:text-base font-semibold">
                  Empezar ahora
                </Button>
              </Link>
              <a href="#packs">
                <Button variant="outline" size="lg" className="border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground rounded-xl px-6 sm:px-8 h-11 sm:h-13 text-sm sm:text-base font-semibold">
                  Ver packs
                </Button>
              </a>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center text-primary-foreground hover:bg-background/40 transition-colors z-10"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center text-primary-foreground hover:bg-background/40 transition-colors z-10"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {carouselSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "bg-primary-foreground w-7"
                  : "bg-primary-foreground/40 hover:bg-primary-foreground/60"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function WhySection() {
  const reasons = [
    {
      emoji: "📱",
      title: "100% Online",
      desc: "Reserva y gestiona tus clases desde cualquier dispositivo.",
    },
    {
      emoji: "💰",
      title: "Mejores precios",
      desc: "Packs de clases con descuentos exclusivos.",
    },
    {
      emoji: "📅",
      title: "Horarios flexibles",
      desc: "Elige el día y la hora que mejor te venga.",
    },
    {
      emoji: "🚗",
      title: "Profesores expertos",
      desc: "Formadores titulados con años de experiencia.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-2xl sm:text-4xl font-bold font-['Space_Grotesk'] tracking-tight text-foreground">
            ¿Por qué AutoescuelaGO?
          </h2>
          <p className="text-muted-foreground mt-2 mb-10 sm:mb-14 text-base sm:text-lg">
            Aprender a conducir fácil, flexible y a tu ritmo
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 rounded-2xl border border-border/60 bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
            >
              <span className="text-3xl mb-4 block">{r.emoji}</span>
              <h3 className="font-semibold text-foreground mb-2 font-['Space_Grotesk']">{r.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const handleFinish = useCallback(() => setShowSplash(false), []);

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onFinish={handleFinish} />}
      </AnimatePresence>
      {!showSplash && (
        <div className="min-h-screen bg-background">
          <Navbar />
          <main className="pt-20">
            <HeroCarousel />
            <WhySection />
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}
