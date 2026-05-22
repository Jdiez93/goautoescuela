import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const titleMap: Record<string, string> = {
  "/": "Inicio",
  "/inicio": "Inicio",
  "/plataforma": "Plataforma",
  "/la-teorica": "Teórica",
  "/las-practicas": "Prácticas",
  "/actualidad": "Centro de formación",
  "/practicas-virtuales": "Prácticas virtuales",
  "/consejos": "Centro de estudios",
  "/autoescuelas-ready2go": "Nuestros centros",
  "/autoescuela-online": "Autoescuela Online",
  "/matriculate": "Matricúlate",
  "/login": "Iniciar sesión",
  "/registro": "Registrarse",
  "/recuperar-password": "Recuperar contraseña",
  "/reset-password": "Restablecer contraseña",
  "/dashboard": "Panel de alumno",
  "/dashboard-profesor": "Panel de profesor",
  "/dashboard-secretaria": "Panel de secretaría",
  "/pagos": "Pagos",
  "/dashboard/tests": "Tests",
  "/reservas": "Reservas",
  "/perfil": "Mi perfil",
  "/politica-privacidad": "Política de privacidad",
  "/aviso-legal": "Aviso legal",
  "/condiciones-contratacion": "Condiciones de contratación",
  "/cookies": "Política de cookies",
};

export default function PageTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    const section = titleMap[pathname] ?? "Página no encontrada";
    document.title = `Ready2Go · ${section}`;
  }, [pathname]);

  return null;
}
