
-- Tabla tests
CREATE TABLE public.tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  total_questions integer NOT NULL DEFAULT 30,
  pass_threshold integer NOT NULL DEFAULT 27,
  questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;

-- Nadie puede SELECT directo (preguntas contienen respuestas correctas). Solo admins.
CREATE POLICY "Admins manage tests" ON public.tests
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Tabla test_attempts
CREATE TABLE public.test_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  test_id uuid NOT NULL,
  total_questions integer NOT NULL,
  correct_answers integer NOT NULL,
  errors integer NOT NULL,
  score_percentage numeric(5,2) NOT NULL,
  passed boolean NOT NULL,
  duration_seconds integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own attempts" ON public.test_attempts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins view all attempts" ON public.test_attempts
  FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_test_attempts_user_created ON public.test_attempts(user_id, created_at DESC);

-- RPC: listar tests sin exponer preguntas/respuestas
CREATE OR REPLACE FUNCTION public.list_available_tests()
RETURNS TABLE(id uuid, title text, category text, total_questions integer, pass_threshold integer)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT t.id, t.title, t.category, t.total_questions, t.pass_threshold
  FROM public.tests t
  WHERE t.is_active = true
  ORDER BY t.created_at DESC;
$$;

-- RPC: devuelve preguntas sin correct_index
CREATE OR REPLACE FUNCTION public.get_test_for_attempt(_test_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _t public.tests;
  _safe_questions jsonb;
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
    'options', q->'options'
  ) ORDER BY ord), '[]'::jsonb)
  INTO _safe_questions
  FROM jsonb_array_elements(_t.questions) WITH ORDINALITY AS arr(q, ord);

  RETURN jsonb_build_object(
    'id', _t.id,
    'title', _t.title,
    'category', _t.category,
    'total_questions', _t.total_questions,
    'pass_threshold', _t.pass_threshold,
    'questions', _safe_questions
  );
END;
$$;

-- RPC: calcula y guarda el intento en el servidor
CREATE OR REPLACE FUNCTION public.submit_test_attempt(
  _test_id uuid,
  _answers jsonb,
  _duration_seconds integer DEFAULT 0
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _t public.tests;
  _q jsonb;
  _qid text;
  _correct integer;
  _user_ans integer;
  _total integer := 0;
  _hits integer := 0;
  _errors integer := 0;
  _score numeric(5,2);
  _passed boolean;
  _attempt_id uuid;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;

  SELECT * INTO _t FROM public.tests WHERE id = _test_id AND is_active = true;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Test no encontrado';
  END IF;

  FOR _q IN SELECT * FROM jsonb_array_elements(_t.questions)
  LOOP
    _total := _total + 1;
    _qid := _q->>'id';
    _correct := (_q->>'correct_index')::integer;
    BEGIN
      _user_ans := (_answers->_qid)::integer;
    EXCEPTION WHEN OTHERS THEN
      _user_ans := NULL;
    END;
    IF _user_ans IS NOT NULL AND _user_ans = _correct THEN
      _hits := _hits + 1;
    ELSE
      _errors := _errors + 1;
    END IF;
  END LOOP;

  IF _total = 0 THEN
    _score := 0;
  ELSE
    _score := ROUND((_hits::numeric * 100.0) / _total::numeric, 2);
  END IF;
  _passed := _hits >= _t.pass_threshold;

  INSERT INTO public.test_attempts(
    user_id, test_id, total_questions, correct_answers, errors,
    score_percentage, passed, duration_seconds
  ) VALUES (
    auth.uid(), _test_id, _total, _hits, _errors,
    _score, _passed, GREATEST(_duration_seconds, 0)
  )
  RETURNING id INTO _attempt_id;

  RETURN jsonb_build_object(
    'attempt_id', _attempt_id,
    'total_questions', _total,
    'correct_answers', _hits,
    'errors', _errors,
    'score_percentage', _score,
    'passed', _passed
  );
END;
$$;
