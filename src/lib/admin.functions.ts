import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Ctx = { supabase: any; userId: string };

async function assertAdmin(context: Ctx) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden");
}

const productSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Slug can use lowercase letters, numbers and dashes only"),
  title: z.string().trim().min(2).max(160),
  tagline: z.string().trim().max(240).optional().or(z.literal("")),
  description: z.string().trim().max(20000).optional().or(z.literal("")),
  type: z.enum(["theme", "template", "script", "plugin", "service", "other"]),
  status: z.enum(["draft", "published"]),
  featured: z.boolean(),
  price_cents: z.number().int().min(0).max(100000000),
  currency: z.string().trim().length(3),
  cover_image_url: z.string().trim().max(600).optional().or(z.literal("")),
  gallery: z.array(z.string().trim().max(600)).max(20),
  features: z.array(z.string().trim().max(300)).max(40),
  tech_stack: z.array(z.string().trim().max(80)).max(40),
  demo_url: z.string().trim().max(600).optional().or(z.literal("")),
  version: z.string().trim().max(40).optional().or(z.literal("")),
  file_path: z.string().trim().max(600).optional().or(z.literal("")),
  external_download_url: z.string().trim().max(600).optional().or(z.literal("")),
  paddle_price_id: z.string().trim().max(120).optional().or(z.literal("")),
  sort_order: z.number().int().min(0).max(9999),
});

const nullify = (value: string | undefined) => (value && value.length > 0 ? value : null);

export const adminListProducts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as Ctx);
    const { data, error } = await (context as Ctx).supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminGetProduct = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { data: row, error } = await (context as Ctx).supabase
      .from("products")
      .select("*")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row;
  });

export const adminSaveProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => productSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const payload = {
      slug: data.slug,
      title: data.title,
      tagline: nullify(data.tagline),
      description: nullify(data.description),
      type: data.type,
      status: data.status,
      featured: data.featured,
      price_cents: data.price_cents,
      currency: data.currency.toUpperCase(),
      cover_image_url: nullify(data.cover_image_url),
      gallery: data.gallery,
      features: data.features,
      tech_stack: data.tech_stack,
      demo_url: nullify(data.demo_url),
      version: nullify(data.version),
      file_path: nullify(data.file_path),
      external_download_url: nullify(data.external_download_url),
      paddle_price_id: nullify(data.paddle_price_id),
      sort_order: data.sort_order,
      updated_at: new Date().toISOString(),
    };

    const supabase = (context as Ctx).supabase;
    if (data.id) {
      const { data: row, error } = await supabase
        .from("products")
        .update(payload)
        .eq("id", data.id)
        .select("id")
        .maybeSingle();
      if (error) throw new Error(error.message);
      return { id: row?.id ?? data.id };
    }
    const { data: row, error } = await supabase
      .from("products")
      .insert(payload)
      .select("id")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { id: row?.id };
  });

export const adminDeleteProduct = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { error } = await (context as Ctx).supabase.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const pageSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Slug can use lowercase letters, numbers and dashes only"),
  title: z.string().trim().min(2).max(160),
  seo_description: z.string().trim().max(300).optional().or(z.literal("")),
  content: z.string().max(100000),
  published: z.boolean(),
  show_in_footer: z.boolean(),
  sort_order: z.number().int().min(0).max(9999),
});

export const adminListPages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as Ctx);
    const { data, error } = await (context as Ctx).supabase
      .from("pages")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminSavePage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => pageSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const payload = {
      slug: data.slug,
      title: data.title,
      seo_description: nullify(data.seo_description),
      content: data.content,
      published: data.published,
      show_in_footer: data.show_in_footer,
      sort_order: data.sort_order,
      updated_at: new Date().toISOString(),
    };
    const supabase = (context as Ctx).supabase;
    if (data.id) {
      const { error } = await supabase.from("pages").update(payload).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { data: row, error } = await supabase.from("pages").insert(payload).select("id").maybeSingle();
    if (error) throw new Error(error.message);
    return { id: row?.id };
  });

export const adminDeletePage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { error } = await (context as Ctx).supabase.from("pages").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const paddleSchema = z.object({
  environment: z.enum(["sandbox", "production"]),
  client_token: z.string().trim().max(400),
  api_key: z.string().trim().max(400),
  webhook_secret: z.string().trim().max(400),
  default_success_path: z.string().trim().max(200),
});

export const adminGetPaddleSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as Ctx);
    const { data } = await (context as Ctx).supabase
      .from("app_settings")
      .select("value")
      .eq("key", "paddle")
      .maybeSingle();
    const value = (data?.value ?? {}) as Record<string, string>;
    return {
      environment: value["environment"] === "production" ? "production" : "sandbox",
      client_token: value["client_token"] ?? "",
      api_key: value["api_key"] ?? "",
      webhook_secret: value["webhook_secret"] ?? "",
      default_success_path: value["default_success_path"] ?? "/thank-you",
    };
  });

export const adminSavePaddleSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => paddleSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { error } = await (context as Ctx).supabase
      .from("app_settings")
      .upsert({ key: "paddle", value: data, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as Ctx);
    const { data, error } = await (context as Ctx).supabase
      .from("orders")
      .select("id, email, amount_cents, currency, status, paddle_transaction_id, created_at, products(title, slug)")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminListSubmissions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as Ctx);
    const { data, error } = await (context as Ctx).supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const adminToggleSubmission = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string; handled: boolean }) =>
    z.object({ id: z.string().uuid(), handled: z.boolean() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { error } = await (context as Ctx).supabase
      .from("contact_submissions")
      .update({ handled: data.handled })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminSignedFileUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { path: string }) => z.object({ path: z.string().trim().min(1).max(600) }).parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: signed, error } = await supabaseAdmin.storage
      .from("product-files")
      .createSignedUrl(data.path, 300);
    if (error) throw new Error(error.message);
    return { url: signed?.signedUrl ?? null };
  });

const footerLinkSchema = z.object({
  label: z.string().trim().min(1).max(60),
  url: z.string().trim().min(1).max(400),
});

const footerSchema = z.object({
  brand_name: z.string().trim().min(1).max(80),
  tagline: z.string().trim().max(120),
  description: z.string().trim().max(600),
  email: z.string().trim().max(160),
  phone: z.string().trim().max(60),
  address: z.string().trim().max(240),
  copyright: z.string().trim().min(1).max(200),
  columns: z
    .array(z.object({ title: z.string().trim().min(1).max(60), links: z.array(footerLinkSchema).max(12) }))
    .max(4),
  socials: z.array(footerLinkSchema).max(10),
});

export const adminGetFooter = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as Ctx);
    const { FOOTER_DEFAULTS } = await import("@/lib/store.functions");
    const { data } = await (context as Ctx).supabase
      .from("app_settings")
      .select("value")
      .eq("key", "footer")
      .maybeSingle();
    const value = (data?.value ?? {}) as Record<string, unknown>;
    return { ...FOOTER_DEFAULTS, ...value };
  });

export const adminSaveFooter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => footerSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as Ctx);
    const { error } = await (context as Ctx).supabase
      .from("app_settings")
      .upsert({ key: "footer", value: data, updated_at: new Date().toISOString() }, { onConflict: "key" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
