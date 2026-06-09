CREATE OR REPLACE FUNCTION public.secretaria_get_test_readiness(_user_ids uuid[])
RETURNS TABLE(user_id uuid, readiness numeric, attempts_count integer, tests_count integer)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT (public.has_role(auth.uid(), 'secretaria'::app_role) OR public.has_role(auth.uid(), 'admin'::app_role)) THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;

  RETURN QUERY
  WITH best_per_test AS (
    SELECT ta.user_id, ta.test_id, MAX(ta.score_percentage) AS best_score
    FROM public.test_attempts ta
    WHERE ta.user_id = ANY(_user_ids)
    GROUP BY ta.user_id, ta.test_id
  ),
  agg_best AS (
    SELECT bpt.user_id,
           ROUND(AVG(bpt.best_score)::numeric, 1) AS readiness,
           COUNT(DISTINCT bpt.test_id)::int AS tests_count
    FROM best_per_test bpt
    GROUP BY bpt.user_id
  ),
  agg_attempts AS (
    SELECT ta.user_id, COUNT(*)::int AS attempts_count
    FROM public.test_attempts ta
    WHERE ta.user_id = ANY(_user_ids)
    GROUP BY ta.user_id
  )
  SELECT u AS user_id,
         COALESCE(ab.readiness, 0)::numeric AS readiness,
         COALESCE(aa.attempts_count, 0)::int AS attempts_count,
         COALESCE(ab.tests_count, 0)::int AS tests_count
  FROM unnest(_user_ids) AS u
  LEFT JOIN agg_best ab ON ab.user_id = u
  LEFT JOIN agg_attempts aa ON aa.user_id = u;
END;
$$;