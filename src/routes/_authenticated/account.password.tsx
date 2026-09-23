import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_authenticated/account/password")({
  component: ChangePassword,
});

const schema = z
  .object({
    current: z.string().min(1, { message: "Enter your current password" }),
    next: z.string().min(8, { message: "New password must be at least 8 characters" }).max(72),
    confirm: z.string(),
  })
  .refine((v) => v.next === v.confirm, { message: "New passwords don't match" });

const input =
  "mt-2 w-full rounded-lg border border-steel bg-white px-4 py-3 text-sm text-carbon focus:border-volt-dim focus:outline-none";
const label = "font-mono text-[10px] uppercase tracking-[0.15em] text-ink/50";

function ChangePassword() {
  const { user } = useAuth();
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: parsed.data.next,
        // Cloud may require the current password for signed-in changes.
        ...({ current_password: parsed.data.current } as Record<string, string>),
      } as never);
      if (error) throw error;
      toast.success("Password updated.");
      setForm({ current: "", next: "", confirm: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update the password");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-titan">
      <div className="mx-auto max-w-lg px-6 py-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt-dim">/ account security</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-carbon">Change password</h1>
        <p className="mt-2 text-sm text-ink/60">Signed in as {user?.email ?? "…"}</p>

        <form onSubmit={submit} className="mt-8 rounded-xl border border-steel bg-white/70 p-6">
          <label className="block">
            <span className={label}>Current password</span>
            <input
              type="password"
              autoComplete="current-password"
              className={input}
              value={form.current}
              onChange={(e) => setForm({ ...form, current: e.target.value })}
            />
          </label>
          <label className="mt-5 block">
            <span className={label}>New password</span>
            <input
              type="password"
              autoComplete="new-password"
              className={input}
              value={form.next}
              onChange={(e) => setForm({ ...form, next: e.target.value })}
            />
          </label>
          <label className="mt-5 block">
            <span className={label}>Confirm new password</span>
            <input
              type="password"
              autoComplete="new-password"
              className={input}
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="mt-8 w-full rounded-lg bg-volt px-6 py-4 font-mono text-[12px] font-semibold uppercase tracking-[0.15em] text-carbon transition hover:brightness-95 disabled:opacity-60"
          >
            {busy ? "Updating…" : "Update password"}
          </button>
        </form>

        <Link
          to="/admin"
          className="mt-6 inline-block font-mono text-[11px] uppercase tracking-[0.15em] text-volt-dim hover:text-carbon"
        >
          Back to backend
        </Link>
      </div>
    </main>
  );
}
