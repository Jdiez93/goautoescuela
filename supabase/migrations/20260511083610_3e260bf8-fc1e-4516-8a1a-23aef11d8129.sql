ALTER TABLE public.chat_messages
  ADD COLUMN IF NOT EXISTS anon_id uuid;

ALTER TABLE public.chat_messages
  ALTER COLUMN user_id DROP NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'chat_messages_owner_check'
  ) THEN
    ALTER TABLE public.chat_messages
      ADD CONSTRAINT chat_messages_owner_check
      CHECK (
        (user_id IS NOT NULL AND anon_id IS NULL)
        OR (user_id IS NULL AND anon_id IS NOT NULL)
      );
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_chat_messages_user_created
  ON public.chat_messages (user_id, created_at);

CREATE INDEX IF NOT EXISTS idx_chat_messages_anon_created
  ON public.chat_messages (anon_id, created_at);

DROP POLICY IF EXISTS "Users insert own chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users view own chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users delete own chat messages" ON public.chat_messages;

CREATE POLICY "Users insert own chat messages"
ON public.chat_messages
FOR INSERT
WITH CHECK (auth.uid() = user_id AND anon_id IS NULL);

CREATE POLICY "Users view own chat messages"
ON public.chat_messages
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users delete own chat messages"
ON public.chat_messages
FOR DELETE
USING (auth.uid() = user_id);