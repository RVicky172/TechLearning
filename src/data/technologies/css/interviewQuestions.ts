import type { TopicNode } from "@/data/types";

const iqSpecificity: TopicNode = {
  id: "css-iq-specificity",
  title: "Specificity Scoring",
  iconName: "Target",
  theory: "A common warm-up question: calculate which rule wins and explain the scoring system.",
  theoryDetail: {
    keyConcepts: [
      "Specificity is scored as three buckets: (IDs, Classes/Attrs/Pseudo-classes, Elements/Pseudo-elements)",
      "!important overrides all specificity — avoid it; fix the selector instead",
      "Equal specificity defers to source order — the later declaration wins",
    ],
    examples: [
      {
        title: "Q: Which rule applies and why?",
        description:
          "Given these rules for the same element, calculate which color is rendered. Specificity is compared bucket-by-bucket left to right.",
        code: `/* HTML: <nav id="primary-nav"><a class="nav link active">Home</a></nav> */

/* (0,0,1,1) — element + class */
nav a { color: gray; }

/* (0,0,2,0) — two classes */
.nav .link { color: blue; }

/* (0,0,3,0) — three classes — BEATS two classes */
.nav .link.active { color: green; }

/* (0,1,0,0) — ID — BEATS all class selectors above */
#primary-nav a { color: purple; }

/* (0,1,1,0) — ID + class — highest specificity */
#primary-nav .link { color: red; }

/* OUTPUT: color is RED
   Scoring: (0,1,1,0) beats (0,1,0,0) beats (0,0,3,0) ...

   Tip: use browser DevTools → Computed → filter for 'color'
   to see which rule won and why it was struck through. */`,
        language: "css",
      },
      {
        title: "Q: Why doesn't my override work? How do you fix specificity wars?",
        description:
          "The correct fix is almost never !important. Restructure the selector or use CSS Layers.",
        code: `/* Problem: library adds a high-specificity rule */
.sidebar .widget .title { color: blue; }  /* (0,0,3,0) */

/* Your override has lower specificity — ignored */
.title { color: red; }                    /* (0,0,1,0) */

/* ❌ Wrong fix — !important escalates the war */
.title { color: red !important; }

/* ✅ Fix 1: Match or beat the specificity */
.sidebar .widget .title.custom { color: red; } /* (0,0,4,0) */

/* ✅ Fix 2: Use CSS Layers — utilities always win */
@layer base, utilities;

@layer base {
  .sidebar .widget .title { color: blue; }
}

@layer utilities {
  .title { color: red; } /* wins because 'utilities' > 'base' in layer order */
}

/* ✅ Fix 3: Use :where() to reduce library specificity to 0 */
:where(.sidebar .widget) .title { color: blue; } /* (0,0,1,0) */
/* Now .title { color: red; } (0,0,1,0) wins by source order */`,
        language: "css",
      },
    ],
  },
};

const iqCentering: TopicNode = {
  id: "css-iq-centering",
  title: "Centering an Element",
  iconName: "AlignCenter",
  theory:
    "One of the most asked CSS questions. Know at least three approaches and when each is appropriate.",
  theoryDetail: {
    keyConcepts: [
      "Flexbox and Grid are the modern approaches — one or two properties each",
      "position + transform works when you cannot modify the parent",
      "margin: auto horizontally centers block elements with a defined width",
    ],
    examples: [
      {
        title: "Q: How do you center a div both horizontally and vertically?",
        description:
          "Multiple valid approaches exist. The modern answers are Flexbox and Grid.",
        code: `/* HTML: <div class="parent"><div class="child">Centered</div></div> */

/* ─── 1. Flexbox (most common modern approach) ─── */
.parent {
  display: flex;
  justify-content: center; /* horizontal */
  align-items: center;     /* vertical */
  height: 100vh;
}

/* ─── 2. Grid — one-liner ─── */
.parent {
  display: grid;
  place-items: center; /* shorthand for align-items + justify-items */
  height: 100vh;
}

/* ─── 3. Position + transform (no parent modification needed) ─── */
.parent { position: relative; height: 100vh; }

.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* Works regardless of child's width/height */
}

/* ─── 4. Margin auto (horizontal only, block elements) ─── */
.child {
  width: 600px;
  margin: 0 auto; /* left + right auto = centered */
}

/* OUTPUT: All four center the child inside the parent.
   Prefer Flexbox/Grid — they handle dynamic sizes and
   don't require knowing the child's dimensions. */`,
        language: "css",
      },
    ],
  },
};

const iqBFC: TopicNode = {
  id: "css-iq-bfc",
  title: "Block Formatting Context",
  iconName: "Box",
  theory:
    "BFC questions assess deep understanding of how layout contexts isolate float behaviour, margin collapse, and overflow.",
  theoryDetail: {
    keyConcepts: [
      "A BFC is an isolated layout region where internal floats are contained",
      "display: flow-root is the clean, no-side-effect way to create a BFC",
      "Margin collapse does NOT cross a BFC boundary",
    ],
    examples: [
      {
        title: "Q: What is a BFC and when does one form?",
        description:
          "A BFC is an isolated layout region. Floats are contained within it and margins don't collapse across its boundary.",
        code: `/* ─── What creates a BFC ─── */
display: flow-root;       /* modern, explicit, no side effects ✅ */
display: flex;            /* also a BFC */
display: grid;            /* also a BFC */
overflow: hidden;         /* classic hack — creates a BFC */
position: absolute | fixed;
float: left | right;
contain: layout | content | paint;

/* ─── Practical: contain floated children ─── */
/* HTML:
  <div class="container">
    <div class="float-left">Float</div>
    <p>Normal content</p>
  </div>
*/

/* WITHOUT BFC — container collapses to 0 height */
.container { background: lightblue; }

/* WITH BFC — container wraps around the float */
.container {
  background: lightblue;
  display: flow-root; /* ← establishes a BFC */
}

/* ─── Margin collapse prevention ─── */
.parent { overflow: hidden; } /* BFC prevents child margin from escaping */
.child  { margin-top: 24px; } /* stays INSIDE the parent, doesn't collapse out */`,
        language: "css",
      },
    ],
  },
};

const iqStacking: TopicNode = {
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

const iqFlexboxVsGrid: TopicNode = {
  id: "css-iq-flex-vs-grid",
  title: "Flexbox vs Grid",
  iconName: "Layout",
  theory:
    "A decision-making question: when do you reach for Flexbox and when for Grid? Interviewers want to hear clear trade-offs.",
  theoryDetail: {
    keyConcepts: [
      "Flexbox: one-dimensional — content-first layout (items decide their size)",
      "Grid: two-dimensional — layout-first (tracks define the structure, items fill it)",
      "Both can be nested: Grid for page layout, Flex for component internals",
    ],
    examples: [
      {
        title: "Q: When do you use Flexbox vs Grid?",
        description:
          "Use Flexbox when items flow along one axis. Use Grid when you need control over both rows AND columns.",
        code: `/* ─── Use FLEXBOX for ─── */

/* 1. Nav bar — items in a single row */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 2. Button group — items side by side */
.btn-group {
  display: flex;
  gap: 8px;
}

/* 3. Centering a single item */
.hero {
  display: flex;
  place-content: center;
}

/* ─── Use GRID for ─── */

/* 1. Page layout — header / sidebar / main / footer */
.app {
  display: grid;
  grid-template:
    "header header" 60px
    "sidebar main"  1fr
    "footer footer"  50px
    / 240px 1fr;
}

/* 2. Card grid — rows AND columns matter */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

/* 3. Overlay — items occupy the same cell */
.image-wrapper {
  display: grid;
}
.image-wrapper > * {
  grid-area: 1 / 1; /* all children stack on the same cell */
}

/* OUTPUT:
  Flexbox: excellent for components and one-axis alignment
  Grid:    excellent for full-page structures and 2D placement

  Rule of thumb:
    "Do the items define the layout?" → Flexbox
    "Does the layout define where items go?" → Grid */`,
        language: "css",
      },
    ],
  },
};

const iqPerformance: TopicNode = {
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

const iqAccessibility: TopicNode = {
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

const iqCSSVsSass: TopicNode = {
  id: "css-iq-css-vs-sass",
  title: "Modern CSS vs Sass",
  iconName: "GitMerge",
  theory:
    "With native CSS nesting, custom properties, and color functions, many classic Sass features are now available in plain CSS. Know when a preprocessor still adds value.",
  theoryDetail: {
    keyConcepts: [
      "CSS nesting is now baseline — supported in all modern browsers since 2024",
      "CSS custom properties replace Sass variables for runtime-mutable tokens",
      "Sass still wins for: @use/@forward module system, @mixin, @each/@for loops, and compile-time math",
    ],
    examples: [
      {
        title: "Q: Do we still need Sass in 2025?",
        description:
          "Side-by-side comparison of features now native in CSS versus where Sass still adds unique value.",
        code: `/* ─── Variables ─── */

/* Sass (compile-time only) */
$primary: #3b82f6;
.button { background: $primary; }

/* Modern CSS (runtime-mutable) — PREFER THIS */
:root { --primary: #3b82f6; }
.button { background: var(--primary); }
/* CSS variables can change at runtime; Sass variables cannot. */

/* ─── Nesting ─── */

/* Sass */
.card {
  padding: 16px;
  &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  & .title { font-size: 1.25rem; }
}

/* Modern CSS — identical syntax (baseline 2024) */
.card {
  padding: 16px;
  &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  & .title { font-size: 1.25rem; }
}

/* ─── Where Sass STILL wins ─── */

/* 1. Mixins — no native CSS equivalent */
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.hero { @include flex-center; }

/* 2. Loops — generate utility classes */
@each $size in sm, md, lg {
  .gap-#{$size} { gap: map.get($sizes, $size); }
}

/* 3. Module system */
@use 'tokens' as t;
.button { background: t.$primary; }

/* OUTPUT: For new projects, modern CSS handles 80% of
   what Sass provided. Sass still wins for large design
   systems with loops, mixins, and module boundaries. */`,
        language: "css",
      },
    ],
  },
};

export const cssInterviewQuestions: TopicNode = {
  id: "css-interview-questions",
  title: "Interview Questions",
  iconName: "HelpCircle",
  theory:
    "CSS interviews test both conceptual depth and practical problem-solving. Expect questions on the cascade, layout, specificity, performance, and accessibility. Strong answers include trade-offs and real scenarios.",
  theoryDetail: {
    keyConcepts: [
      "Explain concepts clearly: cascade order, specificity scoring, box model modes, stacking contexts",
      "Discuss trade-offs: Flexbox vs Grid, transitions vs keyframes, rem vs em vs px, CSS vs Sass",
      "Mention accessibility: focus management, reduced-motion, color contrast ratios",
      "Mention performance: which properties are GPU-composited, how to audit unused CSS",
    ],
    whyItMatters:
      "CSS interviews reveal whether a candidate writes maintainable, performant, and accessible styles — not just replicating a Figma mockup. These questions separate practitioners from guessers.",
    commonPitfalls: [
      "Memorising syntax without understanding why — interviewers always follow up with 'why not just use X?'",
      "Ignoring performance: animating layout properties, large paint areas, oversized stylesheets",
      "Not mentioning accessibility — focus styles and reduced-motion are expected at senior level",
    ],
  },
  children: [
    iqSpecificity,
    iqCentering,
    iqBFC,
    iqStacking,
    iqFlexboxVsGrid,
    iqPerformance,
    iqAccessibility,
    iqCSSVsSass,
  ],
};
