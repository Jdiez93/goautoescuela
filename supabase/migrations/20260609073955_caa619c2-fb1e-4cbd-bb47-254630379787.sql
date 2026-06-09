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
  WITH ranked AS (
    SELECT ta.user_id,
           ta.test_id,
           ta.score_percentage,
           ROW_NUMBER() OVER (PARTITION BY ta.user_id ORDER BY ta.created_at DESC) AS rn
    FROM public.test_attempts ta
    WHERE ta.user_id = ANY(_user_ids)
  ),
  last10 AS (
    SELECT user_id, score_percentage, rn,
           (11 - rn)::numeric AS weight  -- rn=1 (más reciente) -> peso 10; rn=10 -> peso 1
    FROM ranked
    WHERE rn <= 10
  ),
  weighted AS (
    SELECT user_id,
           ROUND((SUM(score_percentage * weight) / NULLIF(SUM(weight), 0))::numeric, 1) AS readiness
    FROM last10
    GROUP BY user_id
  ),
  totals AS (
    SELECT user_id,
           COUNT(*)::int AS attempts_count,
           COUNT(DISTINCT test_id)::int AS tests_count
    FROM ranked
    GROUP BY user_id
  )
  SELECT u AS user_id,
         COALESCE(w.readiness, 0)::numeric AS readiness,
         COALESCE(t.attempts_count, 0)::int AS attempts_count,
         COALESCE(t.tests_count, 0)::int AS tests_count
  FROM unnest(_user_ids) AS u
  LEFT JOIN weighted w ON w.user_id = u
  LEFT JOIN totals t ON t.user_id = u;
END;
$$;