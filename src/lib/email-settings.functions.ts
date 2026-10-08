import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { readEmailSettings, sendResendEmail } from "@/lib/email.server";

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  if (!data) throw new Error("Forbidden");
}

/** Never returns the API key itself — only whether one is saved. */
export const adminGetEmailSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as any);
    const s = await readEmailSettings();
    return { from_email: s.from_email, admin_email: s.admin_email, has_key: Boolean(s.resend_api_key) };
  });

export const adminSaveEmailSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        from_email: z.string().trim().min(3).max(200),
        admin_email: z.string().trim().email().max(255),
        resend_api_key: z.string().trim().max(200).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as any);
    const current = await readEmailSettings();
    const value = {
      from_email: data.from_email,
      admin_email: data.admin_email,
      resend_api_key: data.resend_api_key || current.resend_api_key,
    };
    const { error } = await (context as any).supabase
      .from("app_settings")
      .upsert({ key: "email", value, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminSendTestEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as any);
    const s = await readEmailSettings();
    if (!s.resend_api_key) throw new Error("Add your Resend API key first.");
    await sendResendEmail(s, {
      to: [s.admin_email],
      subject: "Menfia Digital — test email",
      html: "<p style=\"font-family:Arial,sans-serif\">Your Resend email setup works.</p>",
    });
    return { ok: true, to: s.admin_email };
  });
