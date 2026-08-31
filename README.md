# 🚗 Ready2Go | AutoescuelaGO

Plataforma web integral para la gestión digital de una autoescuela. El proyecto combina una web pública orientada a captación de alumnos con un área privada para gestionar matrículas, pagos, clases prácticas, usuarios y seguimiento del alumno.

🌐 **Web:** [autoescuelago.com](https://autoescuelago.com/)

---

## 📌 Descripción

**Ready2Go / AutoescuelaGO** nace con el objetivo de digitalizar la experiencia de una autoescuela y centralizar en una única plataforma los principales procesos de alumnos, profesores y personal de secretaría.

La aplicación permite consultar información de los centros, realizar el proceso de matrícula online, gestionar pagos, reservar clases prácticas, acceder a tests y disponer de paneles específicos según el rol del usuario.

El proyecto está diseñado como una aplicación web moderna, responsive y preparada para funcionar tanto en escritorio como en dispositivos móviles.

---

## ✨ Funcionalidades principales

### 👨‍🎓 Área de alumnos

* Registro e inicio de sesión.
* Recuperación y restablecimiento de contraseña.
* Dashboard personal del alumno.
* Gestión del perfil.
* Consulta y gestión de pagos.
* Reserva de clases prácticas.
* Consulta de disponibilidad de profesores.
* Acceso a tests desde el área privada.
* Seguimiento de la actividad del alumno.

### 👨‍🏫 Área de profesores

* Panel específico para profesores.
* Gestión y consulta de clases prácticas.
* Organización de agenda y disponibilidad.
* Visualización de reservas de alumnos.

### 🗂️ Área de secretaría

* Dashboard independiente para administración.
* Gestión de alumnos y matrículas.
* Alta de matrículas presenciales.
* Gestión operativa de reservas y pagos.

### 💳 Matrícula y pagos

* Proceso de matrícula online.
* Confirmación y comprobación del estado del pago.
* Integración de pagos mediante **Stripe**.
* Webhook para procesar eventos de Stripe.
* Obtención de justificantes de pago.
* Flujo específico para matrículas presenciales.

### 📅 Reservas de clases

* Sistema de reserva de clases prácticas.
* Gestión de horarios y profesores.
* Confirmaciones de reserva.
* Confirmaciones de cancelación.
* Notificaciones por correo electrónico.

### 🤖 Asistente y comunicaciones

* Asistente de chat integrado en la web.
* Envío de notificaciones de contacto.
* Cola de procesamiento de correos electrónicos.
* Automatización de confirmaciones relacionadas con reservas.

### 🌐 Web pública

* Página principal y presentación de servicios.
* Información sobre teoría y prácticas.
* Información específica de los centros de Villanueva del Pardillo y Valdemorillo.
* Área de autoescuela online.
* Consejos y contenidos informativos.
* Páginas legales y gestión del consentimiento de cookies.
* Configuración SEO y metadatos sociales.

---

## 🛠️ Tecnologías utilizadas

### Frontend

* **React 18**
* **TypeScript**
* **Vite**
* **React Router DOM**
* **Tailwind CSS**
* **shadcn/ui**
* **Radix UI**
* **Framer Motion**
* **Lucide React**
* **TanStack React Query**
* **React Hook Form**
* **Zod**
* **Recharts**

### Backend y servicios

* **Supabase**

  * PostgreSQL
  * Authentication
  * Edge Functions
  * Persistencia de datos
* **Stripe** para pagos online
* Edge Functions para matrículas, pagos, reservas, correo y asistente de chat

### Desarrollo y testing

* **ESLint**
* **Vitest**
* **Testing Library**
* **Bun / npm**

---

## 🏗️ Arquitectura del proyecto

```text
goautoescuela/
├── public/                 # Recursos públicos
├── src/
│   ├── assets/             # Imágenes y recursos
│   ├── components/         # Componentes reutilizables y UI
│   ├── contexts/           # Auth, cookies y estados globales
│   ├── hooks/              # Hooks personalizados
│   ├── integrations/       # Integraciones externas
│   ├── lib/                # Utilidades y lógica compartida
│   ├── pages/              # Páginas de la aplicación
│   ├── test/               # Tests y configuración
│   ├── App.tsx             # Rutas y providers
│   └── main.tsx            # Punto de entrada
├── supabase/
│   ├── functions/          # Supabase Edge Functions
│   ├── migrations/         # Migraciones de base de datos
│   └── config.toml         # Configuración Supabase
├── package.json
├── tailwind.config.ts
└── vite.config.ts
```

---

## 🔐 Roles de usuario

| Rol            | Acceso principal                                    |
| -------------- | --------------------------------------------------- |
| **Alumno**     | Perfil, pagos, reservas, tests y seguimiento        |
| **Profesor**   | Agenda y gestión de clases prácticas                |
| **Secretaría** | Matrículas, alumnos, pagos y gestión administrativa |

---

## 🚀 Instalación local

### Requisitos

* Node.js 18 o superior
* npm o Bun
* Proyecto de Supabase configurado

### 1. Clonar el repositorio

```bash
git clone https://github.com/Jdiez93/goautoescuela.git
cd goautoescuela
```

### 2. Instalar dependencias

```bash
npm install
```

o:

```bash
bun install
```

### 3. Configurar variables de entorno

Crea un archivo `.env`:

```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=tu_supabase_publishable_key
```

> No publiques claves privadas, claves de servicio ni secretos de Stripe en el repositorio.

### 4. Iniciar el proyecto

```bash
npm run dev
```

---

## 📜 Scripts disponibles

```bash
npm run dev
```

Servidor de desarrollo.

```bash
npm run build
```

Genera la versión de producción.

```bash
npm run preview
```

Previsualiza la build.

```bash
npm run lint
```

Ejecuta ESLint.

```bash
npm run test
```

Ejecuta los tests con Vitest.

```bash
npm run test:watch
```

Ejecuta Vitest en modo observación.

---

## 🔄 Supabase Edge Functions

El backend serverless incorpora funciones para:

* creación y comprobación de pagos de matrícula;
* matrículas presenciales;
* pagos de alumnos;
* webhooks de Stripe;
* obtención de recibos;
* registro de alumnos;
* confirmaciones de reservas y cancelaciones;
* notificaciones de contacto;
* procesamiento de correo;
* asistente de chat.

Esto permite mantener en servidor la lógica sensible y las integraciones que no deben ejecutarse directamente desde el navegador.

---

## 🍪 Privacidad y páginas legales

La aplicación incorpora:

* Política de privacidad.
* Política de cookies.
* Aviso legal.
* Condiciones de contratación.
* Banner de consentimiento de cookies.
* Configuración de preferencias de cookies.

---

## 📱 Diseño responsive

La interfaz está desarrollada para ofrecer una experiencia consistente en:

* Ordenadores.
* Tablets.
* Smartphones.

---

## 🧪 Calidad del código

El proyecto utiliza **TypeScript**, **ESLint**, **Vitest** y **Testing Library** para mejorar la mantenibilidad del código, detectar errores y facilitar la evolución de la plataforma.

---

## 👨‍💻 Autor

**Jorge Díez Rodríguez**

* GitHub: [@Jdiez93](https://github.com/Jdiez93)
* Repositorio: [github.com/Jdiez93/goautoescuela](https://github.com/Jdiez93/goautoescuela)

---

## 📄 Licencia

Este proyecto no incluye actualmente una licencia de código abierto. Todos los derechos quedan reservados a su autor salvo indicación expresa en contrario.
