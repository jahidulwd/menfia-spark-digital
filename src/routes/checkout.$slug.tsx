import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { getProduct, listFooterPages } from "@/lib/store.functions";
import { createOrder, getPaddleConfig, markOrderCompleted } from "@/lib/checkout.functions";

const productQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: async () => {
      const row = await getProduct({ data: { slug } });
      if (!row) throw notFound();
      return row as any;
    },
  });

export const Route = createFileRoute("/checkout/$slug")({
  loader: ({ context, params }) => context.queryClient.ensureQueryData(productQuery(params.slug)),
  head: ({ loaderData }) => {
    const title = `Checkout — ${(loaderData as any)?.title ?? "Menfia Digital"}`;
    return {
      meta: [
        { title },
        { name: "description", content: "Secure checkout powered by Paddle. Pay once and download instantly." },
        { property: "og:title", content: title },
        { property: "og:description", content: "Secure Paddle checkout for Menfia Digital products." },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  errorComponent: () => (
    <main className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-2xl font-extrabold text-carbon">Checkout couldn't load</h1>
      <Link to="/products" className="mt-4 inline-block font-mono text-xs uppercase text-volt-dim">
        Back to products
      </Link>
    </main>
  ),
  notFoundComponent: () => (
    <main className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-2xl font-extrabold text-carbon">Product not found</h1>
    </main>
  ),
  component: CheckoutPage,
});

declare global {
  interface Window {
    Paddle?: any;
  }
}

function loadPaddle(): Promise<any> {
  if (window.Paddle) return Promise.resolve(window.Paddle);
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.onload = () => (window.Paddle ? resolve(window.Paddle) : reject(new Error("Paddle failed to load")));
    script.onerror = () => reject(new Error("Paddle failed to load"));
    document.head.appendChild(script);
  });
}

const emailSchema = z.string().trim().email().max(255);

function CheckoutPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const { data: product } = useSuspenseQuery(productQuery(slug));

  const config = useServerFn(getPaddleConfig);
  const start = useServerFn(createOrder);
  const complete = useServerFn(markOrderCompleted);
  const pages = useServerFn(listFooterPages);

  const paddle = useQuery({ queryKey: ["paddle-config"], queryFn: () => config() });
  const footerPages = useQuery({ queryKey: ["footer-pages"], queryFn: () => pages() });

  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [busy, setBusy] = useState(false);

  const termsSlug =
    (footerPages.data ?? []).find((p: any) => /terms/.test(p.slug))?.slug ?? "terms-and-conditions";
  const refundSlug = (footerPages.data ?? []).find((p: any) => /refund/.test(p.slug))?.slug ?? "refund-policy";

  async function pay() {
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) return toast.error("Enter a valid email address");
    if (!agreed) return toast.error("Please accept the terms and refund policy first");

    setBusy(true);
    try {
      const order = await start({ data: { productId: product.id, email: parsed.data } });

      if (!paddle.data?.configured || !order.priceId) {
        toast.error("Payments aren't configured for this product yet. Please contact us to complete the purchase.");
        return;
      }

      const Paddle = await loadPaddle();
      Paddle.Environment.set(paddle.data.environment === "production" ? "production" : "sandbox");
      Paddle.Initialize({
        token: paddle.data.clientToken,
        eventCallback: async (event: any) => {
          if (event?.name === "checkout.completed") {
            try {
              await complete({ data: { orderId: order.orderId, transactionId: event?.data?.transaction_id } });
            } catch {
              /* the webhook is the source of truth */
            }
            navigate({ to: "/thank-you", search: { order: order.orderId } });
          }
        },
      });
      Paddle.Checkout.open({
        items: [{ priceId: order.priceId, quantity: 1 }],
        customer: { email: parsed.data },
        customData: { order_id: order.orderId, product_slug: product.slug },
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start the checkout");
    } finally {
      setBusy(false);
    }
  }

  const price =
    product.price_cents === 0 ? "Free" : `${product.currency} ${(product.price_cents / 100).toFixed(2)}`;

  return (
    <main className="min-h-screen bg-titan">
      <div className="mx-auto max-w-5xl px-6 py-14 lg:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-volt-dim">/ secure checkout</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-carbon sm:text-4xl">Complete your purchase</h1>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-xl border border-steel bg-white/70 p-6">
            <label className="block">
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/50">Email for the receipt & download</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="mt-2 w-full rounded-lg border border-steel bg-white px-4 py-3 text-sm text-carbon focus:border-volt-dim focus:outline-none"
              />
            </label>

            <label className="mt-6 flex items-start gap-3 text-sm text-ink/70">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1"
              />
              <span>
                I agree to the{" "}
                <Link to="/p/$slug" params={{ slug: termsSlug }} className="underline hover:text-carbon">
                  terms and conditions
                </Link>{" "}
                and the{" "}
                <Link to="/p/$slug" params={{ slug: refundSlug }} className="underline hover:text-carbon">
                  refund policy
                </Link>
                . Digital products are delivered instantly.
              </span>
            </label>

            <button
              onClick={pay}
              disabled={busy || !agreed}
              className="mt-8 w-full rounded-lg bg-volt px-6 py-4 font-mono text-[12px] font-semibold uppercase tracking-[0.15em] text-carbon transition hover:brightness-95 disabled:opacity-50"
            >
              {busy ? "Opening checkout…" : `Pay ${price} with Paddle`}
            </button>
            <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-ink/40">
              Payments processed securely by Paddle
            </p>
          </div>

          <aside className="rounded-xl border border-steel bg-carbon p-6 text-white">
            <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">Order summary</p>
            <div className="mt-4 flex gap-4">
              {product.cover_image_url && (
                <img
                  src={product.cover_image_url}
                  alt={`${product.title} cover`}
                  className="h-20 w-24 rounded object-cover"
                />
              )}
              <div>
                <p className="font-bold">{product.title}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white/40">{product.type}</p>
              </div>
            </div>
            <div className="mt-6 border-t border-white/10 pt-4">
              <div className="flex justify-between text-sm text-white/70">
                <span>Subtotal</span>
                <span>{price}</span>
              </div>
              <div className="mt-2 flex justify-between text-sm text-white/70">
                <span>Taxes</span>
                <span>Calculated by Paddle</span>
              </div>
              <div className="mt-4 flex justify-between text-lg font-extrabold text-volt">
                <span>Total</span>
                <span>{price}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
