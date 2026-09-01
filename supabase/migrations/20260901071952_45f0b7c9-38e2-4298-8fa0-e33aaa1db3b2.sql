DROP POLICY IF EXISTS "Anyone can view cookie consent" ON public.cookie_consents;
DROP POLICY IF EXISTS "Anyone can update cookie consent" ON public.cookie_consents;
DROP POLICY IF EXISTS "Anyone can insert cookie consent" ON public.cookie_consents;

CREATE POLICY "Owners and admins view cookie consent"
ON public.cookie_consents
FOR SELECT
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::app_role));

REVOKE SELECT, INSERT, UPDATE, DELETE ON public.cookie_consents FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.cookie_consents FROM authenticated;

CREATE OR REPLACE FUNCTION public.get_cookie_consent(p_anon_id uuid)
RETURNS TABLE(necessary boolean, preferences boolean, analytics boolean, marketing boolean)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.necessary, c.preferences, c.analytics, c.marketing
  FROM public.cookie_consents c
  WHERE c.anon_id = p_anon_id
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.upsert_cookie_consent(
  p_anon_id uuid,
  p_preferences boolean,
  p_analytics boolean,
  p_marketing boolean,
  p_policy_version text DEFAULT 'v1',
  p_user_agent text DEFAULT NULL,
  p_source_url text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.cookie_consents (
    anon_id, user_id, necessary, preferences, analytics, marketing,
    policy_version, user_agent, source_url
  )
  VALUES (
    p_anon_id, auth.uid(), true,
    COALESCE(p_preferences, false), COALESCE(p_analytics, false), COALESCE(p_marketing, false),
    LEFT(COALESCE(p_policy_version, 'v1'), 20),
    LEFT(p_user_agent, 500),
    LEFT(p_source_url, 500)
  )
  ON CONFLICT (anon_id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    preferences = EXCLUDED.preferences,
    analytics = EXCLUDED.analytics,
    marketing = EXCLUDED.marketing,
    policy_version = EXCLUDED.policy_version,
    user_agent = EXCLUDED.user_agent,
    source_url = EXCLUDED.source_url;
END;
$$;

CREATE OR REPLACE FUNCTION public.delete_cookie_consent(p_anon_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.cookie_consents WHERE anon_id = p_anon_id;
$$;

GRANT EXECUTE ON FUNCTION public.get_cookie_consent(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.upsert_cookie_consent(uuid, boolean, boolean, boolean, text, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.delete_cookie_consent(uuid) TO anon, authenticated;