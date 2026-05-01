import { motion } from "framer-motion";
import { Cookie, Settings2, RotateCcw, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { useCookieConsent } from "@/contexts/CookieConsentContext";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const cookieTable = [
  {
    name: "Técnicas / Necesarias",
    owner: "Propias",
    purpose: "Sesión de usuario, autenticación, seguridad y registro de la preferencia de consentimiento.",
    duration: "Sesión / hasta 12 meses",
  },
  {
    name: "Personalización",
    owner: "Propias",
    purpose: "Recordar preferencias del usuario (sede preferida, vista, idioma).",
    duration: "Hasta 12 meses",
  },
  {
    name: "Analíticas",
    owner: "Propias y de terceros (p. ej. Google Analytics)",
    purpose: "Medir el uso de la web de forma agregada para mejorar el servicio.",
    duration: "Hasta 24 meses",
  },
  {
    name: "Publicidad / Marketing",
    owner: "Propias y de terceros (p. ej. Meta, Google Ads)",
    purpose: "Mostrar contenido relevante y medir la eficacia de campañas.",
    duration: "Hasta 13 meses",
  },
];

const sections = [
  {
    title: "1. ¿Qué son las cookies?",
    content:
      "Las cookies son pequeños archivos de texto que los sitios web descargan en tu dispositivo (ordenador, móvil o tableta) cuando los visitas. Permiten que la página recuerde tus acciones y preferencias durante un periodo de tiempo, de modo que no tengas que reconfigurarlos cada vez que vuelves o navegas de una página a otra. También se utilizan para analizar el uso del sitio y, en algunos casos, para personalizar contenidos o mostrar publicidad.",
  },
  {
    title: "2. ¿Quién utiliza las cookies en este sitio?",
    content:
      "En Ready2Go utilizamos cookies propias (gestionadas por nosotros) y, cuando el usuario lo consiente, cookies de terceros gestionadas por proveedores externos. Entre los terceros que pueden instalar cookies se incluyen, según los servicios activados:",
    list: [
      "Stripe — procesamiento seguro de pagos.",
      "Supabase — autenticación y gestión de sesión.",
      "Google (Analytics / Ads) — analítica de uso y publicidad, si están activadas.",
      "Meta (Facebook / Instagram) — píxeles publicitarios, si están activadas.",
      "Resend — envío de correos transaccionales (no instala cookies en el navegador del usuario).",
    ],
    footer:
      "Puedes consultar las políticas de privacidad de cada uno de estos terceros en sus propios sitios web para conocer en detalle cómo tratan tus datos.",
  },
  {
    title: "3. Tipos de cookies utilizadas y finalidad",
    content:
      "A continuación se detallan las categorías de cookies utilizadas, su titularidad, finalidad y duración orientativa:",
    table: true,
  },
  {
    title: "4. Cómo aceptar, rechazar, configurar y revocar el consentimiento",
    content:
      "Al acceder por primera vez a la web se muestra un banner desde el que puedes Aceptar todas las cookies, Rechazarlas todas (excepto las técnicas, que son imprescindibles) o acceder al panel de Configuración para activar o desactivar cada categoría de forma granular. Retirar el consentimiento es tan fácil como otorgarlo: en cualquier momento puedes volver a abrir el panel desde el botón inferior de esta página o desde el enlace 'Cookies' del pie de página.",
  },
  {
    title: "5. Plazo de conservación",
    content:
      "El plazo de conservación depende del tipo de cookie y de su finalidad. Las cookies de sesión se eliminan al cerrar el navegador; las cookies persistentes pueden permanecer entre algunos minutos y un máximo de 24 meses, según la finalidad indicada en la tabla anterior. La preferencia de consentimiento que el usuario expresa se conserva durante 12 meses, transcurridos los cuales se vuelve a solicitar.",
  },
  {
    title: "6. Transferencias internacionales de datos",
    content:
      "Algunos de los terceros indicados (por ejemplo Google, Meta o Stripe) pueden tratar datos fuera del Espacio Económico Europeo, principalmente en Estados Unidos. En esos casos, dichos proveedores aplican las garantías exigidas por el Reglamento General de Protección de Datos (RGPD), tales como las Cláusulas Contractuales Tipo aprobadas por la Comisión Europea o, cuando proceda, su adhesión al EU–US Data Privacy Framework. Puedes consultar las garantías concretas en las políticas de privacidad de cada proveedor.",
  },
  {
    title: "7. Decisiones automatizadas y elaboración de perfiles",
    content:
      "Ready2Go no realiza decisiones automatizadas ni elaboración de perfiles que produzcan efectos jurídicos en los usuarios o que les afecten significativamente de modo similar a través de las cookies utilizadas en este sitio.",
  },
  {
    title: "8. Más información",
    content:
      "Para conocer el resto de información exigida por el RGPD (responsable del tratamiento, derechos del usuario, plazos generales, contacto, etc.), consulta nuestra",
    link: { label: "Política de Privacidad", to: "/politica-privacidad" },
  },
];

export default function PoliticaCookies() {
  const { openSettings, revokeConsent, consent, hasDecided } = useCookieConsent();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
              <Cookie className="w-7 h-7 text-primary" />
            </div>
            <span className="block text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-2">
              Legal
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] tracking-tight text-foreground">
              Política de Cookies
            </h1>
            <div className="mt-4 h-1 w-16 mx-auto rounded-full bg-primary/40" />
          </motion.div>

          {/* Quick actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="rounded-2xl border border-primary/30 bg-card p-5 sm:p-6 mb-10 shadow-sm"
          >
            <h2 className="font-semibold font-['Space_Grotesk'] text-foreground mb-2">
              Tu consentimiento
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              {hasDecided
                ? "Ya has expresado tu preferencia de cookies. Puedes modificarla o revocarla en cualquier momento."
                : "Aún no has expresado tu preferencia de cookies. Puedes hacerlo ahora."}
            </p>

            {hasDecided && consent && (
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  { k: "necessary", label: "Técnicas" },
                  { k: "preferences", label: "Personalización" },
                  { k: "analytics", label: "Analíticas" },
                  { k: "marketing", label: "Marketing" },
                ].map(({ k, label }) => {
                  const active = (consent as Record<string, boolean>)[k];
                  return (
                    <span
                      key={k}
                      className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border ${
                        active
                          ? "bg-primary/10 text-primary border-primary/30"
                          : "bg-muted text-muted-foreground border-border"
                      }`}
                    >
                      {active ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      {label}
                    </span>
                  );
                })}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={openSettings} size="sm" className="gap-1.5">
                <Settings2 className="w-4 h-4" />
                Configurar cookies
              </Button>
              <Button onClick={revokeConsent} size="sm" variant="outline" className="gap-1.5">
                <RotateCcw className="w-4 h-4" />
                Revocar consentimiento
              </Button>
            </div>
          </motion.div>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section, i) => (
              <motion.article
                key={i}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 shadow-sm"
              >
                <h2 className="text-lg font-semibold font-['Space_Grotesk'] text-foreground mb-3">
                  {section.title}
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {section.content}{" "}
                  {section.link && (
                    <Link
                      to={section.link.to}
                      className="text-primary font-medium hover:underline"
                    >
                      {section.link.label}
                    </Link>
                  )}
                  {section.link && "."}
                </p>

                {section.list && (
                  <ul className="mt-4 space-y-2 pl-5">
                    {section.list.map((item, j) => (
                      <li
                        key={j}
                        className="relative text-sm leading-relaxed text-muted-foreground before:content-[''] before:absolute before:-left-4 before:top-[0.55em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/50"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {section.footer && (
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground italic">
                    {section.footer}
                  </p>
                )}

                {section.table && (
                  <div className="mt-5 overflow-x-auto rounded-xl border border-border/60">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                          <th className="px-4 py-3 font-semibold">Categoría</th>
                          <th className="px-4 py-3 font-semibold">Titular</th>
                          <th className="px-4 py-3 font-semibold">Finalidad</th>
                          <th className="px-4 py-3 font-semibold">Duración</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cookieTable.map((row, idx) => (
                          <tr
                            key={idx}
                            className="border-t border-border/60 align-top hover:bg-muted/30 transition-colors"
                          >
                            <td className="px-4 py-3 font-medium text-foreground">{row.name}</td>
                            <td className="px-4 py-3 text-muted-foreground">{row.owner}</td>
                            <td className="px-4 py-3 text-muted-foreground">{row.purpose}</td>
                            <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                              {row.duration}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
