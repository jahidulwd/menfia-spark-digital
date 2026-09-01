REVOKE ALL ON FUNCTION public.bootstrap_current_user() FROM anon, public;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
GRANT EXECUTE ON FUNCTION public.bootstrap_current_user() TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;