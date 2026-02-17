import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Mensaje enviado", description: "Te responderemos lo antes posible." });
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Contacto</span>
            <h1 className="text-4xl font-bold mt-3 mb-4">¿Tienes alguna pregunta?</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">Escríbenos y te responderemos lo antes posible.</p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Card className="shadow-[var(--card-shadow)]">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre</Label>
                        <Input id="name" placeholder="Tu nombre" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="tu@email.com" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Asunto</Label>
                      <Input id="subject" placeholder="¿En qué te podemos ayudar?" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Mensaje</Label>
                      <Textarea id="message" placeholder="Escribe tu mensaje..." rows={5} required />
                    </div>
                    <Button type="submit" className="w-full bg-hero-gradient text-primary-foreground hover:opacity-90" disabled={loading}>
                      Enviar mensaje
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
              {[
                { icon: MapPin, title: "Dirección", text: "Calle Concepción, 61 · 28229 Villanueva del Pardillo (Madrid)" },
                { icon: Phone, title: "Teléfono", text: "918 15 XX XX" },
                { icon: Mail, title: "Email", text: "info@autoescuelago.es" },
                { icon: Clock, title: "Horario", text: "Lun-Vie: 9:00-21:00 · Sáb: 9:00-14:00" },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-sm text-muted-foreground">{item.text}</div>
                  </div>
                </div>
              ))}

              <div className="rounded-xl overflow-hidden border border-border/50 h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3033.5!2d-3.9742!3d40.4468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd418f0a2a6d5c67%3A0x400f7634e53c510!2sCalle%20Concepci%C3%B3n%2C%2061%2C%2028229%20Villanueva%20del%20Pardillo%2C%20Madrid!5e0!3m2!1ses!2ses!4v1"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade" title="Ubicación AutoescuelaGO"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
