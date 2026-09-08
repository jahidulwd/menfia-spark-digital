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

/* ---------------------------------- branding --------------------------------- */

export type Branding = {
  site_name: string;
  header_logo_url: string;
  footer_logo_url: string;
  logo_height: number;
  favicon_url: string;
};

export const BRANDING_DEFAULTS: Branding = {
  site_name: "MENFIA DIGITAL",
  header_logo_url: "",
  footer_logo_url: "",
  logo_height: 32,
  favicon_url: "",
};

export const getBranding = createServerFn({ method: "GET" }).handler(async (): Promise<Branding> => {
  const { data } = await publicClient().from("app_settings").select("value").eq("key", "branding").maybeSingle();
  const value = (data?.value ?? {}) as Partial<Branding>;
  return {
    site_name: value.site_name || BRANDING_DEFAULTS.site_name,
    header_logo_url: value.header_logo_url ?? "",
    footer_logo_url: value.footer_logo_url ?? "",
    logo_height: Number(value.logo_height) > 0 ? Number(value.logo_height) : BRANDING_DEFAULTS.logo_height,
    favicon_url: value.favicon_url ?? "",
  };
});

/* --------------------------------- home page -------------------------------- */

export type HomeContent = {
  hero: {
    badge: string;
    title_line1: string;
    title_line2: string;
    subtitle: string;
    primary_label: string;
    primary_url: string;
    secondary_label: string;
    secondary_url: string;
  };
  panel_title: string;
  panel_stats: { label: string; value: string }[];
  stats_band: { label: string; value: string; note: string }[];
  services: { eyebrow: string; title: string; intro: string };
  work: { eyebrow: string; title: string; intro: string };
  process: { eyebrow: string; title: string; steps: { title: string; body: string }[] };
  testimonials: { eyebrow: string; title: string; items: { quote: string; name: string; role: string }[] };
  faq: { eyebrow: string; title: string; items: { q: string; a: string }[] };
  cta: { eyebrow: string; title: string; body: string };
};

export const HOME_DEFAULTS: HomeContent = {
  hero: {
    badge: "Engineered for the web",
    title_line1: "We build digital",
    title_line2: "systems that scale.",
    subtitle:
      "Menfia Digital designs and engineers web products, templates, plugins, and growth campaigns — from first grid to final deploy.",
    primary_label: "View the work",
    primary_url: "/#work",
    secondary_label: "Browse services",
    secondary_url: "/#services",
  },
  panel_title: "Live index",
  panel_stats: [
    { label: "Web dev", value: "148" },
    { label: "Templates", value: "62" },
    { label: "Plugins", value: "27" },
  ],
  stats_band: [
    { label: "Projects shipped", value: "240", note: "Across 14 countries" },
    { label: "Avg. Lighthouse", value: "98", note: "Performance budget enforced" },
    { label: "Client retention", value: "92", note: "Percent, year over year" },
    { label: "Years building", value: "9", note: "Web systems only" },
  ],
  services: {
    eyebrow: "/ what we do",
    title: "The service matrix",
    intro: "Four modules that cover the full lifecycle — from a blank grid to a system that keeps compounding.",
  },
  work: {
    eyebrow: "/ selected work",
    title: "Recent builds",
    intro: "A short list of systems we designed, engineered and shipped end to end.",
  },
  process: {
    eyebrow: "/ how we work",
    title: "The build sequence",
    steps: [
      { title: "Discover", body: "We map goals, users and constraints, then agree on what success actually measures." },
      { title: "Architect", body: "Information architecture, data model and stack decisions written down before code." },
      { title: "Design", body: "High-contrast interface systems with real content, components and states." },
      { title: "Engineer", body: "Typed, tested and reviewed builds with performance budgets from day one." },
      { title: "Launch", body: "Staged rollout, analytics, monitoring and a documented handover." },
      { title: "Compound", body: "Iteration cycles, growth campaigns and support that keep results climbing." },
    ],
  },
  testimonials: {
    eyebrow: "/ signals",
    title: "What clients say",
    items: [
      {
        quote: "They rebuilt our platform in ten weeks and it still outperforms everything in our category.",
        name: "Sarah Whitlock",
        role: "Head of Product, Northwind",
      },
      {
        quote: "The clearest engineering process we've worked with. No surprises, no drift, no fluff.",
        name: "Daniel Roy",
        role: "Founder, GMT Equipment",
      },
      {
        quote: "Our template library became a real revenue line within a quarter of launching.",
        name: "Amina Rahman",
        role: "Director, Studio Kern",
      },
    ],
  },
  faq: {
    eyebrow: "/ questions",
    title: "Frequently asked",
    items: [
      {
        q: "How long does a typical project take?",
        a: "Marketing sites run 3–5 weeks. Product platforms and storefronts usually run 8–14 weeks depending on scope and integrations.",
      },
      {
        q: "How do you price work?",
        a: "Fixed-scope phases with a clear deliverable list, or a monthly retainer for ongoing product and growth work.",
      },
      {
        q: "Do you work with our existing codebase?",
        a: "Yes. We audit what exists, document the risks, and improve it incrementally instead of forcing a rewrite.",
      },
      {
        q: "What do I get when I buy a template or plugin?",
        a: "An instant download with the full source, documentation and a licence for unlimited personal or client projects.",
      },
      {
        q: "Can you handle marketing after launch?",
        a: "We run SEO, content and paid campaigns on the same systems we build, so tracking and reporting stay honest.",
      },
      {
        q: "Who owns the final work?",
        a: "You do. Code, design files and accounts are transferred to you at handover.",
      },
    ],
  },
  cta: {
    eyebrow: "/ start a build",
    title: "Let's ship the next system.",
    body: "Tell us what you're building. We'll map the stack, the timeline, and the first milestone — no fluff.",
  },
};

function mergeDeep<T>(base: T, patch: unknown): T {
  if (!patch || typeof patch !== "object" || Array.isArray(patch)) return base;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [key, value] of Object.entries(patch as Record<string, unknown>)) {
    const current = out[key];
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) out[key] = value;
    else if (typeof value === "object" && current && typeof current === "object") out[key] = mergeDeep(current, value);
    else out[key] = value;
  }
  return out as T;
}

export const getHomeContent = createServerFn({ method: "GET" }).handler(async (): Promise<HomeContent> => {
  const { data } = await publicClient().from("app_settings").select("value").eq("key", "home").maybeSingle();
  return mergeDeep(HOME_DEFAULTS, data?.value);
});
