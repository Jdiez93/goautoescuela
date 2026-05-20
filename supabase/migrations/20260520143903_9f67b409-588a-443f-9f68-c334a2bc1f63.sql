-- =========================================================
-- FASE 1: Matrículas + Packs (estructura y RLS)
-- =========================================================

-- 1) Añadir columnas nuevas a matriculas (sin tocar las existentes)
ALTER TABLE public.matriculas
  ADD COLUMN IF NOT EXISTS user_id uuid,
  ADD COLUMN IF NOT EXISTS precio numeric(10,2),
  ADD COLUMN IF NOT EXISTS contrato_asociado text DEFAULT '',
  ADD COLUMN IF NOT EXISTS contrato_firmado_url text,
  ADD COLUMN IF NOT EXISTS dni_anverso_url text,
  ADD COLUMN IF NOT EXISTS dni_reverso_url text,
  ADD COLUMN IF NOT EXISTS estado_matricula text NOT NULL DEFAULT 'pendiente_datos',
  ADD COLUMN IF NOT EXISTS estado_pago text NOT NULL DEFAULT 'pendiente',
  ADD COLUMN IF NOT EXISTS stripe_session_id text,
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text,
  ADD COLUMN IF NOT EXISTS fecha_pago timestamptz;

-- 2) Restricciones de valores válidos
ALTER TABLE public.matriculas
  DROP CONSTRAINT IF EXISTS matriculas_estado_matricula_check;
ALTER TABLE public.matriculas
  ADD CONSTRAINT matriculas_estado_matricula_check
  CHECK (estado_matricula IN ('pendiente_datos','datos_completados','pendiente_pago','completada'));

ALTER TABLE public.matriculas
  DROP CONSTRAINT IF EXISTS matriculas_estado_pago_check;
ALTER TABLE public.matriculas
  ADD CONSTRAINT matriculas_estado_pago_check
  CHECK (estado_pago IN ('pendiente','pagado','fallido','cancelado'));

-- 3) Índices útiles
CREATE INDEX IF NOT EXISTS idx_matriculas_user_id ON public.matriculas(user_id);
CREATE INDEX IF NOT EXISTS idx_matriculas_email ON public.matriculas(lower(email));
CREATE INDEX IF NOT EXISTS idx_matriculas_estado_pago ON public.matriculas(estado_pago);

-- 4) RLS: asegurar activada (ya estaba) y añadir SELECT del propio alumno
ALTER TABLE public.matriculas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Students view own matricula" ON public.matriculas;
CREATE POLICY "Students view own matricula"
  ON public.matriculas
  FOR SELECT
  USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- (Las políticas existentes se mantienen):
--   "Anyone can submit matricula"           INSERT  true
--   "Secretaria and admins view matriculas" SELECT  secretaria/admin
--   "Secretaria and admins update matriculas" UPDATE secretaria/admin
--   "Secretaria and admins delete matriculas" DELETE secretaria/admin

-- 5) packs_matricula: unicidad de slug y seed de los 4 packs
CREATE UNIQUE INDEX IF NOT EXISTS packs_matricula_slug_unique ON public.packs_matricula(slug);

INSERT INTO public.packs_matricula (slug, name, tagline, price, description, sort_order, is_active)
VALUES
  ('pack_basico',   'Pack Básico',           'Matrícula + 3 Clases',                       69.00,   '[PRECIO PROVISIONAL - revisar]', 1, true),
  ('pack_avanzado', 'Pack Avanzado',         'Matrícula + 5 Clases + 1 Examen Práctico',   229.00,  '[PRECIO PROVISIONAL - revisar]', 2, true),
  ('pack_completo', 'Pack Completo',         'Matrícula TODO INCLUIDO',                    944.00,  '[PRECIO PROVISIONAL - revisar]', 3, true),
  ('pack_premium',  'Pack Premium (Ávila)',  'Apto para Villanueva del Pardillo y Valdemorillo - Sin lista de espera', 1350.00, '[PRECIO PROVISIONAL - revisar]', 4, true)
ON CONFLICT (slug) DO NOTHING;
