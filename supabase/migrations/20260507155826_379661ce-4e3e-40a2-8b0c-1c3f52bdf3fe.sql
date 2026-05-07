
CREATE TABLE public.packs_matricula (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  tagline text NOT NULL DEFAULT '',
  price numeric NOT NULL DEFAULT 0,
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.packs_matricula ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone view packs_matricula"
ON public.packs_matricula FOR SELECT TO public
USING (true);

CREATE POLICY "Admins insert packs_matricula"
ON public.packs_matricula FOR INSERT TO public
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins update packs_matricula"
ON public.packs_matricula FOR UPDATE TO public
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete packs_matricula"
ON public.packs_matricula FOR DELETE TO public
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER packs_matricula_updated_at
BEFORE UPDATE ON public.packs_matricula
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

INSERT INTO public.packs_matricula (slug, name, tagline, price, sort_order) VALUES
  ('basico', 'Pack Básico', 'Matrícula + 3 Clases', 69, 1),
  ('avanzado', 'Pack Avanzado', 'Matrícula + 6 Clases + 1 Examen Práctico', 229, 2),
  ('completo', 'Pack Completo', 'Matrícula TODO INCLUIDO', 944, 3);
