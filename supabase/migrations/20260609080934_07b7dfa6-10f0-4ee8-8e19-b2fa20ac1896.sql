CREATE OR REPLACE FUNCTION public.secretaria_get_test_readiness(_user_ids uuid[])
RETURNS TABLE(user_id uuid, readiness numeric, attempts_count integer, tests_count integer)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT (public.has_role(auth.uid(), 'secretaria'::app_role) OR public.has_role(auth.uid(), 'admin'::app_role)) THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;

  RETURN QUERY
  WITH requested_users AS (
    SELECT requested_user_id
    FROM unnest(_user_ids) AS requested(requested_user_id)
  ),
  ranked AS (
    SELECT ta.user_id AS attempt_user_id,
           ta.test_id AS attempt_test_id,
           ta.score_percentage AS attempt_score_percentage,
           ROW_NUMBER() OVER (PARTITION BY ta.user_id ORDER BY ta.created_at DESC) AS attempt_rank
    FROM public.test_attempts ta
    WHERE ta.user_id = ANY(_user_ids)
  ),
  last10 AS (
    SELECT r.attempt_user_id,
           r.attempt_score_percentage,
           (11 - r.attempt_rank)::numeric AS attempt_weight
    FROM ranked r
    WHERE r.attempt_rank <= 10
  ),
  weighted AS (
    SELECT l.attempt_user_id,
           ROUND((SUM(l.attempt_score_percentage * l.attempt_weight) / NULLIF(SUM(l.attempt_weight), 0))::numeric, 1) AS calculated_readiness
    FROM last10 l
    GROUP BY l.attempt_user_id
  ),
  totals AS (
    SELECT r.attempt_user_id,
           COUNT(*)::integer AS calculated_attempts_count,
           COUNT(DISTINCT r.attempt_test_id)::integer AS calculated_tests_count
    FROM ranked r
    GROUP BY r.attempt_user_id
  )
  SELECT ru.requested_user_id AS user_id,
         COALESCE(w.calculated_readiness, 0)::numeric AS readiness,
         COALESCE(t.calculated_attempts_count, 0)::integer AS attempts_count,
         COALESCE(t.calculated_tests_count, 0)::integer AS tests_count
  FROM requested_users ru
  LEFT JOIN weighted w ON w.attempt_user_id = ru.requested_user_id
  LEFT JOIN totals t ON t.attempt_user_id = ru.requested_user_id;
END;
$function$;

NOTIFY pgrst, 'reload schema';