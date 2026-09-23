import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Ctx = { supabase: any; userId: string; claims?: { email?: string } };

export const getMyAccess = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as Ctx;
    const { data } = await ctx.supabase.rpc("has_role", { _user_id: ctx.userId, _role: "admin" });
    return { userId: ctx.userId, isAdmin: Boolean(data), email: ctx.claims?.email ?? "" };
  });

export const listMyOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await (context as Ctx).supabase
      .from("orders")
      .select("id, status, amount_cents, currency, created_at, products(title, slug)")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

/** Returns a short-lived download link for a paid order owned by the caller. */
export const getMyDownloadLink = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { orderId: string }) => z.object({ orderId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    const ctx = context as Ctx;
    const { data: order } = await ctx.supabase
      .from("orders")
      .select("id, status, user_id, products(file_path, external_download_url)")
      .eq("id", data.orderId)
      .maybeSingle();
    if (!order || order.user_id !== ctx.userId) throw new Error("Order not found.");
    if (order.status !== "paid") throw new Error("This order is not paid yet.");

    const product = order.products as { file_path: string | null; external_download_url: string | null } | null;
    if (product?.external_download_url) return { url: product.external_download_url };
    if (!product?.file_path) throw new Error("No file attached to this product yet.");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: signed, error } = await supabaseAdmin.storage
      .from("product-files")
      .createSignedUrl(product.file_path, 300);
    if (error) throw new Error("Could not create the download link.");
    return { url: signed?.signedUrl ?? null };
  });
