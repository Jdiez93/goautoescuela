
ALTER TABLE public.packs_matricula
  ADD COLUMN IF NOT EXISTS num_practice_classes integer NOT NULL DEFAULT 0;

UPDATE public.packs_matricula SET num_practice_classes = 20 WHERE slug = 'premium';
UPDATE public.packs_matricula SET num_practice_classes = 15 WHERE slug = 'completo';
UPDATE public.packs_matricula SET num_practice_classes = 5  WHERE slug = 'avanzado';
UPDATE public.packs_matricula SET num_practice_classes = 0  WHERE slug = 'basico';
