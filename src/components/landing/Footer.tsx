import { Car, MapPin, Phone, Mail, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background/80 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-hero-gradient flex items-center justify-center">
                <Car className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-background font-['Space_Grotesk']">
                AutoescuelaGO
              </span>
            </div>
            <p className="text-sm leading-relaxed opacity-70">
              Tu autoescuela de confianza en Villanueva del Pardillo. Formación de calidad para obtener tu carnet.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-background mb-4 text-sm uppercase tracking-wider">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 opacity-70" />
                <span>Villanueva del Pardillo, Madrid</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 opacity-70" />
                <span>918 15 XX XX</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 opacity-70" />
                <span>info@autoescuelago.es</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-semibold text-background mb-4 text-sm uppercase tracking-wider">Horario</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 shrink-0 opacity-70" />
                <span>Lun - Vie: 9:00 - 21:00</span>
              </li>
              <li className="pl-6">Sáb: 9:00 - 14:00</li>
              <li className="pl-6">Dom: Cerrado</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs opacity-60">
          <span>© 2026 AutoescuelaGO. Todos los derechos reservados.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:opacity-100">Política de privacidad</a>
            <a href="#" className="hover:opacity-100">Aviso legal</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
