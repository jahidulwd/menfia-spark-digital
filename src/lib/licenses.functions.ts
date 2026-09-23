import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Ctx = { supabase: any; userId: string; claims?: { email?: string } };

/** Licenses owned by the signed-in customer, with the domains they are running on. */
export const listMyLicenses = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as Ctx;

    // Claim any licenses bought before the customer created an account.
    const email = ctx.claims?.email;
    if (email) {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin
        .from("licenses")
        .update({ user_id: ctx.userId } as any)
        .is("user_id", null)
        .eq("email", email);
    }

    const { data, error } = await ctx.supabase
      .from("licenses")
      .select(
        "id, license_key, status, period, activation_limit, issued_at, expires_at, products(title, slug, version), license_activations(id, domain, active, activated_at, last_seen_at)",
      )
      .eq("user_id", ctx.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });
