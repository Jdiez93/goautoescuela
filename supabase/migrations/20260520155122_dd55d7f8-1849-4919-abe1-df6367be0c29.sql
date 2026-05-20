REVOKE ALL ON FUNCTION public.can_upload_matricula_document(text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.can_view_matricula_document(text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.can_manage_matricula_document() FROM PUBLIC, anon, authenticated;