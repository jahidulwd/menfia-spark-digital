import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { adminListOrders, adminListProducts, adminListSubmissions } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Overview,
});

function Card({ label, value, to }: { label: string; value: string | number; to: string }) {
  return (
    <Link to={to} className="rounded-xl border border-steel bg-white/70 p-6 hover:border-volt-dim">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50">{label}</p>
      <p className="mt-3 text-3xl font-extrabold tracking-tight text-carbon">{value}</p>
    </Link>
  );
}

function Overview() {
  const products = useServerFn(adminListProducts);
  const orders = useServerFn(adminListOrders);
  const messages = useServerFn(adminListSubmissions);

  const p = useQuery({ queryKey: ["admin-products"], queryFn: () => products() });
  const o = useQuery({ queryKey: ["admin-orders"], queryFn: () => orders() });
  const m = useQuery({ queryKey: ["admin-messages"], queryFn: () => messages() });

  const paid = (o.data ?? []).filter((row: any) => row.status === "paid");
  const revenue = paid.reduce((sum: number, row: any) => sum + (row.amount_cents ?? 0), 0);

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-carbon">Backend overview</h1>
      <p className="mt-2 text-sm text-ink/60">
        Upload products, publish policy pages, watch orders and configure Paddle — all stored in your database.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card label="Products" value={(p.data ?? []).length} to="/admin/products" />
        <Card label="Paid orders" value={paid.length} to="/admin/orders" />
        <Card
          label="Revenue"
          value={`$${(revenue / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          to="/admin/orders"
        />
        <Card
          label="New messages"
          value={(m.data ?? []).filter((row: any) => !row.handled).length}
          to="/admin/messages"
        />
      </div>
    </div>
  );
}
