import { Link } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-steel bg-titan/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link to="/" className="leading-tight">
          <p className="text-sm font-extrabold tracking-tight">MENFIA DIGITAL</p>
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
