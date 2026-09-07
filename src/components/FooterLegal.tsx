import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { getFooterSettings, listFooterPages } from "@/lib/store.functions";

type FooterLink = { label: string; url: string };
type FooterColumn = { title: string; links: FooterLink[] };

function isInternal(url: string) {
  return url.startsWith("/");
}

function FooterAnchor({ link }: { link: FooterLink }) {
  const className = "text-sm text-white/55 transition hover:text-volt";
  if (isInternal(link.url)) {
    return (
      <Link to={link.url} className={className}>
        {link.label}
      </Link>
    );
  }
  return (
    <a href={link.url} target="_blank" rel="noreferrer noopener" className={className}>
      {link.label}
    </a>
  );
}

export function FooterLegal() {
  const fetchPages = useServerFn(listFooterPages);
  const fetchFooter = useServerFn(getFooterSettings);

  const { data: pages } = useQuery({ queryKey: ["footer-pages"], queryFn: () => fetchPages() });
  const { data: footer } = useQuery({ queryKey: ["footer-settings"], queryFn: () => fetchFooter() });

  const columns = (footer?.columns ?? []) as FooterColumn[];
  const socials = (footer?.socials ?? []) as FooterLink[];
  const legalPages = (pages ?? []) as { slug: string; title: string }[];

  return (
    <footer className="mt-20 border-t border-white/10 pt-14">
      <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
        <div>
          <p className="text-sm font-extrabold tracking-tight text-volt">{footer?.brand_name}</p>
          {footer?.tagline && (
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
              {footer.tagline}
            </p>
          )}
          {footer?.description && (
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/50">{footer.description}</p>
          )}
          <dl className="mt-7 space-y-2 text-sm text-white/55">
            {footer?.email && (
              <div>
                <a href={`mailto:${footer.email}`} className="transition hover:text-volt">
                  {footer.email}
                </a>
              </div>
            )}
            {footer?.phone && (
              <div>
                <a href={`tel:${footer.phone.replace(/\s+/g, "")}`} className="transition hover:text-volt">
                  {footer.phone}
                </a>
              </div>
            )}
            {footer?.address && <div className="text-white/40">{footer.address}</div>}
          </dl>
        </div>

        <div className="grid gap-10 sm:grid-cols-3">
          {columns.map((column) => (
            <nav key={column.title}>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">{column.title}</p>
              <ul className="mt-4 space-y-3">
                {(column.links ?? []).map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    <FooterAnchor link={link} />
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <nav>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">Legal</p>
            <ul className="mt-4 space-y-3">
              {legalPages.map((page) => (
                <li key={page.slug}>
                  <Link
                    to="/p/$slug"
                    params={{ slug: page.slug }}
                    className="text-sm text-white/55 transition hover:text-volt"
                  >
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="mt-14 flex flex-col items-start justify-between gap-5 border-t border-white/10 pt-7 font-mono text-[11px] uppercase tracking-[0.15em] text-white/35 sm:flex-row sm:items-center">
        <span>{footer?.copyright}</span>
        <div className="flex flex-wrap gap-5">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.url}
              target="_blank"
              rel="noreferrer noopener"
              className="transition hover:text-volt"
            >
              {social.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
