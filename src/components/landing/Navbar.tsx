import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logoReady2Go from "@/assets/logo-ready2go-oficial.jpeg";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Teórica", to: "/la-teorica" },
  { label: "Prácticas", to: "/las-practicas" },
  { label: "Centro de formación", to: "/actualidad" },
  { label: "Centro de estudios", to: "/consejos" },
  { label: "Autoescuelas Ready2Go", to: "/autoescuelas-ready2go" },
  { label: "Autoescuela Online", to: "/autoescuela-online" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut, isTeacher } = useAuth();
  const location = useLocation();
  const panelHref = isTeacher ? "/dashboard-profesor" : "/dashboard";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/60 backdrop-blur-2xl border-b border-border/40 shadow-[0_1px_12px_-4px_hsl(var(--foreground)/0.08)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0 min-w-0">
            <motion.img
              src={logoReady2Go}
              alt="Ready2Go"
              className="h-8 sm:h-10 md:h-12 w-auto object-contain shrink-0"
              whileHover={{ scale: 1.08, rotate: -3 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            />
            <span className="text-base sm:text-lg md:text-xl font-bold font-['Space_Grotesk'] tracking-tight truncate">
              Ready2Go
            </span>
          </Link>

          {/* Center nav links — desktop */}
          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link key={link.to} to={link.to}>
                  <span
                    className={cn(
                      "relative px-2.5 xl:px-3 py-2 text-xs xl:text-sm font-medium rounded-lg transition-colors duration-200",
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Right actions — desktop */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <Link to="/matriculate" className="hidden lg:inline-block">
              <span className="relative px-3 py-2 text-xs xl:text-sm font-bold rounded-lg text-[hsl(174,72%,45%)] hover:text-[hsl(174,80%,55%)] transition-all duration-300 hover:[text-shadow:0_0_12px_hsl(174_80%_55%/0.9),0_0_24px_hsl(174_80%_55%/0.6)]">
                Matricúlate
              </span>
            </Link>
            {user ? (
              <>
                <Link to={panelHref}>
                  <Button variant="ghost" size="sm" className="rounded-xl hover:bg-primary/10 transition-colors">Mi panel</Button>
                </Link>
                <Button variant="ghost" size="sm" className="rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" onClick={signOut}>
                  <LogOut className="w-4 h-4 mr-1" /> Salir
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl hover:bg-primary/10 transition-colors" aria-label="Acceso de usuario">
                    <UserCircle className="w-9 h-9" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 rounded-xl">
                  <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                    <Link to="/login">Iniciar sesión</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg cursor-pointer">
                    <Link to="/registro">Registrarse</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile toggle */}
          <motion.button
            className="lg:hidden p-2 rounded-xl hover:bg-muted transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden bg-background/80 backdrop-blur-2xl border-b border-border/40"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to;
                return (
                  <Link key={link.to} to={link.to} onClick={() => setIsOpen(false)}>
                    <div
                      className={cn(
                        "px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      {link.label}
                    </div>
                  </Link>
                );
              })}
              <Link to="/matriculate" onClick={() => setIsOpen(false)}>
                <div className="px-4 py-2.5 rounded-xl text-sm font-bold text-[hsl(174,72%,45%)] hover:[text-shadow:0_0_12px_hsl(174_80%_55%/0.9)] transition-all">
                  Matricúlate
                </div>
              </Link>
              <div className="h-px bg-border/60 my-2" />
              {user ? (
                <>
                  <Link to={panelHref} onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full rounded-xl">Mi panel</Button>
                  </Link>
                  <Button className="w-full rounded-xl" variant="ghost" onClick={() => { signOut(); setIsOpen(false); }}>
                    <LogOut className="w-4 h-4 mr-1" /> Cerrar sesión
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full rounded-xl">Iniciar sesión</Button>
                  </Link>
                  <Link to="/registro" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-hero-gradient text-primary-foreground rounded-xl">Registrarse</Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
