import workSaas from "../assets/work-saas.jpg";
import workCommerce from "../assets/work-commerce.jpg";
import workMarketing from "../assets/work-marketing.jpg";

export interface Service {
  id: string;
  label: string;
  title: string;
  description: string;
  tags: string[];
  featured?: boolean;
}

export const services: Service[] = [
  {
    id: "01",
    label: "Web Dev",
    title: "Web Development",
    description:
      "Custom sites and web apps engineered on clean, maintainable stacks — from marketing pages to full SaaS dashboards.",
    tags: ["Next", "Node", "a11y"],
  },
  {
    id: "02",
    label: "Templates",
    title: "Templates",
    description:
      "Production-ready, design-system driven templates that ship pixel-perfect and stay easy to extend.",
    tags: ["React", "Tailwind", "Figma"],
  },
  {
    id: "03",
    label: "Plugins",
    title: "Plugins & Scripts",
    description:
      "Bespoke plugins, scripts, and integrations that plug into your stack and automate the busywork.",
    tags: ["WP", "Shopify", "API"],
    featured: true,
  },
  {
    id: "04",
    label: "Marketing",
    title: "Digital Marketing",
    description:
      "SEO, paid, and content systems that turn traffic into pipeline — measured, reported, and compounding.",
    tags: ["SEO", "Paid", "CRO"],
  },
];

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: "Web" | "Template" | "Marketing";
  description: string;
  image: string;
  client: string;
  year: string;
  stack: string[];
  challenge: string;
  solution: string;
  results: string[];
  /* long-form case study */
  intro: string;
  scope: string[];
  timeline: string;
  role: string;
  problemNote: string;
  approach: { title: string; body: string }[];
  design: { title: string; body: string; bullets: string[] };
  build: { title: string; body: string; bullets: string[] };
  metrics: { value: string; label: string }[];
  testimonial: { quote: string; author: string; role: string };
  deliverables: string[];
  outcome: string;
}

export const projects: Project[] = [
  {
    id: "northwind-saas-console",
    slug: "northwind-saas-console",
    title: "Northwind SaaS Console",
    category: "Web",
    description: "Analytics platform, 0→1",
    image: workSaas,
    client: "Northwind Supply",
    year: "2024",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS"],
    challenge:
      "Northwind needed a single dashboard to unify inventory, revenue, and customer analytics without rebuilding their existing ERP.",
    solution:
      "We designed a modular console that pulls from their existing APIs, visualizes real-time KPIs, and lets teams export reports in one click.",
    results: [
      "Reduced reporting time by 60%",
      "Improved data accessibility across 4 teams",
      "Shipped in 8 weeks",
    ],
    intro: "Northwind runs a 40-year-old supply business on a modern warehouse floor and a legacy ERP. They needed one console their operators, finance leads and account managers could all read — without ripping out the systems that already worked.",
    scope: ["Product discovery", "UX architecture", "Design system", "Front-end build", "API integration", "Analytics"],
    timeline: "8 weeks · Feb – Apr 2024",
    role: "Design & engineering partner",
    problemNote: "Four teams, six spreadsheets, and no shared source of truth. Every weekly report was assembled by hand.",
    approach: [{"title": "Map the data before the screens", "body": "We audited every ERP endpoint, tagged the fields each team actually used, and threw away the 70% nobody opened. That map became the information architecture."}, {"title": "One console, four lenses", "body": "Instead of four dashboards, we built a single console with role-aware views — the same data model, filtered to the job someone is doing that morning."}, {"title": "Ship weekly, in production", "body": "Every Friday a real slice went live behind a flag. Feedback came from actual shifts, not review meetings."}],
    design: {"title": "An interface built for a warehouse, not a boardroom", "body": "Dense tables, high contrast, and numbers you can read from a standing desk three feet away. We designed the type scale around glanceability first and elegance second.", "bullets": ["Role-aware navigation with pinned KPIs", "Tabular numerals and fixed column widths for scanning", "Keyboard-first table interactions", "Dark surface for the floor terminals"]},
    build: {"title": "A modular front end over an untouched ERP", "body": "Nothing in the ERP moved. We placed a typed API layer in front of it, cached aggressively, and streamed changes into the console so the numbers stay live without hammering the source.", "bullets": ["Next.js App Router with server components", "Typed API layer over the legacy ERP", "Incremental caching + live revalidation", "One-click exports to CSV and Looker"]},
    metrics: [{"value": "60%", "label": "Less time spent on reporting"}, {"value": "4", "label": "Teams on one source of truth"}, {"value": "8 wk", "label": "Discovery to production"}, {"value": "99.9%", "label": "Console uptime"}],
    testimonial: {"quote": "We stopped arguing about whose spreadsheet was right. That alone paid for the project.", "author": "Dana Whitfield", "role": "Head of Operations, Northwind Supply"},
    deliverables: ["Product strategy doc", "Figma design system", "Production console", "API integration layer", "Analytics + reporting suite", "Team handover and training"],
    outcome: "The console is now the first tab open on every operations machine. Northwind has since extended it with two internal modules using the same design system, without our help — which was always the point.",
  },
  {
    id: "kestrel-commerce-kit",
    slug: "kestrel-commerce-kit",
    title: "Kestrel Commerce Kit",
    category: "Template",
    description: "Headless storefront system",
    image: workCommerce,
    client: "Kestrel & Co",
    year: "2025",
    stack: ["React", "Tailwind CSS", "Shopify Storefront API", "Framer Motion"],
    challenge:
      "Kestrel wanted a repeatable storefront template that looked premium out of the box and connected cleanly to Shopify.",
    solution:
      "We built a headless commerce kit with product grids, cart logic, checkout hooks, and a design system ready for white-labeling.",
    results: [
      "Cut new storefront launch time from 6 weeks to 4 days",
      "45% faster mobile checkout",
      "Used by 12 brands so far",
    ],
    intro: "Kestrel launches storefronts for boutique brands. Every launch started from scratch. We turned their best work into a headless commerce kit that ships in days instead of weeks — and still feels bespoke.",
    scope: ["Design system", "Component library", "Shopify integration", "Performance", "Documentation"],
    timeline: "10 weeks · Jan – Mar 2025",
    role: "Template system architects",
    problemNote: "Six weeks per storefront, most of it re-solving problems the last project already solved.",
    approach: [{"title": "Extract, don't invent", "body": "We audited five shipped Kestrel storefronts and pulled out the patterns that survived every one of them. Those became the kit's primitives."}, {"title": "Tokens over templates", "body": "Brand identity lives entirely in a token layer — colour, type, radius, motion. Swap the tokens, get a different-feeling store with the same tested code."}, {"title": "Commerce logic as hooks", "body": "Cart, variants, and checkout are headless hooks, so any layout can be dropped on top without touching business logic."}],
    design: {"title": "Premium out of the box, brandable in an afternoon", "body": "The default theme is deliberately opinionated — generous white space, editorial type, product-first imagery. Everything visual routes through tokens so a rebrand is a config change, not a refactor.", "bullets": ["48 composable UI components", "Full token layer for colour, type and motion", "Editorial and grid-first product layouts", "Motion presets tuned for commerce"]},
    build: {"title": "Headless, fast, and boring in the right places", "body": "Shopify Storefront API on the data side, React on the surface, and a hard performance budget enforced in CI. If a component pushes the bundle past the line, the build fails.", "bullets": ["Shopify Storefront API with typed queries", "Optimistic cart with offline recovery", "Image pipeline with responsive art direction", "Lighthouse budget enforced in CI"]},
    metrics: [{"value": "4 days", "label": "New storefront launch time"}, {"value": "45%", "label": "Faster mobile checkout"}, {"value": "12", "label": "Brands shipped on the kit"}, {"value": "98", "label": "Median Lighthouse score"}],
    testimonial: {"quote": "We quoted a client on Monday and had their store in staging by Thursday. That's a different business model.", "author": "Ilya Marchetti", "role": "Founder, Kestrel & Co"},
    deliverables: ["Component library", "Token-driven theme system", "Shopify integration layer", "Storybook documentation", "Migration guide", "Two reference storefronts"],
    outcome: "The kit is now Kestrel's default starting point. Twelve brands are live on it, and the team ships features into the kit itself rather than into individual client repos.",
  },
  {
    id: "vantage-growth-engine",
    slug: "vantage-growth-engine",
    title: "Vantage Growth Engine",
    category: "Marketing",
    description: "Paid + SEO, 3.2x ROAS",
    image: workMarketing,
    client: "Vantage Labs",
    year: "2025",
    stack: ["Google Ads", "Meta Ads", "Looker Studio", "Segment"],
    challenge:
      "Vantage had strong product-market fit but their paid spend was inefficient and SEO traffic had plateaued.",
    solution:
      "We rebuilt their funnel tracking, restructured ad campaigns around intent signals, and published a technical SEO content system.",
    results: [
      "3.2x return on ad spend",
      "2.4x organic traffic in 6 months",
      "Cost per qualified lead dropped 41%",
    ],
    intro: "Vantage had the product right and the funnel wrong. Spend was climbing, organic had flatlined, and nobody could say which channel actually produced revenue. We rebuilt the measurement layer first, then the campaigns.",
    scope: ["Funnel audit", "Attribution setup", "Paid restructure", "Technical SEO", "Content system", "Reporting"],
    timeline: "6 months · ongoing",
    role: "Growth partner",
    problemNote: "Three analytics tools, three different revenue numbers, and a paid account structured around products instead of intent.",
    approach: [{"title": "Fix measurement before spend", "body": "We consolidated tracking into a single event schema and rebuilt attribution so every lead carries its full source path into the CRM."}, {"title": "Restructure around intent", "body": "Campaigns were rebuilt by search intent, not product line, so budget follows demand rather than internal org charts."}, {"title": "Publish on a system", "body": "A technical content system with programmatic templates and a real editorial standard — volume that doesn't read like volume."}],
    design: {"title": "Reporting a founder can read in ninety seconds", "body": "One Looker board, three questions: what did we spend, what did it produce, what should we do next. Everything else lives one click deeper.", "bullets": ["Single-source event schema in Segment", "Channel-level CAC and payback views", "Cohort retention tied to acquisition source", "Weekly automated digest to Slack"]},
    build: {"title": "Compounding channels, not campaign sprints", "body": "Paid buys the demand that exists today; SEO builds the demand that shows up next quarter. We ran both against the same intent map so they reinforce rather than cannibalise.", "bullets": ["Intent-mapped campaign architecture", "Landing page CRO with sequential testing", "Technical SEO remediation across 1,400 URLs", "Programmatic content templates with editorial review"]},
    metrics: [{"value": "3.2x", "label": "Return on ad spend"}, {"value": "2.4x", "label": "Organic traffic in 6 months"}, {"value": "41%", "label": "Lower cost per qualified lead"}, {"value": "1,400", "label": "URLs remediated"}],
    testimonial: {"quote": "For the first time I can tell the board exactly where the pipeline came from, and I believe the number.", "author": "Priya Raman", "role": "CEO, Vantage Labs"},
    deliverables: ["Funnel and attribution audit", "Segment event schema", "Rebuilt paid account", "Technical SEO roadmap", "Content system and templates", "Looker reporting suite"],
    outcome: "Vantage now runs the system in-house with us on retainer for strategy. Paid and organic feed the same intent map, and monthly reporting takes minutes instead of days.",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
