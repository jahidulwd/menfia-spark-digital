export type EmailSettings = { resend_api_key: string; from_email: string; admin_email: string };

/** Email settings live in the database (admin panel); only server code reads them. */
export async function readEmailSettings(): Promise<EmailSettings> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.from("app_settings").select("value").eq("key", "email").maybeSingle();
  const v = (data?.value ?? {}) as Partial<EmailSettings>;
  return {
    resend_api_key: v.resend_api_key || process.env["RESEND_API_KEY"] || "",
    from_email: v.from_email || "Menfia Digital <onboarding@resend.dev>",
    admin_email: v.admin_email || "jahidulwd@gmail.com",
  };
}

export async function sendResendEmail(s: EmailSettings, payload: Record<string, unknown>) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${s.resend_api_key}` },
    body: JSON.stringify({ from: s.from_email, ...payload }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`Resend request failed [${res.status}]: ${body}`);
    let detail = body;
    try {
      detail = (JSON.parse(body) as { message?: string }).message ?? body;
    } catch {}
    throw new Error(`Resend error (${res.status}): ${detail}`);
  }
  return res.json();
}
