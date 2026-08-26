import workSaas from "../assets/work-saas.jpg";
import workCommerce from "../assets/work-commerce.jpg";
import workMarketing from "../assets/work-marketing.jpg";

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
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
