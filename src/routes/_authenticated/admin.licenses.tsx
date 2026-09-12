import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";

import {
  adminDeleteLicense,
  adminIssueLicense,
  adminListLicenses,
  adminListProducts,
  adminRenewLicense,
  adminSetActivation,
  adminUpdateLicense,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/licenses")({
  component: AdminLicenses,
});

const STATUSES = ["active", "expired", "suspended", "revoked"] as const;

const chip = (status: string) =>
  status === "active"
    ? "bg-volt text-carbon"
    : status === "expired"
      ? "bg-steel text-ink/60"
      : status === "suspended"
        ? "bg-amber-200 text-carbon"
        : "bg-red-200 text-carbon";

function AdminLicenses() {
  const qc = useQueryClient();
  const list = useServerFn(adminListLicenses);
  const products = useServerFn(adminListProducts);
  const update = useServerFn(adminUpdateLicense);
  const renew = useServerFn(adminRenewLicense);
  const remove = useServerFn(adminDeleteLicense);
  const setActivation = useServerFn(adminSetActivation);
  const issue = useServerFn(adminIssueLicense);

  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newLicense, setNewLicense] = useState({
    product_id: "",
    email: "",
    period: "lifetime" as "lifetime" | "monthly" | "yearly",
    activation_limit: 1,
  });

  const licenses = useQuery({ queryKey: ["admin-licenses"], queryFn: () => list() });
  const productList = useQuery({ queryKey: ["admin-products"], queryFn: () => products() });

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-licenses"] });
  const fail = (err: unknown) => toast.error(err instanceof Error ? err.message : "Something went wrong");

  const updateMutation = useMutation({
    mutationFn: (payload: any) => update({ data: payload }),
    onSuccess: () => {
      toast.success("Licence updated");
      refresh();
    },
    onError: fail,
  });
  const renewMutation = useMutation({
    mutationFn: (id: string) => renew({ data: { id } }),
    onSuccess: () => {
      toast.success("Licence renewed");
      refresh();
    },
    onError: fail,
  });
  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      toast.success("Licence deleted");
      refresh();
    },
    onError: fail,
  });
  const activationMutation = useMutation({
    mutationFn: (payload: { id: string; active: boolean; remove?: boolean }) => setActivation({ data: payload }),
    onSuccess: () => {
      toast.success("Domain updated");
      refresh();
    },
    onError: fail,
  });
  const issueMutation = useMutation({
    mutationFn: () => issue({ data: newLicense }),
    onSuccess: (res: any) => {
      toast.success(`Licence created: ${res?.license_key ?? ""}`);
      setCreating(false);
      setNewLicense({ product_id: "", email: "", period: "lifetime", activation_limit: 1 });
      refresh();
    },
    onError: fail,
  });

  const rows = (licenses.data ?? []).filter((row: any) => {
    if (filter !== "all" && row.status !== filter) return false;
    if (!search.trim()) return true;
    const needle = search.trim().toLowerCase();
    const domains = (row.license_activations ?? []).map((a: any) => a.domain).join(" ");
    return (
      row.license_key.toLowerCase().includes(needle) ||
      (row.email ?? "").toLowerCase().includes(needle) ||
      (row.products?.title ?? "").toLowerCase().includes(needle) ||
      domains.toLowerCase().includes(needle)
    );
  });

  const input =
    "rounded-lg border border-steel bg-white px-3 py-2 text-sm text-carbon focus:border-volt-dim focus:outline-none";
  const label = "font-mono text-[10px] uppercase tracking-[0.15em] text-ink/50";

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-carbon">Licences</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink/60">
            Every paid order for a licensed product generates a key automatically. Activate, suspend, renew or expire
            keys here and see the domains each customer is running your product on.
          </p>
        </div>
        <button
          onClick={() => setCreating((v) => !v)}
          className="rounded-full bg-carbon px-6 py-3 font-mono text-[11px] uppercase tracking-[0.15em] text-volt"
        >
          {creating ? "Close" : "Issue licence"}
        </button>
      </div>

      {creating && (
        <div className="mt-6 grid gap-4 rounded-xl border border-steel bg-white/70 p-6 sm:grid-cols-4">
          <label className="block">
            <span className={label}>Product</span>
            <select
              className={`${input} mt-2 w-full`}
              value={newLicense.product_id}
              onChange={(e) => setNewLicense({ ...newLicense, product_id: e.target.value })}
            >
              <option value="">Select…</option>
              {(productList.data ?? []).map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={label}>Customer email</span>
            <input
              className={`${input} mt-2 w-full`}
              value={newLicense.email}
              onChange={(e) => setNewLicense({ ...newLicense, email: e.target.value })}
            />
          </label>
          <label className="block">
            <span className={label}>Type</span>
            <select
              className={`${input} mt-2 w-full`}
              value={newLicense.period}
              onChange={(e) => setNewLicense({ ...newLicense, period: e.target.value as any })}
            >
              <option value="lifetime">lifetime</option>
              <option value="monthly">monthly</option>
              <option value="yearly">yearly</option>
            </select>
          </label>
          <label className="block">
            <span className={label}>Domains allowed</span>
            <input
              type="number"
              min={1}
              className={`${input} mt-2 w-full`}
              value={newLicense.activation_limit}
              onChange={(e) =>
                setNewLicense({ ...newLicense, activation_limit: Math.max(1, Number(e.target.value) || 1) })
              }
            />
          </label>
          <button
            onClick={() => issueMutation.mutate()}
            disabled={issueMutation.isPending || !newLicense.product_id || !newLicense.email}
            className="rounded-full bg-volt px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-carbon disabled:opacity-50 sm:col-span-4 sm:w-fit"
          >
            {issueMutation.isPending ? "Creating…" : "Create licence key"}
          </button>
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <input
          placeholder="Search key, email, product or domain"
          className={`${input} w-72`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className={input} value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">all statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/40">{rows.length} licences</span>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-steel bg-white/70">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-steel font-mono text-[10px] uppercase tracking-[0.15em] text-ink/50">
            <tr>
              <th className="px-4 py-3">Key</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Expires</th>
              <th className="px-4 py-3">Domains</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {licenses.isLoading && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-ink/50">
                  Loading…
                </td>
              </tr>
            )}
            {!licenses.isLoading && rows.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-ink/50">
                  No licences yet.
                </td>
              </tr>
            )}
            {rows.map((row: any) => {
              const activations = row.license_activations ?? [];
              const activeCount = activations.filter((a: any) => a.active).length;
              return (
                <>
                  <tr key={row.id} className="border-b border-steel/60 last:border-0">
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          void navigator.clipboard?.writeText(row.license_key);
                          toast.success("Key copied");
                        }}
                        className="font-mono text-xs text-carbon hover:text-volt-dim"
                        title="Copy key"
                      >
                        {row.license_key}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-ink/70">{row.products?.title ?? "—"}</td>
                    <td className="px-4 py-3 text-ink/60">{row.email}</td>
                    <td className="px-4 py-3 font-mono text-[10px] uppercase text-ink/50">{row.period}</td>
                    <td className="px-4 py-3 text-ink/60">
                      {row.expires_at ? new Date(row.expires_at).toLocaleDateString() : "never"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setOpenRow(openRow === row.id ? null : row.id)}
                        className="font-mono text-[10px] uppercase tracking-[0.12em] text-volt-dim"
                      >
                        {activeCount}/{row.activation_limit} — view
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={row.status}
                        onChange={(e) => updateMutation.mutate({ id: row.id, status: e.target.value })}
                        className={`rounded-full px-2 py-1 font-mono text-[10px] uppercase ${chip(row.status)}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => renewMutation.mutate(row.id)}
                        className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/60 hover:text-carbon"
                      >
                        Renew
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete licence ${row.license_key}?`)) deleteMutation.mutate(row.id);
                        }}
                        className="ml-4 font-mono text-[10px] uppercase tracking-[0.12em] text-red-500/80 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                  {openRow === row.id && (
                    <tr key={`${row.id}-detail`} className="border-b border-steel/60 bg-titan/60">
                      <td colSpan={8} className="px-4 py-5">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <p className={label}>Domains using this key</p>
                            {activations.length === 0 && (
                              <p className="mt-2 text-sm text-ink/50">Not activated anywhere yet.</p>
                            )}
                            <ul className="mt-2 space-y-2">
                              {activations.map((a: any) => (
                                <li
                                  key={a.id}
                                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-steel bg-white px-3 py-2"
                                >
                                  <div>
                                    <p className="font-mono text-xs text-carbon">{a.domain}</p>
                                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/40">
                                      {a.active ? "active" : "deactivated"} · last seen{" "}
                                      {new Date(a.last_seen_at).toLocaleDateString()}
                                      {a.product_version ? ` · v${a.product_version}` : ""}
                                    </p>
                                  </div>
                                  <div className="flex gap-3">
                                    <button
                                      onClick={() => activationMutation.mutate({ id: a.id, active: !a.active })}
                                      className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/60 hover:text-carbon"
                                    >
                                      {a.active ? "Deactivate" : "Reactivate"}
                                    </button>
                                    <button
                                      onClick={() => activationMutation.mutate({ id: a.id, active: false, remove: true })}
                                      className="font-mono text-[10px] uppercase tracking-[0.12em] text-red-500/80"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <label className="block">
                              <span className={label}>Expiry date</span>
                              <input
                                type="date"
                                className={`${input} mt-2 w-full`}
                                defaultValue={row.expires_at ? row.expires_at.slice(0, 10) : ""}
                                onChange={(e) =>
                                  updateMutation.mutate({ id: row.id, expires_at: e.target.value || null })
                                }
                              />
                            </label>
                            <label className="block">
                              <span className={label}>Domains allowed</span>
                              <input
                                type="number"
                                min={1}
                                className={`${input} mt-2 w-full`}
                                defaultValue={row.activation_limit}
                                onBlur={(e) =>
                                  updateMutation.mutate({
                                    id: row.id,
                                    activation_limit: Math.max(1, Number(e.target.value) || 1),
                                  })
                                }
                              />
                            </label>
                            <label className="block sm:col-span-2">
                              <span className={label}>Internal note</span>
                              <textarea
                                rows={2}
                                className={`${input} mt-2 w-full`}
                                defaultValue={row.notes ?? ""}
                                onBlur={(e) => updateMutation.mutate({ id: row.id, notes: e.target.value })}
                              />
                            </label>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-10 rounded-xl border border-steel bg-carbon p-6 text-white">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-volt">/ licence api</p>
        <p className="mt-3 text-sm text-white/70">
          Use these endpoints inside your themes, plugins and scripts to check a customer&apos;s key.
        </p>
        <pre className="mt-4 overflow-x-auto rounded-lg bg-black/40 p-4 font-mono text-[11px] leading-relaxed text-volt/90">
{`POST /api/public/license/activate
     { "license_key": "MFA-XXXXX-...", "domain": "client-site.com",
       "version": "1.0.0", "instance_id": "optional" }

POST /api/public/license/validate
     { "license_key": "MFA-XXXXX-...", "domain": "client-site.com" }
GET  /api/public/license/validate?license_key=...&domain=...

POST /api/public/license/deactivate
     { "license_key": "MFA-XXXXX-...", "domain": "client-site.com" }

-> { "valid": true, "status": "active", "period": "yearly",
     "expires_at": "...", "product": { "title": "...", "version": "..." } }`}
        </pre>
      </div>
    </div>
  );
}
