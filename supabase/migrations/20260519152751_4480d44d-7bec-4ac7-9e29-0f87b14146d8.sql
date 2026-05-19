DROP POLICY IF EXISTS "Users view own cookie consent" ON public.cookie_consents;
CREATE POLICY "Anyone can view cookie consent" ON public.cookie_consents FOR SELECT USING (true);