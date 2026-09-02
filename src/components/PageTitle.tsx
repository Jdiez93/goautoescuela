import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const titleMap: Record<string, string> = {
  "/": "Bienvenido",
  "/home": "Inicio",
  "/inicio": "Inicio",
  "/centro-estudios": "Centro de Estudio y Formación",
  "/plataforma": "Plataforma",
  "/la-teorica": "Teórica",
  "/las-practicas": "Prácticas",
  "/actualidad": "Robótica y programación",
  "/practicas-virtuales": "Robótica y programación",
  "/consejos": "Consejos",
  "/autoescuelas-ready2go": "Nuestros centros",
  "/autoescuelas-ready2go/villanueva-del-pardillo": "Autoescuela Villanueva del Pardillo",
  "/autoescuelas-ready2go/valdemorillo": "Autoescuela Valdemorillo",
  "/autoescuela-online": "Autoescuela Online",
  "/matriculate": "Matricúlate",
  "/matricula": "Matrícula",
  "/matricula-exito": "Matrícula completada",
  "/matricula-cancelada": "Matrícula cancelada",
  "/login": "Iniciar sesión",
  "/registro": "Registrarse",
  "/recuperar-password": "Recuperar contraseña",
  "/reset-password": "Restablecer contraseña",
  "/dashboard": "Panel de alumno",
  "/dashboard-alumno": "Panel de alumno",
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
