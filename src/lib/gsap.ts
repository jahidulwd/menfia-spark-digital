import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Runs a GSAP setup function once the element scrolls into view.
 * Uses IntersectionObserver instead of the ScrollTrigger plugin so animations
 * are reliable during SSR hydration.
 */
export function useGsapContext<T extends HTMLElement = HTMLDivElement>(
  setup: (self: gsap.Context, root: T) => void,
  deps: unknown[] = [],
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = ref.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: gsap.Context | null = null;
    const settle: number | undefined = undefined;
    const run = () => {
      if (ctx) return;
      ctx = gsap.context((self) => setup(self, root), root);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            run();
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );
    observer.observe(root);

    // Safety net: if the observer never fires (e.g. element already scrolled
    // past), play the animation anyway so content is never left hidden.
    const fallback = window.setTimeout(run, 1500);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
      if (settle) window.clearTimeout(settle);
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

/** Split a text node into per-word spans for staggered reveals. */
export function splitWords(el: HTMLElement) {
  if (el.dataset["split"] === "true") return Array.from(el.querySelectorAll<HTMLElement>(".gsap-word"));
  const words = (el.textContent ?? "").split(/\s+/).filter(Boolean);
  el.textContent = "";
  const nodes = words.map((w) => {
    const outer = document.createElement("span");
    outer.className = "inline-block overflow-hidden align-bottom";
    const inner = document.createElement("span");
    inner.className = "gsap-word inline-block";
    inner.textContent = w;
    outer.appendChild(inner);
    el.appendChild(outer);
    el.appendChild(document.createTextNode(" "));
    return inner;
  });
  el.dataset["split"] = "true";
  return nodes;
}

export { gsap };
