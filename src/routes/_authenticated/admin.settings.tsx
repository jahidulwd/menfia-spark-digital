import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { adminGetPaddleSettings, adminSavePaddleSettings } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: AdminSettings,
});

type Settings = {
  environment: "sandbox" | "production";
  client_token: string;
  api_key: string;
  webhook_secret: string;
  default_success_path: string;
};

const input =
  "mt-2 w-full rounded-lg border border-steel bg-white px-3 py-2.5 text-sm text-carbon focus:border-volt-dim focus:outline-none";
const label = "font-mono text-[10px] uppercase tracking-[0.15em] text-ink/50";

function AdminSettings() {
  const get = useServerFn(adminGetPaddleSettings);
  const save = useServerFn(adminSavePaddleSettings);
  const { data } = useQuery({ queryKey: ["paddle-settings"], queryFn: () => get() });
  const [form, setForm] = useState<Settings | null>(null);

  useEffect(() => {
    if (data) setForm(data as Settings);
  }, [data]);

  const mutation = useMutation({
    mutationFn: (payload: Settings) => save({ data: payload }),
    onSuccess: () => toast.success("Paddle settings saved"),
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Could not save"),
  });

  const webhookUrl = typeof window !== "undefined" ? `${window.location.origin}/api/public/paddle-webhook` : "";

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-extrabold tracking-tight text-carbon">Paddle configuration</h1>
      <p className="mt-1 text-sm text-ink/60">
        Keys are stored in your database and only ever read on the server. The client token is the only value sent to the
        browser, as Paddle requires.
      </p>

      {form && (
        <div className="mt-8 rounded-xl border border-steel bg-white/70 p-6">
          <label className="block">
            <span className={label}>Environment</span>
            <select
              className={input}
              value={form.environment}
              onChange={(e) => setForm({ ...form, environment: e.target.value as Settings["environment"] })}
            >
              <option value="sandbox">sandbox</option>
              <option value="production">production</option>
            </select>
          </label>
          <label className="mt-4 block">
            <span className={label}>Client-side token (public)</span>
            <input
              className={input}
              placeholder="live_... / test_..."
              value={form.client_token}
              onChange={(e) => setForm({ ...form, client_token: e.target.value })}
            />
          </label>
          <label className="mt-4 block">
            <span className={label}>API key (server only)</span>
            <input
              type="password"
              className={input}
              placeholder="pdl_..."
              value={form.api_key}
              onChange={(e) => setForm({ ...form, api_key: e.target.value })}
            />
          </label>
          <label className="mt-4 block">
            <span className={label}>Webhook secret key (server only)</span>
            <input
              type="password"
              className={input}
              placeholder="pdl_ntfset_..."
              value={form.webhook_secret}
              onChange={(e) => setForm({ ...form, webhook_secret: e.target.value })}
            />
          </label>
          <label className="mt-4 block">
            <span className={label}>Success path after payment</span>
            <input
              className={input}
              value={form.default_success_path}
              onChange={(e) => setForm({ ...form, default_success_path: e.target.value })}
            />
          </label>

          <div className="mt-6 rounded-lg border border-dashed border-steel p-4">
            <p className={label}>Webhook URL — paste into Paddle notifications</p>
            <p className="mt-2 break-all font-mono text-xs text-carbon">{webhookUrl}</p>
            <p className="mt-2 text-xs text-ink/50">
              Subscribe to transaction.completed, transaction.payment_failed and transaction.canceled.
            </p>
          </div>

          <button
            onClick={() => mutation.mutate(form)}
            disabled={mutation.isPending}
            className="mt-6 rounded-full bg-volt px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-carbon disabled:opacity-60"
          >
            {mutation.isPending ? "Saving…" : "Save settings"}
          </button>
        </div>
      )}
    </div>
  );
}
