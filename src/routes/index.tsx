import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { projects } from "../lib/projects";
import { services } from "../lib/services";
import { Reveal, SplitHeading, Tilt3D, CountUp } from "../components/Motion";
import { ContactForm } from "../components/ContactForm";
import { FooterLegal } from "../components/FooterLegal";
import { getHomeContent, HOME_DEFAULTS } from "../lib/store.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Menfia Digital — Web Systems That Scale" },
      {
        name: "description",
        content:
          "Menfia Digital designs and engineers web products, templates, plugins, and growth campaigns — from first grid to final deploy.",
      },
      { property: "og:title", content: "Menfia Digital — Web Systems That Scale" },
      {
        property: "og:description",
        content:
          "Web development, custom templates, plugins, scripts, and digital marketing built for performance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function isInternal(url: string) {
  return url.startsWith("/") || url.startsWith("#");
}

function CtaLink({ url, children, className }: { url: string; children: React.ReactNode; className: string }) {
  if (isInternal(url)) {
    return (
      <a href={url} className={className}>
        {children}
      </a>
    );
  }
  return (
    <a href={url} target="_blank" rel="noreferrer noopener" className={className}>
      {children}
    </a>
  );
}

function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-steel border-y border-steel">
      {items.map((item, i) => (
        <div key={`${item.q}-${i}`}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            className="flex w-full items-start justify-between gap-6 py-6 text-left"
          >
            <span className="text-lg font-bold tracking-tight text-carbon">{item.q}</span>
            <span className="mt-1 shrink-0 font-mono text-sm text-volt-dim">{open === i ? "—" : "+"}</span>
          </button>
          {open === i && <p className="max-w-3xl pb-7 text-sm leading-relaxed text-ink/60">{item.a}</p>}
        </div>
      ))}
    </div>
  );
}

function Index() {
  const fetchHome = useServerFn(getHomeContent);
  const { data } = useQuery({ queryKey: ["home-content"], queryFn: () => fetchHome() });
  const c = data ?? HOME_DEFAULTS;

  return (
    <div className="min-h-screen bg-titan font-sans text-ink antialiased">
      {/* 01 HERO */}
      <section className="grid-bg border-b border-steel">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-end">
            <div className="flex-1">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-steel bg-white/60 px-4 py-1.5">
                <span className="size-2 rounded-full bg-volt"></span>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60">{c.hero.badge}</span>
              </div>
              <h1 className="text-5xl font-extrabold leading-[0.95] tracking-tight text-carbon sm:text-6xl lg:text-7xl">
                <SplitHeading as="span" className="block">
                  {c.hero.title_line1}
                </SplitHeading>
                <SplitHeading as="span" className="block" delay={0.15}>
                  {c.hero.title_line2}
                </SplitHeading>
              </h1>
              <Reveal delay={0.3}>
                <p className="mt-6 max-w-md text-base leading-relaxed text-ink/60">{c.hero.subtitle}</p>
              </Reveal>
              <Reveal delay={0.4} className="mt-8 flex flex-wrap gap-3">
                <CtaLink
                  url={c.hero.primary_url}
                  className="rounded-full bg-carbon px-6 py-3 font-mono text-[12px] font-semibold uppercase tracking-[0.15em] text-volt transition hover:opacity-90"
                >
                  {c.hero.primary_label}
                </CtaLink>
                <CtaLink
                  url={c.hero.secondary_url}
                  className="rounded-full border border-steel bg-white/50 px-6 py-3 font-mono text-[12px] font-semibold uppercase tracking-[0.15em] text-ink/70 transition hover:border-carbon/30"
                >
                  {c.hero.secondary_label}
                </CtaLink>
              </Reveal>
            </div>
            <Tilt3D className="w-full lg:w-80">
              <div className="rounded-xl border border-steel bg-white/70 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/40">{c.panel_title}</span>
                  <span className="h-px flex-1 mx-3 bg-steel"></span>
                </div>
                <dl className="space-y-4">
                  {c.panel_stats.map((row) => (
                    <div key={row.label} className="flex items-start justify-between gap-4">
                      <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/50">{row.label}</dt>
                      <dd className="text-right text-2xl font-extrabold text-carbon">
                        <CountUp value={row.value} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Tilt3D>
          </div>
        </div>
      </section>

      {/* 02 NUMBERS BAND */}
      <section className="border-b border-steel bg-carbon">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
          {c.stats_band.map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-extrabold tracking-tight text-volt">
                <CountUp value={stat.value} />
              </p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.15em] text-white/70">{stat.label}</p>
              <p className="mt-1 text-xs text-white/40">{stat.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 03 SERVICES */}
      <section id="services" className="border-b border-steel">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt-dim">{c.services.eyebrow}</p>
              <SplitHeading className="mt-2 text-3xl font-extrabold tracking-tight text-carbon sm:text-4xl">
                {c.services.title}
              </SplitHeading>
              {c.services.intro && <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/60">{c.services.intro}</p>}
            </div>
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink/40">
              {String(services.length).padStart(2, "0")} modules
            </span>
          </div>
          <Reveal stagger={0.12} className="grid gap-4 md:grid-cols-2">
            {services.map((service) => (
              <Link
                key={service.id}
                to="/services/$id"
                params={{ id: service.slug }}
                className={`group block rounded-xl border border-steel p-7 transition hover:border-carbon/30 ${
                  service.featured ? "bg-carbon hover:opacity-95" : "bg-white/70"
                }`}
              >
                <span className={`font-mono text-[11px] ${service.featured ? "text-volt/60" : "text-ink/30"}`}>
                  {service.id}
                </span>
                <h3
                  className={`mt-6 text-2xl font-extrabold tracking-tight ${
                    service.featured ? "text-volt" : "text-carbon"
                  }`}
                >
                  {service.title}
                </h3>
                <p
                  className={`mt-3 max-w-sm text-sm leading-relaxed ${
                    service.featured ? "text-white/60" : "text-ink/60"
                  }`}
                >
                  {service.description}
                </p>
                <span
                  className={`mt-6 inline-block font-mono text-[11px] uppercase tracking-[0.15em] ${
                    service.featured ? "text-volt/70 group-hover:text-volt" : "text-ink/50 group-hover:text-carbon"
                  }`}
                >
                  / explore
                </span>
                <div className="mt-5 flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`rounded-sm px-2 py-1 font-mono text-[11px] uppercase tracking-wider ${
                        service.featured ? "bg-white/10 text-steel" : "bg-steel/20 text-ink/50"
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 04 WORK */}
      <section id="work" className="border-b border-steel bg-white/40">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt-dim">{c.work.eyebrow}</p>
              <SplitHeading className="mt-2 text-3xl font-extrabold tracking-tight text-carbon sm:text-4xl">
                {c.work.title}
              </SplitHeading>
              {c.work.intro && <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink/60">{c.work.intro}</p>}
            </div>
          </div>
          <Reveal stagger={0.14} className="grid gap-6 md:grid-cols-3">
            {projects.map((project) => (
              <article key={project.slug} className="group">
                <Link
                  to="/work/$id"
                  params={{ id: project.slug }}
                  className="block overflow-hidden rounded-xl border border-steel"
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    width={1024}
                    height={768}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
                <div className="mt-4 flex items-center justify-between">
                  <Link
                    to="/work/$id"
                    params={{ id: project.slug }}
                    className="text-lg font-bold tracking-tight text-carbon hover:underline"
                  >
                    {project.title}
                  </Link>
                  <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/40">
                    {project.category}
                  </span>
                </div>
                <p className="mt-1 text-sm text-ink/50">{project.description}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 05 PROCESS */}
      <section id="process" className="border-b border-steel">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt-dim">{c.process.eyebrow}</p>
          <SplitHeading className="mt-2 text-3xl font-extrabold tracking-tight text-carbon sm:text-4xl">
            {c.process.title}
          </SplitHeading>
          <Reveal stagger={0.1} className="mt-10 grid gap-px overflow-hidden rounded-xl border border-steel bg-steel md:grid-cols-2 lg:grid-cols-3">
            {c.process.steps.map((step, i) => (
              <div key={`${step.title}-${i}`} className="bg-titan p-7">
                <span className="font-mono text-[11px] text-ink/30">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 text-xl font-extrabold tracking-tight text-carbon">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/60">{step.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 06 TESTIMONIALS */}
      <section id="clients" className="border-b border-steel bg-white/40">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt-dim">{c.testimonials.eyebrow}</p>
          <SplitHeading className="mt-2 text-3xl font-extrabold tracking-tight text-carbon sm:text-4xl">
            {c.testimonials.title}
          </SplitHeading>
          <Reveal stagger={0.12} className="mt-10 grid gap-5 md:grid-cols-3">
            {c.testimonials.items.map((item, i) => (
              <figure key={`${item.name}-${i}`} className="rounded-xl border border-steel bg-white/70 p-7">
                <blockquote className="text-base leading-relaxed text-carbon">“{item.quote}”</blockquote>
                <figcaption className="mt-6">
                  <p className="text-sm font-bold text-carbon">{item.name}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink/40">{item.role}</p>
                </figcaption>
              </figure>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 07 FAQ */}
      <section id="faq" className="border-b border-steel">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt-dim">{c.faq.eyebrow}</p>
          <SplitHeading className="mt-2 text-3xl font-extrabold tracking-tight text-carbon sm:text-4xl">
            {c.faq.title}
          </SplitHeading>
          <div className="mt-10">
            <Faq items={c.faq.items} />
          </div>
        </div>
      </section>

      {/* 08 CTA + FOOTER */}
      <section id="contact" className="bg-carbon">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt">{c.cta.eyebrow}</p>
              <SplitHeading className="mt-3 text-4xl font-extrabold leading-tight tracking-tight text-volt sm:text-5xl">
                {c.cta.title}
              </SplitHeading>
              <p className="mt-5 max-w-md text-base leading-relaxed text-white/60">{c.cta.body}</p>
            </div>
            <Tilt3D className="rounded-xl border border-white/10 bg-white/5 p-7">
              <ContactForm />
            </Tilt3D>
          </div>
          <FooterLegal />
        </div>
      </section>
    </div>
  );
}
