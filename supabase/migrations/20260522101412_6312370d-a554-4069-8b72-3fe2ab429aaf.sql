
REVOKE EXECUTE ON FUNCTION public.list_available_tests() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_test_for_attempt(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.submit_test_attempt(uuid, jsonb, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.list_available_tests() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_test_for_attempt(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_test_attempt(uuid, jsonb, integer) TO authenticated;
