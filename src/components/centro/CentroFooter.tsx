import { MapPin, Phone, Mail, Clock, ArrowUpRight, Instagram, Music2 } from "lucide-react";
import { Link } from "react-router-dom";
import logoReady2Go from "@/assets/logo-ready2go-oficial.png";

export default function CentroFooter() {
  return (
    <footer className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen max-w-none bg-foreground text-background/80 pt-20 pb-8 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-primary/[0.05] rounded-full blur-3xl" />

      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-14">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-5">
              <img src={logoReady2Go} alt="Ready2Go" className="h-20 w-auto object-contain" />
              <span className="text-xl font-bold text-background font-['Space_Grotesk'] tracking-tight">
                Ready2Go
              </span>
            </div>
            <p className="text-sm leading-relaxed opacity-60 max-w-xs">
              Centro de Estudio y Formación. Acompañamos tu aprendizaje con metodología, recursos y un equipo cercano para que alcances tus objetivos.
            </p>

            <div className="mt-5">
              <h4 className="font-semibold text-background mb-3 text-xs uppercase tracking-[0.2em]">Síguenos</h4>
              <div className="flex items-center gap-2.5">
                {[
                  { Icon: Instagram, label: "Instagram", href: "https://www.instagram.com/campus.ready2go" },
                  { Icon: Music2, label: "TikTok", href: "https://www.tiktok.com/@campus.ready2go" },
                ].map(({ Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-xl border border-background/10 bg-background/[0.03] flex items-center justify-center text-background/70 hover:text-primary hover:border-primary/40 hover:bg-primary/10 transition-all cursor-pointer"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Enlaces */}
          <div>
            <h4 className="font-semibold text-background mb-5 text-xs uppercase tracking-[0.2em]">Enlaces</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/consejos" className="opacity-70 hover:opacity-100 hover:text-primary transition-all inline-flex items-center gap-1.5 group">
                  Centro de estudio
                  <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              </li>
              <li>
                <Link to="/actualidad" className="opacity-70 hover:opacity-100 hover:text-primary transition-all inline-flex items-center gap-1.5 group">
                  Centro de formación
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
                <p className="text-xs opacity-80">Calle Santa Ana, 1 — 28229 Madrid</p>
              </div>
            </li>
            <li className="flex items-center gap-3 group">
              <Phone className="w-4 h-4 shrink-0 text-primary/70 group-hover:text-primary transition-colors" />
              <a href="tel:+34658474814" className="opacity-70 group-hover:opacity-100 transition-opacity">
                658 47 48 14
              </a>
            </li>
            <li className="flex items-start gap-3 group">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary/70 group-hover:text-primary transition-colors" />
              <div className="opacity-70 group-hover:opacity-100 transition-opacity">
                <p className="font-medium text-background/90">Valdemorillo</p>
                <p className="text-xs opacity-80">C. Covachuelas, 18 — 28210 Madrid</p>
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
                    <span>Lun a Vie</span>
                    <span className="font-medium text-background/85">10–13 / 16:00–20:00</span>
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
                    <span>Lun a Vie</span>
                    <span className="font-medium text-background/85">10–13 / 16:00–20:00</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs opacity-60 pl-1">
                <span>Sáb y Dom:</span>
                <span className="text-red-400 font-semibold">Cerrado</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col gap-4 text-xs opacity-60">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <span>© 2026 Ready2Go. Todos los derechos reservados.</span>
            <div className="flex gap-6">
              <Link to="/politica-privacidad" className="hover:opacity-100 hover:text-primary transition-all">Política de privacidad</Link>
              <Link to="/aviso-legal" className="hover:opacity-100 hover:text-primary transition-all">Aviso legal</Link>
              <Link to="/cookies" className="hover:opacity-100 hover:text-primary transition-all">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
