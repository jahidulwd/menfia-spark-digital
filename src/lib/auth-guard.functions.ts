import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type TurnstileSettings = { site_key?: string; secret_key?: string; enabled?: boolean };

async function readTurnstile(): Promise<TurnstileSettings> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.from("app_settings").select("value").eq("key", "turnstile").maybeSingle();
  return (data?.value ?? {}) as TurnstileSettings;
}

function isActive(s: TurnstileSettings) {
  return Boolean(s.enabled && s.site_key && s.secret_key);
}

/** Public: only the publishable site key ever leaves the server. */
export const getTurnstileConfig = createServerFn({ method: "GET" }).handler(async () => {
  const s = await readTurnstile();
  return { enabled: isActive(s), siteKey: isActive(s) ? (s.site_key ?? "") : "" };
});

async function verifyTurnstile(token: string | undefined) {
  const s = await readTurnstile();
  if (!isActive(s)) return;
  if (!token) throw new Error("Please complete the security check.");
  const body = new FormData();
  body.append("secret", s.secret_key!);
  body.append("response", token);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
  const out = (await res.json().catch(() => ({}))) as { success?: boolean };
  if (!out.success) throw new Error("Security check failed. Please try again.");
}

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const credSchema = z.object({
  mode: z.enum(["signin", "signup"]),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(72),
  redirectTo: z.string().url().max(500),
  turnstileToken: z.string().max(4000).optional(),
});

/** Verifies Turnstile on the server, then signs in / signs up. */
export const protectedAuth = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => credSchema.parse(data))
  .handler(async ({ data }) => {
    await verifyTurnstile(data.turnstileToken);
    const sb = publicClient();
    if (data.mode === "signup") {
      const { data: res, error } = await sb.auth.signUp({
        email: data.email,
        password: data.password,
        options: { emailRedirectTo: data.redirectTo },
      });
      if (error) throw new Error(error.message);
      const s = res.session;
      return { session: s ? { access_token: s.access_token, refresh_token: s.refresh_token } : null };
    }
    const { data: res, error } = await sb.auth.signInWithPassword({ email: data.email, password: data.password });
    if (error) throw new Error(error.message);
    return { session: { access_token: res.session.access_token, refresh_token: res.session.refresh_token } };
  });

/** Verifies Turnstile before the browser starts Google sign-in. */
export const checkTurnstile = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ turnstileToken: z.string().max(4000).optional() }).parse(data))
  .handler(async ({ data }) => {
    await verifyTurnstile(data.turnstileToken);
    return { ok: true };
  });

async function assertAdmin(context: { supabase: any; userId: string }) {
  const { data } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  if (!data) throw new Error("Forbidden");
}

export const adminGetTurnstile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as any);
    const s = await readTurnstile();
    return { enabled: Boolean(s.enabled), site_key: s.site_key ?? "", has_secret: Boolean(s.secret_key) };
  });

export const adminSaveTurnstile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        enabled: z.boolean(),
        site_key: z.string().trim().max(200),
        secret_key: z.string().trim().max(200).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as any);
    const current = await readTurnstile();
    const value = {
      enabled: data.enabled,
      site_key: data.site_key,
      secret_key: data.secret_key ? data.secret_key : (current.secret_key ?? ""),
    };
    if (value.enabled && (!value.site_key || !value.secret_key)) {
      throw new Error("Add both the site key and secret key before turning protection on.");
    }
    const { error } = await (context as any).supabase
      .from("app_settings")
      .upsert({ key: "turnstile", value, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
