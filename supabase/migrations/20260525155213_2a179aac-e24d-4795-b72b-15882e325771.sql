CREATE OR REPLACE FUNCTION public.secretaria_add_classes(_user_id uuid, _num_classes integer, _amount numeric DEFAULT 0, _note text DEFAULT 'Pago en efectivo (secretaría)'::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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

  -- Notificar al alumno del saldo añadido
  INSERT INTO public.notifications (user_id, type, message)
  VALUES (
    _user_id,
    'classes_added',
    'Secretaría ha añadido ' || _num_classes::text || ' clase' ||
      CASE WHEN _num_classes = 1 THEN '' ELSE 's' END ||
      ' prácticas a tu saldo (pago presencial).'
  );

  RETURN _payment_id;
END;
$function$;