import type { TopicNode } from "@/data/types";

export const cssIqAccessibility: TopicNode = {
  id: "css-iq-accessibility",
  title: "CSS & Accessibility",
  iconName: "Eye",
  theory:
    "CSS accessibility questions are expected at senior level. Know focus management, reduced-motion, color contrast, and how CSS can help or harm screen reader users.",
  theoryDetail: {
    keyConcepts: [
      "Color contrast ratio: WCAG AA requires 4.5:1 for normal text, 3:1 for large text",
      ":focus-visible targets keyboard navigation focus without affecting mouse users",
      "prefers-reduced-motion: reduce protects users with vestibular disorders from animation",
      "visibility: hidden removes from accessibility tree; opacity: 0 does NOT — screen readers still read it",
    ],
    examples: [
      {
        title: "Q: How does CSS affect accessibility?",
        description:
          "CSS can improve or harm accessibility. Focus, motion, contrast, and visibility are the key areas.",
        code: `/* ─── 1. Focus management ─── */

/* ❌ Wrong — removes focus entirely for all users */
*:focus { outline: none; }

/* ✅ Correct — only hides outline for mouse users */
*:focus:not(:focus-visible) { outline: none; }
*:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
  border-radius: 4px;
}

/* ─── 2. Reduced motion ─── */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration:       0.01ms !important;
    animation-iteration-count: 1     !important;
    transition-duration:      0.01ms !important;
    scroll-behavior:          auto   !important;
  }
}

/* ─── 3. Visually hidden — visible to screen readers ─── */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
/* Use for labels that should be read aloud but not shown */

/* ─── 4. Hiding from screen readers (decorative) ─── */
.icon-decorative {
  aria-hidden: true; /* HTML attribute — not CSS */
}

/* opacity: 0 hides visually but screen readers STILL READ it */
/* visibility: hidden removes from accessibility tree */
/* display: none   removes from both layout and accessibility tree */

/* OUTPUT:
  sr-only → invisible on screen, announced by screen reader
  display: none → invisible and silent
  opacity: 0 → invisible visually, read aloud — use with care */`,
        language: "css",
      },
    ],
  },
};