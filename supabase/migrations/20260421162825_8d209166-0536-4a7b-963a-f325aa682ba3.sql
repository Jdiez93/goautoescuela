-- Tabla para solicitudes de información desde formularios públicos
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  source_page TEXT NOT NULL DEFAULT 'unknown',
  email_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activar RLS
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Cualquiera (público) puede insertar una solicitud
CREATE POLICY "Anyone can submit contact form"
ON public.contact_submissions
FOR INSERT
WITH CHECK (true);

-- Solo admins pueden ver
CREATE POLICY "Admins view submissions"
ON public.contact_submissions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Solo admins pueden actualizar (ej: marcar email_sent)
CREATE POLICY "Admins update submissions"
ON public.contact_submissions
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Solo admins pueden borrar
CREATE POLICY "Admins delete submissions"
ON public.contact_submissions
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Índice para consultas por fecha
CREATE INDEX idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);