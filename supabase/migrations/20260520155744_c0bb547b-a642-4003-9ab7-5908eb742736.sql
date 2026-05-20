GRANT EXECUTE ON FUNCTION public.can_upload_matricula_document(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.can_view_matricula_document(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.can_manage_matricula_document() TO authenticated;

DROP POLICY IF EXISTS "Anon delete incomplete orphan matricula" ON public.matriculas;
CREATE POLICY "Anon delete incomplete orphan matricula"
ON public.matriculas
FOR DELETE
USING (
  auth.uid() IS NULL
  AND user_id IS NULL
  AND contrato_firmado_url IS NULL
  AND dni_anverso_url IS NULL
  AND dni_reverso_url IS NULL
  AND created_at > now() - interval '1 hour'
);