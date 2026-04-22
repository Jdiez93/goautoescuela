-- Función auxiliar para actualizar updated_at (si no existe)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Tabla de consentimientos de cookies
CREATE TABLE public.cookie_consents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  anon_id UUID NOT NULL,
  user_id UUID,
  necessary BOOLEAN NOT NULL DEFAULT true,
  preferences BOOLEAN NOT NULL DEFAULT false,
  analytics BOOLEAN NOT NULL DEFAULT false,
  marketing BOOLEAN NOT NULL DEFAULT false,
  policy_version TEXT NOT NULL DEFAULT 'v1',
  user_agent TEXT,
  source_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_cookie_consents_anon_id ON public.cookie_consents(anon_id);
CREATE INDEX idx_cookie_consents_user_id ON public.cookie_consents(user_id);

ALTER TABLE public.cookie_consents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert cookie consent"
ON public.cookie_consents
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update cookie consent"
ON public.cookie_consents
FOR UPDATE
USING (true);

CREATE POLICY "Users view own cookie consent"
ON public.cookie_consents
FOR SELECT
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins delete cookie consents"
ON public.cookie_consents
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_cookie_consents_updated_at
BEFORE UPDATE ON public.cookie_consents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();