import { motion, AnimatePresence } from "framer-motion";
import { Cookie, Settings2, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCookieConsent } from "@/contexts/CookieConsentContext";

export default function CookieBanner() {
  const { showBanner, acceptAll, rejectAll, openSettings } = useCookieConsent();

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-3 right-3 sm:left-6 sm:right-6 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-[100]"
          role="dialog"
          aria-live="polite"
          aria-label="Aviso de cookies"
        >
          <div className="relative rounded-2xl border border-primary/30 bg-card/95 backdrop-blur-xl shadow-2xl p-5 sm:p-6 overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

            <div className="flex items-start gap-3 mb-3 relative">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Cookie className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold font-['Space_Grotesk'] text-foreground text-base">
                  Usamos cookies
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Para mejorar tu experiencia
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-4 relative">
              Utilizamos cookies propias y de terceros para fines técnicos, analíticos y de
              personalización. Puedes aceptarlas todas, rechazarlas o configurar tus preferencias.
              Más información en nuestra{" "}
              <Link to="/cookies" className="text-primary font-medium hover:underline">
                Política de cookies
              </Link>
              .
            </p>

            <div className="flex flex-col sm:flex-row gap-2 relative">
              <Button
                onClick={acceptAll}
                size="sm"
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-1.5"
              >
                <Check className="w-4 h-4" />
                Aceptar todas
              </Button>
              <Button
                onClick={rejectAll}
                size="sm"
                variant="outline"
                className="flex-1 gap-1.5"
              >
                <X className="w-4 h-4" />
                Rechazar
              </Button>
              <Button
                onClick={openSettings}
                size="sm"
                variant="ghost"
                className="sm:flex-none gap-1.5"
                aria-label="Configurar cookies"
              >
                <Settings2 className="w-4 h-4" />
                <span className="sm:hidden">Configurar</span>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
