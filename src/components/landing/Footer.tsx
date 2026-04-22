import { Car, MapPin, Phone, Mail, Clock, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative bg-foreground text-background/80 pt-20 pb-8 overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* Subtle orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-primary/[0.05] rounded-full blur-3xl" />

      <div className="container mx-auto px-3 sm:px-4 relative z-10">
        {/* Top section: Brand + Navigation columns */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-14">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Car className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-background font-['Space_Grotesk'] tracking-tight">
                AutoescuelaGO
              </span>
            </div>
            <p className="text-sm leading-relaxed opacity-60 max-w-xs">
              Tu autoescuela digital de confianza en la Sierra de Madrid. Formación moderna, profesional y cercana.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="font-semibold text-background mb-5 text-xs uppercase tracking-[0.2em]">Enlaces</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/inicio" className="opacity-70 hover:opacity-100 hover:text-primary transition-all inline-flex items-center gap-1.5 group">
                  Inicio
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link to="/la-teorica" className="opacity-70 hover:opacity-100 hover:text-primary transition-all inline-flex items-center gap-1.5 group">
                  La Teórica
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link to="/las-practicas" className="opacity-70 hover:opacity-100 hover:text-primary transition-all inline-flex items-center gap-1.5 group">
                  Las Prácticas
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link to="/practicas-virtuales" className="opacity-70 hover:opacity-100 hover:text-primary transition-all inline-flex items-center gap-1.5 group">
                  Prácticas Virtuales
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link to="/autoescuela-online" className="opacity-70 hover:opacity-100 hover:text-primary transition-all inline-flex items-center gap-1.5 group">
                  Autoescuela Online
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link to="/autoescuelas-ready2go" className="opacity-70 hover:opacity-100 hover:text-primary transition-all inline-flex items-center gap-1.5 group">
                  Nuestros Centros
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-semibold text-background mb-5 text-xs uppercase tracking-[0.2em]">Contacto</h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3 group">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary/70 group-hover:text-primary transition-colors" />
                <div className="opacity-70 group-hover:opacity-100 transition-opacity">
                  <p className="font-medium text-background/90">Villanueva del Pardillo</p>
                  <p className="text-xs opacity-80">C/ Concepción, 61 — 28229 Madrid</p>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary/70 group-hover:text-primary transition-colors" />
                <div className="opacity-70 group-hover:opacity-100 transition-opacity">
                  <p className="font-medium text-background/90">Valdemorillo</p>
                  <p className="text-xs opacity-80">C/ Covachuelas, 18 — 28210 Madrid</p>
                </div>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone className="w-4 h-4 shrink-0 text-primary/70 group-hover:text-primary transition-colors" />
                <a href="tel:+34645343117" className="opacity-70 group-hover:opacity-100 transition-opacity">
                  645 34 31 17
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail className="w-4 h-4 shrink-0 text-primary/70 group-hover:text-primary transition-colors" />
                <a href="mailto:info@autoescuelago.es" className="opacity-70 group-hover:opacity-100 transition-opacity">
                  info@autoescuelago.es
                </a>
              </li>
            </ul>
          </div>

          {/* Horarios */}
          <div>
            <h4 className="font-semibold text-background mb-5 text-xs uppercase tracking-[0.2em]">Horarios</h4>
            <div className="space-y-4 text-sm">
              {/* Pardillo */}
              <div className="rounded-xl border border-background/10 bg-background/[0.03] p-3.5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <p className="font-semibold text-background/90 text-xs uppercase tracking-wider">V. del Pardillo</p>
                </div>
                <div className="space-y-1 text-xs opacity-70">
                  <div className="flex justify-between gap-2">
                    <span>Mar y Jue</span>
                    <span className="font-medium text-background/85">11–13 / 17:30–20:30</span>
                  </div>
                </div>
              </div>

              {/* Valdemorillo */}
              <div className="rounded-xl border border-background/10 bg-background/[0.03] p-3.5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <p className="font-semibold text-background/90 text-xs uppercase tracking-wider">Valdemorillo</p>
                </div>
                <div className="space-y-1 text-xs opacity-70">
                  <div className="flex justify-between gap-2">
                    <span>Lun, Mié y Vie</span>
                    <span className="font-medium text-background/85">11–13 / 17:30–20:30</span>
                  </div>
                </div>
              </div>

              {/* Prácticas */}
              <div className="flex items-center gap-2 text-xs opacity-70 pl-1">
                <Clock className="w-3.5 h-3.5 text-primary/70" />
                <span>Prácticas L–V · 8:00 – 22:00</span>
              </div>
              <div className="flex items-center gap-2 text-xs opacity-60 pl-1">
                <span>Sáb y Dom:</span>
                <span className="text-red-400 font-semibold">Cerrado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-background/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs opacity-50">
          <span>© 2026 AutoescuelaGO. Todos los derechos reservados.</span>
          <div className="flex gap-6">
            <Link to="/politica-privacidad" className="hover:opacity-100 hover:text-primary transition-all">Política de privacidad</Link>
            <Link to="/aviso-legal" className="hover:opacity-100 hover:text-primary transition-all">Aviso legal</Link>
            <Link to="/condiciones-contratacion" className="hover:opacity-100 hover:text-primary transition-all">Condiciones de contratación</Link>
            <Link to="/cookies" className="hover:opacity-100 hover:text-primary transition-all">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
