import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

function verify(signatureHeader: string | null, body: string, secret: string) {
  if (!signatureHeader) return false;
  const parts = Object.fromEntries(
    signatureHeader.split(";").map((chunk) => {
      const [key, ...rest] = chunk.split("=");
      return [key?.trim() ?? "", rest.join("=")];
    }),
  ) as Record<string, string>;
  const ts = parts["ts"];
  const h1 = parts["h1"];
  if (!ts || !h1) return false;
  const expected = createHmac("sha256", secret).update(`${ts}:${body}`).digest("hex");
  const a = Buffer.from(h1);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export const Route = createFileRoute("/api/public/paddle-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: settings } = await supabaseAdmin
          .from("app_settings")
          .select("value")
          .eq("key", "paddle")
          .maybeSingle();
        const secret = ((settings?.value ?? {}) as Record<string, string>)["webhook_secret"];
        if (!secret) return new Response("Webhook not configured", { status: 503 });

        const body = await request.text();
        if (!verify(request.headers.get("paddle-signature"), body, secret)) {
          return new Response("Invalid signature", { status: 401 });
        }

        let event: any;
        try {
          event = JSON.parse(body);
        } catch {
          return new Response("Bad payload", { status: 400 });
        }

        const type = event?.event_type as string | undefined;
        const txn = event?.data ?? {};
        const orderId = txn?.custom_data?.order_id as string | undefined;
        const transactionId = txn?.id as string | undefined;

        if (orderId) {
          const status =
            type === "transaction.completed" || type === "transaction.paid"
              ? "paid"
              : type === "transaction.payment_failed" || type === "transaction.canceled"
                ? "failed"
                : type === "adjustment.created" || type === "transaction.refunded"
                  ? "refunded"
                  : null;
          if (status) {
            await supabaseAdmin
              .from("orders")
              .update({ status, ...(transactionId ? { paddle_transaction_id: transactionId } : {}) })
              .eq("id", orderId);
          }
        }

        return new Response("ok");
      },
    },
  },
});
