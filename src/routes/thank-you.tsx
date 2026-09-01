import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/thank-you")({
  validateSearch: (search: Record<string, unknown>): { order?: string } =>
    typeof search["order"] === "string" ? { order: search["order"] as string } : {},
  head: () => ({
    meta: [
      { title: "Thank you for your purchase — Menfia Digital" },
      { name: "description", content: "Your Menfia Digital purchase is confirmed. Your download link is on the way." },
      { property: "og:title", content: "Thank you — Menfia Digital" },
      { property: "og:description", content: "Purchase confirmed. Download details are in your inbox." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ThankYou,
});

function ThankYou() {
  const { order } = Route.useSearch();
  return (
    <main className="flex min-h-[80vh] items-center bg-titan">
      <div className="mx-auto max-w-xl px-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt-dim">/ order confirmed</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-carbon">Thank you for your purchase</h1>
        <p className="mt-4 text-base text-ink/60">
          Paddle has your receipt and your download is ready. Sign in with the same email to access your files any time.
        </p>
        {order && (
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.15em] text-ink/40">Order reference {order}</p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/downloads"
            className="rounded-full bg-volt px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-carbon"
          >
            Go to downloads
          </Link>
          <Link
            to="/products"
            className="rounded-full border border-steel px-6 py-3 font-mono text-[11px] uppercase tracking-[0.15em] text-ink/60"
          >
            Browse more products
          </Link>
        </div>
      </div>
    </main>
  );
}
