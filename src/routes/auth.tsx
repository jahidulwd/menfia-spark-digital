import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search["redirect"] === "string" ? (search["redirect"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in — Menfia Digital" },
      { name: "description", content: "Sign in to manage products, pages and orders, or access your purchased downloads." },
      { property: "og:title", content: "Sign in — Menfia Digital" },
      { property: "og:description", content: "Access your Menfia Digital account, downloads and admin tools." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const schema = z.object({
  email: z.string().trim().email({ message: "Enter a valid email address" }).max(255),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }).max(72),
});

function AuthPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/auth" });
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const target = search.redirect && search.redirect.startsWith("/") ? search.redirect : "/admin";

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: target });
    });
  }, [navigate, target]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check your details");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: { emailRedirectTo: `${window.location.origin}/auth` },
        });
        if (error) throw error;
        toast.success("Account created — check your email if confirmation is required.");
      } else {
        const { error } = await supabase.auth.signInWithPassword(parsed.data);
        if (error) throw error;
      }
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        await supabase.rpc("bootstrap_current_user");
        navigate({ to: target });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not sign you in");
    } finally {
      setBusy(false);
    }
  }

  const input =
    "mt-2 w-full rounded-lg border border-steel bg-white px-4 py-3 text-sm text-carbon focus:border-volt-dim focus:outline-none";

  return (
    <main className="min-h-[80vh] bg-titan">
      <div className="mx-auto max-w-md px-6 py-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt-dim">/ account access</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-carbon">
          {mode === "signin" ? "Sign in" : "Create account"}
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          Admins manage products, pages and orders. Customers can access purchased downloads.
        </p>

        <form onSubmit={submit} className="mt-8 rounded-xl border border-steel bg-white/70 p-6">
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/50">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={input}
              placeholder="you@company.com"
            />
          </label>
          <label className="mt-4 block">
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/50">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={input}
              placeholder="••••••••"
            />
          </label>
          <button
            type="submit"
            disabled={busy}
            className="mt-6 w-full rounded-lg bg-volt px-6 py-3.5 font-mono text-[12px] font-semibold uppercase tracking-[0.15em] text-carbon transition hover:brightness-95 disabled:opacity-60"
          >
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-4 w-full font-mono text-[11px] uppercase tracking-[0.15em] text-ink/50 hover:text-carbon"
          >
            {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
