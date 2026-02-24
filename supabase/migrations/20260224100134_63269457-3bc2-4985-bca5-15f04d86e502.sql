
-- 1. Create SECURITY DEFINER function to deduct classes (for booking)
CREATE OR REPLACE FUNCTION public.deduct_classes(_user_id uuid, _num_classes integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _payment RECORD;
  _remaining integer := _num_classes;
BEGIN
  FOR _payment IN
    SELECT id, classes_remaining
    FROM public.payments
    WHERE user_id = _user_id AND status = 'completed' AND classes_remaining > 0
    ORDER BY created_at ASC
  LOOP
    IF _remaining <= 0 THEN EXIT; END IF;
    UPDATE public.payments
    SET classes_remaining = classes_remaining - LEAST(_remaining, _payment.classes_remaining)
    WHERE id = _payment.id;
    _remaining := _remaining - LEAST(_remaining, _payment.classes_remaining);
  END LOOP;

  IF _remaining > 0 THEN
    RAISE EXCEPTION 'Saldo insuficiente';
  END IF;
END;
$$;

-- 2. Create SECURITY DEFINER function to refund a class (for cancellation)
CREATE OR REPLACE FUNCTION public.refund_class(_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.payments
  SET classes_remaining = classes_remaining + 1
  WHERE id = (
    SELECT id FROM public.payments
    WHERE user_id = _user_id AND status = 'completed'
    ORDER BY created_at DESC
    LIMIT 1
  );
END;
$$;

-- 3. Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION public.deduct_classes(uuid, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.refund_class(uuid) TO authenticated;

-- 4. Drop the user self-UPDATE policy on payments (students should NOT update payments directly)
DROP POLICY IF EXISTS "Users update own payments" ON public.payments;

-- 5. Tighten profiles SELECT: students see only own profile, teachers and admins see all
DROP POLICY IF EXISTS "Authenticated can view profiles" ON public.profiles;
CREATE POLICY "View own profile or privileged"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = user_id
  OR has_role(auth.uid(), 'admin'::app_role)
  OR has_role(auth.uid(), 'teacher'::app_role)
);
