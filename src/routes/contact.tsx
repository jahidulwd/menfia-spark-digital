import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { submitContact } from "@/lib/store.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Menfia Digital — start a web, plugin or marketing build" },
      {
        name: "description",
        content:
          "Tell us about your project: web development, templates, plugins and scripts, or digital marketing. We reply within one business day.",
      },
      { property: "og:title", content: "Contact Menfia Digital" },
      {
        property: "og:description",
        content: "Share your budget, timeline and scope — we reply within one business day.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, { message: "Tell us your name" }).max(100),
  email: z.string().trim().email({ message: "Enter a valid email address" }).max(255),
  phone: z.string().trim().max(40),
  company: z.string().trim().max(120),
  website: z.string().trim().max(255),
  projectType: z.string().trim().max(80),
  budget: z.string().trim().max(80),
  timeline: z.string().trim().max(80),
  message: z.string().trim().min(10, { message: "A sentence or two about the project, please" }).max(4000),
});

const input =
  "mt-2 w-full rounded-lg border border-steel bg-white px-4 py-3 text-sm text-carbon focus:border-volt-dim focus:outline-none";
const label = "font-mono text-[10px] uppercase tracking-[0.15em] text-ink/50";

const projectTypes = [
  "Web development",
  "Theme or template",
  "Plugin or script",
  "Digital marketing",
  "Maintenance & support",
  "Something else",
];
const budgets = ["Under $1k", "$1k – $5k", "$5k – $15k", "$15k – $50k", "$50k+"];
const timelines = ["ASAP", "2–4 weeks", "1–3 months", "Flexible"];

function ContactPage() {
  const send = useServerFn(submitContact);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    projectType: projectTypes[0]!,
    budget: budgets[1]!,
    timeline: timelines[1]!,
    message: "",
  });
  const [busy, setBusy] = useState(false);

  function set(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setBusy(true);
    try {
      await send({ data: parsed.data });
      // Best-effort notification emails; the brief is already stored.
      void fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: parsed.data.email,
          projectType: parsed.data.projectType || "General enquiry",
          message: parsed.data.message,
        }),
      });
      toast.success("Brief received — we'll reply within one business day.");
      setForm({ ...form, name: "", email: "", phone: "", company: "", website: "", message: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send your brief");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-titan">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt-dim">/ contact</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-carbon sm:text-5xl">
          Tell us what you're building.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-ink/60">
          The more detail you share, the sharper our first reply. Every brief lands in our backend and gets a human answer
          within one business day.
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <form onSubmit={submit} className="rounded-xl border border-steel bg-white/70 p-6 lg:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className={label}>Full name *</span>
                <input className={input} value={form.name} onChange={(e) => set("name", e.target.value)} required />
              </label>
              <label className="block">
                <span className={label}>Email *</span>
                <input
                  type="email"
                  className={input}
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  required
                />
              </label>
              <label className="block">
                <span className={label}>Phone / WhatsApp</span>
                <input className={input} value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              </label>
              <label className="block">
                <span className={label}>Company</span>
                <input className={input} value={form.company} onChange={(e) => set("company", e.target.value)} />
              </label>
              <label className="block sm:col-span-2">
                <span className={label}>Current website</span>
                <input
                  className={input}
                  placeholder="https://"
                  value={form.website}
                  onChange={(e) => set("website", e.target.value)}
                />
              </label>
              <label className="block">
                <span className={label}>Project type</span>
                <select className={input} value={form.projectType} onChange={(e) => set("projectType", e.target.value)}>
                  {projectTypes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className={label}>Budget range</span>
                <select className={input} value={form.budget} onChange={(e) => set("budget", e.target.value)}>
                  {budgets.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className={label}>Timeline</span>
                <select className={input} value={form.timeline} onChange={(e) => set("timeline", e.target.value)}>
                  {timelines.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className={label}>Project details *</span>
                <textarea
                  rows={6}
                  className={input}
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  placeholder="Goals, current stack, must-have features, launch date…"
                  required
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={busy}
              className="mt-8 w-full rounded-lg bg-volt px-6 py-4 font-mono text-[12px] font-semibold uppercase tracking-[0.15em] text-carbon transition hover:brightness-95 disabled:opacity-60 sm:w-auto"
            >
              {busy ? "Sending…" : "Send brief"}
            </button>
          </form>

          <aside className="space-y-6">
            <div className="rounded-xl border border-steel bg-white/70 p-6">
              <p className={label}>Direct line</p>
              <a href="mailto:jahidulwd@gmail.com" className="mt-2 block font-bold text-carbon hover:underline">
                jahidulwd@gmail.com
              </a>
              <p className="mt-4 text-sm text-ink/60">Mon–Sat, 10:00–19:00 (GMT+6). Replies within one business day.</p>
            </div>
            <div className="rounded-xl border border-steel bg-carbon p-6 text-white">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">What we do</p>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li>+ Web development & web apps</li>
                <li>+ Themes, templates & design systems</li>
                <li>+ Plugins, scripts & automation</li>
                <li>+ Digital marketing & growth</li>
              </ul>
            </div>
            <div className="rounded-xl border border-steel bg-white/70 p-6">
              <p className={label}>How we start</p>
              <ol className="mt-4 space-y-2 text-sm text-ink/65">
                <li>01 — You send the brief</li>
                <li>02 — 30-minute scoping call</li>
                <li>03 — Fixed proposal & timeline</li>
                <li>04 — Build in weekly sprints</li>
              </ol>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
