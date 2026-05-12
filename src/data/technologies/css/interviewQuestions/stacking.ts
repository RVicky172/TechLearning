import type { TopicNode } from "@/data/types";

export const cssIqStacking: TopicNode = {
  id: "css-iq-stacking",
  title: "Stacking Contexts & z-index",
  iconName: "Layers",
  theory:
    "z-index only works within a stacking context. Understanding what creates a context explains why z-index: 9999 sometimes fails.",
  theoryDetail: {
    keyConcepts: [
      "z-index only competes within the same stacking context",
      "opacity < 1, transform, filter, will-change, isolation: isolate all create a new stacking context",
      "isolation: isolate creates a context intentionally without any visual side-effects",
    ],
    examples: [
      {
        title: "Q: Why doesn't my z-index: 9999 work?",
        description:
          "The element is trapped inside a stacking context created by a parent. Its z-index only competes within that parent's context.",
        code: `/* HTML:
  <div class="card">           ← creates a stacking context
    <div class="tooltip">...</div>  ← z-index: 9999 (trapped!)
  </div>
  <div class="sidebar">...</div>   ← z-index: 10
*/

/* PROBLEM: .card creates a stacking context via transform */
.card {
  transform: translateY(0); /* innocent performance optimisation */
  /* ← this creates a stacking context! */
}

.tooltip {
  position: absolute;
  z-index: 9999; /* only competes inside .card, not globally */
}

.sidebar {
  position: relative;
  z-index: 10; /* in ROOT context — renders above .tooltip */
}

/* ─── How to debug ─── */
/* DevTools → Elements → Computed → search "stacking" */
/* Or look for: opacity, transform, filter, will-change,
   isolation, mix-blend-mode, contain: paint|layout */

/* ─── Fix 1: Remove the context-creating property ─── */
.card { /* remove transform — use a wrapper for the effect */ }

/* ─── Fix 2: Use isolation: isolate explicitly on root ─── */
#modal-root {
  isolation: isolate; /* clean, intentional stacking context */
}

/* ─── Fix 3: Move the tooltip to a Portal (React) ─── */
/* Render the tooltip as a child of document.body,
   outside .card's stacking context entirely. */`,
        language: "css",
      },
    ],
  },
};