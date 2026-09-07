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

export type FooterSettings = {
  brand_name: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  copyright: string;
  columns: { title: string; links: { label: string; url: string }[] }[];
  socials: { label: string; url: string }[];
};

export const FOOTER_DEFAULTS: FooterSettings = {
  brand_name: "MENFIA DIGITAL",
  tagline: "Systems for the web",
  description:
    "We design, build and ship web systems — custom development, production-ready templates, plugins and scripts, plus digital marketing that compounds.",
  email: "jahidulwd@gmail.com",
  phone: "",
  address: "",
  copyright: "© 2026 Menfia Digital · Built with intent",
  columns: [
    {
      title: "Company",
      links: [
        { label: "Services", url: "/#services" },
        { label: "Work", url: "/#work" },
        { label: "Contact", url: "/contact" },
      ],
    },
    {
      title: "Products",
      links: [
        { label: "All products", url: "/products" },
        { label: "Downloads", url: "/downloads" },
      ],
    },
  ],
  socials: [],
};

export const getFooterSettings = createServerFn({ method: "GET" }).handler(async (): Promise<FooterSettings> => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.from("app_settings").select("value").eq("key", "footer").maybeSingle();
  const value = (data?.value ?? {}) as Partial<FooterSettings>;
  return {
    brand_name: value.brand_name || FOOTER_DEFAULTS.brand_name,
    tagline: value.tagline ?? FOOTER_DEFAULTS.tagline,
    description: value.description ?? FOOTER_DEFAULTS.description,
    email: value.email ?? FOOTER_DEFAULTS.email,
    phone: value.phone ?? "",
    address: value.address ?? "",
    copyright: value.copyright || FOOTER_DEFAULTS.copyright,
    columns: Array.isArray(value.columns) ? value.columns : FOOTER_DEFAULTS.columns,
    socials: Array.isArray(value.socials) ? value.socials : [],
  };
});
