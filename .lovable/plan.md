# Flujo de Matrícula Real — Plan por Fases

Objetivo: convertir `/matriculate` en un flujo de matrícula real, con datos persistidos, documentos privados (DNI + contrato firmado), control de acceso por roles, registro de alumno restringido a matrículas pagadas, y por último el pago con Stripe.

Cada fase queda **funcional y verificable** antes de avanzar a la siguiente. No se borrará nada existente sin avisarte.

---

## Estado actual (lo que ya hay)

- **Tablas relevantes**: `matriculas` (datos personales + pack + status), `packs_matricula` (precios reales en BD), `payments`, `profiles`, `user_roles` (`student | teacher | admin | secretaria`), `bookings`.
- **Auth**: Supabase Auth con `AuthProvider`, registro libre en `/registro`, trigger `handle_new_user` que crea `profiles` + rol `student` automáticamente.
- **Páginas**: `/matriculate` (solo visual, packs hardcodeados en el front), `/dashboard-secretaria` (lista matrículas, ya protegida por rol), `/dashboard`, `/dashboard-profesor`.
- **RLS**: ya activa en todas las tablas. `matriculas` permite INSERT público y SELECT solo a secretaria/admin.
- **Edge functions**: `create-payment`, `stripe-webhook` (con `PACK_PRICES` hardcodeado — habrá que migrar a leer desde BD).
- **Storage**: no hay buckets creados todavía.

---

## Fases propuestas

### Fase 1 — Formulario de matrícula real (sin pago aún)
- Página nueva `/matriculate/checkout?pack=<slug>` accesible al pulsar "Elegir" en cualquier pack de `/matriculate`.
- Los packs del listado se leen de `packs_matricula` (BD), no del array hardcodeado. Mantengo el diseño visual actual.
- Formulario con: nombre, apellidos, DNI, fecha nacimiento, email, teléfono, dirección, CP, ciudad, aceptación de privacidad y condiciones.
- Validación con `zod` cliente + servidor.
- Al enviar: se crea fila en `matriculas` con `status = 'pendiente_pago'` y `pack_id` real desde BD.
- **No se cobra todavía.** Aparece en el dashboard de secretaría.

### Fase 2 — Subida privada de DNI y contrato firmado
- Crear bucket privado `matricula-docs` (no público) con RLS estricta: cada alumno solo accede a sus propios archivos; secretaría/admin a todos.
- Añadir a `matriculas`: `dni_front_path`, `dni_back_path`, `contract_signed_path`, columnas para timestamps de firma.
- En el checkout, dos pasos extra: subir DNI (anverso/reverso) + descargar contrato PDF generado, firmarlo (firma digital en canvas o subida del PDF firmado), reupload.
- Edge function `get-matricula-doc-url` que devuelve URL firmada temporal (60s) tras validar permisos.

### Fase 3 — Control de acceso al registro de alumno
- Modificar `/registro`: antes de permitir signup, validar contra `matriculas` que existe una con ese email **y** `status = 'pagada'`.
- Edge function `verify-matricula-for-signup` (pública, sin JWT) que recibe email y devuelve `{ allowed: bool }`.
- Si no hay matrícula pagada → mensaje claro: "Debes completar tu matrícula primero" con CTA a `/matriculate`.
- Tras signup, trigger ya existente crea perfil + rol student. Añadimos paso: vincular `matriculas.user_id` al nuevo usuario (vía función SQL).

### Fase 4 — Roles y rutas protegidas reforzadas
- Auditar y blindar:
  - `/dashboard` → solo `student` (los admin/teacher se redirigen a su panel).
  - `/dashboard-profesor` → solo `teacher` o `admin`.
  - `/dashboard-secretaria` → solo `secretaria` o `admin` (ya está).
- Crear componente `<RequireRole roles={[...]}>` reutilizable que use `useAuth` y haga `<Navigate>` si no cumple.
- Verificar a nivel de RLS que ninguna política se apoya en el front (revisión y, si hace falta, endurecer).

### Fase 5 — Integración real con Stripe (último paso)
- Reescribir `create-payment` para:
  - Recibir `matricula_id` (no `packKey` del front).
  - Leer `pack_id` desde `matriculas` y precio desde `packs_matricula` en BD.
  - Crear sesión de Stripe Checkout con `price_data` dinámico (o `price_id` mapeado server-side).
  - Pasar `matricula_id` en metadata.
- `stripe-webhook`:
  - Al recibir `checkout.session.completed`, marcar `matriculas.status = 'pagada'`, registrar fila en `payments` con el pack correcto.
- Flujo final del alumno:
  1. Elige pack → 2. Rellena datos → 3. Sube DNI + firma contrato → 4. Paga con Stripe → 5. Recibe email con instrucción de registrarse con el mismo email → 6. Crea cuenta → 7. Accede al dashboard.

---

## Detalles técnicos

- **Validación**: `zod` en cliente y dentro de cada edge function.
- **RLS storage**: políticas basadas en `(storage.foldername(name))[1] = auth.uid()::text` para el alumno, y `has_role(auth.uid(),'secretaria'|'admin')` para staff.
- **Precios siempre en servidor**: ni `create-payment` ni el webhook leen importes del body del cliente.
- **Sin borrado destructivo**: las migraciones añaden columnas/tablas/políticas, no eliminan. Si algo debe deprecarse (p.ej. `PACK_PRICES` hardcodeado) te lo aviso antes.

---

## Empezamos por la Fase 1

Si das luz verde, comenzaré por:
1. Confirmar que `packs_matricula` tiene los 4 packs cargados (Básico, Avanzado, Completo, Premium) con precios correctos. Si faltan, te propongo el INSERT.
2. Refactor de `/matriculate` para leer packs desde BD manteniendo el diseño.
3. Nueva página de checkout con el formulario y persistencia en `matriculas`.

Confirma y arrancamos por la Fase 1.
