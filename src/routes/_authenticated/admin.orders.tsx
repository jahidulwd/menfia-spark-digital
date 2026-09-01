import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { adminListOrders } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  component: AdminOrders,
});

function AdminOrders() {
  const list = useServerFn(adminListOrders);
  const { data, isLoading } = useQuery({ queryKey: ["admin-orders"], queryFn: () => list() });

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-carbon">Orders</h1>
      <p className="mt-1 text-sm text-ink/60">
        Every checkout creates a pending order; Paddle confirms payment through the webhook.
      </p>
      <div className="mt-8 overflow-x-auto rounded-xl border border-steel bg-white/70">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-steel font-mono text-[10px] uppercase tracking-[0.15em] text-ink/50">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Transaction</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-ink/50">
                  Loading…
                </td>
              </tr>
            )}
            {!isLoading && (data ?? []).length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-ink/50">
                  No orders yet.
                </td>
              </tr>
            )}
            {(data ?? []).map((row: any) => (
              <tr key={row.id} className="border-b border-steel/60 last:border-0">
                <td className="px-4 py-3 text-ink/60">{new Date(row.created_at).toLocaleString()}</td>
                <td className="px-4 py-3 font-semibold text-carbon">{row.products?.title ?? "—"}</td>
                <td className="px-4 py-3 text-ink/60">{row.email}</td>
                <td className="px-4 py-3 text-ink/60">
                  {row.currency} {(row.amount_cents / 100).toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 font-mono text-[10px] uppercase ${
                      row.status === "paid" ? "bg-volt text-carbon" : "bg-steel text-ink/60"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-ink/50">{row.paddle_transaction_id ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
