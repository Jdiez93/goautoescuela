import { Car, MapPin, Phone, Mail, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="relative bg-foreground text-background/80 pt-20 pb-8 overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      {/* Subtle orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-primary/[0.05] rounded-full blur-3xl" />

      <div className="container mx-auto px-3 sm:px-4 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12 mb-16">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Car className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-background font-['Space_Grotesk'] tracking-tight">
                AutoescuelaGO
              </span>
            </div>
            <p className="text-sm leading-relaxed opacity-60 max-w-xs">
              Tu autoescuela de confianza en Villanueva del Pardillo. Formación de calidad para obtener tu carnet.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-background mb-5 text-xs uppercase tracking-[0.2em]">Contacto</h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3 group">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 opacity-40 group-hover:opacity-70 transition-opacity" />
                <span className="opacity-70 group-hover:opacity-100 transition-opacity">C/ Concepción, 61, 28229 Villanueva del Pardillo (Madrid)</span>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone className="w-4 h-4 shrink-0 opacity-40 group-hover:opacity-70 transition-opacity" />
                <span className="opacity-70 group-hover:opacity-100 transition-opacity">658 474 814</span>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail className="w-4 h-4 shrink-0 opacity-40 group-hover:opacity-70 transition-opacity" />
                <span className="opacity-70 group-hover:opacity-100 transition-opacity">info@autoescuelago.es</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-semibold text-background mb-5 text-xs uppercase tracking-[0.2em]">Horario</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 shrink-0 opacity-40" />
                <span className="opacity-70">Lunes - Viernes: 10:00 - 13:00 y 16:00 - 20:00</span>
              </li>
              <li className="pl-7 opacity-70">
                Sábados y domingos: <span className="text-red-400 font-semibold">Cerrados</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs opacity-40">
          <span>© 2026 AutoescuelaGO. Todos los derechos reservados.</span>
          <div className="flex gap-6">
            <Link to="/politica-privacidad" className="hover:opacity-100 transition-opacity">Política de privacidad</Link>
            <a href="#" className="hover:opacity-100 transition-opacity">Aviso legal</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
