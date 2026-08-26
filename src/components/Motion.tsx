import { useRef, useEffect, useState, type ReactNode, type ElementType } from "react";
import { gsap, useGsapContext, splitWords } from "../lib/gsap";

/** Fires once the element scrolls into view (with a safe fallback). */
function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView] as const;
}

/** Fade + rise on scroll, with optional stagger over direct children. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 36,
  stagger,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  stagger?: number;
  as?: ElementType;
}) {
  const [ref, inView] = useInView<HTMLDivElement>();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const targets = (stagger ? Array.from(root.children) : [root]) as HTMLElement[];
    targets.forEach((el, i) => {
      el.style.transition = "none";
      el.style.opacity = inView ? "1" : "0";
      el.style.transform = inView ? "translateY(0)" : `translateY(${y}px)`;
      if (!inView) return;
      // force styles to apply, then transition to the resting state
      void el.offsetWidth;
      el.style.opacity = "0";
      el.style.transform = `translateY(${y}px)`;
      el.style.transition = `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay + i * (stagger ?? 0)}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay + i * (stagger ?? 0)}s`;
      requestAnimationFrame(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
    });
  }, [inView, delay, stagger, y, ref]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Word-by-word masked text reveal. */
export function SplitHeading({
  children,
  className,
  as: Tag = "h2",
  delay = 0,
}: {
  children: string;
  className?: string;
  as?: ElementType;
  delay?: number;
}) {
  const [ref, inView] = useInView<HTMLHeadingElement>();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const words = splitWords(root);
    words.forEach((w, i) => {
      w.style.display = "inline-block";
      w.style.willChange = "transform, opacity";
      w.style.transition = "none";
      w.style.transform = "translateY(115%)";
      w.style.opacity = "0";
      if (!inView) return;
      void w.offsetWidth;
      w.style.transition = `transform 0.85s cubic-bezier(0.16,1,0.3,1) ${delay + i * 0.055}s, opacity 0.5s ease ${delay + i * 0.055}s`;
      requestAnimationFrame(() => {
        w.style.transform = "translateY(0)";
        w.style.opacity = "1";
      });
    });
  }, [inView, delay, ref]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Pointer-driven 3D tilt with depth parallax on children marked data-depth. */
export function Tilt3D({
  children,
  className,
  intensity = 12,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const inner = el.firstElementChild as HTMLElement | null;
    if (!inner) return;
    const setX = gsap.quickTo(inner, "rotationY", { duration: 0.6, ease: "power3.out" });
    const setY = gsap.quickTo(inner, "rotationX", { duration: 0.6, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      setX(px * intensity * 2);
      setY(-py * intensity * 2);
    };
    const onLeave = () => {
      setX(0);
      setY(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [intensity]);

  return (
    <div ref={ref} className={className} style={{ perspective: "1200px" }}>
      <div style={{ transformStyle: "preserve-3d", willChange: "transform" }}>{children}</div>
    </div>
  );
}

/** Vertical parallax drift as the element scrolls through the viewport. */
export function Parallax({
  children,
  className,
  amount = 60,
}: {
  children: ReactNode;
  className?: string;
  amount?: number;
}) {
  const ref = useGsapContext<HTMLDivElement>((_self, root) => {
    const update = () => {
      const r = root.getBoundingClientRect();
      const progress = 1 - (r.top + r.height / 2) / window.innerHeight;
      gsap.to(root, { y: -progress * amount, duration: 0.4, ease: "power2.out", overwrite: true });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  });
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Counts a numeric string up when scrolled into view. */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const [ref, inView] = useInView<HTMLSpanElement>();

  useEffect(() => {
    const root = ref.current;
    if (!root || !inView) return;
    const match = value.match(/[\d.]+/);
    if (!match) return;
    const target = parseFloat(match[0]);
    const decimals = (match[0].split(".")[1] ?? "").length;
    const start = performance.now();
    const duration = 1400;
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      root.textContent = value.replace(match[0], (target * eased).toFixed(decimals));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const settle = window.setTimeout(() => {
      root.textContent = value;
    }, duration + 1200);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(settle);
      root.textContent = value;
    };
  }, [inView, value, ref]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}

export { gsap };
