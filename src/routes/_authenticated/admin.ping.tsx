import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { adminGetPingStatus, adminPingNow } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/ping")({
  component: AdminPing,
});

const label = "font-mono text-[10px] uppercase tracking-[0.15em] text-ink/50";

function format(value: string | null) {
  if (!value) return "Never";
  return new Date(value).toLocaleString();
}

function AdminPing() {
  const qc = useQueryClient();
  const get = useServerFn(adminGetPingStatus);
  const ping = useServerFn(adminPingNow);
  const { data } = useQuery({ queryKey: ["keepalive"], queryFn: () => get() });

  const mutation = useMutation({
    mutationFn: () => ping(),
    onSuccess: (res) => {
      toast.success(res.ok ? "Database answered — kept alive" : "Ping recorded, but the database did not answer");
      qc.invalidateQueries({ queryKey: ["keepalive"] });
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Ping failed"),
  });

  const log = data?.log ?? [];

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-extrabold tracking-tight text-carbon">Keep-alive ping</h1>
      <p className="mt-1 text-sm text-ink/60">
        A small automatic check runs every 5 days so the database never goes idle. You can also run it yourself and see
        the history below.
      </p>

      <div className="mt-8 rounded-xl border border-steel bg-white/70 p-6">
        <p className={label}>Last successful ping</p>
        <p className="mt-2 text-xl font-extrabold tracking-tight text-carbon">{format(data?.last_ping_at ?? null)}</p>
        <p className="mt-2 text-xs text-ink/50">Automatic schedule: every 5 days at 04:00 UTC.</p>
        <button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="mt-6 rounded-full bg-volt px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-carbon disabled:opacity-60"
        >
          {mutation.isPending ? "Pinging…" : "Ping now"}
        </button>
      </div>

      <div className="mt-6 rounded-xl border border-steel bg-white/70 p-6">
        <p className={label}>Recent pings</p>
        {log.length === 0 ? (
          <p className="mt-3 text-sm text-ink/50">No pings recorded yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-steel/70">
            {log.map((entry, i) => (
              <li key={`${entry.at}-${i}`} className="flex items-center justify-between py-3 text-sm">
                <span className="text-carbon">{format(entry.at)}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/50">{entry.source}</span>
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.12em] ${
                    entry.ok ? "text-volt-dim" : "text-red-500/80"
                  }`}
                >
                  {entry.ok ? "ok" : "failed"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
