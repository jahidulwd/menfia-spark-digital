import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

/**
 * Public license API used by the products themselves.
 *
 *   POST /api/public/license/activate    { license_key, domain, instance_id?, version? }
 *   POST /api/public/license/deactivate  { license_key, domain }
 *   POST /api/public/license/validate    { license_key, domain? }
 *   GET  /api/public/license/validate?license_key=...&domain=...
 *
 * Responses are intentionally minimal — never return customer PII.
 */

const bodySchema = z.object({
  license_key: z.string().trim().min(6).max(80),
  domain: z.string().trim().max(255).optional().or(z.literal("")),
  instance_id: z.string().trim().max(120).optional(),
  version: z.string().trim().max(40).optional(),
});

const json = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "content-type",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    },
  });

async function handle(action: string, input: z.infer<typeof bodySchema>, ip: string | null) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { normalizeDomain, isExpired } = await import("@/lib/licensing.server");

  const key = input.license_key.trim().toUpperCase();
  const domain = input.domain ? normalizeDomain(input.domain) : "";

  const { data: license } = await supabaseAdmin
    .from("licenses")
    .select("id, license_key, status, period, activation_limit, expires_at, products(title, slug, version)")
    .eq("license_key", key)
    .maybeSingle();

  if (!license) return json({ valid: false, status: "not_found", message: "License key not found" }, 404);
  const row = license as any;

  // Auto-expire on read so the stored status stays honest.
  let status = row.status as string;
  if (status === "active" && isExpired(row)) {
    status = "expired";
    await supabaseAdmin.from("licenses").update({ status: "expired" } as any).eq("id", row.id);
  }
  await supabaseAdmin.from("licenses").update({ last_checked_at: new Date().toISOString() } as any).eq("id", row.id);

  const product = row.products ?? null;
  const base = {
    status,
    product: product ? { title: product.title, slug: product.slug, version: product.version } : null,
    period: row.period,
    expires_at: row.expires_at,
    activation_limit: row.activation_limit,
  };

  if (action === "validate" || action === "status") {
    let domainActive = true;
    if (domain) {
      const { data: act } = await supabaseAdmin
        .from("license_activations")
        .select("id, active")
        .eq("license_id", row.id)
        .eq("domain", domain)
        .maybeSingle();
      domainActive = Boolean(act && (act as any).active);
      if (act) {
        await supabaseAdmin
          .from("license_activations")
          .update({ last_seen_at: new Date().toISOString() } as any)
          .eq("id", (act as any).id);
      }
    }
    return json({ ...base, valid: status === "active" && domainActive, domain: domain || null });
  }

  if (action === "activate") {
    if (!domain) return json({ valid: false, status, message: "A domain is required" }, 400);
    if (status !== "active") return json({ valid: false, status, message: `License is ${status}` }, 403);

    const { data: existing } = await supabaseAdmin
      .from("license_activations")
      .select("id, active")
      .eq("license_id", row.id)
      .eq("domain", domain)
      .maybeSingle();

    if (!existing) {
      const { count } = await supabaseAdmin
        .from("license_activations")
        .select("id", { count: "exact", head: true })
        .eq("license_id", row.id)
        .eq("active", true);
      if ((count ?? 0) >= row.activation_limit) {
        return json({ valid: false, status, message: "Activation limit reached for this license" }, 403);
      }
      await supabaseAdmin.from("license_activations").insert({
        license_id: row.id,
        domain,
        instance_id: input.instance_id ?? null,
        product_version: input.version ?? null,
        ip_address: ip,
        active: true,
      } as any);
    } else {
      await supabaseAdmin
        .from("license_activations")
        .update({
          active: true,
          instance_id: input.instance_id ?? null,
          product_version: input.version ?? null,
          ip_address: ip,
          last_seen_at: new Date().toISOString(),
        } as any)
        .eq("id", (existing as any).id);
    }
    return json({ ...base, valid: true, activated: true, domain });
  }

  if (action === "deactivate") {
    if (!domain) return json({ valid: false, status, message: "A domain is required" }, 400);
    await supabaseAdmin
      .from("license_activations")
      .update({ active: false } as any)
      .eq("license_id", row.id)
      .eq("domain", domain);
    return json({ ...base, valid: false, deactivated: true, domain });
  }

  return json({ message: "Unknown action" }, 404);
}

export const Route = createFileRoute("/api/public/license/$action")({
  server: {
    handlers: {
      OPTIONS: async () => json({ ok: true }),
      GET: async ({ params, request }) => {
        const url = new URL(request.url);
        const parsed = bodySchema.safeParse({
          license_key: url.searchParams.get("license_key") ?? "",
          domain: url.searchParams.get("domain") ?? "",
          instance_id: url.searchParams.get("instance_id") ?? undefined,
          version: url.searchParams.get("version") ?? undefined,
        });
        if (!parsed.success) return json({ message: "A license_key is required" }, 400);
        return handle(params.action, parsed.data, request.headers.get("cf-connecting-ip"));
      },
      POST: async ({ params, request }) => {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return json({ message: "Invalid JSON body" }, 400);
        }
        const parsed = bodySchema.safeParse(payload);
        if (!parsed.success) return json({ message: "A license_key is required" }, 400);
        return handle(params.action, parsed.data, request.headers.get("cf-connecting-ip"));
      },
    },
  },
});
