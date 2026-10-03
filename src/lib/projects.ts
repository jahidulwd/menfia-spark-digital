import workSaas from "../assets/work-saas.jpg";
import workCommerce from "../assets/work-commerce.jpg";
import workMarketing from "../assets/work-marketing.jpg";
import brandmatesAsset from "../assets/brandmates.jpg.asset.json";
import ecommerceAsset from "../assets/ecommerce.jpg.asset.json";
import creativePlanAsset from "../assets/elementor-website-development.jpg.asset.json";
import importedAsset from "../assets/importedmakeover.jpg.asset.json";
import mxFashionAsset from "../assets/mx-fashion.jpg.asset.json";
import rageroomAsset from "../assets/Rageroom-Zeeland.jpg.asset.json";
import collectionsAsset from "../assets/shopify-collection-slider.jpg.asset.json";
import wavesAsset from "../assets/wavesrecruitment.png.asset.json";

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
  {
    id: "brandmates-creative-agency",
    slug: "brandmates-creative-agency",
    title: "Brandmates Creative Agency",
    category: "Web",
    description: "A bold, friendly agency presence built for every screen",
    image: brandmatesAsset.url,
    client: "Brandmates",
    year: "2025",
    stack: ["WordPress", "Elementor", "Responsive UI", "Performance"],
    challenge: "Turn a personable creative studio into a distinctive digital brand without losing its approachable character.",
    solution: "We translated the studio's bold blue identity into a responsive marketing site with confident type, clear service routes, and a direct path to contact.",
    results: ["A consistent identity across desktop and mobile", "Clearer routes into every core service", "A flexible foundation for future campaign pages"],
    intro: "Brandmates is built around close creative partnership. Its website needed to feel just as human: energetic, unmistakable, and easy for prospective clients to understand in a few seconds.",
    scope: ["Creative direction", "UX structure", "Responsive design", "WordPress build", "Performance pass", "Launch support"],
    timeline: "6 weeks",
    role: "Design and development partner",
    problemNote: "The visual identity had personality, but the website needed a stronger hierarchy and a mobile experience that carried the same confidence.",
    approach: [{ title: "Lead with personality", body: "We made the studio's friendly voice and recognizable team presence the first impression, then placed services beside it for immediate context." }, { title: "Build a visual rhythm", body: "Large statements, branded shapes, and focused blue panels create momentum without making the page difficult to scan." }, { title: "Design mobile in parallel", body: "The compact experience was composed alongside desktop so the story, portrait, and calls to action stay intentional on smaller screens." }],
    design: { title: "Friendly, bold, and immediately recognizable", body: "Deep navy, electric blue, oversized rounded type, and real human imagery give the site a distinctive but welcoming visual language.", bullets: ["High-contrast blue brand system", "Human-led opening experience", "Responsive service presentation", "Focused contact prompts"] },
    build: { title: "A modular marketing system the team can extend", body: "Reusable content sections and responsive image treatments let Brandmates publish new services and campaigns without breaking the visual system.", bullets: ["Reusable Elementor sections", "Mobile-first navigation", "Optimized responsive imagery", "Editor-friendly content controls"] },
    metrics: [{ value: "Desktop", label: "Full studio story" }, { value: "Mobile", label: "Purpose-built experience" }, { value: "4", label: "Core service paths" }, { value: "CMS", label: "Team-managed content" }],
    testimonial: { quote: "The new site finally feels like meeting our team: clear, upbeat, and ready to make something together.", author: "Brandmates", role: "Creative team" },
    deliverables: ["Website strategy", "Responsive interface design", "WordPress website", "Service page system", "Content migration", "Launch handover"],
    outcome: "Brandmates now has a digital home that presents its personality and capabilities as one coherent story, from the widest desktop to the smallest phone.",
  },
  {
    id: "menfia-2-commerce",
    slug: "menfia-2-commerce",
    title: "Menfia 2.0 Commerce",
    category: "Web",
    description: "A high-density electronics storefront with a mobile-first path to purchase",
    image: ecommerceAsset.url,
    client: "Menfia 2.0",
    year: "2025",
    stack: ["WooCommerce", "WordPress", "Product Search", "Responsive UI"],
    challenge: "Organize a broad electronics catalog without making discovery feel crowded or slow.",
    solution: "We built a structured commerce homepage that balances campaigns, categories, product rails, and search while simplifying the mobile buying journey.",
    results: ["Faster visual scanning across a large catalog", "Consistent product discovery on mobile", "Campaign areas that can change without redesign"],
    intro: "Menfia 2.0 brings laptops, accessories, audio, and everyday technology into one storefront. The experience had to support breadth while keeping the next useful product close at hand.",
    scope: ["Commerce UX", "Catalog architecture", "Responsive design", "Storefront build", "Search experience", "Campaign modules"],
    timeline: "8 weeks",
    role: "Commerce design and build",
    problemNote: "A large assortment created too many competing choices, particularly on mobile where product discovery and navigation share limited space.",
    approach: [{ title: "Organize around shopping intent", body: "Products are grouped into recognizable journeys: popular picks, deals, new arrivals, trending brands, and recently viewed items." }, { title: "Make search a primary control", body: "Search stays prominent across screen sizes, reducing the distance between intent and a relevant product." }, { title: "Reserve space for campaigns", body: "Flexible promotional modules let the store highlight seasonal offers without disrupting the catalog structure." }],
    design: { title: "High information density with a clear visual order", body: "A restrained shell gives product photography, offer badges, and campaign colors room to do the selling.", bullets: ["Persistent product search", "Compact product cards", "Clear sale and category signals", "Mobile bottom navigation"] },
    build: { title: "Commerce modules made for frequent change", body: "The storefront separates catalog logic from campaign presentation so merchandisers can refresh offers while customers keep familiar navigation.", bullets: ["Reusable product rails", "Responsive category navigation", "Promotional content modules", "Mobile cart and account access"] },
    metrics: [{ value: "1", label: "Unified product catalog" }, { value: "Mobile", label: "Optimized shopping flow" }, { value: "Search", label: "Prominent at every size" }, { value: "CMS", label: "Editable campaigns" }],
    testimonial: { quote: "The catalog feels broad without feeling overwhelming, and the mobile store keeps the essentials within reach.", author: "Menfia 2.0", role: "Commerce team" },
    deliverables: ["Catalog UX plan", "Responsive storefront", "Product card system", "Campaign modules", "Search interface", "Store management handover"],
    outcome: "The result is a scalable electronics storefront where products, promotions, and discovery tools share one clear and responsive system.",
  },
  {
    id: "creative-plan-studio",
    slug: "creative-plan-studio",
    title: "Creative Plan Studio",
    category: "Web",
    description: "An expressive agency site with a cinematic dark interface",
    image: creativePlanAsset.url,
    client: "Creative Plan",
    year: "2025",
    stack: ["WordPress", "Elementor", "Motion Design", "Responsive UI"],
    challenge: "Give a multidisciplinary studio a site as expressive as its work while keeping its services easy to understand.",
    solution: "We combined a cinematic dark canvas, vibrant color fields, and concise service groupings into an immersive yet practical agency experience.",
    results: ["A distinctive visual position for the studio", "Four service disciplines presented clearly", "A responsive system that preserves the concept"],
    intro: "Creative Plan works across websites, branding, online marketing, and custom solutions. The website turns that range into one coherent creative world rather than four disconnected offers.",
    scope: ["Art direction", "UX writing", "Motion concept", "Elementor development", "Responsive design", "Launch"],
    timeline: "7 weeks",
    role: "Digital design and development",
    problemNote: "The studio needed expressive visuals, but not at the expense of clarity, pace, or the ability to maintain the site internally.",
    approach: [{ title: "Create one strong atmosphere", body: "A deep black foundation and controlled spectral light establish a premium identity before any service detail appears." }, { title: "Turn services into destinations", body: "Each discipline receives its own saturated color panel, making the offer easy to scan and memorable." }, { title: "Keep motion purposeful", body: "Transitions reinforce depth and direction while respecting readability and reduced-motion preferences." }],
    design: { title: "Cinematic restraint with moments of vivid color", body: "The identity uses large italic headlines, atmospheric light, and a compact monochrome navigation, then introduces color only where it carries meaning.", bullets: ["Dark immersive canvas", "Color-coded service system", "Editorial display typography", "Purposeful directional motion"] },
    build: { title: "An expressive site that remains easy to manage", body: "The visual system was translated into reusable Elementor patterns so future case studies and services can retain the same creative standard.", bullets: ["Reusable page sections", "Responsive typography", "Optimized visual effects", "Accessible motion fallbacks"] },
    metrics: [{ value: "4", label: "Connected disciplines" }, { value: "1", label: "Unified visual system" }, { value: "Mobile", label: "Concept preserved" }, { value: "CMS", label: "Flexible publishing" }],
    testimonial: { quote: "It feels creative before we say a word, then makes our full offer simple to navigate.", author: "Creative Plan", role: "Studio team" },
    deliverables: ["Creative direction", "Website design", "Motion language", "Elementor build", "Responsive QA", "Editor handover"],
    outcome: "Creative Plan now has a portfolio presence that feels ownable, presents its services with confidence, and remains practical for daily use.",
  },
  {
    id: "imported-makeover",
    slug: "imported-makeover",
    title: "Imported Makeover",
    category: "Web",
    description: "A colorful beauty storefront organized around discovery",
    image: importedAsset.url,
    client: "Imported Makeover",
    year: "2025",
    stack: ["WooCommerce", "WordPress", "Product Filters", "Responsive UI"],
    challenge: "Present a varied international beauty catalog with enough energy to inspire discovery and enough structure to support purchase decisions.",
    solution: "We developed a bright, product-led storefront with editorial campaigns, category stories, and reusable merchandising rails tailored for mobile browsing.",
    results: ["A clearer path from campaign to product", "Consistent merchandising across devices", "Flexible space for launches and brand stories"],
    intro: "Imported Makeover curates makeup and skincare across recognizable brands and new discoveries. The storefront brings those products together through an energetic editorial system.",
    scope: ["Store strategy", "Art direction", "Commerce UX", "Responsive build", "Catalog setup", "Merchandising system"],
    timeline: "8 weeks",
    role: "Ecommerce design and implementation",
    problemNote: "New launches, product lines, free-sample offers, and evergreen categories all needed attention without competing for the same visual priority.",
    approach: [{ title: "Build around discovery", body: "Campaign stories lead naturally into featured products and deeper catalog groups rather than operating as isolated banners." }, { title: "Create a merchandising rhythm", body: "Alternating product rails and editorial panels keep longer pages useful and visually varied." }, { title: "Keep mobile product-first", body: "Large imagery, direct actions, and short text blocks make browsing comfortable on narrow screens." }],
    design: { title: "Bright editorial commerce with a precise hierarchy", body: "Pink accents, soft color bands, generous white space, and close product imagery create an optimistic beauty language.", bullets: ["Campaign-led opening panels", "Editorial product collections", "Clear price and favorite controls", "Mobile-first product imagery"] },
    build: { title: "A storefront ready for a changing catalog", body: "Reusable commerce sections let the team feature a new serum, collection, or promotion without rebuilding the homepage.", bullets: ["Reusable product carousels", "Category and brand filtering", "Responsive campaign modules", "Editable offer banners"] },
    metrics: [{ value: "Catalog", label: "Structured for discovery" }, { value: "Mobile", label: "Product-led browsing" }, { value: "CMS", label: "Editable merchandising" }, { value: "1", label: "Consistent checkout path" }],
    testimonial: { quote: "The store now gives every launch its moment while customers can still find what they came for quickly.", author: "Imported Makeover", role: "Retail team" },
    deliverables: ["Commerce strategy", "Responsive storefront", "Campaign system", "Product collection templates", "Catalog configuration", "Team handover"],
    outcome: "Imported Makeover gained a flexible digital shop that balances beauty storytelling with the practical details customers need to browse and buy.",
  },
  {
    id: "mx-fashion-store",
    slug: "mx-fashion-store",
    title: "MX Fashion Store",
    category: "Web",
    description: "A deal-led fashion store designed for quick product discovery",
    image: mxFashionAsset.url,
    client: "MX Fashion",
    year: "2025",
    stack: ["WooCommerce", "WordPress", "Catalog UI", "Responsive UI"],
    challenge: "Bring categories, flash deals, featured products, and new arrivals into one fast-moving fashion storefront.",
    solution: "We created a clear retail hierarchy with visual category shortcuts, prominent offers, consistent product cards, and a compact mobile shopping interface.",
    results: ["Promotions are easier to scan", "Categories remain visible throughout the journey", "Desktop and mobile share one merchandising language"],
    intro: "MX Fashion is a broad catalog built around frequent deals and fast inventory changes. The interface makes that pace feel organized rather than noisy.",
    scope: ["Retail UX", "Catalog hierarchy", "Responsive design", "WooCommerce build", "Promotion templates", "Store handover"],
    timeline: "7 weeks",
    role: "Ecommerce experience partner",
    problemNote: "Multiple campaign types and a wide catalog competed for attention, especially on mobile where sale content could easily bury navigation.",
    approach: [{ title: "Prioritize the shopping sequence", body: "Search and categories come first, followed by current deals, featured products, and deeper catalog rows." }, { title: "Standardize product decisions", body: "Cards use a consistent image, price, option, and action structure to make comparison quicker." }, { title: "Make promotions modular", body: "Deal bands and campaign panels can be reordered as the retail calendar changes." }],
    design: { title: "Direct retail graphics with strong promotional signals", body: "Black section bars, white surfaces, and sharp sale colors create clear stops across an otherwise image-rich catalog.", bullets: ["Visual category shortcuts", "Strong promotional hierarchy", "Consistent product card anatomy", "Compact mobile controls"] },
    build: { title: "A practical system for daily retail updates", body: "The store is assembled from repeatable modules that support new products, price changes, and seasonal campaigns without layout work.", bullets: ["Reusable catalog sections", "Promotion scheduling support", "Responsive product grids", "Streamlined mobile navigation"] },
    metrics: [{ value: "Catalog", label: "Unified product system" }, { value: "Mobile", label: "Compact shopping flow" }, { value: "CMS", label: "Retail team managed" }, { value: "1", label: "Consistent card pattern" }],
    testimonial: { quote: "We can change the offer, products, and seasonal focus while the storefront still feels consistent.", author: "MX Fashion", role: "Retail team" },
    deliverables: ["Store architecture", "Responsive website", "Product card system", "Deal templates", "Catalog configuration", "Launch support"],
    outcome: "MX Fashion now has a flexible deal-led storefront that gives customers quick orientation and gives the team room to keep the catalog fresh.",
  },
  {
    id: "rageroom-zeeland",
    slug: "rageroom-zeeland",
    title: "Rageroom Zeeland",
    category: "Web",
    description: "A high-impact venue site built to turn curiosity into bookings",
    image: rageroomAsset.url,
    client: "Rageroom Zeeland",
    year: "2025",
    stack: ["WordPress", "Booking Integration", "Responsive UI", "Performance"],
    challenge: "Explain an unfamiliar entertainment concept quickly, build trust, and make booking feel effortless.",
    solution: "We created a visceral black-and-yellow venue experience with immediate booking actions, clear room options, and a step-by-step explanation of the visit.",
    results: ["The activity is understandable at first glance", "Booking remains prominent on every screen", "Room options are easy to compare"],
    intro: "Rageroom Zeeland offers a memorable way to release stress by safely smashing objects in a controlled room. The website turns that unusual idea into an exciting and credible bookable experience.",
    scope: ["Experience strategy", "Art direction", "Booking UX", "Responsive build", "Room presentation", "Launch support"],
    timeline: "6 weeks",
    role: "Experience design and development",
    problemNote: "Visitors needed to understand what a rage room is, see what they could book, and feel confident about the experience before committing.",
    approach: [{ title: "Show the experience immediately", body: "Broken objects, dramatic contrast, and direct language communicate the energy before visitors need to read an explanation." }, { title: "Repeat the booking path", body: "Reservation actions appear at the moments where intent is strongest, without crowding the rest of the content." }, { title: "Answer uncertainty in sequence", body: "Room choices and a simple how-it-works flow turn an unusual concept into a predictable visit." }],
    design: { title: "Raw energy contained by a disciplined grid", body: "Black surfaces, distressed white lettering, and safety yellow create impact while structured spacing keeps the experience credible.", bullets: ["Distinctive venue identity", "Persistent reservation actions", "Room comparison cards", "Mobile-first booking prompts"] },
    build: { title: "A fast promotional site connected to booking", body: "The content system lets the venue update rooms, images, and practical information while the primary reservation journey remains stable.", bullets: ["Booking integration", "Reusable room templates", "Responsive media", "Editable practical information"] },
    metrics: [{ value: "2", label: "Room experiences presented" }, { value: "Booking", label: "Primary action throughout" }, { value: "Mobile", label: "Full reservation journey" }, { value: "CMS", label: "Venue-managed content" }],
    testimonial: { quote: "The site captures the energy of the room and makes the next step obvious: choose your experience and reserve it.", author: "Rageroom Zeeland", role: "Venue team" },
    deliverables: ["Website strategy", "Visual design", "Responsive development", "Room templates", "Booking connection", "Content handover"],
    outcome: "Rageroom Zeeland now has a digital experience that feels as distinctive as the venue while answering the practical questions that turn interest into a booking.",
  },
  {
    id: "menfia-digital-collections",
    slug: "menfia-digital-collections",
    title: "Menfia Digital Collections",
    category: "Web",
    description: "A dark beauty collection experience built for visual browsing",
    image: collectionsAsset.url,
    client: "Menfia Digital",
    year: "2025",
    stack: ["Shopify", "Liquid", "Collection UI", "Responsive UI"],
    challenge: "Make a compact beauty catalog feel editorial and distinctive while keeping collections simple to browse.",
    solution: "We designed a dark Shopify storefront around circular collection stories, immersive campaign imagery, and clean product groups that translate naturally to mobile.",
    results: ["Collections become the primary discovery tool", "A consistent premium identity across devices", "A reusable system for future category launches"],
    intro: "This beauty storefront explores collection-led shopping as a visual experience. Customers can move from a recognizable look to the products behind it without losing the editorial atmosphere.",
    scope: ["Shopify UX", "Visual direction", "Collection architecture", "Theme development", "Responsive design", "Store handover"],
    timeline: "6 weeks",
    role: "Shopify design and theme development",
    problemNote: "A small catalog needed stronger storytelling and easier collection discovery without imitating a conventional white retail template.",
    approach: [{ title: "Lead with collections", body: "Circular category portraits create an immediate visual vocabulary before customers reach individual products." }, { title: "Use contrast deliberately", body: "A black canvas makes skin tones, makeup colors, and packaging carry the page rather than decorative interface elements." }, { title: "Keep product groups calm", body: "Simple headings and focused grids slow the visual pace after the campaign imagery and support considered browsing." }],
    design: { title: "Editorial beauty on a deep black canvas", body: "Large portraits, elegant display type, and restrained controls give the store a premium fashion-editorial character.", bullets: ["Circular collection navigation", "Immersive campaign imagery", "Minimal product presentation", "Compact mobile header"] },
    build: { title: "A reusable collection system inside Shopify", body: "Theme sections connect collection imagery, labels, and product groups so new categories can launch without custom page work.", bullets: ["Configurable collection slider", "Reusable campaign sections", "Native Shopify product data", "Responsive theme controls"] },
    metrics: [{ value: "Shopify", label: "Native collection management" }, { value: "Mobile", label: "Horizontal visual discovery" }, { value: "Theme", label: "Reusable sections" }, { value: "1", label: "Unified visual language" }],
    testimonial: { quote: "The collections feel like stories now, not just filters, while the store remains simple to update.", author: "Menfia Digital", role: "Commerce team" },
    deliverables: ["Collection strategy", "Shopify theme design", "Custom collection slider", "Responsive theme build", "Product templates", "Store handover"],
    outcome: "The finished storefront uses a strong editorial identity to make a concise catalog feel richer, more navigable, and ready to expand.",
  },
  {
    id: "waves-recruitment",
    slug: "waves-recruitment",
    title: "Waves Recruitment",
    category: "Web",
    description: "A people-first recruitment platform for technical industries",
    image: wavesAsset.url,
    client: "Waves",
    year: "2025",
    stack: ["WordPress", "Elementor", "Recruitment UX", "Responsive UI"],
    challenge: "Present a new recruitment partner as credible, human, and relevant across several specialist industries.",
    solution: "We built a clear corporate narrative around people, expertise, and process, supported by industry-focused content and a responsive candidate journey.",
    results: ["A more credible first impression for employers", "Expertise areas are easier to understand", "Candidate and client journeys share one clear structure"],
    intro: "Waves connects professionals and organizations across construction, infrastructure, and installation technology. Its website needed to balance scale and expertise with a distinctly personal approach.",
    scope: ["Brand translation", "Information architecture", "Responsive design", "WordPress build", "Industry pages", "Content system"],
    timeline: "7 weeks",
    role: "Website design and development",
    problemNote: "The business served multiple audiences and technical sectors, but needed one message that felt specific enough for each and coherent as a whole.",
    approach: [{ title: "Start with a shared promise", body: "The opening message positions Waves around the future of hiring before splitting into candidate, employer, and expertise journeys." }, { title: "Make expertise tangible", body: "Industry cards and supporting imagery connect abstract recruitment services to recognizable working environments." }, { title: "Build trust through people", body: "Human imagery, participation cues, and straightforward language keep the experience grounded in real relationships." }],
    design: { title: "Optimistic corporate design with a human center", body: "Bright blue, wave-shaped transitions, open white space, and worksite photography create a confident identity without feeling institutional.", bullets: ["Wave-based visual language", "People-led photography", "Sector-focused expertise cards", "Clear contact actions"] },
    build: { title: "A flexible platform for growing expertise", body: "The content model supports additional sectors, stories, FAQs, and recruitment information while preserving a consistent user journey.", bullets: ["Reusable industry pages", "Responsive editorial sections", "Editable FAQ system", "Conversion-focused contact paths"] },
    metrics: [{ value: "3", label: "Initial expertise areas" }, { value: "2", label: "Core audience journeys" }, { value: "Mobile", label: "Candidate-ready experience" }, { value: "CMS", label: "Expandable content" }],
    testimonial: { quote: "The new website gives our expertise a clear structure while keeping the people behind every placement at the center.", author: "Waves", role: "Recruitment team" },
    deliverables: ["Website strategy", "Responsive interface", "WordPress build", "Expertise templates", "FAQ framework", "Content handover"],
    outcome: "Waves now has a clear, scalable recruitment presence that introduces its mission, proves sector relevance, and gives every visitor an obvious next step.",
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
