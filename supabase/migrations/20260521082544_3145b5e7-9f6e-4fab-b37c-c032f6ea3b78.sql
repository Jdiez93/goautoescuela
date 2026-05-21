ALTER TABLE public.matriculas DROP CONSTRAINT IF EXISTS matriculas_estado_pago_check;
ALTER TABLE public.matriculas ADD CONSTRAINT matriculas_estado_pago_check
  CHECK (estado_pago = ANY (ARRAY['pendiente'::text, 'pagada'::text, 'fallido'::text, 'cancelado'::text]));