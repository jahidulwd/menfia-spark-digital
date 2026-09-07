import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { adminGetFooter, adminSaveFooter } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/footer")({
  component: AdminFooter,
});

type Link = { label: string; url: string };
type Column = { title: string; links: Link[] };
type Footer = {
  brand_name: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  copyright: string;
  columns: Column[];
  socials: Link[];
};

const input =
  "mt-2 w-full rounded-lg border border-steel bg-white px-3 py-2.5 text-sm text-carbon focus:border-volt-dim focus:outline-none";
const small = "w-full rounded-lg border border-steel bg-white px-3 py-2 text-sm text-carbon focus:border-volt-dim focus:outline-none";
const label = "font-mono text-[10px] uppercase tracking-[0.15em] text-ink/50";
const ghost =
  "rounded-full border border-steel px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/60 hover:text-carbon";

function AdminFooter() {
  const qc = useQueryClient();
  const get = useServerFn(adminGetFooter);
  const save = useServerFn(adminSaveFooter);
  const { data } = useQuery({ queryKey: ["admin-footer"], queryFn: () => get() });
  const [form, setForm] = useState<Footer | null>(null);

  useEffect(() => {
    if (data) setForm(data as Footer);
  }, [data]);

  const mutation = useMutation({
    mutationFn: (payload: Footer) => save({ data: payload }),
    onSuccess: () => {
      toast.success("Footer updated");
      qc.invalidateQueries({ queryKey: ["footer-settings"] });
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Could not save"),
  });

  if (!form) {
    return <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink/50">Loading…</p>;
  }

  const set = (patch: Partial<Footer>) => setForm({ ...form, ...patch });

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-extrabold tracking-tight text-carbon">Footer</h1>
      <p className="mt-1 text-sm text-ink/60">
        Every word in the site footer — brand line, description, contact details, link columns, social links and the
        copyright line.
      </p>

      <section className="mt-8 rounded-xl border border-steel bg-white/70 p-6">
        <p className={label}>Brand</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={label}>Brand name</span>
            <input className={input} value={form.brand_name} onChange={(e) => set({ brand_name: e.target.value })} />
          </label>
          <label className="block">
            <span className={label}>Tagline</span>
            <input className={input} value={form.tagline} onChange={(e) => set({ tagline: e.target.value })} />
          </label>
        </div>
        <label className="mt-4 block">
          <span className={label}>Description</span>
          <textarea
            rows={3}
            className={input}
            value={form.description}
            onChange={(e) => set({ description: e.target.value })}
          />
        </label>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className={label}>Email</span>
            <input className={input} value={form.email} onChange={(e) => set({ email: e.target.value })} />
          </label>
          <label className="block">
            <span className={label}>Phone</span>
            <input className={input} value={form.phone} onChange={(e) => set({ phone: e.target.value })} />
          </label>
          <label className="block">
            <span className={label}>Address</span>
            <input className={input} value={form.address} onChange={(e) => set({ address: e.target.value })} />
          </label>
        </div>
        <label className="mt-4 block">
          <span className={label}>Copyright line</span>
          <input className={input} value={form.copyright} onChange={(e) => set({ copyright: e.target.value })} />
        </label>
      </section>

      <section className="mt-6 rounded-xl border border-steel bg-white/70 p-6">
        <div className="flex items-center justify-between">
          <p className={label}>Link columns</p>
          {form.columns.length < 4 && (
            <button
              className={ghost}
              onClick={() => set({ columns: [...form.columns, { title: "New column", links: [] }] })}
            >
              Add column
            </button>
          )}
        </div>
        <div className="mt-5 space-y-6">
          {form.columns.map((column, ci) => (
            <div key={ci} className="rounded-lg border border-steel/70 p-4">
              <div className="flex items-center gap-3">
                <input
                  className={small}
                  value={column.title}
                  onChange={(e) => {
                    const columns = [...form.columns];
                    columns[ci] = { ...column, title: e.target.value };
                    set({ columns });
                  }}
                />
                <button
                  className="font-mono text-[10px] uppercase tracking-[0.12em] text-red-500/80"
                  onClick={() => set({ columns: form.columns.filter((_, i) => i !== ci) })}
                >
                  Remove
                </button>
              </div>
              <div className="mt-4 space-y-3">
                {(column.links ?? []).map((link, li) => (
                  <div key={li} className="flex items-center gap-3">
                    <input
                      className={small}
                      placeholder="Label"
                      value={link.label}
                      onChange={(e) => {
                        const columns = [...form.columns];
                        const links = [...column.links];
                        links[li] = { ...link, label: e.target.value };
                        columns[ci] = { ...column, links };
                        set({ columns });
                      }}
                    />
                    <input
                      className={small}
                      placeholder="/products or https://…"
                      value={link.url}
                      onChange={(e) => {
                        const columns = [...form.columns];
                        const links = [...column.links];
                        links[li] = { ...link, url: e.target.value };
                        columns[ci] = { ...column, links };
                        set({ columns });
                      }}
                    />
                    <button
                      className="font-mono text-[10px] uppercase tracking-[0.12em] text-red-500/80"
                      onClick={() => {
                        const columns = [...form.columns];
                        columns[ci] = { ...column, links: column.links.filter((_, i) => i !== li) };
                        set({ columns });
                      }}
                    >
                      Del
                    </button>
                  </div>
                ))}
                <button
                  className={ghost}
                  onClick={() => {
                    const columns = [...form.columns];
                    columns[ci] = { ...column, links: [...(column.links ?? []), { label: "", url: "" }] };
                    set({ columns });
                  }}
                >
                  Add link
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-steel bg-white/70 p-6">
        <div className="flex items-center justify-between">
          <p className={label}>Social links</p>
          <button className={ghost} onClick={() => set({ socials: [...form.socials, { label: "", url: "" }] })}>
            Add social
          </button>
        </div>
        <div className="mt-5 space-y-3">
          {form.socials.map((social, si) => (
            <div key={si} className="flex items-center gap-3">
              <input
                className={small}
                placeholder="Label (e.g. LinkedIn)"
                value={social.label}
                onChange={(e) => {
                  const socials = [...form.socials];
                  socials[si] = { ...social, label: e.target.value };
                  set({ socials });
                }}
              />
              <input
                className={small}
                placeholder="https://…"
                value={social.url}
                onChange={(e) => {
                  const socials = [...form.socials];
                  socials[si] = { ...social, url: e.target.value };
                  set({ socials });
                }}
              />
              <button
                className="font-mono text-[10px] uppercase tracking-[0.12em] text-red-500/80"
                onClick={() => set({ socials: form.socials.filter((_, i) => i !== si) })}
              >
                Del
              </button>
            </div>
          ))}
        </div>
      </section>

      <button
        onClick={() =>
          mutation.mutate({
            ...form,
            columns: form.columns.map((c) => ({
              ...c,
              links: (c.links ?? []).filter((l) => l.label.trim() && l.url.trim()),
            })),
            socials: form.socials.filter((s) => s.label.trim() && s.url.trim()),
          })
        }
        disabled={mutation.isPending}
        className="mt-8 rounded-full bg-volt px-7 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-carbon disabled:opacity-60"
      >
        {mutation.isPending ? "Saving…" : "Save footer"}
      </button>
    </div>
  );
}
