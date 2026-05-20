DROP POLICY IF EXISTS "Anon delete incomplete orphan matricula docs" ON storage.objects;
CREATE POLICY "Anon delete incomplete orphan matricula docs"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'matriculas'
  AND auth.uid() IS NULL
  AND EXISTS (
    SELECT 1
    FROM public.matriculas m
    WHERE m.id = ((storage.foldername(name))[1])::uuid
      AND m.user_id IS NULL
      AND m.created_at > now() - interval '1 hour'
  )
);