-- app_settings access
GRANT SELECT, INSERT, UPDATE, DELETE ON public.app_settings TO authenticated;
GRANT ALL ON public.app_settings TO service_role;

CREATE POLICY "admins manage settings" ON public.app_settings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- storage policies
CREATE POLICY "public read product images" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'product-images');

CREATE POLICY "admins manage product images" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "admins manage product files" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'product-files' AND public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (bucket_id = 'product-files' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- bootstrap profile + role for the signed-in user
CREATE OR REPLACE FUNCTION public.bootstrap_current_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  em text;
BEGIN
  IF uid IS NULL THEN
    RETURN;
  END IF;
  SELECT email INTO em FROM auth.users WHERE id = uid;
  INSERT INTO public.profiles (id, email)
  VALUES (uid, coalesce(em, ''))
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (uid, CASE WHEN lower(coalesce(em, '')) = 'jahidulwd@gmail.com' THEN 'admin'::public.app_role ELSE 'customer'::public.app_role END)
  ON CONFLICT DO NOTHING;
END;
$$;

GRANT EXECUTE ON FUNCTION public.bootstrap_current_user() TO authenticated;

-- make sure the owner account is an admin if it already exists
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users WHERE lower(email) = 'jahidulwd@gmail.com'
ON CONFLICT DO NOTHING;

INSERT INTO public.profiles (id, email)
SELECT id, email FROM auth.users WHERE lower(email) = 'jahidulwd@gmail.com'
ON CONFLICT (id) DO NOTHING;

-- default paddle settings row
INSERT INTO public.app_settings (key, value)
VALUES ('paddle', '{"environment":"sandbox","client_token":"","vendor_id":"","webhook_configured":false}'::jsonb)
ON CONFLICT (key) DO NOTHING;