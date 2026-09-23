import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { listProducts } from "@/lib/store.functions";

const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: () => listProducts(),
});

export const Route = createFileRoute("/products/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  head: () => ({
    meta: [
      { title: "Digital products — themes, templates, scripts & plugins" },
      {
        name: "description",
        content:
          "Buy production-ready themes, templates, scripts and plugins built by Menfia Digital. Instant checkout, instant download.",
      },
      { property: "og:title", content: "Digital products by Menfia Digital" },
      {
        property: "og:description",
        content: "Themes, templates, scripts and plugins engineered for real production work.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  errorComponent: () => (
    <main className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-2xl font-extrabold text-carbon">Products couldn't load</h1>
      <p className="mt-2 text-sm text-ink/60">Please refresh in a moment.</p>
    </main>
  ),
  notFoundComponent: () => <main className="px-6 py-24 text-center text-ink/60">Nothing here.</main>,
  component: ProductsPage,
});

const money = (cents: number, currency: string) =>
  cents === 0 ? "Free" : `${currency} ${(cents / 100).toFixed(2)}`;

function ProductsPage() {
  const { data } = useSuspenseQuery(productsQuery);

  return (
    <main className="min-h-screen bg-titan">
      <section className="border-b border-steel">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt-dim">/ digital products</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold tracking-tight text-carbon sm:text-5xl">
            Themes, templates, scripts and plugins — shipped ready to run.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-ink/60">
            Every product is built by the same team that ships client work. Purchase securely through Paddle and download
            immediately.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        {data.length === 0 ? (
          <div className="rounded-xl border border-dashed border-steel p-12 text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink/40">
              No products published yet — check back shortly.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.map((product: any) => (
              <article key={product.id} className="group flex flex-col rounded-xl border border-steel bg-white/70">
                <Link to="/products/$slug" params={{ slug: product.slug }} className="block overflow-hidden rounded-t-xl">
                  {product.cover_image_url ? (
                    <img
                      src={product.cover_image_url}
                      alt={`${product.title} cover`}
                      loading="lazy"
                      className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="aspect-[4/3] w-full bg-steel/60" />
                  )}
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.12em] text-ink/40">
                    <span>{product.type}</span>
                    {product.version && <span>v{product.version}</span>}
                  </div>
                  <Link
                    to="/products/$slug"
                    params={{ slug: product.slug }}
                    className="mt-2 text-lg font-bold tracking-tight text-carbon hover:underline"
                  >
                    {product.title}
                  </Link>
                  <p className="mt-1 flex-1 text-sm text-ink/55">{product.tagline}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="font-mono text-sm font-semibold text-carbon">
                      {money(product.price_cents, product.currency)}
                    </span>
                    <Link
                      to="/checkout/$slug"
                      params={{ slug: product.slug }}
                      className="rounded-full bg-volt px-4 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.12em] text-carbon"
                    >
                      Buy now
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
