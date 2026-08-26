import { useRef, useEffect, type ReactNode, type ElementType } from "react";
import { gsap, ScrollTrigger, useGsapContext, splitWords } from "../lib/gsap";

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
  const ref = useGsapContext<HTMLDivElement>((_self, root) => {
    const targets = stagger ? Array.from(root.children) : [root];
    gsap.from(targets, {
      opacity: 0,
      y,
      duration: 0.9,
      delay,
      ease: "power3.out",
      stagger: stagger ?? 0,
      scrollTrigger: { trigger: root, start: "top 88%", once: true },
    });
  });

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
  const ref = useGsapContext<HTMLHeadingElement>((_self, root) => {
    const words = splitWords(root);
    gsap.from(words, {
      yPercent: 115,
      opacity: 0,
      duration: 0.9,
      delay,
      ease: "power4.out",
      stagger: 0.055,
      scrollTrigger: { trigger: root, start: "top 90%", once: true },
    });
  });

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
    gsap.fromTo(
      root,
      { y: amount },
      {
        y: -amount,
        ease: "none",
        scrollTrigger: { trigger: root, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
  });
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Counts a numeric string up when scrolled into view. */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useGsapContext<HTMLSpanElement>((_self, root) => {
    const match = value.match(/[\d.]+/);
    if (!match) return;
    const target = parseFloat(match[0]);
    const decimals = (match[0].split(".")[1] ?? "").length;
    const obj = { n: 0 };
    gsap.to(obj, {
      n: target,
      duration: 1.4,
      ease: "power2.out",
      scrollTrigger: { trigger: root, start: "top 92%", once: true },
      onUpdate: () => {
        root.textContent = value.replace(match[0], obj.n.toFixed(decimals));
      },
    });
  });
  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
}

export { gsap, ScrollTrigger };
