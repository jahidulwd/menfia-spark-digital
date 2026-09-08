import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { useAuth } from "@/hooks/useAuth";
import { getBranding } from "@/lib/store.functions";

export function Header() {
  const { user } = useAuth();
  const fetchBranding = useServerFn(getBranding);
  const { data: branding } = useQuery({ queryKey: ["branding"], queryFn: () => fetchBranding() });

  const name = branding?.site_name || "MENFIA DIGITAL";
  const logo = branding?.header_logo_url;
  const height = branding?.logo_height || 32;

  return (
    <header className="sticky top-0 z-50 border-b border-steel bg-titan/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link to="/" className="flex items-center leading-tight">
          {logo ? (
            <img src={logo} alt={name} style={{ height: `${height}px` }} className="w-auto" />
          ) : (
            <p className="text-sm font-extrabold tracking-tight">{name}</p>
          )}
        </Link>
        <nav className="hidden items-center gap-8 font-mono text-[11px] uppercase tracking-[0.15em] text-ink/60 md:flex">
          <Link to="/" hash="work" className="hover:text-carbon">
            Work
          </Link>
          <Link to="/" hash="services" className="hover:text-carbon">
            Services
          </Link>
          <Link to="/products" className="hover:text-carbon">
            Products
          </Link>
          <Link to="/" hash="faq" className="hover:text-carbon">
            FAQ
          </Link>
          <Link to="/contact" className="hover:text-carbon">
            Contact
          </Link>
          {user ? (
            <Link to="/downloads" className="hover:text-carbon">
              Account
            </Link>
          ) : (
            <Link to="/auth" className="hover:text-carbon">
              Sign in
            </Link>
          )}
        </nav>
        <Link
          to="/contact"
          className="rounded-full bg-volt px-5 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-carbon transition hover:brightness-95"
        >
          Start a build
        </Link>
      </div>
    </header>
  );
}
