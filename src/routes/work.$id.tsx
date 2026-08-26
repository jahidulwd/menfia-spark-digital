import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getProjectBySlug } from "../lib/projects";

export const Route = createFileRoute("/work/$id")({
  head: ({ params }) => {
    const project = getProjectBySlug(params.id);
    const title = project
      ? `${project.title} — Menfia Digital`
      : "Project — Menfia Digital";
    const description = project
      ? `${project.description}. ${project.challenge}`
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
  loader: ({ params }) => {
    const project = getProjectBySlug(params.id);
    if (!project) {
      throw notFound();
    }
    return { project };
  },
  component: ProjectDetail,
});

function ProjectDetail() {
  const { project } = Route.useLoaderData();

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

      {/* Hero */}
      <section className="border-b border-steel">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt-dim">
                / {project.category}
              </p>
              <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight text-carbon sm:text-5xl">
                {project.title}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-ink/60">{project.description}</p>
              <div className="mt-8 flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-sm bg-steel/20 px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-ink/60"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4 border-t border-steel pt-6">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/40">
                    Client
                  </p>
                  <p className="mt-1 text-sm font-semibold text-carbon">{project.client}</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/40">
                    Year
                  </p>
                  <p className="mt-1 text-sm font-semibold text-carbon">{project.year}</p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="overflow-hidden rounded-xl border border-steel">
                <img
                  src={project.image}
                  alt={project.title}
                  width={1024}
                  height={768}
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="border-b border-steel bg-white/40">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-carbon">The challenge</h2>
              <p className="mt-4 leading-relaxed text-ink/60">{project.challenge}</p>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-carbon">The solution</h2>
              <p className="mt-4 leading-relaxed text-ink/60">{project.solution}</p>
            </div>
          </div>

          <div className="mt-16 rounded-xl border border-steel bg-carbon p-8 lg:p-12">
            <h2 className="text-2xl font-extrabold tracking-tight text-volt">Results</h2>
            <ul className="mt-6 space-y-3">
              {project.results.map((result, index) => (
                <li key={index} className="flex items-start gap-3 text-white/80">
                  <span className="mt-1.5 size-1.5 rounded-full bg-volt"></span>
                  <span>{result}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-carbon">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center lg:px-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt">
            / start a build
          </p>
          <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-volt sm:text-5xl">
            Want something like this?
          </h2>
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
        </div>
      </section>
    </main>
  );
}
