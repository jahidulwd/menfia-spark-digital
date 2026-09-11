import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";

import { useAuth } from "@/hooks/useAuth";
import { getBranding, getHeaderSettings, HEADER_DEFAULTS, type HeaderLink } from "@/lib/store.functions";

function Anchor({ link, className }: { link: HeaderLink; className: string }) {
  const external = !(link.url.startsWith("/") || link.url.startsWith("#"));
  return (
    <a
      href={link.url || "#"}
      className={className}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
    >
      {link.label}
    </a>
  );
}

export function Header() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const fetchBranding = useServerFn(getBranding);
  const fetchHeader = useServerFn(getHeaderSettings);
  const { data: branding } = useQuery({ queryKey: ["branding"], queryFn: () => fetchBranding() });
  const { data: headerData } = useQuery({ queryKey: ["header-settings"], queryFn: () => fetchHeader() });
  const h = headerData ?? HEADER_DEFAULTS;

  const name = branding?.site_name || "MENFIA DIGITAL";
  const logo = branding?.header_logo_url;
  const logoHeight = branding?.logo_height || 32;

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        open ? "border-white/10 bg-carbon" : "border-steel bg-titan/85 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link to="/" onClick={() => setOpen(false)} className="flex items-center">
          {logo ? (
            <img src={logo} alt={name} style={{ height: `${logoHeight}px` }} className="w-auto" />
          ) : (
            <p className={`text-base font-extrabold tracking-tight ${open ? "text-volt" : "text-carbon"}`}>{name}</p>
          )}
        </Link>

        <div className="flex items-center gap-5 sm:gap-7">
          <Anchor
            link={{ label: h.cta_label, url: h.cta_url }}
            className={`hidden rounded-full px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] transition sm:inline-flex ${
              open ? "bg-volt text-carbon" : "bg-volt text-carbon hover:brightness-95"
            }`}
          />
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="header-panel"
            className="flex items-center gap-3"
          >
            <span
              className={`font-mono text-[11px] font-semibold uppercase tracking-[0.18em] ${
                open ? "text-volt" : "text-carbon"
              }`}
            >
              {open ? h.close_label : h.menu_label}
            </span>
            <span className="relative block h-[18px] w-[26px]">
              {[0, 8, 16].map((top, i) => (
                <span
                  key={top}
                  className={`absolute left-0 right-0 h-[2px] rounded-sm transition-all duration-300 ${
                    open ? "bg-volt" : "bg-carbon"
                  }`}
                  style={{
                    top: open ? 8 : top,
                    transform: open ? (i === 0 ? "rotate(45deg)" : i === 2 ? "rotate(-45deg)" : "none") : "none",
                    opacity: open && i === 1 ? 0 : 1,
                  }}
                />
              ))}
            </span>
          </button>
        </div>
      </div>

      <div
        id="header-panel"
        className="overflow-hidden bg-carbon transition-[max-height] duration-500 ease-in-out"
        style={{ maxHeight: open ? "min(90vh, 640px)" : 0 }}
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-12 pt-2 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
          <nav aria-label="Primary" className="flex flex-col pt-2">
            {h.nav.map((link) => (
              <a
                key={`${link.label}-${link.url}`}
                href={link.url || "#"}
                onClick={() => setOpen(false)}
                className="border-b border-white/15 py-3 text-2xl font-extrabold tracking-tight text-white transition hover:pl-2 hover:text-volt sm:text-3xl"
              >
                {link.label}
              </a>
            ))}
            {user ? (
              <Link
                to="/downloads"
                onClick={() => setOpen(false)}
                className="border-b border-white/15 py-3 text-2xl font-extrabold tracking-tight text-white transition hover:pl-2 hover:text-volt sm:text-3xl"
              >
                My account
              </Link>
            ) : (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="border-b border-white/15 py-3 text-2xl font-extrabold tracking-tight text-white transition hover:pl-2 hover:text-volt sm:text-3xl"
              >
                Sign in
              </Link>
            )}
          </nav>

          <div className="flex flex-col gap-7 pt-2">
            <Anchor
              link={{ label: h.panel_cta_label, url: h.panel_cta_url }}
              className="w-fit rounded-full bg-volt px-6 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-carbon"
            />

            {h.blocks.map((block) => (
              <div key={block.title}>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
                  {block.title}
                </p>
                <div className="mt-2 space-y-1.5">
                  {block.lines.map((line) =>
                    line.url ? (
                      <Anchor
                        key={line.label}
                        link={line}
                        className="block text-sm leading-relaxed text-white/80 transition hover:text-volt"
                      />
                    ) : (
                      <p key={line.label} className="text-sm leading-relaxed text-white/60">
                        {line.label}
                      </p>
                    ),
                  )}
                </div>
              </div>
            ))}

            {h.socials.length > 0 && (
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
                  Follow along
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {h.socials.map((social) => (
                    <Anchor
                      key={social.label}
                      link={social}
                      className="rounded-full border border-white/25 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-white/70 transition hover:border-volt hover:text-volt"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
