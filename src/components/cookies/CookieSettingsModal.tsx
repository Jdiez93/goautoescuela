import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Sliders, BarChart3, Megaphone, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useCookieConsent } from "@/contexts/CookieConsentContext";

const categories = [
  {
    key: "necessary" as const,
    icon: Lock,
    title: "Cookies técnicas (necesarias)",
    description:
      "Imprescindibles para el funcionamiento del sitio: sesión, seguridad, balance de carga y preferencia de consentimiento. No pueden desactivarse.",
    duration: "Sesión / hasta 12 meses",
    required: true,
  },
  {
    key: "preferences" as const,
    icon: Sliders,
    title: "Personalización",
    description:
      "Permiten recordar tus preferencias (idioma, sede preferida, vista del dashboard) para ofrecerte una experiencia más cómoda.",
    duration: "Hasta 12 meses",
    required: false,
  },
  {
    key: "analytics" as const,
    icon: BarChart3,
    title: "Analíticas",
    description:
      "Nos ayudan a entender cómo se usa la web (páginas más vistas, errores, rendimiento) para mejorarla. Datos agregados y anónimos.",
    duration: "Hasta 24 meses",
    required: false,
  },
  {
    key: "marketing" as const,
    icon: Megaphone,
    title: "Publicidad y marketing",
    description:
      "Se usan para mostrarte contenido y campañas relevantes y medir la eficacia de nuestras comunicaciones. Pueden incluir terceros.",
    duration: "Hasta 13 meses",
    required: false,
  },
];

export default function CookieSettingsModal() {
  const { showSettings, closeSettings, savePreferences, consent, acceptAll, rejectAll } =
    useCookieConsent();

  const [prefs, setPrefs] = useState({
    preferences: false,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    if (showSettings) {
      setPrefs({
        preferences: consent?.preferences ?? false,
        analytics: consent?.analytics ?? false,
        marketing: consent?.marketing ?? false,
      });
    }
  }, [showSettings, consent]);

  return (
    <AnimatePresence>
      {showSettings && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[110] bg-foreground/60 backdrop-blur-sm"
            onClick={closeSettings}
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[120] flex items-center justify-center p-4 pointer-events-none"
            role="dialog"
            aria-modal="true"
            aria-label="Configuración de cookies"
          >
            <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-primary/30 bg-card shadow-2xl overflow-hidden pointer-events-auto">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

              {/* Header */}
              <div className="p-6 border-b border-border/60 flex items-start gap-3 shrink-0">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-['Space_Grotesk'] text-foreground">
                    Configuración de cookies
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Elige qué tipos de cookies quieres permitir. Puedes cambiar esta decisión en
                    cualquier momento.
                  </p>
                </div>
              </div>

              {/* Categories */}
              <div className="overflow-y-auto p-6 space-y-3 flex-1">
                {categories.map((cat, i) => {
                  const Icon = cat.icon;
                  const enabled = cat.required ? true : prefs[cat.key as keyof typeof prefs];
                  return (
                    <motion.div
                      key={cat.key}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 + i * 0.06, duration: 0.4 }}
                      className="rounded-xl border border-border/60 bg-background/60 p-4 hover:border-primary/40 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-sm text-foreground">{cat.title}</h3>
                              {cat.required && (
                                <span className="text-[10px] uppercase tracking-wider font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                  Siempre activa
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                              {cat.description}
                            </p>
                            <p className="text-[11px] text-muted-foreground/80 mt-2">
                              <span className="font-semibold">Duración:</span> {cat.duration}
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={enabled}
                          disabled={cat.required}
                          onCheckedChange={(v) =>
                            !cat.required &&
                            setPrefs((p) => ({ ...p, [cat.key]: v }))
                          }
                          aria-label={`Activar ${cat.title}`}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Footer actions */}
              <div className="p-6 border-t border-border/60 flex flex-col sm:flex-row gap-2 shrink-0 bg-background/40">
                <Button variant="outline" size="sm" onClick={rejectAll} className="flex-1">
                  Rechazar todas
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => savePreferences(prefs)}
                  className="flex-1"
                >
                  Guardar selección
                </Button>
                <Button
                  size="sm"
                  onClick={acceptAll}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Aceptar todas
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
