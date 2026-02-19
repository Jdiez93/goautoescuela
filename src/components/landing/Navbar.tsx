import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Car, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();

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
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              className="w-10 h-10 rounded-xl bg-hero-gradient flex items-center justify-center"
              whileHover={{ scale: 1.08, rotate: -3 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Car className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <span className="text-lg sm:text-xl font-bold font-['Space_Grotesk'] tracking-tight">
              Autoescuela<span className="text-gradient">GO</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="rounded-xl hover:bg-primary/10 transition-colors">Mi panel</Button>
                </Link>
                <Button variant="ghost" size="sm" className="rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" onClick={signOut}>
                  <LogOut className="w-4 h-4 mr-1" /> Salir
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="rounded-xl hover:bg-primary/10 transition-colors">Iniciar sesión</Button>
                </Link>
                <Link to="/registro">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                    <Button size="sm" className="bg-hero-gradient hover:opacity-90 text-primary-foreground rounded-xl shadow-md shadow-primary/20">
                      Registrarse
                    </Button>
                  </motion.div>
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <motion.button
            className="md:hidden p-2 rounded-xl hover:bg-muted transition-colors"
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
            className="md:hidden bg-background/80 backdrop-blur-2xl border-b border-border/40"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsOpen(false)}>
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
