import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { listFooterPages } from "@/lib/store.functions";

export function FooterLegal() {
  const fetchPages = useServerFn(listFooterPages);
  const { data } = useQuery({ queryKey: ["footer-pages"], queryFn: () => fetchPages() });

  return (
    <div className="mt-16 border-t border-white/10 pt-8">
      <nav className="flex flex-wrap gap-x-6 gap-y-3 font-mono text-[11px] uppercase tracking-[0.15em] text-white/40">
        <Link to="/products" className="hover:text-volt">
          Products
        </Link>
        <Link to="/contact" className="hover:text-volt">
          Contact
        </Link>
        {(data ?? []).map((page: { slug: string; title: string }) => (
          <Link key={page.slug} to="/p/$slug" params={{ slug: page.slug }} className="hover:text-volt">
            {page.title}
          </Link>
        ))}
      </nav>
      <div className="mt-6 flex flex-col items-start justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.15em] text-white/40 sm:flex-row sm:items-center">
        <span>Menfia Digital — Systems for the web</span>
        <span>© 2026 · Built with intent</span>
      </div>
    </div>
  );
}
