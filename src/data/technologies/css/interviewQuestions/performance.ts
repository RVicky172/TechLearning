import type { TopicNode } from "@/data/types";

export const cssIqPerformance: TopicNode = {
  id: "css-iq-performance",
  title: "CSS Performance",
  iconName: "Zap",
  theory:
    "CSS can be a performance bottleneck through excessive repaints, layout thrashing, and large unused stylesheets. Senior engineers are expected to know what's expensive and why.",
  theoryDetail: {
    keyConcepts: [
      "Rendering pipeline: Style → Layout → Paint → Composite",
      "Layout (reflow): triggered by changes to geometry — width, height, margin, padding, top, left",
      "Paint: triggered by visual changes — color, background, box-shadow (no geometry change)",
      "Composite: only transform and opacity skip Layout and Paint — cheapest to animate",
      "contain: layout | paint | size limits style recalculation to the contained subtree",
    ],
    examples: [
      {
        title: "Q: What CSS properties are expensive to animate and why?",
        description:
          "Properties that trigger Layout or Paint on every frame cause jank. Only animate transform and opacity for smooth 60fps animations.",
        code: `/* ❌ EXPENSIVE — triggers Layout (reflow) on every frame */
@keyframes bad-move {
  from { left: 0; }
  to   { left: 200px; }
}
/* The browser must recalculate every other element's
   position on EVERY animation frame. */

/* ❌ EXPENSIVE — triggers Paint on every frame */
@keyframes bad-shadow {
  from { box-shadow: 0 0 0 rgba(0,0,0,0); }
  to   { box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
}
/* Repaints the element and any overlapping elements. */

/* ✅ CHEAP — only triggers Composite */
@keyframes good-move {
  from { transform: translateX(0); }
  to   { transform: translateX(200px); }
}

@keyframes good-fade {
  from { opacity: 0; }
  to   { opacity: 1; }
}
/* transform and opacity are handled entirely on the GPU
   compositor thread — no Layout, no Paint, no jank.
   OUTPUT: consistent 60fps even on low-end devices. */

/* Hint the browser to promote the element to its own layer */
.animated-element {
  will-change: transform; /* use sparingly — wastes GPU memory */
}`,
        language: "css",
      },
      {
        title: "Q: How do you reduce unused CSS?",
        description:
          "Large CSS files delay render. Know the tools and approaches for stripping unused styles in production.",
        code: `/* ─── Build-time: PurgeCSS / Tailwind's content purging ─── */

/* tailwind.config.js */
export default {
  content: ['./src/**/*.{html,js,ts,tsx}'],
  /* Tailwind scans these files and removes any class
     not found in them from the production CSS bundle. */
}

/* ─── CSS containment ─── */
.isolated-widget {
  contain: strict;
  /* Tells the browser: nothing inside affects layout
     outside this box. Enables style recalculation skipping. */
}

/* ─── @layer for progressive enhancement ─── */
/* Non-critical styles in a separate layer or file —
   load them with <link rel="preload" as="style">
   or import them lazily. */

/* ─── DevTools audit ─── */
/* Chrome → DevTools → Coverage tab
   Run the page, see which CSS lines are unused (red bars).
   Target large unused chunks for lazy loading or removal. */`,
        language: "css",
      },
    ],
  },
};