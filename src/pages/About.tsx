import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Users, Award, MapPin, Car } from "lucide-react";

const team = [
  { name: "Valentín", role: "Director y profesor", years: 15 },
  { name: "Joaquín", role: "Profesora de prácticas", years: 8 },
  { name: "David López", role: "Profesor de prácticas", years: 10 },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Sobre nosotros</span>
            <h1 className="text-4xl font-bold mt-3 mb-4">Más de 15 años formando conductores</h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              En AutoescuelaGO, Villanueva del Pardillo, combinamos experiencia, tecnología y un trato cercano
              para que obtengas tu carnet de forma segura y eficiente.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto mb-20">
            {[
              { icon: Award, label: "98% aprobados", sub: "Tasa de éxito" },
              { icon: Users, label: "+500 alumnos", sub: "Formados con nosotros" },
              { icon: MapPin, label: "Villanueva del Pardillo", sub: "Madrid" },
            ].map((item) => (
              <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
                <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="font-bold text-lg">{item.label}</div>
                <div className="text-sm text-muted-foreground">{item.sub}</div>
              </motion.div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-10">Nuestro equipo</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {team.map((member, i) => (
                <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="text-center p-6 rounded-2xl bg-card border border-border/50 shadow-[var(--card-shadow)]">
                  <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
                    <Car className="w-7 h-7 text-primary" />
                  </div>
                  <div className="font-semibold">{member.name}</div>
                  <div className="text-sm text-muted-foreground">{member.role}</div>
                  <div className="text-xs text-primary mt-1">{member.years} años de experiencia</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
