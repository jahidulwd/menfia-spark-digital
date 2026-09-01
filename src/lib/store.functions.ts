import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const PRODUCT_COLUMNS =
  "id, slug, title, tagline, description, type, price_cents, currency, cover_image_url, gallery, features, tech_stack, demo_url, version, featured, sort_order, paddle_price_id";

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("products")
    .select(PRODUCT_COLUMNS)
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
});

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => z.object({ slug: z.string().min(1).max(120) }).parse(data))
  .handler(async ({ data }) => {
    const { data: row } = await publicClient()
      .from("products")
      .select(PRODUCT_COLUMNS)
      .eq("status", "published")
      .eq("slug", data.slug)
      .maybeSingle();
    return row;
  });

export const listFooterPages = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await publicClient()
    .from("pages")
    .select("slug, title")
    .eq("published", true)
    .eq("show_in_footer", true)
    .order("sort_order", { ascending: true });
  return data ?? [];
});

export const getPage = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => z.object({ slug: z.string().min(1).max(120) }).parse(data))
  .handler(async ({ data }) => {
    const { data: row } = await publicClient()
      .from("pages")
      .select("slug, title, seo_description, content, updated_at")
      .eq("published", true)
      .eq("slug", data.slug)
      .maybeSingle();
    return row;
  });

const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  website: z.string().trim().max(255).optional().or(z.literal("")),
  projectType: z.string().trim().max(80).optional().or(z.literal("")),
  budget: z.string().trim().max(80).optional().or(z.literal("")),
  timeline: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().min(10).max(4000),
});

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("contact_submissions").insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      company: data.company || null,
      website: data.website || null,
      project_type: data.projectType || null,
      budget: data.budget || null,
      timeline: data.timeline || null,
      message: data.message,
    });
    if (error) throw new Error("Could not save your message.");
    return { ok: true };
  });
