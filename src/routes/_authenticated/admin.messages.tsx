import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { adminListSubmissions, adminToggleSubmission } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/messages")({
  component: AdminMessages,
});

function AdminMessages() {
  const qc = useQueryClient();
  const list = useServerFn(adminListSubmissions);
  const toggle = useServerFn(adminToggleSubmission);
  const { data, isLoading } = useQuery({ queryKey: ["admin-messages"], queryFn: () => list() });

  const mutate = useMutation({
    mutationFn: (vars: { id: string; handled: boolean }) => toggle({ data: vars }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-messages"] }),
  });

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-carbon">Contact messages</h1>
      <p className="mt-1 text-sm text-ink/60">Every brief submitted through the contact form, stored in your database.</p>

      <div className="mt-8 grid gap-4">
        {isLoading && <p className="text-sm text-ink/50">Loading…</p>}
        {!isLoading && (data ?? []).length === 0 && <p className="text-sm text-ink/50">No messages yet.</p>}
        {(data ?? []).map((row: any) => (
          <article key={row.id} className="rounded-xl border border-steel bg-white/70 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold text-carbon">
                  {row.name} · <span className="font-normal text-ink/60">{row.email}</span>
                </p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-ink/40">
                  {new Date(row.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => mutate.mutate({ id: row.id, handled: !row.handled })}
                className={`rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] ${
                  row.handled ? "bg-volt text-carbon" : "border border-steel text-ink/60"
                }`}
              >
                {row.handled ? "Handled" : "Mark handled"}
              </button>
            </div>
            <dl className="mt-4 grid gap-2 font-mono text-[11px] uppercase tracking-[0.1em] text-ink/50 sm:grid-cols-3">
              {[
                ["Phone", row.phone],
                ["Company", row.company],
                ["Website", row.website],
                ["Project", row.project_type],
                ["Budget", row.budget],
                ["Timeline", row.timeline],
              ].map(([k, v]) => (
                <div key={k as string}>
                  <dt className="text-ink/35">{k}</dt>
                  <dd className="text-carbon/80 normal-case">{(v as string) || "—"}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 whitespace-pre-wrap text-sm text-ink/70">{row.message}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
