INSERT INTO public.user_roles (user_id, role)
SELECT user_id, 'teacher'::public.app_role
FROM public.profiles
WHERE email = 'milinco93@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;