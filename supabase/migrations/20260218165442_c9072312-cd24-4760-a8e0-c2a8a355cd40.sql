
-- Allow users to update their own payments (for balance deduction)
CREATE POLICY "Users update own payments"
ON public.payments
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
