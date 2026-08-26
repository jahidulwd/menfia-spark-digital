export interface ProcessStep {
  step: string;
  title: string;
  body: string;
}

export interface Deliverable {
  title: string;
  body: string;
}

export interface Tier {
  name: string;
  price: string;
  blurb: string;
  items: string[];
  featured?: boolean;
}

export interface Faq {
  q: string;
  a: string;
}

export interface ServiceDetail {
  id: string;
  slug: string;
  label: string;
  title: string;
  description: string;
  tags: string[];
  featured?: boolean;
  /* detail page content */
  headline: string;
  intro: string;
  metrics: { value: string; label: string }[];
  overview: string[];
  capabilities: { title: string; body: string }[];
  process: ProcessStep[];
  stack: string[];
  deliverables: Deliverable[];
  tiers: Tier[];
  faqs: Faq[];
}

export const services: ServiceDetail[] = [
  {
    id: "01",
    slug: "web-development",
    label: "Web Dev",
    title: "Web Development",
    description:
      "Custom sites and web apps engineered on clean, maintainable stacks — from marketing pages to full SaaS dashboards.",
    tags: ["Next", "Node", "a11y"],
    headline: "Web systems engineered to hold up under real traffic.",
    intro:
      "We design, build, and ship production web applications — typed end to end, tested where it matters, and fast on the devices your customers actually own.",
    metrics: [
      { value: "148", label: "Builds shipped" },
      { value: "98", label: "Avg. Lighthouse" },
      { value: "6wk", label: "Median timeline" },
    ],
    overview: [
      "Most agencies hand you a pretty front end bolted onto a fragile backend. We treat the whole thing as one system: data model, API surface, rendering strategy, and interface all decided together.",
      "Every build ships with typed contracts, sensible error states, and documentation your own team can pick up without a handover call.",
    ],
    capabilities: [
      {
        title: "Marketing sites",
        body: "Server-rendered, SEO-complete, CMS-backed pages that load in under a second.",
      },
      {
        title: "SaaS dashboards",
        body: "Auth, roles, billing, and data-dense interfaces built on a real design system.",
      },
      {
        title: "APIs & integrations",
        body: "REST and typed RPC layers, third-party syncs, webhooks, and background jobs.",
      },
      {
        title: "Performance work",
        body: "Bundle surgery, caching strategy, and Core Web Vitals remediation on existing apps.",
      },
      {
        title: "Accessibility",
        body: "Keyboard paths, focus management, and contrast audited to WCAG 2.2 AA.",
      },
      {
        title: "Migrations",
        body: "Legacy stack to modern framework, moved incrementally with zero downtime.",
      },
    ],
    process: [
      { step: "01", title: "Scope", body: "One session to map users, data, and the first shippable milestone." },
      { step: "02", title: "Architect", body: "Data model, routes, and rendering strategy written down before code." },
      { step: "03", title: "Build", body: "Weekly deploys to a live preview URL you can click through." },
      { step: "04", title: "Harden", body: "Load, a11y, and error-path testing before anything touches production." },
      { step: "05", title: "Ship & hand over", body: "Deploy pipeline, docs, and a walkthrough for your team." },
    ],
    stack: ["TypeScript", "React", "Next.js", "Node", "PostgreSQL", "Tailwind CSS", "Vercel", "Cloudflare"],
    deliverables: [
      { title: "Source repository", body: "Clean commit history, CI, and environment config included." },
      { title: "Design system", body: "Tokens and components documented, not one-off styles." },
      { title: "Deploy pipeline", body: "Preview per branch, automated checks, one-click rollback." },
      { title: "Handover docs", body: "Architecture notes, runbook, and a recorded walkthrough." },
    ],
    tiers: [
      {
        name: "Landing",
        price: "from $2.4k",
        blurb: "A single high-conversion page, built properly.",
        items: ["Up to 6 sections", "CMS-editable copy", "SEO + analytics", "2 revision rounds"],
      },
      {
        name: "Product site",
        price: "from $7.5k",
        blurb: "Multi-page marketing system with a real CMS.",
        items: ["8–15 pages", "Design system", "Blog + SEO architecture", "Performance budget"],
        featured: true,
      },
      {
        name: "Application",
        price: "from $18k",
        blurb: "Full web app with auth, data, and billing.",
        items: ["Custom data model", "Auth + roles", "Integrations", "Post-launch support"],
      },
    ],
    faqs: [
      { q: "How long does a typical build take?", a: "Landing pages ship in 1–2 weeks. Product sites run 4–6 weeks. Applications depend on scope, but we always ship a usable slice inside the first month." },
      { q: "Do you work with our existing codebase?", a: "Yes. We audit first, then work incrementally so nothing breaks while we improve it." },
      { q: "Who owns the code?", a: "You do, entirely, from the first commit." },
      { q: "Do you offer ongoing support?", a: "Monthly retainers cover maintenance, feature work, and performance monitoring." },
    ],
  },
  {
    id: "02",
    slug: "templates",
    label: "Templates",
    title: "Templates",
    description:
      "Production-ready, design-system driven templates that ship pixel-perfect and stay easy to extend.",
    tags: ["React", "Tailwind", "Figma"],
    headline: "Templates that behave like products, not zip files.",
    intro:
      "Every template we build is a real design system underneath — tokens, components, and states — so your team can extend it instead of fighting it.",
    metrics: [
      { value: "62", label: "Templates built" },
      { value: "4d", label: "Avg. launch time" },
      { value: "100%", label: "Token-driven" },
    ],
    overview: [
      "A template is only useful if the second page is as easy as the first. We start from tokens and primitives, then compose pages — never the reverse.",
      "Figma and code stay in sync: the same names, the same scale, the same variants on both sides.",
    ],
    capabilities: [
      { title: "Design systems", body: "Colour, type, spacing, and elevation as documented tokens." },
      { title: "Component libraries", body: "Accessible primitives with every state designed, not just the happy one." },
      { title: "Page kits", body: "Landing, pricing, docs, blog, dashboard — composed from the same parts." },
      { title: "Figma parity", body: "Variables and variants mirroring the coded components exactly." },
      { title: "Theming", body: "Light, dark, and white-label themes from a single token layer." },
      { title: "Docs site", body: "Usage guidance and live examples shipped alongside the code." },
    ],
    process: [
      { step: "01", title: "Audit", body: "Inventory what you already have and what actually gets reused." },
      { step: "02", title: "Tokenise", body: "Lock the scale: colour, type, spacing, radius, motion." },
      { step: "03", title: "Primitives", body: "Build the base components with full state coverage." },
      { step: "04", title: "Compose", body: "Assemble page templates from primitives only." },
      { step: "05", title: "Document", body: "Ship a docs site so adoption doesn't need us." },
    ],
    stack: ["React", "TypeScript", "Tailwind CSS", "Radix UI", "Figma", "Storybook"],
    deliverables: [
      { title: "Token layer", body: "One source of truth exported to CSS, TS, and Figma." },
      { title: "Component library", body: "Typed, accessible, and versioned." },
      { title: "Page templates", body: "Ready-to-fill layouts for every core page type." },
      { title: "Documentation", body: "Live examples, do/don't guidance, and changelog." },
    ],
    tiers: [
      { name: "Starter kit", price: "from $1.8k", blurb: "Tokens plus a core component set.", items: ["20+ components", "Light/dark themes", "Figma file", "MIT-style licence"] },
      { name: "Full system", price: "from $6k", blurb: "Complete library plus page templates.", items: ["60+ components", "10 page templates", "Docs site", "Team onboarding"], featured: true },
      { name: "White-label", price: "from $12k", blurb: "Multi-brand system for resale or agencies.", items: ["Brand theming engine", "Unlimited themes", "Distribution setup", "Quarterly updates"] },
    ],
    faqs: [
      { q: "Can we use our own brand?", a: "Yes — theming is the point. Swap tokens and the whole system follows." },
      { q: "Do you support other frameworks?", a: "React is our default. Vue and Svelte ports are possible on request." },
      { q: "Are the templates accessible?", a: "All primitives are keyboard-navigable and tested to WCAG 2.2 AA." },
      { q: "Can we resell what you build?", a: "With the white-label tier, yes — distribution setup is included." },
    ],
  },
  {
    id: "03",
    slug: "plugins-scripts",
    label: "Plugins",
    title: "Plugins & Scripts",
    description:
      "Bespoke plugins, scripts, and integrations that plug into your stack and automate the busywork.",
    tags: ["WP", "Shopify", "API"],
    featured: true,
    headline: "Small pieces of software that delete hours of manual work.",
    intro:
      "When your platform almost does the thing, we write the piece that closes the gap — a plugin, a script, a sync job — and we make it boringly reliable.",
    metrics: [
      { value: "27", label: "Plugins live" },
      { value: "1.2M", label: "Monthly runs" },
      { value: "99.9%", label: "Job success rate" },
    ],
    overview: [
      "Automation only pays off if it never surprises you. Every script we ship has logging, retries, and an alert path when something upstream changes.",
      "We write against public APIs and documented hooks — no fragile DOM scraping, no unsupported core edits.",
    ],
    capabilities: [
      { title: "WordPress plugins", body: "Custom blocks, admin screens, and REST endpoints built to core standards." },
      { title: "Shopify apps", body: "Embedded apps, checkout extensions, and Storefront API work." },
      { title: "Browser extensions", body: "Chrome and Firefox tooling for internal workflows." },
      { title: "Data sync jobs", body: "Scheduled pipelines between CRMs, ERPs, and warehouses." },
      { title: "Webhook services", body: "Signature-verified receivers with idempotent processing." },
      { title: "Internal CLIs", body: "Scripts your team runs without asking an engineer." },
    ],
    process: [
      { step: "01", title: "Trace", body: "Watch the manual process end to end before automating it." },
      { step: "02", title: "Spec", body: "Define inputs, outputs, failure modes, and who gets alerted." },
      { step: "03", title: "Build", body: "Small, testable units against documented APIs." },
      { step: "04", title: "Observe", body: "Structured logs, retries, and a dashboard for job health." },
      { step: "05", title: "Maintain", body: "We track upstream API changes so you don't discover them at 2am." },
    ],
    stack: ["PHP", "TypeScript", "Node", "WordPress", "Shopify", "Zapier", "Cron", "REST / GraphQL"],
    deliverables: [
      { title: "Packaged plugin", body: "Versioned, signed, and installable through your normal flow." },
      { title: "Monitoring", body: "Job dashboard plus email or Slack alerting." },
      { title: "Runbook", body: "What to do when an upstream API breaks." },
      { title: "Source & tests", body: "Full repository with automated test coverage." },
    ],
    tiers: [
      { name: "Script", price: "from $900", blurb: "One focused automation, delivered fast.", items: ["Single workflow", "Logging included", "1 week turnaround", "30-day warranty"] },
      { name: "Plugin", price: "from $4.5k", blurb: "Distributable plugin or embedded app.", items: ["Admin UI", "Settings + licensing", "Update channel", "Documentation"], featured: true },
      { name: "Automation suite", price: "from $9k", blurb: "Multiple connected jobs with monitoring.", items: ["Multi-system sync", "Health dashboard", "Alerting", "Ongoing maintenance"] },
    ],
    faqs: [
      { q: "Will an update break the plugin?", a: "We build on supported hooks and APIs, and maintenance plans include compatibility testing on major releases." },
      { q: "Can you take over an existing plugin?", a: "Yes. We audit, stabilise, then extend." },
      { q: "Where does it run?", a: "Your infrastructure, ours, or a managed serverless runtime — your call." },
      { q: "How fast is a simple script?", a: "Usually under a week from spec to production." },
    ],
  },
  {
    id: "04",
    slug: "digital-marketing",
    label: "Marketing",
    title: "Digital Marketing",
    description:
      "SEO, paid, and content systems that turn traffic into pipeline — measured, reported, and compounding.",
    tags: ["SEO", "Paid", "CRO"],
    headline: "Growth that compounds, not campaigns that spike.",
    intro:
      "We build measurement first, then spend. Every channel reports into one model so you can see which pound actually produced a customer.",
    metrics: [
      { value: "3.2x", label: "Median ROAS" },
      { value: "2.4x", label: "Organic growth" },
      { value: "-41%", label: "Cost per lead" },
    ],
    overview: [
      "Most marketing reporting measures activity. We measure pipeline — tracking each session through to a closed deal so budget decisions stop being guesses.",
      "Once attribution is trustworthy, the work is simple: cut what doesn't convert, compound what does.",
    ],
    capabilities: [
      { title: "Technical SEO", body: "Crawl, indexation, schema, and Core Web Vitals fixed at the source." },
      { title: "Content systems", body: "Topic clusters mapped to real search intent and buying stage." },
      { title: "Paid search", body: "Intent-structured campaigns with negative hygiene and offer testing." },
      { title: "Paid social", body: "Creative iteration loops on Meta, LinkedIn, and TikTok." },
      { title: "CRO", body: "Landing page experiments run to statistical significance." },
      { title: "Analytics", body: "Server-side events, consent handling, and one honest dashboard." },
    ],
    process: [
      { step: "01", title: "Instrument", body: "Fix tracking before spending anything. No clean data, no campaign." },
      { step: "02", title: "Baseline", body: "Agree the numbers that matter: CAC, LTV, payback." },
      { step: "03", title: "Launch", body: "Small, structured tests across two channels maximum." },
      { step: "04", title: "Iterate", body: "Weekly creative and keyword cycles based on the model, not vibes." },
      { step: "05", title: "Scale", body: "Increase budget only where marginal CAC still clears the bar." },
    ],
    stack: ["Google Ads", "Meta Ads", "GA4", "Looker Studio", "Segment", "Ahrefs", "Hotjar"],
    deliverables: [
      { title: "Tracking build", body: "Server-side events, conversions, and consent mode configured." },
      { title: "Growth model", body: "A spreadsheet that predicts spend to pipeline, updated monthly." },
      { title: "Campaign structure", body: "Documented account architecture you could run yourself." },
      { title: "Monthly report", body: "One page: what we spent, what it produced, what changes next." },
    ],
    tiers: [
      { name: "Audit", price: "$1.5k", blurb: "Where the money is leaking, in two weeks.", items: ["Tracking audit", "SEO crawl", "Ad account review", "Prioritised roadmap"] },
      { name: "Growth retainer", price: "from $3.5k/mo", blurb: "Two channels, run properly.", items: ["Paid + SEO", "Weekly iteration", "CRO testing", "Monthly reporting"], featured: true },
      { name: "Full funnel", price: "from $8k/mo", blurb: "Multi-channel with dedicated creative.", items: ["4+ channels", "Creative production", "Lifecycle email", "Quarterly strategy"] },
    ],
    faqs: [
      { q: "How soon will we see results?", a: "Paid signals show within 3–4 weeks. SEO compounds over 3–6 months." },
      { q: "Is ad spend included?", a: "No — media budget is separate and paid directly by you, so nothing is hidden." },
      { q: "Do you write the content?", a: "Yes, briefs and drafts included on retainer tiers." },
      { q: "What's the minimum commitment?", a: "Three months on retainers, so there's time for the data to mean something." },
    ],
  },
];

export function getServiceBySlug(slug: string): ServiceDetail | undefined {
  return services.find((s) => s.slug === slug);
}
