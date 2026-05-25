
-- RPC: secretaria/admin reads class balances for a set of users
CREATE OR REPLACE FUNCTION public.secretaria_get_user_balances(_user_ids uuid[])
RETURNS TABLE(user_id uuid, balance integer)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NOT (public.has_role(auth.uid(), 'secretaria'::app_role) OR public.has_role(auth.uid(), 'admin'::app_role)) THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;

  RETURN QUERY
  SELECT p.user_id, COALESCE(SUM(p.classes_remaining), 0)::integer AS balance
  FROM public.payments p
  WHERE p.user_id = ANY(_user_ids)
    AND p.status = 'completed'
  GROUP BY p.user_id;
END;
$$;

-- RPC: secretaria/admin adds classes (cash payment in-store) to a user
CREATE OR REPLACE FUNCTION public.secretaria_add_classes(
  _user_id uuid,
  _num_classes integer,
  _amount numeric DEFAULT 0,
  _note text DEFAULT 'Pago en efectivo (secretaría)'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _payment_id uuid;
BEGIN
  IF NOT (public.has_role(auth.uid(), 'secretaria'::app_role) OR public.has_role(auth.uid(), 'admin'::app_role)) THEN
    RAISE EXCEPTION 'No autorizado';
  END IF;

  IF _user_id IS NULL THEN
    RAISE EXCEPTION 'Usuario no válido';
  END IF;

  IF _num_classes IS NULL OR _num_classes <= 0 THEN
    RAISE EXCEPTION 'Número de clases inválido';
  END IF;

  INSERT INTO public.payments (
    user_id, amount, classes_purchased, classes_remaining, status, stripe_payment_id
  ) VALUES (
    _user_id,
    COALESCE(_amount, 0),
    _num_classes,
    _num_classes,
    'completed',
    'cash:' || COALESCE(_note, '')
  )
  RETURNING id INTO _payment_id;

  RETURN _payment_id;
END;
$$;
