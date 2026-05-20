
-- Allow anonymous/just-created matriculas to be updated (e.g. to attach file URLs)
-- only while user_id is still NULL. Once secretaria links it to a user, locks down.
CREATE POLICY "Anon update orphan matricula"
ON public.matriculas
FOR UPDATE
USING (user_id IS NULL)
WITH CHECK (user_id IS NULL);
