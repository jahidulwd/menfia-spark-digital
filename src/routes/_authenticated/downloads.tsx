import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { getMyDownloadLink, listMyOrders } from "@/lib/account.functions";

export const Route = createFileRoute("/_authenticated/downloads")({
  component: Downloads,
});

function Downloads() {
  const list = useServerFn(listMyOrders);
  const link = useServerFn(getMyDownloadLink);
  const { data, isLoading } = useQuery({ queryKey: ["my-orders"], queryFn: () => list() });

  async function download(orderId: string) {
    try {
      const res = await link({ data: { orderId } });
      if (res.url) window.open(res.url, "_blank", "noopener");
      else toast.error("No file available yet.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create the download link");
    }
  }

  return (
    <main className="min-h-screen bg-titan">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt-dim">/ your library</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-carbon">Downloads</h1>
        <p className="mt-2 text-sm text-ink/60">Paid orders unlock an expiring, private download link.</p>

        <div className="mt-8 grid gap-3">
          {isLoading && <p className="text-sm text-ink/50">Loading…</p>}
          {!isLoading && (data ?? []).length === 0 && (
            <div className="rounded-xl border border-dashed border-steel p-10 text-center">
              <p className="text-sm text-ink/55">No purchases yet.</p>
              <Link
                to="/products"
                className="mt-4 inline-block font-mono text-[11px] uppercase tracking-[0.15em] text-volt-dim"
              >
                Browse products
              </Link>
            </div>
          )}
          {(data ?? []).map((order: any) => (
            <div
              key={order.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-steel bg-white/70 p-5"
            >
              <div>
                <p className="font-bold text-carbon">{order.products?.title ?? "Product"}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/40">
                  {new Date(order.created_at).toLocaleDateString()} · {order.status} · {order.currency}{" "}
                  {(order.amount_cents / 100).toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => download(order.id)}
                disabled={order.status !== "paid"}
                className="rounded-full bg-volt px-5 py-2.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-carbon disabled:opacity-40"
              >
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
