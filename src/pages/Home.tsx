import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ContactForm from "@/components/landing/ContactForm";
import SplashScreen from "@/components/SplashScreen";
import iconoMetodo from "@/assets/icono-metodo.jpeg";
import iconoApp from "@/assets/icono-app.jpeg";
import iconoEstadistica from "@/assets/icono-estadistica.jpeg";
import iconoAprobado from "@/assets/icono-aprobado.jpeg";

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

const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6, ease: easeCurve },
};

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.08 },
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, margin: "-60px" },
  transition: { duration: 0.7, ease: easeCurve },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.92 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: false, margin: "-40px" },
  transition: { duration: 0.6, ease: easeCurve },
};

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
    <motion.div
      className="relative w-full max-w-6xl mx-auto px-4 pt-8"
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: easeCurve, delay: 0.1 }}
    >
      <div className="relative overflow-hidden rounded-3xl aspect-[16/7] sm:aspect-[16/6]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.05, x: 60 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.97, x: -60 }}
            transition={{ duration: 0.6, ease: easeCurve }}
            className={`absolute inset-0 bg-gradient-to-br ${carouselSlides[current].bg} flex flex-col justify-end p-6 sm:p-10 lg:p-14`}
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-2xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground font-['Space_Grotesk'] tracking-tight mb-2 sm:mb-3 max-w-xl"
            >
              {carouselSlides[current].title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-sm sm:text-lg text-primary-foreground/80 max-w-md mb-6 sm:mb-8"
            >
              {carouselSlides[current].subtitle}
            </motion.p>

            <motion.div
              className="flex gap-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Link to="/registro">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Button size="lg" className="bg-foreground text-background hover:bg-foreground/90 rounded-xl px-6 sm:px-8 h-11 sm:h-13 text-sm sm:text-base font-semibold">
                    Empezar ahora
                  </Button>
                </motion.div>
              </Link>
              <a href="#packs">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Button size="lg" className="border border-primary-foreground/40 bg-transparent text-primary-foreground hover:border-primary-foreground hover:bg-transparent rounded-xl px-6 sm:px-8 h-11 sm:h-13 text-sm sm:text-base font-semibold">
                    Ver packs
                  </Button>
                </motion.div>
              </a>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <motion.button
          onClick={prev}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center text-primary-foreground hover:bg-background/40 transition-colors z-10"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
        <motion.button
          onClick={next}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center text-primary-foreground hover:bg-background/40 transition-colors z-10"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {carouselSlides.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setCurrent(i)}
              animate={{
                width: i === current ? 28 : 10,
                opacity: i === current ? 1 : 0.4,
              }}
              whileHover={{ opacity: 0.8 }}
              transition={{ duration: 0.4, ease: easeCurve }}
              className="h-2.5 rounded-full bg-primary-foreground"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function WhySection() {
  const reasons = [
    {
      icon: iconoMetodo,
      title: "Método Ready2Go",
      desc: "Nos adaptamos a ti, de una manera innovadora, clara y práctica que acelera tu progreso, refuerza tu seguridad y te lleva al carnet con acompañamiento cercano y recursos útiles.",
    },
    {
      icon: iconoApp,
      title: "App Ready2Go",
      desc: "Desde el primer día tendrás un área personal donde gestionar tu carnet: test propios con vídeos y temario digital, seguimiento del progreso y reserva de prácticas con elección de día y hora. Todo en el mismo sitio para facilitar cada paso.",
    },
    {
      icon: iconoEstadistica,
      title: "Plan y gestión personalizada",
      desc: "Verás tu progreso en tiempo real, en teoría y práctica. Nuestros profes te acompañan, evalúan y guían. Así sabrás exactamente cuándo estás listo para presentarte al examen.",
    },
    {
      icon: iconoAprobado,
      title: "Aprueba sin vueltas",
      desc: "¡Sí, sí! Si has seguido el método y no apruebas en primera convocatoria ¡Te devolvemos el dinero del curso teórico! Los requisitos son fáciles: conseguir 85% en nuestro barómetro general en menos de dos meses.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp}>
          <h2 className="text-2xl sm:text-4xl font-bold font-['Space_Grotesk'] tracking-tight text-foreground">
            ¿Por qué Ready2Go?
          </h2>
          <p className="text-muted-foreground mt-2 mb-10 sm:mb-14 text-base sm:text-lg">
            Porque aprender a conducir tiene que ser compatible con tu agenda, fácil y divertido
          </p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: false, margin: "-60px" }}
        >
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              variants={{
                initial: { opacity: 0, y: 40, scale: 0.95 },
                animate: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.6, delay: i * 0.1, ease: easeCurve },
                },
              }}
              whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.3 } }}
              className="p-6 rounded-2xl border border-border/60 bg-card hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 group cursor-default flex flex-col items-center text-center"
            >
              <img src={r.icon} alt={r.title} className="w-44 h-44 sm:w-52 sm:h-52 mb-4 object-contain mix-blend-multiply" />
              <h3 className="font-semibold text-foreground mb-2 font-['Space_Grotesk']">{r.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CoursesSection() {
  const courses = [
    { title: "La Teórica", id: "teorica", to: "/la-teorica" },
    { title: "La Práctica", id: "practica", to: "/las-practicas" },
  ];

  return (
    <section className="pb-16 sm:pb-24 px-4">
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 gap-6">
        {courses.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, margin: "-40px" }}
            transition={{ duration: 0.6, delay: i * 0.15, ease: easeCurve }}
            className="flex flex-col gap-3"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-foreground font-['Space_Grotesk'] tracking-tight">
              {course.title}
            </h3>
            <motion.div
              whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.3 } }}
              className="relative rounded-2xl overflow-hidden bg-[hsl(220,30%,15%)] aspect-[16/9] flex items-end justify-end p-4 sm:p-6 cursor-pointer"
            >
              <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }}>
                <Link to={course.to}>
                  <Button size="sm" variant="ghost" className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10 rounded-full px-4 h-8 text-xs font-medium backdrop-blur-sm border border-white/15">
                    Saber más
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function PromoBanner() {
  return (
    <section className="pb-16 sm:pb-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Text + button row */}
        <motion.div
          {...fadeUp}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-['Space_Grotesk'] tracking-tight text-foreground max-w-2xl">
            Únete a Ready2Go de forma digital y descubre los beneficios exclusivos de nuestros descuentos online
          </h2>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
            <Link to="/autoescuela-online">
              <Button variant="outline" className="rounded-full px-6 h-11 text-sm font-semibold border-foreground text-foreground hover:bg-foreground hover:text-background shrink-0">
                Saber más
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Image placeholder */}
        <motion.div
          {...scaleIn}
          whileHover={{ scale: 1.005, transition: { duration: 0.3 } }}
          className="relative rounded-3xl overflow-hidden bg-[hsl(220,30%,15%)] aspect-[21/9] flex flex-col items-center justify-center"
        >
          <span className="text-primary-foreground/60 text-sm mb-auto mt-[30%]">Imagen creada coche rotulado</span>
          <div className="mb-8">
            <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-11 text-sm font-semibold">
                Me interesa
              </Button>
            </motion.div>
          </div>
        </motion.div>
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
        <motion.div
          className="min-h-screen bg-background"
          {...pageTransition}
        >
          <Navbar />
          <main className="pt-20">
            <HeroCarousel />
            <WhySection />
            <CoursesSection />
            <PromoBanner />
            <ContactForm />
          </main>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.7, ease: easeCurve }}
          >
            <Footer />
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
