
-- Add assigned teacher to student profiles
ALTER TABLE public.profiles ADD COLUMN assigned_teacher_id uuid;

-- Allow the webhook/service role to insert payments (stripe webhook uses service role)
-- Add policy for service role inserts is handled by service_role key bypassing RLS

-- Create index for faster booking queries
CREATE INDEX IF NOT EXISTS idx_bookings_date_teacher ON public.bookings (booking_date, teacher_id);
CREATE INDEX IF NOT EXISTS idx_bookings_student ON public.bookings (student_id, booking_date);
