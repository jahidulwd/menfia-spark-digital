import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { adminGetTurnstile, adminSaveTurnstile } from "@/lib/auth-guard.functions";

export const Route = createFileRoute("/_authenticated/admin/security")({
  component: AdminSecurity,
});

const input =
  "mt-2 w-full rounded-lg border border-steel bg-white px-3 py-2.5 text-sm text-carbon focus:border-volt-dim focus:outline-none";
const label = "font-mono text-[10px] uppercase tracking-[0.15em] text-ink/50";

function AdminSecurity() {
  const qc = useQueryClient();
  const get = useServerFn(adminGetTurnstile);
  const save = useServerFn(adminSaveTurnstile);
  const { data } = useQuery({ queryKey: ["turnstile-settings"], queryFn: () => get() });
  const [enabled, setEnabled] = useState(false);
  const [siteKey, setSiteKey] = useState("");
  const [secret, setSecret] = useState("");

  useEffect(() => {
    if (data) {
      setEnabled(data.enabled);
      setSiteKey(data.site_key);
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: () => save({ data: { enabled, site_key: siteKey, secret_key: secret || undefined } }),
    onSuccess: () => {
      toast.success("Login protection saved");
      setSecret("");
      qc.invalidateQueries({ queryKey: ["turnstile-settings"] });
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Could not save"),
  });

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-extrabold tracking-tight text-carbon">Login security</h1>
      <p className="mt-1 text-sm text-ink/60">
        Cloudflare Turnstile protects sign in, sign up and Google login from bots. The secret key is stored on the
        server and is never sent to the browser.
      </p>
      <div className="mt-8 rounded-xl border border-steel bg-white/70 p-6">
        <label className="flex items-center gap-2 text-sm text-ink/70">
          <input type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
          Turn on Turnstile protection on the login page
        </label>
        <label className="mt-4 block">
          <span className={label}>Site key (public)</span>
          <input className={input} placeholder="0x4AAAA..." value={siteKey} onChange={(e) => setSiteKey(e.target.value)} />
        </label>
        <label className="mt-4 block">
          <span className={label}>Secret key (server only)</span>
          <input
            type="password"
            className={input}
            placeholder={data?.has_secret ? "Saved — leave empty to keep it" : "0x4AAAA..."}
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
          />
        </label>
        <p className="mt-4 text-xs text-ink/50">
          Get both keys in Cloudflare → Turnstile → Add widget. Add your website domain to the widget's allowed
          hostnames.
        </p>
        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="mt-6 rounded-full bg-volt px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-carbon disabled:opacity-60"
        >
          {mutation.isPending ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
