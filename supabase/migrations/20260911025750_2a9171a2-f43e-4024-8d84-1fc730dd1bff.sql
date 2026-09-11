
DO $$ BEGIN
  CREATE TYPE public.license_status AS ENUM ('active','expired','suspended','revoked');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.license_period AS ENUM ('lifetime','monthly','yearly');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS license_enabled boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS license_period public.license_period NOT NULL DEFAULT 'lifetime',
  ADD COLUMN IF NOT EXISTS license_activation_limit integer NOT NULL DEFAULT 1;

CREATE OR REPLACE FUNCTION public.generate_license_key()
RETURNS text
LANGUAGE plpgsql
VOLATILE
SET search_path = public
AS $$
DECLARE
  alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  block text;
  result text := '';
  i int; j int;
BEGIN
  FOR i IN 1..4 LOOP
    block := '';
    FOR j IN 1..5 LOOP
      block := block || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
    END LOOP;
    result := CASE WHEN result = '' THEN block ELSE result || '-' || block END;
  END LOOP;
  RETURN 'MFA-' || result;
END;
$$;

CREATE TABLE IF NOT EXISTS public.licenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  license_key text NOT NULL UNIQUE DEFAULT public.generate_license_key(),
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  email text NOT NULL,
  status public.license_status NOT NULL DEFAULT 'active',
  period public.license_period NOT NULL DEFAULT 'lifetime',
  activation_limit integer NOT NULL DEFAULT 1,
  issued_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz,
  last_checked_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.licenses TO authenticated;
GRANT ALL ON public.licenses TO service_role;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins manage licenses" ON public.licenses;
CREATE POLICY "admins manage licenses" ON public.licenses FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "read own licenses" ON public.licenses;
CREATE POLICY "read own licenses" ON public.licenses FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.license_activations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  license_id uuid NOT NULL REFERENCES public.licenses(id) ON DELETE CASCADE,
  domain text NOT NULL,
  instance_id text,
  product_version text,
  ip_address text,
  active boolean NOT NULL DEFAULT true,
  activated_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (license_id, domain)
);

GRANT SELECT ON public.license_activations TO authenticated;
GRANT ALL ON public.license_activations TO service_role;
ALTER TABLE public.license_activations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins manage activations" ON public.license_activations;
CREATE POLICY "admins manage activations" ON public.license_activations FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "read own activations" ON public.license_activations;
CREATE POLICY "read own activations" ON public.license_activations FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.licenses l WHERE l.id = license_id AND l.user_id = auth.uid()));

CREATE INDEX IF NOT EXISTS licenses_email_idx ON public.licenses (email);
CREATE INDEX IF NOT EXISTS licenses_order_idx ON public.licenses (order_id);
CREATE INDEX IF NOT EXISTS activations_license_idx ON public.license_activations (license_id);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS update_licenses_updated_at ON public.licenses;
CREATE TRIGGER update_licenses_updated_at BEFORE UPDATE ON public.licenses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_license_activations_updated_at ON public.license_activations;
CREATE TRIGGER update_license_activations_updated_at BEFORE UPDATE ON public.license_activations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
