import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { adminGetHeader, adminSaveHeader } from "@/lib/admin.functions";
import type { HeaderSettings } from "@/lib/store.functions";

export const Route = createFileRoute("/_authenticated/admin/header")({
  component: AdminHeader,
});

const input =
  "mt-2 w-full rounded-lg border border-steel bg-white px-3 py-2.5 text-sm text-carbon focus:border-volt-dim focus:outline-none";
const small =
  "w-full rounded-lg border border-steel bg-white px-3 py-2 text-sm text-carbon focus:border-volt-dim focus:outline-none";
const label = "font-mono text-[10px] uppercase tracking-[0.15em] text-ink/50";
const ghost =
  "rounded-full border border-steel px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/60 hover:text-carbon";
const del = "font-mono text-[10px] uppercase tracking-[0.12em] text-red-500/80";

function Card({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 rounded-xl border border-steel bg-white/70 p-6">
      <p className={label}>{title}</p>
      {note && <p className="mt-2 text-xs text-ink/50">{note}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function AdminHeader() {
  const qc = useQueryClient();
  const get = useServerFn(adminGetHeader);
  const save = useServerFn(adminSaveHeader);
  const { data } = useQuery({ queryKey: ["admin-header"], queryFn: () => get() });
  const [form, setForm] = useState<HeaderSettings | null>(null);

  useEffect(() => {
    if (data) setForm(data as HeaderSettings);
  }, [data]);

  const mutation = useMutation({
    mutationFn: (payload: HeaderSettings) => save({ data: payload }),
    onSuccess: () => {
      toast.success("Header updated");
      qc.invalidateQueries({ queryKey: ["header-settings"] });
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Could not save"),
  });

  if (!form) return <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink/50">Loading…</p>;

  const set = (patch: Partial<HeaderSettings>) => setForm({ ...form, ...patch });

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-extrabold tracking-tight text-carbon">Header</h1>
      <p className="mt-1 text-sm text-ink/60">
        The top bar and the menu panel that slides open — button text, menu links, contact details and social links.
      </p>

      <Card title="Top bar">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={label}>Button text</span>
            <input className={input} value={form.cta_label} onChange={(e) => set({ cta_label: e.target.value })} />
          </label>
          <label className="block">
            <span className={label}>Button link</span>
            <input className={input} value={form.cta_url} onChange={(e) => set({ cta_url: e.target.value })} />
          </label>
          <label className="block">
            <span className={label}>Menu word (closed)</span>
            <input className={input} value={form.menu_label} onChange={(e) => set({ menu_label: e.target.value })} />
          </label>
          <label className="block">
            <span className={label}>Menu word (open)</span>
            <input className={input} value={form.close_label} onChange={(e) => set({ close_label: e.target.value })} />
          </label>
        </div>
        <p className="mt-4 text-xs text-ink/50">
          The logo itself is set on the Logo page. Links starting with / stay on your site; anything else opens in a new
          tab.
        </p>
      </Card>

      <Card title="Menu links" note="The big links inside the open menu panel.">
        <div className="space-y-3">
          {form.nav.map((link, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                className={small}
                placeholder="Label"
                value={link.label}
                onChange={(e) => {
                  const nav = [...form.nav];
                  nav[i] = { ...link, label: e.target.value };
                  set({ nav });
                }}
              />
              <input
                className={small}
                placeholder="/products or https://…"
                value={link.url}
                onChange={(e) => {
                  const nav = [...form.nav];
                  nav[i] = { ...link, url: e.target.value };
                  set({ nav });
                }}
              />
              <button className={del} onClick={() => set({ nav: form.nav.filter((_, x) => x !== i) })}>
                Del
              </button>
            </div>
          ))}
        </div>
        {form.nav.length < 10 && (
          <button className={`${ghost} mt-4`} onClick={() => set({ nav: [...form.nav, { label: "", url: "" }] })}>
            Add link
          </button>
        )}
      </Card>

      <Card title="Menu panel button">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={label}>Button text</span>
            <input
              className={input}
              value={form.panel_cta_label}
              onChange={(e) => set({ panel_cta_label: e.target.value })}
            />
          </label>
          <label className="block">
            <span className={label}>Button link</span>
            <input
              className={input}
              value={form.panel_cta_url}
              onChange={(e) => set({ panel_cta_url: e.target.value })}
            />
          </label>
        </div>
      </Card>

      <Card title="Info blocks" note="Small titled blocks beside the menu — contact details, studio note, anything.">
        <div className="space-y-5">
          {form.blocks.map((block, bi) => (
            <div key={bi} className="rounded-lg border border-steel/70 p-4">
              <div className="flex items-center gap-3">
                <input
                  className={small}
                  placeholder="Block title"
                  value={block.title}
                  onChange={(e) => {
                    const blocks = [...form.blocks];
                    blocks[bi] = { ...block, title: e.target.value };
                    set({ blocks });
                  }}
                />
                <button className={del} onClick={() => set({ blocks: form.blocks.filter((_, x) => x !== bi) })}>
                  Remove
                </button>
              </div>
              <div className="mt-3 space-y-2">
                {block.lines.map((line, li) => (
                  <div key={li} className="flex items-center gap-3">
                    <input
                      className={small}
                      placeholder="Text"
                      value={line.label}
                      onChange={(e) => {
                        const blocks = [...form.blocks];
                        const lines = [...block.lines];
                        lines[li] = { ...line, label: e.target.value };
                        blocks[bi] = { ...block, lines };
                        set({ blocks });
                      }}
                    />
                    <input
                      className={small}
                      placeholder="Link (optional)"
                      value={line.url}
                      onChange={(e) => {
                        const blocks = [...form.blocks];
                        const lines = [...block.lines];
                        lines[li] = { ...line, url: e.target.value };
                        blocks[bi] = { ...block, lines };
                        set({ blocks });
                      }}
                    />
                    <button
                      className={del}
                      onClick={() => {
                        const blocks = [...form.blocks];
                        blocks[bi] = { ...block, lines: block.lines.filter((_, x) => x !== li) };
                        set({ blocks });
                      }}
                    >
                      Del
                    </button>
                  </div>
                ))}
              </div>
              {block.lines.length < 6 && (
                <button
                  className={`${ghost} mt-3`}
                  onClick={() => {
                    const blocks = [...form.blocks];
                    blocks[bi] = { ...block, lines: [...block.lines, { label: "", url: "" }] };
                    set({ blocks });
                  }}
                >
                  Add line
                </button>
              )}
            </div>
          ))}
        </div>
        {form.blocks.length < 4 && (
          <button
            className={`${ghost} mt-4`}
            onClick={() => set({ blocks: [...form.blocks, { title: "", lines: [{ label: "", url: "" }] }] })}
          >
            Add block
          </button>
        )}
      </Card>

      <Card title="Social links">
        <div className="space-y-3">
          {form.socials.map((social, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                className={small}
                placeholder="Name"
                value={social.label}
                onChange={(e) => {
                  const socials = [...form.socials];
                  socials[i] = { ...social, label: e.target.value };
                  set({ socials });
                }}
              />
              <input
                className={small}
                placeholder="https://…"
                value={social.url}
                onChange={(e) => {
                  const socials = [...form.socials];
                  socials[i] = { ...social, url: e.target.value };
                  set({ socials });
                }}
              />
              <button className={del} onClick={() => set({ socials: form.socials.filter((_, x) => x !== i) })}>
                Del
              </button>
            </div>
          ))}
        </div>
        {form.socials.length < 6 && (
          <button
            className={`${ghost} mt-4`}
            onClick={() => set({ socials: [...form.socials, { label: "", url: "" }] })}
          >
            Add social link
          </button>
        )}
      </Card>

      <button
        onClick={() => mutation.mutate(form)}
        disabled={mutation.isPending}
        className="mt-8 rounded-full bg-volt px-7 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-carbon disabled:opacity-60"
      >
        {mutation.isPending ? "Saving…" : "Save header"}
      </button>
    </div>
  );
}
