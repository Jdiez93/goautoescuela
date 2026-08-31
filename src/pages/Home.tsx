import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ContactForm from "@/components/landing/ContactForm";
import { AnimatedCardBg } from "@/components/ui/animated-card-bg";
import { Tilt3D } from "@/components/ui/tilt-3d";
import { RandomLetterSwapPingPong } from "@/components/ui/random-letter-swap";
import iconoMetodo from "@/assets/icono-metodo.jpeg";
import iconoApp from "@/assets/icono-app.jpeg";
import iconoEstadistica from "@/assets/icono-estadistica.jpeg";
import iconoAprobado from "@/assets/icono-aprobado.jpeg";
import imgTeorica from "@/assets/home-teorica.jpeg";
import imgPractica from "@/assets/home-practica.jpeg";
import slide1 from "@/assets/carrusel-devolvemos.png";
import slide2 from "@/assets/carrusel-todoen1.jpeg";
import cocheRotulado from "@/assets/coche-rotulado.png";

const carouselSlides = [
  {
    id: 1,
    image: slide1,
    alt: "Promoción Ready2Go: si no apruebas el teórico a la primera, te devolvemos el dinero",
  },
  {
    id: 2,
    image: slide2,
    alt: "Autoescuela Ready2Go: teórico, prácticas y gestión del carnet todo en una sola app",
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
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, ease: easeCurve },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.92 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: "-40px" },
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
      <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold font-['Space_Grotesk'] tracking-tight text-foreground mb-2">
        Autoescuela online Ready2Go
      </h1>
      <p className="text-muted-foreground text-base sm:text-lg mb-6 sm:mb-8 max-w-3xl">
        Teórico online con vídeos, clases prácticas y matrícula en Villanueva del Pardillo y Valdemorillo.
      </p>
      <div className="relative overflow-hidden rounded-3xl aspect-[16/9]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, scale: 1.05, x: 60 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.97, x: -60 }}
            transition={{ duration: 0.6, ease: easeCurve }}
            className="absolute inset-0"
          >
            <img
              src={carouselSlides[current].image}
              alt={carouselSlides[current].alt}
              fetchPriority="high"

              fetchPriority="high"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />

            <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 z-10">
              <Link to="/matriculate">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    size="sm"
                    className="bg-background/30 backdrop-blur-md border border-background/40 text-foreground hover:bg-background/50 rounded-full px-4 h-8 text-xs font-medium shadow-sm"
                  >
                    Ver packs
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

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
      title: "Espacio del alumno",
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
    <section className="pt-[35vh] sm:pt-[40vh] pb-16 sm:pb-24 px-4 cv-auto">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp}>
          <h2 className="text-2xl sm:text-4xl font-bold font-['Space_Grotesk'] tracking-tight text-foreground">
            <RandomLetterSwapPingPong label="¿Por qué Ready2Go?" />
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
          viewport={{ once: true, margin: "-60px" }}
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
            >
            <Tilt3D
              className="relative overflow-hidden p-6 rounded-2xl border border-border/60 bg-card hover:border-primary/30 transition-colors duration-300 group cursor-default flex flex-col items-center text-center h-full"
            >
              <AnimatedCardBg />
              <motion.div
                className="relative z-10 mb-4 cursor-pointer"
                whileHover={{ y: -14, scale: 1.15, rotate: -8 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <img
                  src={r.icon}
                  alt={r.title}
                  loading="lazy"
                  decoding="async"
                  className="no-glow w-28 h-28 sm:w-40 sm:h-40 lg:w-52 lg:h-52 object-contain mix-blend-multiply"
                />
              </motion.div>
              <h3 className="relative z-10 font-semibold text-foreground mb-2 font-['Space_Grotesk']">{r.title}</h3>
              <p className="relative z-10 text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
            </Tilt3D>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CoursesSection() {
  const courses = [
    { title: "La Teórica", id: "teorica", to: "/la-teorica", img: imgTeorica },
    { title: "La Práctica", id: "practica", to: "/las-practicas", img: imgPractica },
  ];

  return (
    <section className="pb-16 sm:pb-24 px-4 cv-auto">
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 gap-6">
        {courses.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: i * 0.15, ease: easeCurve }}
            className="flex flex-col gap-3"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-foreground font-['Space_Grotesk'] tracking-tight">
              <RandomLetterSwapPingPong label={course.title} />
            </h3>
            <motion.div
              whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.3 } }}
              className="relative rounded-2xl overflow-hidden bg-white aspect-[16/9] flex items-end justify-end p-4 sm:p-6 cursor-pointer border border-border/40 shadow-sm"
            >
              <img
                src={course.img}
                alt={course.title}
                className="absolute inset-0 w-full h-full object-cover object-center"
                loading="lazy"
              />
              <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }} className="relative z-10">
                <Link to={course.to}>
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-3 h-7 text-[11px] font-semibold shadow-md">
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
    <section className="pb-16 sm:pb-24 px-4 cv-auto">
      <div className="max-w-6xl mx-auto">
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

        <motion.div
          {...scaleIn}
          whileHover={{ scale: 1.005, transition: { duration: 0.3 } }}
          className="relative rounded-3xl overflow-hidden aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] flex items-end justify-center"
        >
          <img
            src={cocheRotulado}
            alt="Coche rotulado Ready2Go - Conduce hacia tu libertad"
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading="lazy"
          />
          <div className="relative z-10 mb-6 sm:mb-8">
            <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-background/20 backdrop-blur-md border border-background/40 text-primary-foreground hover:bg-background/40 rounded-full px-6 h-10 text-sm font-semibold shadow-sm">
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
  return (
    <motion.div
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: easeCurve }}
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
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: easeCurve }}
        className="w-full max-w-none overflow-hidden"
      >
        <Footer />
      </motion.div>
    </motion.div>
  );
}
