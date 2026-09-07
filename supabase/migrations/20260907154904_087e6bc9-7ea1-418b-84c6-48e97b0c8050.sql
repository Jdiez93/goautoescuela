-- 1) Fix mutable search_path on the email queue helpers (all internal calls are schema-qualified)
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = '';
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = '';
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = '';
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = '';

-- 2) Internal-only functions: no client role should ever call them
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.email_queue_dispatch() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.email_queue_wake() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM anon, authenticated;

-- 3) Signed-in-only functions: block anonymous callers
REVOKE EXECUTE ON FUNCTION public.deduct_classes(uuid, integer) FROM anon;
REVOKE EXECUTE ON FUNCTION public.refund_class(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.secretaria_add_classes(uuid, integer, numeric, text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.secretaria_get_test_readiness(uuid[]) FROM anon;
REVOKE EXECUTE ON FUNCTION public.secretaria_get_user_balances(uuid[]) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_test_for_study(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_taken_slots(date, text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_user_role(uuid) FROM anon;

-- 4) Make sure the server-side (service role) keeps full access
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;