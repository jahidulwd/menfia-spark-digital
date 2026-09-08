import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { adminGetHome, adminSaveHome } from "@/lib/admin.functions";
import type { HomeContent } from "@/lib/store.functions";

export const Route = createFileRoute("/_authenticated/admin/home")({
  component: AdminHome,
});

const input =
  "mt-2 w-full rounded-lg border border-steel bg-white px-3 py-2.5 text-sm text-carbon focus:border-volt-dim focus:outline-none";
const small =
  "w-full rounded-lg border border-steel bg-white px-3 py-2 text-sm text-carbon focus:border-volt-dim focus:outline-none";
const label = "font-mono text-[10px] uppercase tracking-[0.15em] text-ink/50";
const ghost =
  "rounded-full border border-steel px-4 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/60 hover:text-carbon";
const del = "font-mono text-[10px] uppercase tracking-[0.12em] text-red-500/80";

function Section({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 rounded-xl border border-steel bg-white/70 p-6">
      <p className={label}>{title}</p>
      {note && <p className="mt-2 text-xs text-ink/50">{note}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function AdminHome() {
  const qc = useQueryClient();
  const get = useServerFn(adminGetHome);
  const save = useServerFn(adminSaveHome);
  const { data } = useQuery({ queryKey: ["admin-home"], queryFn: () => get() });
  const [form, setForm] = useState<HomeContent | null>(null);

  useEffect(() => {
    if (data) setForm(data as HomeContent);
  }, [data]);

  const mutation = useMutation({
    mutationFn: (payload: HomeContent) => save({ data: payload }),
    onSuccess: () => {
      toast.success("Home page updated");
      qc.invalidateQueries({ queryKey: ["home-content"] });
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Could not save"),
  });

  if (!form) return <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink/50">Loading…</p>;

  const set = (patch: Partial<HomeContent>) => setForm({ ...form, ...patch });

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-extrabold tracking-tight text-carbon">Home page</h1>
      <p className="mt-1 text-sm text-ink/60">
        Every heading, paragraph, number, step, quote and FAQ answer on the home page — all eight sections.
      </p>

      <Section title="1 · Hero">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={label}>Small badge</span>
            <input
              className={input}
              value={form.hero.badge}
              onChange={(e) => set({ hero: { ...form.hero, badge: e.target.value } })}
            />
          </label>
          <label className="block">
            <span className={label}>Headline line 1</span>
            <input
              className={input}
              value={form.hero.title_line1}
              onChange={(e) => set({ hero: { ...form.hero, title_line1: e.target.value } })}
            />
          </label>
          <label className="block">
            <span className={label}>Headline line 2</span>
            <input
              className={input}
              value={form.hero.title_line2}
              onChange={(e) => set({ hero: { ...form.hero, title_line2: e.target.value } })}
            />
          </label>
          <label className="block">
            <span className={label}>Panel title</span>
            <input
              className={input}
              value={form.panel_title}
              onChange={(e) => set({ panel_title: e.target.value })}
            />
          </label>
        </div>
        <label className="mt-4 block">
          <span className={label}>Intro paragraph</span>
          <textarea
            rows={3}
            className={input}
            value={form.hero.subtitle}
            onChange={(e) => set({ hero: { ...form.hero, subtitle: e.target.value } })}
          />
        </label>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={label}>Button 1 text</span>
            <input
              className={input}
              value={form.hero.primary_label}
              onChange={(e) => set({ hero: { ...form.hero, primary_label: e.target.value } })}
            />
          </label>
          <label className="block">
            <span className={label}>Button 1 link</span>
            <input
              className={input}
              value={form.hero.primary_url}
              onChange={(e) => set({ hero: { ...form.hero, primary_url: e.target.value } })}
            />
          </label>
          <label className="block">
            <span className={label}>Button 2 text</span>
            <input
              className={input}
              value={form.hero.secondary_label}
              onChange={(e) => set({ hero: { ...form.hero, secondary_label: e.target.value } })}
            />
          </label>
          <label className="block">
            <span className={label}>Button 2 link</span>
            <input
              className={input}
              value={form.hero.secondary_url}
              onChange={(e) => set({ hero: { ...form.hero, secondary_url: e.target.value } })}
            />
          </label>
        </div>
        <div className="mt-6">
          <div className="flex items-center justify-between">
            <p className={label}>Hero panel rows</p>
            {form.panel_stats.length < 6 && (
              <button
                className={ghost}
                onClick={() => set({ panel_stats: [...form.panel_stats, { label: "", value: "" }] })}
              >
                Add row
              </button>
            )}
          </div>
          <div className="mt-4 space-y-3">
            {form.panel_stats.map((row, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  className={small}
                  placeholder="Label"
                  value={row.label}
                  onChange={(e) => {
                    const panel_stats = [...form.panel_stats];
                    panel_stats[i] = { ...row, label: e.target.value };
                    set({ panel_stats });
                  }}
                />
                <input
                  className={small}
                  placeholder="Number"
                  value={row.value}
                  onChange={(e) => {
                    const panel_stats = [...form.panel_stats];
                    panel_stats[i] = { ...row, value: e.target.value };
                    set({ panel_stats });
                  }}
                />
                <button className={del} onClick={() => set({ panel_stats: form.panel_stats.filter((_, x) => x !== i) })}>
                  Del
                </button>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section title="2 · Numbers band" note="Four short proof numbers shown under the hero.">
        <div className="flex items-center justify-between">
          <p className={label}>Rows</p>
          {form.stats_band.length < 6 && (
            <button
              className={ghost}
              onClick={() => set({ stats_band: [...form.stats_band, { label: "", value: "", note: "" }] })}
            >
              Add row
            </button>
          )}
        </div>
        <div className="mt-4 space-y-3">
          {form.stats_band.map((row, i) => (
            <div key={i} className="grid gap-3 sm:grid-cols-[1fr_100px_1fr_auto] sm:items-center">
              <input
                className={small}
                placeholder="Label"
                value={row.label}
                onChange={(e) => {
                  const stats_band = [...form.stats_band];
                  stats_band[i] = { ...row, label: e.target.value };
                  set({ stats_band });
                }}
              />
              <input
                className={small}
                placeholder="Number"
                value={row.value}
                onChange={(e) => {
                  const stats_band = [...form.stats_band];
                  stats_band[i] = { ...row, value: e.target.value };
                  set({ stats_band });
                }}
              />
              <input
                className={small}
                placeholder="Small note"
                value={row.note}
                onChange={(e) => {
                  const stats_band = [...form.stats_band];
                  stats_band[i] = { ...row, note: e.target.value };
                  set({ stats_band });
                }}
              />
              <button className={del} onClick={() => set({ stats_band: form.stats_band.filter((_, x) => x !== i) })}>
                Del
              </button>
            </div>
          ))}
        </div>
      </Section>

      {(["services", "work"] as const).map((key, index) => (
        <Section key={key} title={`${index + 3} · ${key === "services" ? "Services matrix" : "Recent builds"} heading`}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={label}>Eyebrow</span>
              <input
                className={input}
                value={form[key].eyebrow}
                onChange={(e) => set({ [key]: { ...form[key], eyebrow: e.target.value } } as Partial<HomeContent>)}
              />
            </label>
            <label className="block">
              <span className={label}>Heading</span>
              <input
                className={input}
                value={form[key].title}
                onChange={(e) => set({ [key]: { ...form[key], title: e.target.value } } as Partial<HomeContent>)}
              />
            </label>
          </div>
          <label className="mt-4 block">
            <span className={label}>Intro</span>
            <textarea
              rows={2}
              className={input}
              value={form[key].intro}
              onChange={(e) => set({ [key]: { ...form[key], intro: e.target.value } } as Partial<HomeContent>)}
            />
          </label>
        </Section>
      ))}

      <Section title="5 · Process steps">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={label}>Eyebrow</span>
            <input
              className={input}
              value={form.process.eyebrow}
              onChange={(e) => set({ process: { ...form.process, eyebrow: e.target.value } })}
            />
          </label>
          <label className="block">
            <span className={label}>Heading</span>
            <input
              className={input}
              value={form.process.title}
              onChange={(e) => set({ process: { ...form.process, title: e.target.value } })}
            />
          </label>
        </div>
        <div className="mt-5 space-y-4">
          {form.process.steps.map((step, i) => (
            <div key={i} className="rounded-lg border border-steel/70 p-4">
              <div className="flex items-center gap-3">
                <input
                  className={small}
                  placeholder="Step title"
                  value={step.title}
                  onChange={(e) => {
                    const steps = [...form.process.steps];
                    steps[i] = { ...step, title: e.target.value };
                    set({ process: { ...form.process, steps } });
                  }}
                />
                <button
                  className={del}
                  onClick={() =>
                    set({ process: { ...form.process, steps: form.process.steps.filter((_, x) => x !== i) } })
                  }
                >
                  Remove
                </button>
              </div>
              <textarea
                rows={2}
                className={`${small} mt-3`}
                placeholder="Step description"
                value={step.body}
                onChange={(e) => {
                  const steps = [...form.process.steps];
                  steps[i] = { ...step, body: e.target.value };
                  set({ process: { ...form.process, steps } });
                }}
              />
            </div>
          ))}
        </div>
        {form.process.steps.length < 10 && (
          <button
            className={`${ghost} mt-4`}
            onClick={() => set({ process: { ...form.process, steps: [...form.process.steps, { title: "", body: "" }] } })}
          >
            Add step
          </button>
        )}
      </Section>

      <Section title="6 · Client quotes">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={label}>Eyebrow</span>
            <input
              className={input}
              value={form.testimonials.eyebrow}
              onChange={(e) => set({ testimonials: { ...form.testimonials, eyebrow: e.target.value } })}
            />
          </label>
          <label className="block">
            <span className={label}>Heading</span>
            <input
              className={input}
              value={form.testimonials.title}
              onChange={(e) => set({ testimonials: { ...form.testimonials, title: e.target.value } })}
            />
          </label>
        </div>
        <div className="mt-5 space-y-4">
          {form.testimonials.items.map((item, i) => (
            <div key={i} className="rounded-lg border border-steel/70 p-4">
              <textarea
                rows={2}
                className={small}
                placeholder="Quote"
                value={item.quote}
                onChange={(e) => {
                  const items = [...form.testimonials.items];
                  items[i] = { ...item, quote: e.target.value };
                  set({ testimonials: { ...form.testimonials, items } });
                }}
              />
              <div className="mt-3 flex items-center gap-3">
                <input
                  className={small}
                  placeholder="Name"
                  value={item.name}
                  onChange={(e) => {
                    const items = [...form.testimonials.items];
                    items[i] = { ...item, name: e.target.value };
                    set({ testimonials: { ...form.testimonials, items } });
                  }}
                />
                <input
                  className={small}
                  placeholder="Role, company"
                  value={item.role}
                  onChange={(e) => {
                    const items = [...form.testimonials.items];
                    items[i] = { ...item, role: e.target.value };
                    set({ testimonials: { ...form.testimonials, items } });
                  }}
                />
                <button
                  className={del}
                  onClick={() =>
                    set({
                      testimonials: { ...form.testimonials, items: form.testimonials.items.filter((_, x) => x !== i) },
                    })
                  }
                >
                  Del
                </button>
              </div>
            </div>
          ))}
        </div>
        {form.testimonials.items.length < 9 && (
          <button
            className={`${ghost} mt-4`}
            onClick={() =>
              set({
                testimonials: {
                  ...form.testimonials,
                  items: [...form.testimonials.items, { quote: "", name: "", role: "" }],
                },
              })
            }
          >
            Add quote
          </button>
        )}
      </Section>

      <Section title="7 · FAQ">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={label}>Eyebrow</span>
            <input
              className={input}
              value={form.faq.eyebrow}
              onChange={(e) => set({ faq: { ...form.faq, eyebrow: e.target.value } })}
            />
          </label>
          <label className="block">
            <span className={label}>Heading</span>
            <input
              className={input}
              value={form.faq.title}
              onChange={(e) => set({ faq: { ...form.faq, title: e.target.value } })}
            />
          </label>
        </div>
        <div className="mt-5 space-y-4">
          {form.faq.items.map((item, i) => (
            <div key={i} className="rounded-lg border border-steel/70 p-4">
              <div className="flex items-center gap-3">
                <input
                  className={small}
                  placeholder="Question"
                  value={item.q}
                  onChange={(e) => {
                    const items = [...form.faq.items];
                    items[i] = { ...item, q: e.target.value };
                    set({ faq: { ...form.faq, items } });
                  }}
                />
                <button
                  className={del}
                  onClick={() => set({ faq: { ...form.faq, items: form.faq.items.filter((_, x) => x !== i) } })}
                >
                  Remove
                </button>
              </div>
              <textarea
                rows={3}
                className={`${small} mt-3`}
                placeholder="Answer"
                value={item.a}
                onChange={(e) => {
                  const items = [...form.faq.items];
                  items[i] = { ...item, a: e.target.value };
                  set({ faq: { ...form.faq, items } });
                }}
              />
            </div>
          ))}
        </div>
        {form.faq.items.length < 20 && (
          <button
            className={`${ghost} mt-4`}
            onClick={() => set({ faq: { ...form.faq, items: [...form.faq.items, { q: "", a: "" }] } })}
          >
            Add question
          </button>
        )}
      </Section>

      <Section title="8 · Contact call to action">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={label}>Eyebrow</span>
            <input
              className={input}
              value={form.cta.eyebrow}
              onChange={(e) => set({ cta: { ...form.cta, eyebrow: e.target.value } })}
            />
          </label>
          <label className="block">
            <span className={label}>Heading</span>
            <input
              className={input}
              value={form.cta.title}
              onChange={(e) => set({ cta: { ...form.cta, title: e.target.value } })}
            />
          </label>
        </div>
        <label className="mt-4 block">
          <span className={label}>Paragraph</span>
          <textarea
            rows={3}
            className={input}
            value={form.cta.body}
            onChange={(e) => set({ cta: { ...form.cta, body: e.target.value } })}
          />
        </label>
      </Section>

      <button
        onClick={() => mutation.mutate(form)}
        disabled={mutation.isPending}
        className="mt-8 rounded-full bg-volt px-7 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-carbon disabled:opacity-60"
      >
        {mutation.isPending ? "Saving…" : "Save home page"}
      </button>
    </div>
  );
}
