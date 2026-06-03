
CREATE TABLE public.test_attempt_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id uuid NOT NULL REFERENCES public.test_attempts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  test_id uuid NOT NULL,
  question_id text NOT NULL,
  question_text text NOT NULL,
  selected_index integer,
  correct_index integer NOT NULL,
  is_correct boolean NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.test_attempt_answers TO authenticated;
GRANT ALL ON public.test_attempt_answers TO service_role;

ALTER TABLE public.test_attempt_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own attempt answers"
ON public.test_attempt_answers FOR SELECT
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE INDEX idx_taa_user ON public.test_attempt_answers(user_id);
CREATE INDEX idx_taa_attempt ON public.test_attempt_answers(attempt_id);
CREATE INDEX idx_taa_question ON public.test_attempt_answers(user_id, question_id);

CREATE OR REPLACE FUNCTION public.submit_test_attempt(_test_id uuid, _answers jsonb, _duration_seconds integer DEFAULT 0)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _t public.tests;
  _q jsonb;
  _qid text;
  _qtext text;
  _correct integer;
  _user_ans integer;
  _total integer := 0;
  _hits integer := 0;
  _errors integer := 0;
  _score numeric(5,2);
  _passed boolean;
  _attempt_id uuid;
  _is_correct boolean;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;

  SELECT * INTO _t FROM public.tests WHERE id = _test_id AND is_active = true;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Test no encontrado';
  END IF;

  -- First pass: count
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

  -- Second pass: store per-answer rows
  FOR _q IN SELECT * FROM jsonb_array_elements(_t.questions)
  LOOP
    _qid := _q->>'id';
    _qtext := _q->>'text';
    _correct := (_q->>'correct_index')::integer;
    BEGIN
      _user_ans := (_answers->_qid)::integer;
    EXCEPTION WHEN OTHERS THEN
      _user_ans := NULL;
    END;
    _is_correct := (_user_ans IS NOT NULL AND _user_ans = _correct);
    INSERT INTO public.test_attempt_answers(
      attempt_id, user_id, test_id, question_id, question_text,
      selected_index, correct_index, is_correct
    ) VALUES (
      _attempt_id, auth.uid(), _test_id, _qid, _qtext,
      _user_ans, _correct, _is_correct
    );
  END LOOP;

  RETURN jsonb_build_object(
    'attempt_id', _attempt_id,
    'total_questions', _total,
    'correct_answers', _hits,
    'errors', _errors,
    'score_percentage', _score,
    'passed', _passed
  );
END;
$function$;
