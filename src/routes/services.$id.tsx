import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getServiceBySlug, services, type ServiceDetail } from "../lib/services";
import { Reveal, SplitHeading, Tilt3D, CountUp, Parallax } from "../components/Motion";

export const Route = createFileRoute("/services/$id")({
  loader: ({ params }) => {
    const service = getServiceBySlug(params.id);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Service not found — Menfia Digital" }, { name: "robots", content: "noindex" }],
      };
    }
    const s = loaderData.service;
    const title = `${s.title} — Menfia Digital`;
    return {
      meta: [
        { title },
        { name: "description", content: s.description },
        { property: "og:title", content: title },
        { property: "og:description", content: s.description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: ServiceNotFound,
  component: ServicePage,
});

function ServiceNotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-start justify-center px-6">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt-dim">/ 404</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-carbon">Service not found</h1>
      <Link
        to="/"
        hash="services"
        className="mt-8 rounded-full bg-carbon px-6 py-3 font-mono text-[12px] font-semibold uppercase tracking-[0.15em] text-volt"
      >
        Back to services
      </Link>
    </div>
  );
}

function ServicePage() {
  const { service } = Route.useLoaderData();
  const others = services.filter((s: ServiceDetail) => s.slug !== service.slug);

  return (
    <div className="min-h-screen bg-titan font-sans text-ink antialiased">
      {/* 1 — HERO */}
      <section className="grid-bg border-b border-steel">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
          <Link
            to="/"
            hash="services"
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/40 hover:text-carbon"
          >
            ← All services
          </Link>
          <div className="mt-8 flex flex-col gap-12 lg:flex-row lg:items-end">
            <div className="flex-1">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt-dim">
                / module {service.id} — {service.label}
              </p>
              <SplitHeading
                as="h1"
                className="mt-4 text-4xl font-extrabold leading-[1.02] tracking-tight text-carbon sm:text-5xl lg:text-6xl"
              >
                {service.headline}
              </SplitHeading>
              <Reveal delay={0.25}>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/60">{service.intro}</p>
              </Reveal>
              <Reveal delay={0.35} className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/"
                  hash="contact"
                  className="rounded-full bg-carbon px-6 py-3 font-mono text-[12px] font-semibold uppercase tracking-[0.15em] text-volt transition hover:opacity-90"
                >
                  Start a build
                </Link>
                <Link
                  to="/"
                  hash="work"
                  className="rounded-full border border-steel bg-white/50 px-6 py-3 font-mono text-[12px] font-semibold uppercase tracking-[0.15em] text-ink/70 transition hover:border-carbon/30"
                >
                  See the work
                </Link>
              </Reveal>
            </div>
            <Tilt3D className="w-full lg:w-80">
              <div className="rounded-xl border border-steel bg-white/70 p-5">
                <div className="mb-5 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/40">
                    Signals
                  </span>
                  <span className="size-2 rounded-full bg-volt" />
                </div>
                <dl className="space-y-4">
                  {service.metrics.map((m) => (
                    <div key={m.label} className="flex items-end justify-between gap-4">
                      <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/50">
                        {m.label}
                      </dt>
                      <dd className="text-2xl font-extrabold text-carbon">
                        <CountUp value={m.value} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Tilt3D>
          </div>
        </div>
      </section>

      {/* 2 — OVERVIEW */}
      <section className="border-b border-steel">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-3 lg:px-10 lg:py-20">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt-dim">/ overview</p>
            <SplitHeading className="mt-2 text-3xl font-extrabold tracking-tight text-carbon">
              The approach
            </SplitHeading>
          </div>
          <Reveal stagger={0.15} className="space-y-5 lg:col-span-2">
            {service.overview.map((p) => (
              <p key={p} className="text-lg leading-relaxed text-ink/70">
                {p}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 3 — CAPABILITIES */}
      <section className="border-b border-steel bg-white/40">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt-dim">/ capabilities</p>
          <SplitHeading className="mt-2 text-3xl font-extrabold tracking-tight text-carbon sm:text-4xl">
            What is included
          </SplitHeading>
          <Reveal stagger={0.08} className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {service.capabilities.map((c) => (
              <Tilt3D key={c.title} intensity={6}>
                <div className="h-full rounded-xl border border-steel bg-titan p-6 transition hover:border-carbon/30">
                  <h3 className="text-lg font-bold tracking-tight text-carbon">{c.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/60">{c.body}</p>
                </div>
              </Tilt3D>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 4 — PROCESS */}
      <section className="border-b border-steel bg-carbon">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt">/ process</p>
          <SplitHeading className="mt-2 text-3xl font-extrabold tracking-tight text-volt sm:text-4xl">
            How the work runs
          </SplitHeading>
          <Reveal stagger={0.1} className="mt-10 space-y-px">
            {service.process.map((step) => (
              <div
                key={step.step}
                className="group grid gap-3 border-t border-white/10 py-6 md:grid-cols-[80px_240px_1fr] md:items-baseline"
              >
                <span className="font-mono text-[11px] text-volt/70">{step.step}</span>
                <h3 className="text-xl font-bold tracking-tight text-white transition group-hover:text-volt">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/55">{step.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 5 — STACK */}
      <section className="border-b border-steel">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-3">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt-dim">/ stack</p>
              <SplitHeading className="mt-2 text-3xl font-extrabold tracking-tight text-carbon">
                Tools we reach for
              </SplitHeading>
            </div>
            <Reveal stagger={0.05} className="flex flex-wrap content-start gap-3 lg:col-span-2">
              {service.stack.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-steel bg-white/70 px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.12em] text-ink/60"
                >
                  {t}
                </span>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* 6 — DELIVERABLES */}
      <section className="border-b border-steel bg-white/40">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt-dim">/ deliverables</p>
          <SplitHeading className="mt-2 text-3xl font-extrabold tracking-tight text-carbon sm:text-4xl">
            What lands in your hands
          </SplitHeading>
          <Reveal stagger={0.1} className="mt-10 grid gap-4 md:grid-cols-2">
            {service.deliverables.map((d) => (
              <div key={d.title} className="rounded-xl border border-steel bg-titan p-7">
                <h3 className="text-xl font-bold tracking-tight text-carbon">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{d.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 7 — PRICING */}
      <section className="border-b border-steel">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt-dim">/ engagements</p>
          <SplitHeading className="mt-2 text-3xl font-extrabold tracking-tight text-carbon sm:text-4xl">
            Ways to work together
          </SplitHeading>
          <Reveal stagger={0.12} className="mt-10 grid gap-4 md:grid-cols-3">
            {service.tiers.map((tier) => (
              <Tilt3D key={tier.name} intensity={8}>
                <div
                  className={`flex h-full flex-col rounded-xl border p-7 ${
                    tier.featured ? "border-carbon bg-carbon" : "border-steel bg-white/70"
                  }`}
                >
                  <h3
                    className={`text-xl font-extrabold tracking-tight ${
                      tier.featured ? "text-volt" : "text-carbon"
                    }`}
                  >
                    {tier.name}
                  </h3>
                  <p
                    className={`mt-1 font-mono text-[12px] uppercase tracking-[0.12em] ${
                      tier.featured ? "text-volt/70" : "text-ink/40"
                    }`}
                  >
                    {tier.price}
                  </p>
                  <p className={`mt-4 text-sm ${tier.featured ? "text-white/60" : "text-ink/60"}`}>
                    {tier.blurb}
                  </p>
                  <ul className="mt-6 space-y-2">
                    {tier.items.map((i) => (
                      <li
                        key={i}
                        className={`flex gap-2 text-sm ${tier.featured ? "text-white/70" : "text-ink/60"}`}
                      >
                        <span className={tier.featured ? "text-volt" : "text-volt-dim"}>/</span>
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
              </Tilt3D>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 8 — FAQ */}
      <section className="border-b border-steel bg-white/40">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-3 lg:px-10 lg:py-20">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt-dim">/ faq</p>
            <SplitHeading className="mt-2 text-3xl font-extrabold tracking-tight text-carbon">
              Common questions
            </SplitHeading>
          </div>
          <Reveal stagger={0.08} className="lg:col-span-2">
            {service.faqs.map((f) => (
              <div key={f.q} className="border-t border-steel py-6">
                <h3 className="text-lg font-bold tracking-tight text-carbon">{f.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{f.a}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 9 — OTHER SERVICES + CTA */}
      <section className="bg-carbon">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <Parallax amount={24}>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt">/ keep exploring</p>
          </Parallax>
          <Reveal stagger={0.1} className="mt-8 grid gap-4 md:grid-cols-3">
            {others.map((s: ServiceDetail) => (
              <Link
                key={s.slug}
                to="/services/$id"
                params={{ id: s.slug }}
                className="group rounded-xl border border-white/10 bg-white/5 p-6 transition hover:border-volt/40"
              >
                <span className="font-mono text-[11px] text-volt/60">{s.id}</span>
                <h3 className="mt-4 text-xl font-bold tracking-tight text-white group-hover:text-volt">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-white/50">{s.description}</p>
              </Link>
            ))}
          </Reveal>

          <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-10 sm:flex-row sm:items-center">
            <SplitHeading className="max-w-lg text-3xl font-extrabold tracking-tight text-volt">
              Ready to scope your build?
            </SplitHeading>
            <Link
              to="/"
              hash="contact"
              className="rounded-full bg-volt px-7 py-3.5 font-mono text-[12px] font-semibold uppercase tracking-[0.15em] text-carbon transition hover:brightness-95"
            >
              Send a brief
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
