import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { getMyAccess } from "@/lib/account.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
});

const groups = [
  {
    title: "Overview",
    items: [{ to: "/admin", label: "Dashboard", exact: true }],
  },
  {
    title: "Store",
    items: [
      { to: "/admin/products", label: "Products" },
      { to: "/admin/orders", label: "Orders" },
      { to: "/admin/settings", label: "Paddle" },
    ],
  },
  {
    title: "Content",
    items: [
      { to: "/admin/pages", label: "Pages" },
      { to: "/admin/footer", label: "Footer" },
      { to: "/admin/messages", label: "Messages" },
    ],
  },
  {
    title: "Account",
    items: [{ to: "/account/password", label: "Password" }],
  },
] as const;

function AdminLayout() {
  const navigate = useNavigate();
  const access = useServerFn(getMyAccess);
  const { data, isLoading } = useQuery({ queryKey: ["my-access"], queryFn: () => access() });
  const [open, setOpen] = useState(false);

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

  const nav = (
    <nav className="space-y-8">
      {groups.map((group) => (
        <div key={group.title}>
          <p className="px-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/30">{group.title}</p>
          <ul className="mt-3 space-y-1">
            {group.items.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: "exact" in item }}
                  activeProps={{ className: "bg-volt/15 text-volt border-volt/30" }}
                  className="block rounded-lg border border-transparent px-3 py-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white/55 transition hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-titan lg:flex">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col justify-between bg-carbon px-4 py-7 lg:sticky lg:top-0 lg:flex lg:h-screen">
        <div>
          <div className="px-3">
            <p className="text-sm font-extrabold tracking-tight text-volt">MENFIA DIGITAL</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">Control panel</p>
          </div>
          <div className="mt-9">{nav}</div>
        </div>
        <div className="px-3">
          <Link to="/" className="block font-mono text-[10px] uppercase tracking-[0.15em] text-white/40 hover:text-volt">
            View site /
          </Link>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              navigate({ to: "/" });
            }}
            className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-white/40 hover:text-volt"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-carbon/70" onClick={() => setOpen(false)} aria-label="Close menu" />
          <aside className="relative h-full w-72 overflow-y-auto bg-carbon px-4 py-7">
            <p className="px-3 text-sm font-extrabold tracking-tight text-volt">MENFIA DIGITAL</p>
            <div className="mt-8">{nav}</div>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                navigate({ to: "/" });
              }}
              className="mt-10 px-3 font-mono text-[10px] uppercase tracking-[0.15em] text-white/40"
            >
              Sign out
            </button>
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-steel bg-white/75 px-6 py-4 backdrop-blur lg:px-10">
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg border border-steel px-3 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/60 lg:hidden"
          >
            Menu
          </button>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt-dim">/ backend</p>
          <p className="ml-auto hidden font-mono text-[11px] uppercase tracking-[0.12em] text-ink/40 sm:block">
            {data?.email ?? "admin"}
          </p>
        </header>
        <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
