
CREATE OR REPLACE FUNCTION public.get_taken_slots(_booking_date date, _teacher_name text)
RETURNS TABLE(start_time time, end_time time)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT b.start_time, b.end_time
  FROM public.bookings b
  WHERE b.booking_date = _booking_date
    AND b.notes = _teacher_name
    AND b.status IN ('confirmed', 'pending');
$$;
