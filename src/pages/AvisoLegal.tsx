import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

type Section = {
  title: string;
  content?: string;
  list?: { label?: string; value: string }[];
  bullets?: string[];
  paragraphs?: string[];
  footer?: React.ReactNode;
};

const sections: Section[] = [
  {
    title: "1. Datos identificativos",
    content:
      "En cumplimiento de lo dispuesto en la Ley 34/2002, de 11 de julio, de servicios de la sociedad de la información y de comercio electrónico (LSSI-CE), se informa que el presente sitio web es titularidad de:",
    list: [
      { label: "Titular", value: "Valentín Cobo Fernández" },
      { label: "Nombre comercial", value: "Autoescuela Monkey Drive, S.L." },
      { label: "NIF/CIF", value: "B-05398987" },
      { label: "Domicilio social", value: "C/ Concepción, 61, 28229 Villanueva del Pardillo (Madrid)" },
      { label: "Correo electrónico", value: "info@autoescuelago.es" },
      { label: "Teléfono", value: "645 34 31 17" },
    ],
    paragraphs: [
      "Actividad: escuela particular de conductores dedicada a la formación vial, información sobre permisos y licencias de conducción, gestión de reservas de clases y contratación online de clases y servicios formativos a través del área privada del alumno.",
      "Autorización administrativa: Autoescuela Monkey Drive S.L. dispone de la correspondiente autorización administrativa para el ejercicio de la actividad de escuela particular de conductores, otorgada por la Jefatura Provincial de Tráfico de Madrid, con número de autorización o expediente [PENDIENTE DE COMPLETAR].",
    ],
  },
  {
    title: "2. Objeto",
    paragraphs: [
      "El presente Aviso Legal regula el acceso, navegación y uso del sitio web autoescuelago.es, así como las responsabilidades derivadas de la utilización de sus contenidos, servicios y funcionalidades.",
      "A través de este sitio web, los usuarios pueden acceder a información sobre los servicios de la autoescuela, contactar con el centro, registrarse en el área privada de alumno, reservar clases y contratar determinados servicios formativos, de acuerdo con las condiciones que resulten aplicables en cada caso.",
    ],
  },
  {
    title: "3. Condiciones de uso del sitio web",
    paragraphs: [
      "El acceso y uso de este sitio web atribuye la condición de usuario e implica la aceptación plena y sin reservas del presente Aviso Legal.",
      "El usuario se compromete a utilizar la web, sus contenidos y servicios de conformidad con la ley, la buena fe, el orden público y el presente Aviso Legal. Queda prohibido el uso del sitio web con fines ilícitos o lesivos para Autoescuela Monkey Drive, S.L. o terceros, o que puedan causar perjuicio o impedir el normal funcionamiento del sitio web.",
      "El usuario responderá de la veracidad y exactitud de los datos facilitados a través de los formularios del sitio web y, en su caso, del uso que haga de sus credenciales de acceso.",
    ],
  },
  {
    title: "4. Área privada del alumno",
    paragraphs: [
      "El acceso al área privada o dashboard del alumno requiere registro previo y/o asignación de credenciales por parte de la autoescuela.",
      "Las claves de acceso son personales e intransferibles. El usuario se compromete a custodiar diligentemente sus credenciales y a no cederlas a terceros. Cualquier uso realizado mediante dichas credenciales se considerará efectuado por el usuario titular, salvo prueba en contrario.",
      "Autoescuela Monkey Drive, S.L. podrá suspender, restringir o cancelar el acceso al área privada cuando detecte un uso fraudulento, indebido o contrario a las presentes condiciones.",
    ],
  },
  {
    title: "5. Reservas de clases y contratación online",
    content: "A través del área privada, el alumno podrá, en su caso:",
    bullets: [
      "Reservar clases prácticas o teóricas con el profesor asignado o disponible.",
      "Consultar disponibilidad en tiempo real.",
      "Comprar clases, bonos o servicios formativos.",
      "Gestionar determinadas solicitudes relacionadas con su formación.",
    ],
    paragraphs: [
      "La reserva de clases estará sujeta a la disponibilidad existente en cada momento.",
      "La contratación de clases, bonos u otros servicios realizada a través del sitio web tendrá la consideración de contratación electrónica y se regirá, además de por el presente Aviso Legal, por las Condiciones Generales de Contratación que estarán disponibles para el usuario antes de finalizar el proceso de compra.",
      "La compra o reserva de clases no garantiza por sí misma la obtención de un permiso o licencia de conducción, ni la superación de exámenes teóricos o prácticos, al depender ello del cumplimiento de los requisitos legales y de la aptitud del alumno.",
      "Autoescuela Monkey Drive S.L. se reserva el derecho de modificar horarios, profesores o clases por causas organizativas, técnicas, de seguridad, fuerza mayor o cualquier otra causa justificada, informando al alumno por los medios de contacto facilitados.",
    ],
  },
  {
    title: "6. Propiedad intelectual e industrial",
    paragraphs: [
      "Todos los contenidos del sitio web, incluyendo, a título enunciativo y no limitativo, textos, imágenes, diseños, logotipos, iconos, software, estructura, diseño y código fuente, son titularidad de Autoescuela Monkey Drive S.L. o bien se dispone de los derechos o licencias necesarias para su uso, y están protegidos por la normativa de propiedad intelectual e industrial.",
      "Queda prohibida la reproducción, distribución, transformación, comunicación pública, puesta a disposición o cualquier otra forma de explotación, total o parcial, de los contenidos del sitio web sin autorización previa y expresa del titular.",
    ],
  },
  {
    title: "7. Responsabilidad",
    content:
      "Autoescuela Monkey Drive S.L. no garantiza la disponibilidad permanente del sitio web ni la inexistencia de errores en el acceso a sus contenidos, aunque adoptará las medidas razonables para evitarlos o, en su caso, subsanarlos. En particular, no será responsable de:",
    bullets: [
      "Los daños o perjuicios derivados de interrupciones, averías, caídas de red o desconexiones.",
      "Los errores producidos por causas ajenas al titular del sitio web.",
      "El uso indebido que los usuarios puedan hacer del sitio web o de su área privada.",
      "La presencia de virus u otros elementos dañinos introducidos por terceros, sin perjuicio de haber adoptado las medidas de seguridad razonables.",
    ],
  },
  {
    title: "8. Enlaces a terceros",
    paragraphs: [
      "En caso de que este sitio web contenga enlaces a páginas web de terceros, Autoescuela Monkey Drive S.L. no se responsabiliza de los contenidos, políticas, servicios ni prácticas de dichos sitios externos, ya que no ejerce control alguno sobre ellos.",
      "La inclusión de enlaces a terceros no implica la existencia de relación, recomendación o aprobación alguna por parte de Autoescuela Monkey Drive S.L.",
    ],
  },
  {
    title: "9. Protección de datos personales",
    content:
      "Los datos personales recabados a través del sitio web serán tratados conforme a lo dispuesto en la normativa vigente en materia de protección de datos y de acuerdo con lo establecido en la correspondiente Política de Privacidad.",
    footer: (
      <>
        Puedes consultar la información completa en nuestra{" "}
        <Link to="/politica-privacidad" className="text-primary font-medium hover:underline">
          Política de Privacidad
        </Link>
        .
      </>
    ),
  },
  {
    title: "10. Cookies",
    content:
      "Este sitio web utiliza cookies propias y/o de terceros de acuerdo con lo establecido en la Política de Cookies.",
    footer: (
      <>
        Consulta el detalle y gestiona tus preferencias en la{" "}
        <Link to="/cookies" className="text-primary font-medium hover:underline">
          Política de Cookies
        </Link>
        .
      </>
    ),
  },
  {
    title: "11. Comunicaciones electrónicas",
    paragraphs: [
      "En caso de que el usuario facilite sus datos de contacto y exista una relación previa o preste el consentimiento correspondiente, Autoescuela Monkey Drive S.L. podrá remitir comunicaciones relacionadas con la prestación del servicio, la gestión de reservas, la compra de clases o información comercial, en los términos legalmente permitidos.",
    ],
  },
  {
    title: "12. Modificaciones",
    paragraphs: [
      "Autoescuela Monkey Drive S.L. se reserva el derecho a modificar en cualquier momento el presente Aviso Legal para adaptarlo a novedades legislativas, jurisprudenciales o técnicas, así como a cambios en el funcionamiento del sitio web.",
    ],
  },
  {
    title: "13. Legislación aplicable y jurisdicción",
    paragraphs: [
      "El presente Aviso Legal se rige por la legislación española.",
      "Para la resolución de cualquier controversia que pudiera derivarse del acceso o uso del sitio web, las partes se someterán a los Juzgados y Tribunales del domicilio del consumidor y usuario cuando así lo exija la normativa aplicable. En los demás supuestos, las partes se someterán a los Juzgados y Tribunales de Madrid, con renuncia expresa a cualquier otro fuero que pudiera corresponderles.",
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function AvisoLegal() {
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
              Aviso Legal
            </h1>
            <div className="mt-4 h-1 w-16 mx-auto rounded-full bg-primary/40" />
            <p className="mt-5 text-sm text-muted-foreground max-w-xl mx-auto">
              Información legal sobre la titularidad y condiciones de uso del sitio web de Autoescuela Monkey Drive, S.L.
            </p>
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

                {section.content && (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {section.content}
                  </p>
                )}

                {section.list && (
                  <dl className="mt-4 grid sm:grid-cols-2 gap-3">
                    {section.list.map((item, j) => (
                      <div
                        key={j}
                        className="rounded-xl border border-border/50 bg-background/50 px-4 py-3"
                      >
                        {item.label && (
                          <dt className="text-[11px] font-semibold uppercase tracking-wider text-primary/80 mb-0.5">
                            {item.label}
                          </dt>
                        )}
                        <dd className="text-sm text-foreground/90 font-medium">
                          {item.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}

                {section.bullets && (
                  <ul className="mt-4 space-y-2 pl-5">
                    {section.bullets.map((item, j) => (
                      <li
                        key={j}
                        className="relative text-sm leading-relaxed text-muted-foreground before:content-[''] before:absolute before:-left-4 before:top-[0.55em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/50"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {section.paragraphs && (
                  <div className="mt-4 space-y-3">
                    {section.paragraphs.map((p, j) => (
                      <p key={j} className="text-sm leading-relaxed text-muted-foreground">
                        {p}
                      </p>
                    ))}
                  </div>
                )}

                {section.footer && (
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground italic">
                    {section.footer}
                  </p>
                )}
              </motion.article>
            ))}

            {/* Last update note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-center text-xs text-muted-foreground/70 pt-4"
            >
              Última actualización: abril de 2026
            </motion.p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
