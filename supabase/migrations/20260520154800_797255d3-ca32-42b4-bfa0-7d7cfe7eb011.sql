CREATE OR REPLACE FUNCTION public.can_upload_matricula_document(_object_name text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _matricula_id uuid;
  _owner uuid;
BEGIN
  BEGIN
    _matricula_id := (storage.foldername(_object_name))[1]::uuid;
  EXCEPTION WHEN OTHERS THEN
    RETURN false;
  END;

  SELECT user_id INTO _owner
  FROM public.matriculas
  WHERE id = _matricula_id;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  RETURN _owner IS NULL
    OR _owner = auth.uid()
    OR public.has_role(auth.uid(), 'secretaria'::app_role)
    OR public.has_role(auth.uid(), 'admin'::app_role);
END;
$$;

CREATE OR REPLACE FUNCTION public.can_view_matricula_document(_object_name text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _matricula_id uuid;
  _owner uuid;
BEGIN
  BEGIN
    _matricula_id := (storage.foldername(_object_name))[1]::uuid;
  EXCEPTION WHEN OTHERS THEN
    RETURN false;
  END;

  SELECT user_id INTO _owner
  FROM public.matriculas
  WHERE id = _matricula_id;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  RETURN _owner = auth.uid()
    OR public.has_role(auth.uid(), 'secretaria'::app_role)
    OR public.has_role(auth.uid(), 'admin'::app_role);
END;
$$;

CREATE OR REPLACE FUNCTION public.can_manage_matricula_document()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'secretaria'::app_role)
    OR public.has_role(auth.uid(), 'admin'::app_role);
$$;

DROP POLICY IF EXISTS "Upload matricula docs" ON storage.objects;
DROP POLICY IF EXISTS "View own matricula docs" ON storage.objects;
DROP POLICY IF EXISTS "Staff update matricula docs" ON storage.objects;
DROP POLICY IF EXISTS "Staff delete matricula docs" ON storage.objects;

CREATE POLICY "Upload matricula docs"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'matriculas'
  AND public.can_upload_matricula_document(name)
);

CREATE POLICY "View matricula docs securely"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'matriculas'
  AND public.can_view_matricula_document(name)
);

CREATE POLICY "Staff update matricula docs"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'matriculas'
  AND public.can_manage_matricula_document()
)
WITH CHECK (
  bucket_id = 'matriculas'
  AND public.can_manage_matricula_document()
);

CREATE POLICY "Staff delete matricula docs"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'matriculas'
  AND public.can_manage_matricula_document()
);