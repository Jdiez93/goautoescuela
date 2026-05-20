
-- Create private bucket for matricula documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('matriculas', 'matriculas', false)
ON CONFLICT (id) DO NOTHING;

-- Helper: check whether the authenticated user owns the matricula referenced in the object path
CREATE OR REPLACE FUNCTION public.owns_matricula(_matricula_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.matriculas
    WHERE id = _matricula_id AND user_id = auth.uid()
  );
$$;

-- INSERT: allow anyone (anon or authenticated) to upload into matriculas/{matricula_id}/...
-- The path must start with a valid uuid corresponding to an existing matricula row.
CREATE POLICY "Upload matricula docs"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'matriculas'
  AND (
    public.owns_matricula(((storage.foldername(name))[1])::uuid)
    OR has_role(auth.uid(), 'secretaria'::app_role)
    OR has_role(auth.uid(), 'admin'::app_role)
    OR EXISTS (
      SELECT 1 FROM public.matriculas m
      WHERE m.id = ((storage.foldername(name))[1])::uuid
        AND m.user_id IS NULL
    )
  )
);

-- SELECT: owner (student), secretaria, admin
CREATE POLICY "View own matricula docs"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'matriculas'
  AND (
    public.owns_matricula(((storage.foldername(name))[1])::uuid)
    OR has_role(auth.uid(), 'secretaria'::app_role)
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

-- UPDATE: secretaria/admin only
CREATE POLICY "Staff update matricula docs"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'matriculas'
  AND (
    has_role(auth.uid(), 'secretaria'::app_role)
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

-- DELETE: secretaria/admin only
CREATE POLICY "Staff delete matricula docs"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'matriculas'
  AND (
    has_role(auth.uid(), 'secretaria'::app_role)
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);
