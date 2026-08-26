import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

export function useGsapContext<T extends HTMLElement = HTMLDivElement>(
  setup: (self: gsap.Context, root: T) => void,
  deps: unknown[] = [],
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!registered) {
      gsap.registerPlugin(ScrollTrigger);
      registered = true;
    }
    const root = ref.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    console.log('[gsap] setup', root.className);
    const ctx = gsap.context((self) => setup(self, root), root);
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
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

export { gsap, ScrollTrigger };
