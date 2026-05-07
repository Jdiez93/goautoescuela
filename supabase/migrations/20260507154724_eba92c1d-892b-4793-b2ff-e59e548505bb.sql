
CREATE TABLE public.matriculas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  dni text NOT NULL DEFAULT '',
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  postal_code text NOT NULL DEFAULT '',
  date_of_birth date,
  pack_name text NOT NULL DEFAULT '',
  pack_id uuid,
  status text NOT NULL DEFAULT 'pendiente',
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.matriculas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit matricula"
ON public.matriculas FOR INSERT TO public
WITH CHECK (true);

CREATE POLICY "Secretaria and admins view matriculas"
ON public.matriculas FOR SELECT TO public
USING (has_role(auth.uid(), 'secretaria'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Secretaria and admins update matriculas"
ON public.matriculas FOR UPDATE TO public
USING (has_role(auth.uid(), 'secretaria'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Secretaria and admins delete matriculas"
ON public.matriculas FOR DELETE TO public
USING (has_role(auth.uid(), 'secretaria'::app_role) OR has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER matriculas_updated_at
BEFORE UPDATE ON public.matriculas
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
