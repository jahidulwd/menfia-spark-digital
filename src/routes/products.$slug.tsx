import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { getProduct } from "@/lib/store.functions";

const productQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: async () => {
      const row = await getProduct({ data: { slug } });
      if (!row) throw notFound();
      return row as any;
    },
  });

export const Route = createFileRoute("/products/$slug")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(productQuery(params.slug)),
  head: ({ loaderData }) => {
    const product = loaderData as any;
    const title = product?.title ? `${product.title} — Menfia Digital` : "Product — Menfia Digital";
    const description =
      product?.tagline ??
      "A production-ready digital product from Menfia Digital, available for instant download.";
    const image = typeof product?.cover_image_url === "string" && product.cover_image_url.startsWith("https://")
      ? product.cover_image_url
      : null;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(image ? [{ property: "og:image", content: image }, { name: "twitter:image", content: image }] : []),
      ],
    };
  },
  errorComponent: () => (
    <main className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-2xl font-extrabold text-carbon">This product couldn't load</h1>
      <Link to="/products" className="mt-4 inline-block font-mono text-xs uppercase tracking-[0.15em] text-volt-dim">
        Back to products
      </Link>
    </main>
  ),
  notFoundComponent: () => (
    <main className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-2xl font-extrabold text-carbon">Product not found</h1>
      <Link to="/products" className="mt-4 inline-block font-mono text-xs uppercase tracking-[0.15em] text-volt-dim">
        Browse all products
      </Link>
    </main>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: product } = useSuspenseQuery(productQuery(slug));

  const features: string[] = Array.isArray(product.features) ? product.features : [];
  const stack: string[] = Array.isArray(product.tech_stack) ? product.tech_stack : [];

  return (
    <main className="min-h-screen bg-titan">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <Link to="/products" className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink/40 hover:text-carbon">
          / all products
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            {product.cover_image_url && (
              <img
                src={product.cover_image_url}
                alt={`${product.title} preview`}
                className="w-full rounded-xl border border-steel object-cover"
              />
            )}
            <h1 className="mt-8 text-3xl font-extrabold tracking-tight text-carbon sm:text-4xl">{product.title}</h1>
            {product.tagline && <p className="mt-2 text-lg text-ink/60">{product.tagline}</p>}
            {product.description && (
              <div className="mt-6 whitespace-pre-wrap text-base leading-relaxed text-ink/70">{product.description}</div>
            )}

            {features.length > 0 && (
              <section className="mt-10">
                <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt-dim">/ what's included</h2>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {features.map((feature) => (
                    <li key={feature} className="flex gap-2 text-sm text-ink/70">
                      <span className="text-volt-dim">+</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl border border-steel bg-white/70 p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/40">Price</p>
              <p className="mt-1 text-3xl font-extrabold tracking-tight text-carbon">
                {product.price_cents === 0
                  ? "Free"
                  : `${product.currency} ${(product.price_cents / 100).toFixed(2)}`}
              </p>
              <Link
                to="/checkout/$slug"
                params={{ slug: product.slug }}
                className="mt-6 block rounded-lg bg-volt px-6 py-3.5 text-center font-mono text-[12px] font-semibold uppercase tracking-[0.15em] text-carbon hover:brightness-95"
              >
                Continue to checkout
              </Link>
              {product.demo_url && (
                <a
                  href={product.demo_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 block rounded-lg border border-steel px-6 py-3 text-center font-mono text-[11px] uppercase tracking-[0.15em] text-ink/60 hover:text-carbon"
                >
                  View live demo
                </a>
              )}
              <dl className="mt-6 space-y-2 font-mono text-[11px] uppercase tracking-[0.1em] text-ink/45">
                <div className="flex justify-between">
                  <dt>Type</dt>
                  <dd className="text-carbon/80">{product.type}</dd>
                </div>
                {product.version && (
                  <div className="flex justify-between">
                    <dt>Version</dt>
                    <dd className="text-carbon/80">{product.version}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt>Delivery</dt>
                  <dd className="text-carbon/80">Instant download</dd>
                </div>
              </dl>
              {stack.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-steel px-3 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink/55"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
