import type { TopicNode } from "@/data/types";

export const hookUseLayoutEffect: TopicNode = {
  id: "hook-uselayouteffect",
  title: "useLayoutEffect",
  iconName: "Layout",
  link: "https://react.dev/reference/react/useLayoutEffect",
  theory:
    "useLayoutEffect fires synchronously after React updates the DOM but before the browser paints. It has the same signature as useEffect. Use it only when you need to measure DOM geometry or make synchronous DOM mutations that must happen before the user sees the screen — otherwise prefer useEffect.",
  theoryDetail: {
    keyConcepts: [
      "useLayoutEffect is synchronous — it blocks the browser from painting until it completes",
      "Safe to read layout properties (getBoundingClientRect, scrollHeight, offsetTop) here — the DOM is committed but not yet visible",
      "Has the same cleanup mechanism as useEffect — return a function to run before the next layout effect",
      "Runs on every render where deps change, just like useEffect",
    ],
    whyItMatters:
      "useEffect runs after paint, so visual corrections applied there cause a flicker — the user sees the wrong position for one frame. useLayoutEffect prevents that flicker by mutating the DOM before the browser has a chance to paint, giving the appearance of an instant correction.",
    commonPitfalls: [
      "Using useLayoutEffect for data fetching or subscriptions — it blocks painting, degrading perceived performance",
      "Forgetting it runs on the server during SSR (as useEffect in Next.js) — guard with typeof window !== 'undefined' when needed",
      "Long-running synchronous work inside it — delays first paint and hurts Core Web Vitals",
    ],
    examples: [
      {
        title: "Measure element size without flicker",
        description: "Read the DOM dimensions before paint to position a tooltip accurately.",
        code: `import { useRef, useState, useLayoutEffect } from 'react';

function Tooltip({ text, children }) {
  const triggerRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    // Set position BEFORE the browser paints — no flicker
    setPos({ top: rect.bottom + window.scrollY, left: rect.left });
  });

  return (
    <>
      <span ref={triggerRef}>{children}</span>
      <div style={{ position: 'absolute', top: pos.top, left: pos.left }}
           className="tooltip">
        {text}
      </div>
    </>
  );
}`,
        language: "jsx",
      },
      {
        title: "Scroll to top on route change",
        description: "Synchronously reset scroll position before the user sees the new page.",
        code: `import { useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';

function ScrollReset() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}`,
        language: "jsx",
      },
    ],
  },
};
