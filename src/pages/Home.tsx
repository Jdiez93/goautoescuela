import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import ContactForm from "@/components/landing/ContactForm";
import iconoMetodo from "@/assets/icono-metodo.jpeg";
import iconoApp from "@/assets/icono-app.jpeg";
import iconoEstadistica from "@/assets/icono-estadistica.jpeg";
import iconoAprobado from "@/assets/icono-aprobado.jpeg";
import imgTeorica from "@/assets/home-teorica.jpeg";
import imgPractica from "@/assets/home-practica.jpeg";
import slide1 from "@/assets/carrusel-devolvemos.png";
import slide2 from "@/assets/carrusel-todoen1.jpeg";

const carouselSlides = [
  { id: 1, image: slide1 },
  { id: 2, image: slide2 },
];

const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1];

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6, ease: easeCurve },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.15 } },
};

// Reveal con leve rotateX para profundidad 3D
const reveal3D = {
  initial: { opacity: 0, y: 60, rotateX: 15 },
  whileInView: { opacity: 1, y: 0, rotateX: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, ease: "easeOut" as const },
};

// Tarjeta 3D con tilt según movimiento del ratón
function Tilt3DCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const sRx = useSpring(rx, { stiffness: 200, damping: 20 });
  const sRy = useSpring(ry, { stiffness: 200, damping: 20 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * 12);
    rx.set(-py * 12);
  };

  const handleLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <div className="perspective-1000" onMouseMove={handleMove} onMouseLeave={handleLeave}>
      <motion.div
        ref={ref}
        style={{ rotateX: sRx, rotateY: sRy, transformStyle: "preserve-3d" }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
}

function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  // Parallax: el bg se mueve a 0.2x, el carrusel a 1x (natural)
  const bgY = useTransform(scrollY, [0, 800], [0, 160]);
  const midY = useTransform(scrollY, [0, 800], [0, 80]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % carouselSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + carouselSlides.length) % carouselSlides.length);
  const next = () => setCurrent((c) => (c + 1) % carouselSlides.length);

  return (
    <div ref={sectionRef} className="relative">
      {/* Capa background animada (parallax 0.2x) */}
      <motion.div
        aria-hidden
        style={{ y: bgY }}
        className="absolute inset-0 -z-10 gradient-mesh opacity-70 pointer-events-none"
      />
      {/* Capa midground (parallax 0.5x) - blobs flotantes */}
      <motion.div
        aria-hidden
        style={{ y: midY }}
        className="absolute inset-0 -z-10 pointer-events-none overflow-hidden"
      >
        <div className="absolute top-10 left-[8%] w-40 h-40 rounded-full bg-primary/20 blur-3xl animate-float" />
        <div className="absolute top-32 right-[10%] w-56 h-56 rounded-full bg-[hsl(220,95%,70%)]/15 blur-3xl animate-float" style={{ animationDelay: "1.2s" }} />
      </motion.div>

      <motion.div
        className="relative w-full max-w-6xl mx-auto px-4 pt-8 perspective-1000"
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: easeCurve, delay: 0.1 }}
      >
        <Tilt3DCard className="img-glow relative overflow-hidden rounded-3xl aspect-[16/9] preserve-3d">
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
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 z-10" style={{ transform: "translateZ(40px)" }}>
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
                animate={{ width: i === current ? 28 : 10, opacity: i === current ? 1 : 0.4 }}
                whileHover={{ opacity: 0.8 }}
                transition={{ duration: 0.4, ease: easeCurve }}
                className="h-2.5 rounded-full bg-primary-foreground"
              />
            ))}
          </div>
        </Tilt3DCard>
      </motion.div>
    </div>
  );
}

function WhySection() {
  const reasons = [
    { icon: iconoMetodo, title: "Método Ready2Go", desc: "Nos adaptamos a ti, de una manera innovadora, clara y práctica que acelera tu progreso, refuerza tu seguridad y te lleva al carnet con acompañamiento cercano y recursos útiles." },
    { icon: iconoApp, title: "Espacio del alumno", desc: "Desde el primer día tendrás un área personal donde gestionar tu carnet: test propios con vídeos y temario digital, seguimiento del progreso y reserva de prácticas con elección de día y hora. Todo en el mismo sitio para facilitar cada paso." },
    { icon: iconoEstadistica, title: "Plan y gestión personalizada", desc: "Verás tu progreso en tiempo real, en teoría y práctica. Nuestros profes te acompañan, evalúan y guían. Así sabrás exactamente cuándo estás listo para presentarte al examen." },
    { icon: iconoAprobado, title: "Aprueba sin vueltas", desc: "¡Sí, sí! Si has seguido el método y no apruebas en primera convocatoria ¡Te devolvemos el dinero del curso teórico! Los requisitos son fáciles: conseguir 85% en nuestro barómetro general en menos de dos meses." },
  ];

  return (
    <section className="py-16 sm:py-24 px-4 cv-auto relative">
      <div className="max-w-6xl mx-auto perspective-1000">
        <motion.div {...reveal3D}>
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
          viewport={{ once: true, margin: "-60px" }}
        >
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              variants={{
                initial: { opacity: 0, y: 60, rotateX: 15 },
                animate: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.7, ease: "easeOut" } },
              }}
              className="perspective-1000"
            >
              <div className="card-3d p-6 rounded-2xl glass-card hover:border-primary/40 transition-colors duration-300 group flex flex-col items-center text-center h-full">
                <motion.div
                  className="mb-4 animate-float"
                  style={{ animationDelay: `${i * 0.4}s`, transform: "translateZ(30px)" }}
                >
                  <img
                    src={r.icon}
                    alt={r.title}
                    loading="lazy"
                    decoding="async"
                    className="w-28 h-28 sm:w-40 sm:h-40 lg:w-52 lg:h-52 object-contain mix-blend-multiply"
                  />
                </motion.div>
                <h3 className="font-semibold text-foreground mb-2 font-['Space_Grotesk']" style={{ transform: "translateZ(20px)" }}>
                  {r.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
              </div>
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
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 gap-6 perspective-1000">
        {courses.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 60, rotateX: 15 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, delay: i * 0.15, ease: "easeOut" }}
            className="flex flex-col gap-3"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-foreground font-['Space_Grotesk'] tracking-tight">
              {course.title}
            </h3>
            <Tilt3DCard className="img-glow relative rounded-2xl overflow-hidden bg-white aspect-[16/9] flex items-end justify-end p-4 sm:p-6 cursor-pointer border border-border/40 shadow-sm preserve-3d">
              <img
                src={course.img}
                alt={course.title}
                className="absolute inset-0 w-full h-full object-cover object-center"
                loading="lazy"
              />
              <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }} className="relative z-10" style={{ transform: "translateZ(30px)" }}>
                <Link to={course.to}>
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-3 h-7 text-[11px] font-semibold shadow-md">
                    Saber más
                  </Button>
                </Link>
              </motion.div>
            </Tilt3DCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function PromoBanner() {
  return (
    <section className="pb-16 sm:pb-24 px-4 cv-auto">
      <div className="max-w-6xl mx-auto perspective-1000">
        <motion.div {...reveal3D} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
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
          initial={{ opacity: 0, y: 60, rotateX: 15 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Tilt3DCard className="relative rounded-3xl overflow-hidden bg-[hsl(220,30%,15%)] aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] flex flex-col items-center justify-center preserve-3d">
            <span className="text-primary-foreground/60 text-sm mb-auto mt-[30%]" style={{ transform: "translateZ(30px)" }}>
              Imagen creada coche rotulado
            </span>
            <div className="mb-8" style={{ transform: "translateZ(40px)" }}>
              <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-11 text-sm font-semibold">
                  Me interesa
                </Button>
              </motion.div>
            </div>
          </Tilt3DCard>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <motion.div className="min-h-screen bg-background relative overflow-x-hidden" {...pageTransition}>
      <Navbar />
      <main className="pt-20 relative">
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
      >
        <Footer />
      </motion.div>
    </motion.div>
  );
}
