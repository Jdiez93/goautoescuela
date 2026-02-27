import { motion } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

const sections = [
  {
    title: "1. Responsable del tratamiento",
    content:
      "El responsable del tratamiento de sus datos personales es [NOMBRE DE LA AUTOESCUELA O RAZÓN SOCIAL], con NIF [NÚMERO DE CIF], domicilio en [DIRECCIÓN COMPLETA] y correo electrónico de contacto [EMAIL DE CONTACTO].",
  },
  {
    title: "2. Finalidad del tratamiento",
    content:
      "En esta autoescuela tratamos la información que nos facilitan las personas interesadas con las siguientes finalidades:",
    list: [
      "Gestionar la matriculación y formación teórica y práctica para la obtención de permisos de conducir.",
      "Tramitar la documentación necesaria ante la Dirección General de Tráfico (DGT).",
      "Gestionar la agenda de clases, exámenes y comunicaciones relacionadas con el servicio contratado.",
      "Realizar la gestión administrativa, facturación y cobro de los servicios.",
      "Enviar comunicaciones comerciales sobre nuestros cursos si el usuario lo ha autorizado expresamente.",
    ],
  },
  {
    title: "3. Legitimación",
    content: "La base legal para el tratamiento de sus datos es:",
    list: [
      "La ejecución del contrato de enseñanza vial suscrito con el alumno.",
      "El cumplimiento de obligaciones legales ante la Jefatura Central de Tráfico.",
      "El consentimiento del interesado para consultas a través de formularios web o suscripciones.",
    ],
  },
  {
    title: "4. Conservación de los datos",
    content:
      "Los datos personales proporcionados se conservarán mientras se mantenga la relación mercantil o durante los años necesarios para cumplir con las obligaciones legales (habitualmente 5 años tras la obtención del permiso por responsabilidades administrativas).",
  },
  {
    title: "5. Destinatarios y cesiones",
    content:
      "Los datos no se cederán a terceros salvo obligación legal. Las cesiones previstas son:",
    list: [
      "Dirección General de Tráfico (DGT).",
      "Organismos públicos competentes en materia de educación y transporte.",
      "Entidades bancarias para el cobro de servicios.",
      "Proveedores de servicios tecnológicos (alojamiento web y software de gestión) bajo contrato de encargado de tratamiento.",
    ],
  },
  {
    title: "6. Derechos del usuario",
    content:
      "Cualquier persona tiene derecho a obtener confirmación sobre si estamos tratando sus datos. Los interesados tienen derecho a:",
    list: [
      "Acceder a sus datos personales.",
      "Solicitar la rectificación de datos inexactos.",
      "Solicitar su supresión cuando, entre otros motivos, los datos ya no sean necesarios para los fines que fueron recogidos.",
      "Solicitar la limitación u oposición de su tratamiento.",
    ],
    footer:
      "Para ejercer estos derechos, puede enviar un correo electrónico a [EMAIL DE CONTACTO] adjuntando copia de su DNI o documento equivalente.",
  },
  {
    title: "7. Procedencia de los datos",
    content:
      "Los datos personales que tratamos proceden directamente del interesado a través de formularios de inscripción, contratos en oficina o consultas web. Las categorías de datos tratados son: Identificativos (DNI, Nombre, Dirección), Datos de contacto, y Datos de aptitud psicotécnica necesarios para el trámite oficial.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.1 + i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function PoliticaPrivacidad() {
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
            className="text-center mb-14"
          >
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-3">
              Legal
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] tracking-tight text-foreground">
              Política de Privacidad
            </h1>
            <div className="mt-4 h-1 w-16 mx-auto rounded-full bg-primary/40" />
          </motion.div>

          {/* Sections */}
          <div className="space-y-8">
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
                  {section.content}
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
              </motion.article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
