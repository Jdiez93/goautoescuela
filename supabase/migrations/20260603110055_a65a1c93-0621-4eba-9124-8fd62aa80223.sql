
CREATE OR REPLACE FUNCTION public.get_test_for_study(_test_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _t public.tests;
  _qs jsonb;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;

  SELECT * INTO _t FROM public.tests WHERE id = _test_id AND is_active = true;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Test no encontrado';
  END IF;

  SELECT COALESCE(jsonb_agg(jsonb_build_object(
    'id', q->>'id',
    'text', q->>'text',
    'options', q->'options',
    'correct_index', (q->>'correct_index')::int
  ) ORDER BY ord), '[]'::jsonb)
  INTO _qs
  FROM jsonb_array_elements(_t.questions) WITH ORDINALITY AS arr(q, ord);

  RETURN jsonb_build_object(
    'id', _t.id,
    'title', _t.title,
    'category', _t.category,
    'total_questions', _t.total_questions,
    'pass_threshold', _t.pass_threshold,
    'questions', _qs
  );
END;
$function$;
