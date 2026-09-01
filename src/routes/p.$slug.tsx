import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { getPage } from "@/lib/store.functions";

const pageQuery = (slug: string) =>
  queryOptions({
    queryKey: ["page", slug],
    queryFn: async () => {
      const row = await getPage({ data: { slug } });
      if (!row) throw notFound();
      return row as any;
    },
  });

export const Route = createFileRoute("/p/$slug")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(pageQuery(params.slug)),
  head: ({ loaderData }) => {
    const page = loaderData as any;
    const title = page?.title ? `${page.title} — Menfia Digital` : "Menfia Digital";
    const description = page?.seo_description ?? `${page?.title ?? "Policy"} for Menfia Digital.`;
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
  errorComponent: () => (
    <main className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-2xl font-extrabold text-carbon">This page couldn't load</h1>
    </main>
  ),
  notFoundComponent: () => (
    <main className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-2xl font-extrabold text-carbon">Page not found</h1>
      <Link to="/" className="mt-4 inline-block font-mono text-xs uppercase tracking-[0.15em] text-volt-dim">
        Go home
      </Link>
    </main>
  ),
  component: CmsPage,
});

function CmsPage() {
  const { slug } = Route.useParams();
  const { data: page } = useSuspenseQuery(pageQuery(slug));

  return (
    <main className="min-h-screen bg-titan">
      <article className="mx-auto max-w-3xl px-6 py-16 lg:py-20">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt-dim">/ {page.slug}</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-carbon sm:text-4xl">{page.title}</h1>
        <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-ink/40">
          Last updated {new Date(page.updated_at).toLocaleDateString()}
        </p>
        <div className="mt-10 space-y-4 whitespace-pre-wrap text-base leading-relaxed text-ink/70">{page.content}</div>
      </article>
    </main>
  );
}
