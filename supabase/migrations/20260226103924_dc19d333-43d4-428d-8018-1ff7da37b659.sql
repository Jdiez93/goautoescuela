
-- Table for teacher blocked time slots
CREATE TABLE public.teacher_blocked_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL,
  blocked_date date NOT NULL,
  start_time time WITHOUT TIME ZONE NOT NULL,
  end_time time WITHOUT TIME ZONE NOT NULL,
  reason text DEFAULT '',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (teacher_id, blocked_date, start_time)
);

ALTER TABLE public.teacher_blocked_slots ENABLE ROW LEVEL SECURITY;

-- Teachers can view their own blocked slots
CREATE POLICY "Teachers view own blocks"
ON public.teacher_blocked_slots FOR SELECT
USING (auth.uid() = teacher_id);

-- Teachers can insert their own blocks
CREATE POLICY "Teachers insert own blocks"
ON public.teacher_blocked_slots FOR INSERT
WITH CHECK (auth.uid() = teacher_id AND has_role(auth.uid(), 'teacher'::app_role));

-- Teachers can delete their own blocks
CREATE POLICY "Teachers delete own blocks"
ON public.teacher_blocked_slots FOR DELETE
USING (auth.uid() = teacher_id AND has_role(auth.uid(), 'teacher'::app_role));

-- Admins full access
CREATE POLICY "Admins manage blocks"
ON public.teacher_blocked_slots FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Update get_taken_slots to also return blocked slots
CREATE OR REPLACE FUNCTION public.get_taken_slots(_booking_date date, _teacher_name text)
RETURNS TABLE(start_time time without time zone, end_time time without time zone)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  -- Existing bookings
  SELECT b.start_time, b.end_time
  FROM public.bookings b
  WHERE b.booking_date = _booking_date
    AND b.notes = _teacher_name
    AND b.status IN ('confirmed', 'pending')
  UNION ALL
  -- Teacher blocked slots (match by profile name)
  SELECT bs.start_time, bs.end_time
  FROM public.teacher_blocked_slots bs
  JOIN public.profiles p ON p.user_id = bs.teacher_id
  WHERE bs.blocked_date = _booking_date
    AND p.full_name = _teacher_name
$$;
