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
    title: "1. Identificación del titular",
    content:
      "Las presentes Condiciones Generales de Contratación regulan la compra de clases y servicios formativos ofrecidos a través del sitio web autoescuelago.es, titularidad de:",
    list: [
      { label: "Titular", value: "Valentín Cobo Fernández" },
      { label: "Nombre comercial", value: "Autoescuela Monkey Drive, S.L." },
      { label: "NIF/CIF", value: "B-05398987" },
      { label: "Domicilio", value: "C. Covachuelas, 18, 28210 Valdemorillo, Madrid" },
      { label: "Correo electrónico", value: "info@autoescuelago.es" },
      { label: "Teléfono", value: "645 34 31 17" },
    ],
  },
  {
    title: "2. Objeto",
    paragraphs: [
      "Las presentes condiciones regulan la contratación online de clases prácticas, clases teóricas, bonos de clases y, en su caso, otros servicios formativos ofrecidos por Autoescuela Monkey Drive, S.L. a través de su sitio web y/o área privada del alumno.",
      "La contratación de cualquiera de los servicios ofrecidos implica la aceptación plena y sin reservas de las presentes Condiciones Generales de Contratación.",
    ],
  },
  {
    title: "3. Usuarios y área privada",
    paragraphs: [
      "Para contratar determinados servicios o reservar clases, el usuario deberá registrarse en el área privada del alumno o disponer de credenciales facilitadas por Autoescuela Monkey Drive, S.L.",
      "El usuario se compromete a facilitar datos veraces, exactos y actualizados, así como a custodiar diligentemente sus credenciales de acceso. El acceso al área privada es personal e intransferible.",
    ],
  },
  {
    title: "4. Servicios ofertados",
    content: "A través del sitio web podrán contratarse, entre otros, los siguientes servicios:",
    bullets: [
      "Clases prácticas de conducción.",
      "Clases teóricas.",
      "Bonos o paquetes de clases.",
      "Otros servicios relacionados con la formación vial que se encuentren publicados en cada momento.",
    ],
    paragraphs: [
      "La descripción, características, precio y, en su caso, duración o condiciones específicas de cada servicio serán las que figuren en la ficha correspondiente dentro del sitio web.",
    ],
  },
  {
    title: "5. Proceso de contratación",
    paragraphs: [
      "El proceso de compra se realizará de forma electrónica a través del sitio web.",
      "Con carácter previo a finalizar la compra, el usuario podrá revisar el detalle del pedido, corregir posibles errores en los datos introducidos y aceptar expresamente las presentes condiciones.",
      "La contratación solo quedará formalizada cuando el usuario complete el proceso de compra y reciba la confirmación correspondiente por medios electrónicos.",
    ],
  },
  {
    title: "6. Precios y forma de pago",
    paragraphs: [
      "Todos los precios mostrados en el sitio web se expresan en euros e incluyen los impuestos aplicables, salvo que se indique expresamente lo contrario.",
      "Antes de finalizar la compra, el usuario visualizará el precio total del servicio contratado.",
      "El pago se realizará a través de los medios de pago habilitados en cada momento en el sitio web, incluidos, en su caso, pasarela de pago segura con tarjeta u otros medios electrónicos disponibles.",
      "Autoescuela Monkey Drive, S.L. se reserva el derecho de rechazar o cancelar una contratación cuando detecte indicios de fraude, uso no autorizado del medio de pago o errores manifiestos en el precio publicado.",
    ],
  },
  {
    title: "7. Confirmación y disponibilidad",
    paragraphs: [
      "La compra de clases o bonos no garantiza una disponibilidad inmediata en un día y hora concretos, ya que las reservas están sujetas a la agenda del profesorado y a la disponibilidad existente en cada momento.",
      "Las clases adquiridas quedarán asociadas a la cuenta del alumno para su posterior reserva conforme a las presentes condiciones.",
    ],
  },
  {
    title: "8. Reserva de clases",
    paragraphs: [
      "La reserva de clases deberá realizarse a través del área privada del alumno.",
      "La reserva quedará confirmada una vez aparezca reflejada en el área privada del alumno y, en su caso, cuando el usuario reciba la correspondiente comunicación electrónica de confirmación.",
    ],
  },
  {
    title: "9. Modificación o cancelación de reservas por parte del alumno",
    paragraphs: [
      "El alumno podrá modificar o cancelar una clase reservada únicamente cuando lo haga con una antelación mínima de 24 horas respecto de la hora de inicio prevista.",
      "No se admitirán cambios, cancelaciones ni reprogramaciones solicitadas con menos de 24 horas de antelación, salvo que Autoescuela Monkey Drive, S.L., a su sola discreción y sin que ello siente precedente, acepte la modificación por causa debidamente justificada.",
    ],
  },
  {
    title: "10. No asistencia del alumno",
    paragraphs: [
      "La no asistencia del alumno a una clase reservada, así como la imposibilidad de realizarla por causa imputable al propio alumno, supondrá que la clase se considere consumida o impartida a efectos administrativos y económicos, sin derecho a devolución del importe abonado, reembolso, sustitución ni recuperación de la clase.",
      "A estos efectos, se considerarán también causas imputables al alumno, entre otras:",
    ],
    bullets: [
      "No presentarse en el lugar, fecha y hora acordados.",
      "Llegar con un retraso que impida el normal desarrollo de la clase.",
      "No portar la documentación obligatoria necesaria para la realización de la clase, cuando ello impida su impartición.",
      "Encontrarse en condiciones no aptas para realizar la clase conforme a la normativa aplicable.",
    ],
    footer:
      "En caso de retraso del alumno, la duración efectiva de la clase podrá verse reducida en el tiempo correspondiente, sin derecho a devolución.",
  },
  {
    title: "11. Cancelación o modificación por parte de la autoescuela",
    paragraphs: [
      "Autoescuela Monkey Drive, S.L. podrá modificar o cancelar una clase por causas organizativas, indisponibilidad del profesor, avería del vehículo, condiciones de seguridad, fuerza mayor o cualquier otra causa justificada.",
      "En tales casos, el alumno tendrá derecho, a elección de Autoescuela Monkey Drive, S.L., a:",
    ],
    bullets: [
      "La reprogramación de la clase en otra fecha disponible.",
      "La devolución del importe correspondiente a la clase afectada.",
      "La restitución de la clase al saldo disponible del alumno, cuando proceda.",
    ],
  },
  {
    title: "12. Derecho de desistimiento",
    paragraphs: [
      "Cuando el contratante tenga la condición de consumidor o usuario, podrá ejercer el derecho de desistimiento en el plazo legal de 14 días naturales desde la celebración del contrato, siempre que no concurra alguna de las excepciones legalmente previstas.",
      "No obstante, el alumno reconoce y acepta expresamente que, cuando solicite que la ejecución del servicio comience antes de que finalice el plazo de desistimiento —por ejemplo, mediante la activación inmediata de clases adquiridas o la reserva y disfrute de clases dentro de dicho plazo—, Autoescuela Monkey Drive, S.L. podrá iniciar la prestación del servicio.",
      "En caso de ejercicio del desistimiento una vez iniciada la prestación del servicio a solicitud expresa del alumno, este deberá abonar el importe proporcional correspondiente a la parte del servicio efectivamente prestada hasta la fecha de comunicación del desistimiento.",
      "Asimismo, el alumno reconoce que, una vez que el servicio haya sido completamente ejecutado, perderá su derecho de desistimiento cuando la ejecución haya comenzado con su consentimiento expreso previo y con el reconocimiento de que pierde dicho derecho una vez ejecutado íntegramente el contrato.",
      "En ningún caso procederá devolución respecto de clases ya efectivamente impartidas o consumidas conforme a estas condiciones.",
      "Para ejercer el desistimiento, el usuario podrá comunicar su decisión a info@autoescuelago.es indicando sus datos identificativos, el servicio contratado y la fecha de contratación.",
      "Las devoluciones que procedan se efectuarán por el mismo medio de pago utilizado por el usuario, salvo que este disponga expresamente otra cosa.",
    ],
  },
  {
    title: "13. Obligaciones del alumno",
    content: "El alumno se compromete a:",
    bullets: [
      "Hacer un uso adecuado del sitio web y del área privada.",
      "Facilitar información veraz y actualizada.",
      "Respetar los horarios y condiciones de las clases reservadas.",
      "Acudir a las clases con la documentación legalmente exigible.",
      "Cumplir las instrucciones del profesorado y las normas de seguridad.",
    ],
  },
  {
    title: "14. Exoneración de responsabilidad",
    content: "Autoescuela Monkey Drive, S.L. no responderá de los daños o perjuicios derivados de:",
    bullets: [
      "Fallos ajenos en redes de telecomunicaciones, internet o plataformas de pago.",
      "Errores del usuario en el proceso de compra o reserva.",
      "Uso indebido del área privada o de las credenciales de acceso.",
      "Incidencias derivadas de causas de fuerza mayor.",
    ],
  },
  {
    title: "15. Atención al cliente y reclamaciones",
    content:
      "Para cualquier incidencia, consulta o reclamación relacionada con la contratación, el usuario podrá dirigirse a:",
    list: [
      { label: "Correo electrónico", value: "info@autoescuelago.es" },
      { label: "Teléfono", value: "645 34 31 17" },
      { label: "Dirección postal", value: "C. Covachuelas, 18, 28210 Valdemorillo, Madrid" },
    ],
    footer:
      "El establecimiento dispone de hojas oficiales de reclamaciones a disposición de las personas consumidoras y usuarias.",
  },
  {
    title: "16. Modificación de las condiciones",
    paragraphs: [
      "Autoescuela Monkey Drive, S.L. podrá modificar las presentes condiciones cuando exista una causa justificada, respetando en todo caso las condiciones vigentes en el momento de cada contratación.",
    ],
  },
  {
    title: "17. Legislación aplicable y jurisdicción",
    paragraphs: [
      "Las presentes Condiciones Generales de Contratación se regirán por la legislación española.",
      "En caso de conflicto o controversia, serán competentes los Juzgados y Tribunales del domicilio del consumidor y usuario cuando así lo prevea la normativa aplicable. En los demás casos, las partes se someten a los Juzgados y Tribunales de Madrid, con renuncia expresa a cualquier otro fuero que pudiera corresponderles.",
    ],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function CondicionesContratacion() {
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
              Condiciones Generales de Contratación
            </h1>
            <div className="mt-4 h-1 w-16 mx-auto rounded-full bg-primary/40" />
            <p className="mt-5 text-sm text-muted-foreground max-w-xl mx-auto">
              Términos aplicables a la compra de clases, bonos y servicios formativos ofrecidos por Autoescuela Monkey Drive, S.L.
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

            {/* Cross-links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="rounded-2xl border border-border/60 bg-card/50 p-6 text-sm text-muted-foreground text-center"
            >
              Consulta también nuestra{" "}
              <Link to="/politica-privacidad" className="text-primary hover:underline font-medium">
                Política de Privacidad
              </Link>
              ,{" "}
              <Link to="/aviso-legal" className="text-primary hover:underline font-medium">
                Aviso Legal
              </Link>{" "}
              y{" "}
              <Link to="/cookies" className="text-primary hover:underline font-medium">
                Política de Cookies
              </Link>
              .
            </motion.div>

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
