import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { getMyAccess } from "@/lib/account.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const tabs = [
  { to: "/admin", label: "Overview", exact: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/pages", label: "Pages" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/messages", label: "Messages" },
  { to: "/admin/settings", label: "Paddle" },
] as const;

function AdminLayout() {
  const navigate = useNavigate();
  const access = useServerFn(getMyAccess);
  const { data, isLoading } = useQuery({ queryKey: ["my-access"], queryFn: () => access() });

  if (isLoading) {
    return <div className="p-10 font-mono text-xs uppercase tracking-[0.2em] text-ink/50">Loading…</div>;
  }

  if (!data?.isAdmin) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight text-carbon">Admin access required</h1>
        <p className="mt-3 text-sm text-ink/60">
          This account is not an admin. Sign in with the admin email to manage the store.
        </p>
        <button
          onClick={async () => {
            await supabase.auth.signOut();
            navigate({ to: "/auth" });
          }}
          className="mt-6 rounded-full bg-carbon px-6 py-3 font-mono text-[11px] uppercase tracking-[0.15em] text-volt"
        >
          Switch account
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-titan">
      <div className="border-b border-steel bg-white/60">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-6 py-4 lg:px-10">
          <p className="mr-4 font-mono text-[11px] uppercase tracking-[0.2em] text-volt-dim">/ backend</p>
          {tabs.map((tab) => (
            <Link
              key={tab.to}
              to={tab.to}
              activeOptions={{ exact: "exact" in tab }}
              activeProps={{ className: "bg-carbon text-volt" }}
              className="rounded-full border border-steel px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink/60 hover:text-carbon"
            >
              {tab.label}
            </Link>
          ))}
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/" });
            }}
            className="ml-auto font-mono text-[11px] uppercase tracking-[0.12em] text-ink/40 hover:text-carbon"
          >
            Sign out
          </button>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-10">
        <Outlet />
      </div>
    </main>
  );
}
