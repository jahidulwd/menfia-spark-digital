/** Server-only licensing helpers. Never import this from client code. */

export type LicensePeriod = "lifetime" | "monthly" | "yearly";

export function computeExpiry(period: LicensePeriod, from: Date = new Date()): string | null {
  if (period === "lifetime") return null;
  const next = new Date(from.getTime());
  if (period === "monthly") next.setMonth(next.getMonth() + 1);
  else next.setFullYear(next.getFullYear() + 1);
  return next.toISOString();
}

/** Strips protocol, www, path and port so `https://WWW.Site.com/x` becomes `site.com`. */
export function normalizeDomain(raw: string): string {
  let value = raw.trim().toLowerCase();
  value = value.replace(/^[a-z]+:\/\//, "");
  value = value.split("/")[0] ?? value;
  value = value.split("?")[0] ?? value;
  value = value.replace(/:\d+$/, "");
  value = value.replace(/^www\./, "");
  return value;
}

export function isExpired(row: { expires_at: string | null }): boolean {
  return Boolean(row.expires_at && new Date(row.expires_at).getTime() < Date.now());
}

/**
 * Issues a license for a paid order when the purchased product is licensed.
 * Idempotent: an order never receives two keys.
 */
export async function issueLicenseForOrder(orderId: string): Promise<{ licenseKey: string } | null> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data: existing } = await supabaseAdmin
    .from("licenses")
    .select("license_key")
    .eq("order_id", orderId)
    .maybeSingle();
  if (existing) return { licenseKey: (existing as any).license_key };

  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("id, email, user_id, status, product_id, products(license_enabled, license_period, license_activation_limit)")
    .eq("id", orderId)
    .maybeSingle();
  if (!order || (order as any).status !== "paid") return null;

  const product = (order as any).products as
    | { license_enabled: boolean; license_period: LicensePeriod; license_activation_limit: number }
    | null;
  if (!product?.license_enabled) return null;

  const { data: created, error } = await supabaseAdmin
    .from("licenses")
    .insert({
      product_id: (order as any).product_id,
      order_id: (order as any).id,
      user_id: (order as any).user_id,
      email: (order as any).email,
      status: "active",
      period: product.license_period,
      activation_limit: product.license_activation_limit,
      expires_at: computeExpiry(product.license_period),
    } as any)
    .select("license_key")
    .maybeSingle();
  if (error || !created) return null;
  return { licenseKey: (created as any).license_key };
}
