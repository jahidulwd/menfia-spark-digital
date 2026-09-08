import { createFileRoute } from "@tanstack/react-router";

import { authenticateCronRequest } from "@/integrations/supabase/cron-auth";

async function handle(request: Request) {
  const unauthorized = await authenticateCronRequest(request);
  if (unauthorized) return unauthorized;

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { error: readError } = await supabaseAdmin.from("products").select("id").limit(1);
  const now = new Date().toISOString();

  const { data } = await supabaseAdmin.from("app_settings").select("value").eq("key", "keepalive").maybeSingle();
  const value = (data?.value ?? {}) as { log?: { at: string; source: string; ok: boolean }[] };
  const log = [{ at: now, source: "cron", ok: !readError }, ...(Array.isArray(value.log) ? value.log : [])].slice(0, 20);

  await supabaseAdmin
    .from("app_settings")
    .upsert({ key: "keepalive", value: { last_ping_at: now, log }, updated_at: now }, { onConflict: "key" });

  return new Response(JSON.stringify({ ok: !readError, at: now }), {
    headers: { "Content-Type": "application/json" },
  });
}

export const Route = createFileRoute("/api/public/keepalive")({
  server: {
    handlers: {
      POST: ({ request }) => handle(request),
      GET: ({ request }) => handle(request),
    },
  },
});
