import { createFileRoute, Link } from "@tanstack/react-router";
import { projects } from "../lib/projects";
import { services } from "../lib/services";
import { Reveal, SplitHeading, Tilt3D, CountUp, Parallax } from "../components/Motion";

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

function Index() {
  return (
    <div className="min-h-screen bg-titan font-sans text-ink antialiased">
      {/* HERO */}
      <section className="grid-bg border-b border-steel">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-end">
            <div className="flex-1">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-steel bg-white/60 px-4 py-1.5">
                <span className="size-2 rounded-full bg-volt"></span>
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/60">
                  Engineered for the web
                </span>
              </div>
              <h1 className="text-5xl font-extrabold leading-[0.95] tracking-tight text-carbon sm:text-6xl lg:text-7xl">
                <SplitHeading as="span" className="block">
                  We build digital
                </SplitHeading>
                <SplitHeading as="span" className="block" delay={0.15}>
                  systems that scale.
                </SplitHeading>
              </h1>
              <Reveal delay={0.3}>
                <p className="mt-6 max-w-md text-base leading-relaxed text-ink/60">
                  Menfia Digital designs and engineers web products, templates, plugins, and growth
                  campaigns — from first grid to final deploy.
                </p>
              </Reveal>
              <Reveal delay={0.4} className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/"
                  hash="work"
                  className="rounded-full bg-carbon px-6 py-3 font-mono text-[12px] font-semibold uppercase tracking-[0.15em] text-volt transition hover:opacity-90"
                >
                  View the work
                </Link>
                <Link
                  to="/"
                  hash="services"
                  className="rounded-full border border-steel bg-white/50 px-6 py-3 font-mono text-[12px] font-semibold uppercase tracking-[0.15em] text-ink/70 transition hover:border-carbon/30"
                >
                  Browse services
                </Link>
              </Reveal>
            </div>
            <Tilt3D className="w-full lg:w-80">
              <div className="rounded-xl border border-steel bg-white/70 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/40">
                    Live index
                  </span>
                  <span className="h-px flex-1 mx-3 bg-steel"></span>
                  <span className="font-mono text-[10px] text-ink/40">v2.4</span>
                </div>
                <dl className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/50">
                      Web dev
                    </dt>
                    <dd className="text-right text-2xl font-extrabold text-carbon">
                      <CountUp value="148" />
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/50">
                      Templates
                    </dt>
                    <dd className="text-right text-2xl font-extrabold text-carbon">
                      <CountUp value="62" />
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink/50">
                      Plugins
                    </dt>
                    <dd className="text-right text-2xl font-extrabold text-volt">
                      <CountUp value="27" />
                    </dd>
                  </div>
                </dl>
              </div>
            </Tilt3D>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="border-b border-steel">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt-dim">
                / what we do
              </p>
              <SplitHeading className="mt-2 text-3xl font-extrabold tracking-tight text-carbon sm:text-4xl">
                The service matrix
              </SplitHeading>
            </div>
            <span className="hidden font-mono text-[11px] uppercase tracking-[0.15em] text-ink/40 sm:block">
              04 modules
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

                <span
                  className={`font-mono text-[11px] ${
                    service.featured ? "text-volt/60" : "text-ink/30"
                  }`}
                >
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
                    service.featured
                      ? "text-volt/70 group-hover:text-volt"
                      : "text-ink/50 group-hover:text-carbon"
                  }`}
                >
                  / explore
                </span>
                <div className="mt-5 flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`rounded-sm px-2 py-1 font-mono text-[11px] uppercase tracking-wider ${
                        service.featured
                          ? "bg-white/10 text-steel"
                          : "bg-steel/20 text-ink/50"
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

      {/* WORK */}
      <section id="work" className="border-b border-steel bg-white/40">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt-dim">
                / selected work
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-carbon sm:text-4xl">
                Recent builds
              </h2>
            </div>
            <Link
              to="/"
              hash="work"
              className="hidden font-mono text-[11px] uppercase tracking-[0.15em] text-ink/50 hover:text-carbon sm:block"
            >
              All projects /
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
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
          </div>
        </div>
      </section>

      {/* CTA + FOOTER */}
      <section id="contact" className="bg-carbon">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt">
                / start a build
              </p>
              <h2 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight text-volt sm:text-5xl">
                Let&apos;s ship the next system.
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-white/60">
                Tell us what you&apos;re building. We&apos;ll map the stack, the timeline, and the
                first milestone — no fluff.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-7">
              <form
                className="flex flex-col gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">
                    Your email
                  </span>
                  <input
                    type="email"
                    placeholder="you@company.com"
                    className="mt-2 w-full rounded-lg border border-white/10 bg-carbon px-4 py-3 text-sm text-volt placeholder:text-white/30 focus:border-volt focus:outline-none"
                  />
                </label>
                <label className="block">
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">
                    Project type
                  </span>
                  <select className="mt-2 w-full rounded-lg border border-white/10 bg-carbon px-4 py-3 text-sm text-white focus:border-volt focus:outline-none">
                    <option>Web development</option>
                    <option>Template / design system</option>
                    <option>Plugin or script</option>
                    <option>Digital marketing</option>
                  </select>
                </label>
                <button
                  type="submit"
                  className="mt-2 w-full rounded-lg bg-volt px-6 py-3.5 font-mono text-[12px] font-semibold uppercase tracking-[0.15em] text-carbon transition hover:brightness-95"
                >
                  Send brief
                </button>
              </form>
            </div>
          </div>
          <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 font-mono text-[11px] uppercase tracking-[0.15em] text-white/40 sm:flex-row sm:items-center">
            <span>Menfia Digital — Systems for the web</span>
            <span>© 2026 · Built with intent</span>
          </div>
        </div>
      </section>
    </div>
  );
}
