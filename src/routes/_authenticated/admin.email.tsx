import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { adminGetEmailSettings, adminSaveEmailSettings, adminSendTestEmail } from "@/lib/email-settings.functions";

export const Route = createFileRoute("/_authenticated/admin/email")({
  component: AdminEmail,
});

const input =
  "mt-2 w-full rounded-lg border border-steel bg-white px-3 py-2.5 text-sm text-carbon focus:border-volt-dim focus:outline-none";
const label = "font-mono text-[10px] uppercase tracking-[0.15em] text-ink/50";

function AdminEmail() {
  const qc = useQueryClient();
  const get = useServerFn(adminGetEmailSettings);
  const save = useServerFn(adminSaveEmailSettings);
  const test = useServerFn(adminSendTestEmail);
  const { data } = useQuery({ queryKey: ["email-settings"], queryFn: () => get() });
  const [fromEmail, setFromEmail] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    if (data) {
      setFromEmail(data.from_email);
      setAdminEmail(data.admin_email);
    }
  }, [data]);

  const saveM = useMutation({
    mutationFn: () =>
      save({ data: { from_email: fromEmail, admin_email: adminEmail, resend_api_key: apiKey || undefined } }),
    onSuccess: () => {
      toast.success("Email settings saved");
      setApiKey("");
      qc.invalidateQueries({ queryKey: ["email-settings"] });
    },
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Could not save"),
  });
  const testM = useMutation({
    mutationFn: () => test(),
    onSuccess: (r) => toast.success(`Test email sent to ${r.to}`),
    onError: (e: unknown) => toast.error(e instanceof Error ? e.message : "Test failed"),
  });

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-extrabold tracking-tight text-carbon">Email (Resend)</h1>
      <p className="mt-1 text-sm text-ink/60">
        Used for contact form notifications and customer thank-you emails. The API key is stored on the server and is
        never shown again after saving.
      </p>
      <div className="mt-8 rounded-xl border border-steel bg-white/70 p-6">
        <label className="block">
          <span className={label}>Resend API key (server only)</span>
          <input
            type="password"
            className={input}
            placeholder={data?.has_key ? "Saved — leave empty to keep it" : "re_..."}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </label>
        <label className="mt-4 block">
          <span className={label}>Sender (from)</span>
          <input
            className={input}
            placeholder="Menfia Digital <hello@yourdomain.com>"
            value={fromEmail}
            onChange={(e) => setFromEmail(e.target.value)}
          />
          <span className="mt-2 block text-xs text-ink/50">
            Must use a domain verified in Resend. onboarding@resend.dev only delivers to your own Resend account email.
          </span>
        </label>
        <label className="mt-4 block">
          <span className={label}>Admin email (receives new messages)</span>
          <input className={input} value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} />
        </label>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => saveM.mutate()}
            disabled={saveM.isPending}
            className="rounded-full bg-volt px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-carbon disabled:opacity-60"
          >
            {saveM.isPending ? "Saving…" : "Save"}
          </button>
          <button
            onClick={() => testM.mutate()}
            disabled={testM.isPending}
            className="rounded-full border border-carbon px-6 py-3 font-mono text-[11px] uppercase tracking-[0.15em] text-carbon disabled:opacity-60"
          >
            {testM.isPending ? "Sending…" : "Send test email"}
          </button>
        </div>
      </div>
    </div>
  );
}
