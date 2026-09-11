import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";

/** Public Paddle client config. The client token is a publishable value. */
export const getPaddleConfig = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin
    .from("app_settings")
    .select("value")
    .eq("key", "paddle")
    .maybeSingle();
  const value = (data?.value ?? {}) as Record<string, string>;
  return {
    environment: value["environment"] === "production" ? "production" : "sandbox",
    clientToken: value["client_token"] ?? "",
    successPath: value["default_success_path"] || "/thank-you",
    configured: Boolean(value["client_token"]),
  };
});

const createOrderSchema = z.object({
  productId: z.string().uuid(),
  email: z.string().trim().email().max(255),
});

/** Creates a pending order before the Paddle overlay opens. */
export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => createOrderSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: product } = await supabaseAdmin
      .from("products")
      .select("id, price_cents, currency, status, paddle_price_id, title")
      .eq("id", data.productId)
      .eq("status", "published")
      .maybeSingle();
    if (!product) throw new Error("That product is not available.");

    // Attach the signed-in user when a valid bearer token is present.
    let userId: string | null = null;
    const authHeader = getRequestHeader("authorization");
    const token = authHeader?.toLowerCase().startsWith("bearer ") ? authHeader.slice(7) : null;
    if (token) {
      const { data: userData } = await supabaseAdmin.auth.getUser(token);
      userId = userData?.user?.id ?? null;
    }

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        product_id: product.id,
        user_id: userId,
        email: data.email,
        amount_cents: product.price_cents,
        currency: product.currency,
        status: "pending",
      })
      .select("id")
      .maybeSingle();
    if (error || !order) throw new Error("Could not start the checkout.");

    return {
      orderId: order.id,
      priceId: product.paddle_price_id,
      amountCents: product.price_cents,
      currency: product.currency,
      title: product.title,
    };
  });

/** Client-side confirmation after the Paddle overlay reports success. */
export const markOrderCompleted = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z
      .object({ orderId: z.string().uuid(), transactionId: z.string().trim().max(120).optional() })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("orders")
      .update({
        status: "paid",
        ...(data.transactionId ? { paddle_transaction_id: data.transactionId } : {}),
      })
      .eq("id", data.orderId)
      .eq("status", "pending");
    if (error) throw new Error("Could not confirm the order.");
    const { issueLicenseForOrder } = await import("@/lib/licensing.server");
    const license = await issueLicenseForOrder(data.orderId);
    return { ok: true, licenseKey: license?.licenseKey ?? null };
  });
