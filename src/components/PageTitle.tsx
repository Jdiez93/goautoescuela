import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE = "https://campusready2go.com";
const DEFAULT_DESCRIPTION =
  "Autoescuela Ready2Go en Villanueva del Pardillo y Valdemorillo (Madrid): teórico online con vídeos y tests, clases prácticas, matrícula y reservas desde tu móvil.";
const OG_IMAGE = `${SITE}/og-image.jpg`;

type RouteMeta = {
  /** Section appended after "Ready2Go · " unless `fullTitle` is set. */
  title: string;
  fullTitle?: string;
  description: string;
  /** Extra JSON-LD injected for this route. */
  jsonLd?: Record<string, unknown>;
};

const branchSchema = (
  name: string,
  streetAddress: string,
  postalCode: string,
  locality: string,
  telephone: string,
  path: string,
) => ({
  "@context": "https://schema.org",
  "@type": "DrivingSchool",
  name,
  description: `Autoescuela Ready2Go en ${locality}: teórico online, clases prácticas y matrícula.`,
  url: `${SITE}${path}`,
  image: OG_IMAGE,
  telephone,
  priceRange: "€€",
  openingHours: "Mo-Fr 10:00-13:00, Mo-Fr 16:00-20:00",
  address: {
    "@type": "PostalAddress",
    streetAddress,
    postalCode,
    addressLocality: locality,
    addressRegion: "Madrid",
    addressCountry: "ES",
  },
  areaServed: { "@type": "City", name: locality },
});

const courseSchema = (name: string, description: string, path: string) => ({
  "@context": "https://schema.org",
  "@type": "Course",
  name,
  description,
  url: `${SITE}${path}`,
  inLanguage: "es-ES",
  provider: {
    "@type": "DrivingSchool",
    name: "Ready2Go",
    url: SITE,
  },
});

const routeMeta: Record<string, RouteMeta> = {
  "/": {
    title: "Bienvenido",
    fullTitle: "Ready2Go | Autoescuela online en Villanueva del Pardillo y Valdemorillo",
    description: DEFAULT_DESCRIPTION,
  },
  "/home": {
    title: "Inicio",
    fullTitle: "Ready2Go | Autoescuela en Villanueva del Pardillo y Valdemorillo",
    description:
      "Saca tu carnet con Ready2Go: teórico online con vídeos y tests, clases prácticas con profesores propios y reservas desde el móvil en Madrid.",
  },
  "/inicio": {
    title: "Inicio",
    description:
      "Saca tu carnet con Ready2Go: teórico online, clases prácticas y reservas desde el móvil en Villanueva del Pardillo y Valdemorillo.",
  },
  "/centro-estudios": {
    title: "Centro de Estudio y Formación",
    fullTitle: "Ready2Go · Centro de estudio y formación en Madrid",
    description:
      "Centro de estudio y formación Ready2Go: apoyo escolar, robótica y programación de videojuegos en Villanueva del Pardillo y Valdemorillo.",
  },
  "/plataforma": {
    title: "Plataforma del alumno",
    description:
      "Accede a la plataforma Ready2Go: tests, vídeos del temario, progreso y reserva de clases prácticas en un solo lugar.",
  },
  "/la-teorica": {
    title: "Teórica online y presencial",
    description:
      "Prepara el examen teórico con Ready2Go: un vídeo por pregunta, tests ilimitados, seguimiento del progreso y clases presenciales de apoyo.",
    jsonLd: courseSchema(
      "Curso teórico del permiso B",
      "Curso teórico para el permiso B con vídeos explicativos por pregunta, tests oficiales ilimitados y seguimiento del progreso del alumno.",
      "/la-teorica",
    ),
  },
  "/las-practicas": {
    title: "Clases prácticas de conducir",
    description:
      "Clases prácticas Ready2Go: profesores propios, maniobras, recorridos de examen y reserva de clases desde tu móvil en Madrid.",
    jsonLd: courseSchema(
      "Clases prácticas de conducción (permiso B)",
      "Clases prácticas de conducción con profesores propios: maniobras, circulación urbana e interurbana y recorridos de examen.",
      "/las-practicas",
    ),
  },
  "/autoescuela-online": {
    title: "Autoescuela online",
    description:
      "Ready2Go Online: matricúlate, estudia el temario en vídeo, haz tests y reserva tus clases prácticas sin salir de casa.",
  },
  "/actualidad": {
    title: "Robótica y programación de videojuegos",
    description:
      "Talleres de robótica y programación de videojuegos para niños y jóvenes con Lego, Scratch y Arduino en el centro Ready2Go.",
  },
  "/practicas-virtuales": {
    title: "Robótica y programación de videojuegos",
    description:
      "Robótica y programación de videojuegos en Ready2Go: aprendizaje práctico con Lego, Scratch y Arduino.",
  },
  "/consejos": {
    title: "Consejos para aprobar",
    description:
      "Consejos de nuestros profesores para aprobar el teórico y el práctico a la primera con Ready2Go.",
  },
  "/autoescuelas-ready2go": {
    title: "Nuestros centros",
    description:
      "Conoce las sedes de Ready2Go en Villanueva del Pardillo y Valdemorillo: horarios, teléfonos y cómo llegar.",
  },
  "/autoescuelas-ready2go/villanueva-del-pardillo": {
    title: "Autoescuela en Villanueva del Pardillo",
    description:
      "Autoescuela Ready2Go en Villanueva del Pardillo: Calle Santa Ana, 1. Teórico online, clases prácticas y matrícula. Tel. 658 47 48 14.",
    jsonLd: branchSchema(
      "Ready2Go Villanueva del Pardillo",
      "Calle Santa Ana, 1",
      "28229",
      "Villanueva del Pardillo",
      "+34 658 47 48 14",
      "/autoescuelas-ready2go/villanueva-del-pardillo",
    ),
  },
  "/autoescuelas-ready2go/valdemorillo": {
    title: "Autoescuela en Valdemorillo",
    description:
      "Autoescuela Ready2Go en Valdemorillo: C. Covachuelas, 18. Teórico online, clases prácticas y matrícula. Tel. 645 34 31 17.",
    jsonLd: branchSchema(
      "Ready2Go Valdemorillo",
      "C. Covachuelas, 18",
      "28210",
      "Valdemorillo",
      "+34 645 34 31 17",
      "/autoescuelas-ready2go/valdemorillo",
    ),
  },
  "/matriculate": {
    title: "Matricúlate en tu autoescuela",
    description:
      "Elige tu pack de matrícula Ready2Go (básico, avanzado, completo o premium) y empieza hoy tu carnet en Villanueva del Pardillo o Valdemorillo.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Packs de matrícula Ready2Go",
      itemListElement: [
        { name: "Pack Básico", price: "69" },
        { name: "Pack Avanzado", price: "229" },
        { name: "Pack Completo", price: "944" },
        { name: "Pack Premium (Ávila)", price: "1350" },
      ].map((pack, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Product",
          name: `Ready2Go ${pack.name}`,
          description: `Pack de matrícula ${pack.name} de la autoescuela Ready2Go.`,
          brand: { "@type": "Brand", name: "Ready2Go" },
          url: `${SITE}/matriculate`,
          offers: {
            "@type": "Offer",
            price: pack.price,
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
            url: `${SITE}/matriculate`,
          },
        },
      })),
    },
  },

  "/matricula": {
    title: "Matrícula",
    description: "Completa tu matrícula en Ready2Go y empieza tu formación de conducción.",
  },
  "/matricula-exito": {
    title: "Matrícula completada",
    description: "Tu matrícula en Ready2Go se ha completado correctamente.",
  },
  "/matricula-cancelada": {
    title: "Matrícula cancelada",
    description: "El proceso de matrícula en Ready2Go se ha cancelado.",
  },
  "/login": {
    title: "Iniciar sesión",
    description: "Accede a tu área privada de alumno Ready2Go para ver tus tests, clases y progreso.",
  },
  "/registro": {
    title: "Crear cuenta de alumno",
    description: "Crea tu cuenta de alumno Ready2Go y accede a tests, vídeos y reserva de clases.",
  },
  "/recuperar-password": {
    title: "Recuperar contraseña",
    description: "Recupera el acceso a tu cuenta de alumno Ready2Go.",
  },
  "/reset-password": {
    title: "Restablecer contraseña",
    description: "Establece una nueva contraseña para tu cuenta Ready2Go.",
  },
  "/dashboard": { title: "Panel de alumno", description: "Área privada del alumno Ready2Go." },
  "/dashboard-alumno": { title: "Panel de alumno", description: "Área privada del alumno Ready2Go." },
  "/dashboard-profesor": { title: "Panel de profesor", description: "Área privada del profesor Ready2Go." },
  "/dashboard-secretaria": { title: "Panel de secretaría", description: "Área privada de secretaría Ready2Go." },
  "/pagos": { title: "Pagos", description: "Consulta tus pagos y bonos de clases en Ready2Go." },
  "/dashboard/tests": { title: "Tests", description: "Practica los tests del permiso B en Ready2Go." },
  "/reservas": { title: "Reservas", description: "Reserva tus clases prácticas con Ready2Go." },
  "/perfil": { title: "Mi perfil", description: "Gestiona los datos de tu perfil de alumno Ready2Go." },
  "/politica-privacidad": {
    title: "Política de privacidad",
    description: "Información sobre el tratamiento de datos personales en Ready2Go.",
  },
  "/aviso-legal": {
    title: "Aviso legal",
    description: "Titularidad y condiciones de uso del sitio web de Ready2Go.",
  },
  "/condiciones-contratacion": {
    title: "Condiciones de contratación",
    description: "Condiciones generales de contratación de clases y packs de Ready2Go.",
  },
  "/cookies": {
    title: "Política de cookies",
    description: "Información y preferencias sobre las cookies utilizadas en Ready2Go.",
  },
};

const NOT_FOUND: RouteMeta = {
  title: "Página no encontrada",
  description: "La página que buscas no existe en Ready2Go.",
};

function setMeta(selector: string, attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export default function PageTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    const clean = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
    const meta = routeMeta[clean] ?? NOT_FOUND;
    const url = `${SITE}${clean === "/" ? "/" : clean}`;
    const title = meta.fullTitle ?? `Ready2Go · ${meta.title}`;

    document.title = title;
    setMeta('meta[name="description"]', "name", "description", meta.description);
    setMeta('meta[property="og:title"]', "property", "og:title", title);
    setMeta('meta[property="og:description"]', "property", "og:description", meta.description);
    setMeta('meta[property="og:url"]', "property", "og:url", url);
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", meta.description);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    const ROUTE_LD_ID = "route-json-ld";
    document.getElementById(ROUTE_LD_ID)?.remove();
    if (meta.jsonLd) {
      const script = document.createElement("script");
      script.id = ROUTE_LD_ID;
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(meta.jsonLd);
      document.head.appendChild(script);
    }
  }, [pathname]);

  return null;
}
