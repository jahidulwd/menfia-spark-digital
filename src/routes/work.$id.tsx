import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getProjectBySlug, projects } from "../lib/projects";
import { Reveal, SplitHeading, Tilt3D, CountUp } from "../components/Motion";

export const Route = createFileRoute("/work/$id")({
  head: ({ params }) => {
    const project = getProjectBySlug(params.id);
    const title = project
      ? `${project.title} — Case Study | Menfia Digital`
      : "Project — Menfia Digital";
    const description = project
      ? `${project.description}. ${project.challenge}`.slice(0, 155)
      : "Case study by Menfia Digital.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: ProjectNotFound,
  component: ProjectDetail,
});

function ProjectNotFound() {
  return (
    <main className="min-h-screen bg-titan">
      <div className="mx-auto max-w-7xl px-6 py-24 text-center lg:px-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-carbon">Project not found</h1>
        <p className="mt-4 text-ink/60">That project doesn&apos;t exist in our build index.</p>
        <Link
          to="/"
          hash="work"
          className="mt-8 inline-block rounded-full bg-carbon px-6 py-3 font-mono text-[12px] font-semibold uppercase tracking-[0.15em] text-volt transition hover:opacity-90"
        >
          Back to work
        </Link>
      </div>
    </main>
  );
}

function SectionLabel({ index, children }: { index: string; children: string }) {
  return (
    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt-dim">
      <span className="text-ink/30">{index}</span> / {children}
    </p>
  );
}

function ProjectDetail() {
  const { id } = Route.useParams();
  const project = getProjectBySlug(id);
  if (!project) throw notFound();

  const others = projects.filter((p) => p.slug !== project.slug);

  return (
    <main className="min-h-screen bg-titan">
      {/* Breadcrumb */}
      <div className="border-b border-steel">
        <div className="mx-auto max-w-7xl px-6 py-4 lg:px-10">
          <Link
            to="/"
            hash="work"
            className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink/50 hover:text-carbon"
          >
            ← Back to work
          </Link>
        </div>
      </div>

      {/* 01 — Hero */}
      <section className="grid-bg border-b border-steel">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
          <SectionLabel index="01">{project.category.toUpperCase()}</SectionLabel>
          <SplitHeading
            as="h1"
            className="mt-4 max-w-4xl text-5xl font-extrabold leading-[0.95] tracking-tight text-carbon sm:text-7xl"
          >
            {project.title}
          </SplitHeading>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/60 sm:text-xl">
              {project.intro}
            </p>
          </Reveal>

          <Reveal delay={0.25} stagger={0.06} className="mt-12 grid gap-6 border-t border-steel pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Client", project.client],
              ["Year", project.year],
              ["Timeline", project.timeline],
              ["Role", project.role],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/40">
                  {label}
                </p>
                <p className="mt-1.5 text-sm font-semibold text-carbon">{value}</p>
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.3} className="mt-12">
            <Tilt3D className="overflow-hidden rounded-2xl border border-steel bg-white shadow-[0_40px_80px_-40px_rgba(13,14,21,0.35)]">
              <img
                src={project.image}
                alt={`${project.title} interface`}
                width={1600}
                height={1000}
                className="aspect-[16/10] w-full object-cover"
              />
            </Tilt3D>
          </Reveal>
        </div>
      </section>

      {/* 02 — Brief + scope */}
      <section className="border-b border-steel bg-white/50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionLabel index="02">THE BRIEF</SectionLabel>
              <SplitHeading
                as="h2"
                className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-carbon sm:text-4xl"
              >
                {project.challenge}
              </SplitHeading>
            </div>
            <div className="lg:col-span-7">
              <Reveal>
                <p className="text-lg leading-relaxed text-ink/60">{project.solution}</p>
              </Reveal>
              <Reveal delay={0.1} className="mt-8 border-l-2 border-volt bg-volt/10 p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/40">
                  Starting point
                </p>
                <p className="mt-2 text-base font-medium leading-relaxed text-carbon">
                  {project.problemNote}
                </p>
              </Reveal>
              <Reveal delay={0.15} stagger={0.05} className="mt-8 flex flex-wrap gap-2">
                {project.scope.map((item) => (
                  <span
                    key={item}
                    className="rounded-sm border border-steel bg-titan px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-ink/60"
                  >
                    {item}
                  </span>
                ))}
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — Approach */}
      <section className="border-b border-steel">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <SectionLabel index="03">APPROACH</SectionLabel>
          <SplitHeading
            as="h2"
            className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-carbon sm:text-5xl"
          >
            How we worked through it
          </SplitHeading>
          <Reveal stagger={0.1} className="mt-12 grid gap-px overflow-hidden rounded-xl border border-steel bg-steel md:grid-cols-3">
            {project.approach.map((step, i) => (
              <div key={step.title} className="bg-titan p-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt-dim">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-xl font-extrabold tracking-tight text-carbon">
                  {step.title}
                </h3>
                <p className="mt-3 leading-relaxed text-ink/60">{step.body}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 04 — Design */}
      <section className="border-b border-steel bg-white/50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <SectionLabel index="04">DESIGN</SectionLabel>
              <SplitHeading
                as="h2"
                className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-carbon sm:text-4xl"
              >
                {project.design.title}
              </SplitHeading>
              <Reveal delay={0.1}>
                <p className="mt-5 leading-relaxed text-ink/60">{project.design.body}</p>
              </Reveal>
              <Reveal delay={0.15} stagger={0.06} className="mt-8 space-y-3">
                {project.design.bullets.map((b) => (
                  <div key={b} className="flex items-start gap-3">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-volt-dim" />
                    <span className="text-sm leading-relaxed text-ink/70">{b}</span>
                  </div>
                ))}
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <Reveal delay={0.1}>
                <Tilt3D className="overflow-hidden rounded-2xl border border-steel bg-carbon">
                  <img
                    src={project.image}
                    alt={`${project.title} design detail`}
                    width={1200}
                    height={900}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover opacity-90"
                  />
                </Tilt3D>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 05 — Build */}
      <section className="border-b border-steel bg-carbon">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt">
                <span className="text-white/30">05</span> / BUILD
              </p>
              <SplitHeading
                as="h2"
                className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-volt sm:text-4xl"
              >
                {project.build.title}
              </SplitHeading>
            </div>
            <div className="lg:col-span-7">
              <Reveal>
                <p className="text-lg leading-relaxed text-white/60">{project.build.body}</p>
              </Reveal>
              <Reveal delay={0.1} stagger={0.06} className="mt-8 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2">
                {project.build.bullets.map((b) => (
                  <div key={b} className="bg-carbon p-5 text-sm leading-relaxed text-white/70">
                    {b}
                  </div>
                ))}
              </Reveal>
              <Reveal delay={0.15} stagger={0.04} className="mt-8 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-sm border border-white/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-white/60"
                  >
                    {tech}
                  </span>
                ))}
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 06 — Results */}
      <section className="border-b border-steel">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <SectionLabel index="06">RESULTS</SectionLabel>
          <SplitHeading
            as="h2"
            className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-carbon sm:text-5xl"
          >
            What changed after launch
          </SplitHeading>
          <Reveal stagger={0.08} className="mt-12 grid gap-px overflow-hidden rounded-xl border border-steel bg-steel sm:grid-cols-2 lg:grid-cols-4">
            {project.metrics.map((m) => (
              <div key={m.label} className="bg-titan p-8">
                <CountUp
                  value={m.value}
                  className="block text-4xl font-extrabold tracking-tight text-carbon sm:text-5xl"
                />
                <p className="mt-3 font-mono text-[11px] uppercase leading-relaxed tracking-[0.12em] text-ink/50">
                  {m.label}
                </p>
              </div>
            ))}
          </Reveal>
          <Reveal delay={0.1} stagger={0.06} className="mt-10 grid gap-4 md:grid-cols-3">
            {project.results.map((r) => (
              <div key={r} className="rounded-xl border border-steel bg-white/50 p-6">
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-volt-dim">
                  Outcome
                </span>
                <p className="mt-2 leading-relaxed text-carbon">{r}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* 07 — Testimonial */}
      <section className="border-b border-steel bg-volt">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-carbon/50">
            <span className="text-carbon/30">07</span> / CLIENT
          </p>
          <SplitHeading
            as="blockquote"
            className="mt-6 text-2xl font-extrabold leading-snug tracking-tight text-carbon sm:text-4xl"
          >
            {`“${project.testimonial.quote}”`}
          </SplitHeading>
          <Reveal delay={0.15}>
            <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.15em] text-carbon/60">
              {project.testimonial.author} — {project.testimonial.role}
            </p>
          </Reveal>
        </div>
      </section>

      {/* 08 — Deliverables + outcome */}
      <section className="border-b border-steel bg-white/50">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionLabel index="08">DELIVERABLES</SectionLabel>
              <Reveal stagger={0.05} className="mt-6 divide-y divide-steel border-y border-steel">
                {project.deliverables.map((d, i) => (
                  <div key={d} className="flex items-center gap-4 py-4">
                    <span className="font-mono text-[11px] text-ink/30">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-carbon">{d}</span>
                  </div>
                ))}
              </Reveal>
            </div>
            <div className="lg:col-span-7">
              <SectionLabel index="—">WHERE IT LANDED</SectionLabel>
              <Reveal delay={0.1}>
                <p className="mt-6 text-xl leading-relaxed text-ink/70 sm:text-2xl">
                  {project.outcome}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* 09 — Next projects */}
      <section className="border-b border-steel">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
          <SectionLabel index="09">NEXT</SectionLabel>
          <Reveal stagger={0.1} className="mt-8 grid gap-6 md:grid-cols-2">
            {others.map((p) => (
              <Link
                key={p.slug}
                to="/work/$id"
                params={{ id: p.slug }}
                className="group overflow-hidden rounded-xl border border-steel bg-white/50 transition hover:border-carbon"
              >
                <img
                  src={p.image}
                  alt={p.title}
                  width={800}
                  height={500}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <div className="p-6">
                  <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-volt-dim">
                    / {p.category}
                  </p>
                  <h3 className="mt-2 text-xl font-extrabold tracking-tight text-carbon">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-sm text-ink/60">{p.description}</p>
                </div>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-carbon">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt">
            / start a build
          </p>
          <SplitHeading
            as="h2"
            className="mt-4 text-4xl font-extrabold tracking-tight text-volt sm:text-5xl"
          >
            Want something like this?
          </SplitHeading>
          <Reveal delay={0.15}>
            <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-white/60">
              Tell us what you&apos;re building and we&apos;ll map the stack, timeline, and first
              milestone.
            </p>
            <Link
              to="/"
              hash="contact"
              className="mt-8 inline-block rounded-lg bg-volt px-8 py-4 font-mono text-[12px] font-semibold uppercase tracking-[0.15em] text-carbon transition hover:brightness-95"
            >
              Start a build
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
