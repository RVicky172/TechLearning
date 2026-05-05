import type { TopicNode } from "@/data/types";

const mediaQueries: TopicNode = {
  id: "css-media-queries",
  title: "Media Queries",
  iconName: "MonitorSmartphone",
  link: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries",
  theory:
    "Media queries apply CSS rules conditionally based on device characteristics like viewport width, height, orientation, or user preferences.",
  theoryDetail: {
    keyConcepts: [
      "@media (min-width: 768px) applies styles at 768 px and above — mobile-first approach",
      "prefers-color-scheme: dark detects OS dark mode preference",
      "prefers-reduced-motion: reduce identifies users who need less animation",
      "Range syntax (Level 4): @media (768px <= width < 1200px) replaces combined min/max queries",
      "Logical operators: and, or (comma), not combine conditions",
    ],
    whyItMatters:
      "Media queries are the main tool for adapting layouts to different screen sizes and user preferences. The prefers-* queries let you respect accessibility and OS-level settings without JavaScript.",
    commonPitfalls: [
      "Too many breakpoints creating a maintenance burden — prefer fluid layouts over pixel-perfect steps",
      "Using max-width queries on a mobile-first codebase, causing specificity confusion",
      "Forgetting the viewport <meta> tag in HTML — without it, mobile browsers zoom out and ignore media queries",
    ],
    examples: [
      {
        title: "Mobile-first breakpoints",
        description:
          "Write base styles for mobile, then progressively enhance for larger screens using min-width.",
        code: `/* ─── Base styles (mobile) ─── */
.container {
  padding: 16px;
}

.card-grid {
  display: grid;
  grid-template-columns: 1fr; /* single column on mobile */
  gap: 16px;
}

/* ─── Tablet: 768px and up ─── */
@media (min-width: 768px) {
  .container {
    padding: 24px;
  }

  .card-grid {
    grid-template-columns: repeat(2, 1fr); /* two columns */
  }
}

/* ─── Desktop: 1024px and up ─── */
@media (min-width: 1024px) {
  .container {
    padding: 40px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .card-grid {
    grid-template-columns: repeat(3, 1fr); /* three columns */
  }
}

/* OUTPUT mobile:  [Card]
   OUTPUT tablet:  [Card] [Card]
   OUTPUT desktop: [Card] [Card] [Card] */`,
        language: "css",
      },
      {
        title: "User preference queries",
        description: "Adapt to OS-level user preferences for accessibility and comfort.",
        code: `/* ─── Dark mode ─── */
:root {
  --bg: white;
  --text: black;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0d1117;
    --text: #e6edf3;
  }
}

body {
  background: var(--bg);
  color: var(--text);
}
/* OUTPUT: automatically switches to dark palette when
   the user has dark mode enabled in their OS settings */

/* ─── Reduced motion ─── */
.animated-icon {
  animation: spin 1s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animated-icon {
    animation: none; /* disable for vestibular disorder users */
  }
}

/* ─── Print ─── */
@media print {
  .sidebar, .nav { display: none; }
  body { font-size: 12pt; color: black; }
}`,
        language: "css",
      },
      {
        title: "Level 4 range syntax",
        description: "Cleaner syntax for bounded breakpoint ranges — no more min-width + max-width pairs.",
        code: `/* ─── Old syntax (Level 3) ─── */
@media (min-width: 768px) and (max-width: 1023px) {
  .sidebar { width: 200px; }
}

/* ─── New range syntax (Level 4) ─── */
@media (768px <= width < 1024px) {
  .sidebar { width: 200px; }
}

/* Other range operators */
@media (width >= 1200px) { /* same as min-width: 1200px */ }
@media (width <= 480px)  { /* same as max-width: 480px  */ }

/* Combining conditions */
@media (min-width: 768px) and (orientation: landscape) {
  .hero { height: 60vh; }
}`,
        language: "css",
      },
    ],
  },
};

const fluidTypography: TopicNode = {
  id: "css-fluid-typography",
  title: "Fluid Typography & clamp()",
  iconName: "Type",
  link: "https://developer.mozilla.org/en-US/docs/Web/CSS/clamp",
  theory:
    "clamp(min, preferred, max) creates values that scale with the viewport between a minimum and maximum. Combined with viewport units it produces truly fluid typography with no media queries.",
  theoryDetail: {
    keyConcepts: [
      "clamp(min, preferred, max) — value is clamped so it never exceeds min or max",
      "preferred value uses viewport units (vw) to scale with the viewport",
      "min() returns the smallest of its arguments; max() returns the largest",
      "Fluid spacing: padding: clamp(1rem, 5vw, 3rem) — scales with viewport, no breakpoints",
    ],
    whyItMatters:
      "Fluid typography eliminates font-size jumps at breakpoints, producing a smooth professional reading experience at every viewport size without dozens of @media rules.",
    commonPitfalls: [
      "Using only vw units without clamp() — text becomes unreadably small on phones or huge on TVs",
      "Forgetting to set a sensible minimum so text stays legible at the smallest expected size",
      "Not testing with browser zoom — clamp() with vw units doesn't scale with user zoom the way rem does",
    ],
    examples: [
      {
        title: "Fluid font scale with clamp()",
        description:
          "Define a type scale that smoothly scales between mobile and desktop without media queries.",
        code: `/* ─── Fluid type scale ─── */
:root {
  --text-sm:   clamp(0.875rem, 0.8rem + 0.375vw, 1rem);
  --text-base: clamp(1rem,     0.9rem + 0.5vw,   1.125rem);
  --text-lg:   clamp(1.125rem, 1rem   + 0.625vw, 1.25rem);
  --text-xl:   clamp(1.25rem,  1rem   + 1.25vw,  1.5rem);
  --text-2xl:  clamp(1.5rem,   1rem   + 2.5vw,   2.25rem);
  --text-3xl:  clamp(1.875rem, 1rem   + 4vw,     3rem);
}

h1 { font-size: var(--text-3xl); }
h2 { font-size: var(--text-2xl); }
p  { font-size: var(--text-base); }

/* OUTPUT at 320px  viewport: h1 = ~1.875rem (30px)
   OUTPUT at 768px  viewport: h1 = ~2.1rem   (33.6px)
   OUTPUT at 1440px viewport: h1 = 3rem       (48px)
   Smooth interpolation — no jumps at breakpoints */`,
        language: "css",
      },
      {
        title: "Fluid spacing",
        description: "Apply the same clamp() technique to padding and margins for proportional spacing.",
        code: `/* Fluid section padding — scales from 24px to 80px */
.section {
  padding-block: clamp(1.5rem, 5vw, 5rem);
}

/* Fluid gap in a grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: clamp(1rem, 3vw, 2rem);
}

/* min() and max() as building blocks */
.container {
  width: min(100%, 1200px); /* never wider than 1200px */
  margin: 0 auto;
  padding: 0 max(16px, 5vw); /* at least 16px padding */
}

/* OUTPUT: container is 1200px on wide screens,
   100% wide on narrow screens, with proportional padding */`,
        language: "css",
      },
    ],
  },
};

const containerQueries: TopicNode = {
  id: "css-container-queries",
  title: "Container Queries",
  iconName: "Layers",
  link: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries",
  theory:
    "Container queries let components respond to their own container's size instead of the viewport. This enables truly self-contained, reusable components that look correct in any context.",
  theoryDetail: {
    keyConcepts: [
      "container-type: inline-size registers an element as a query container",
      "@container (min-width: 400px) queries the nearest named or unnamed container",
      "container-name: card-container gives a container an explicit name for nested queries",
      "cqi, cqb — container query inline/block units (similar to vw/vh but relative to the container)",
    ],
    whyItMatters:
      "Media queries respond to the viewport, making component-level responsive design impossible without JavaScript. Container queries solve this — a card component can be wide in a sidebar and narrow in a modal without any layout-level knowledge.",
    commonPitfalls: [
      "Forgetting to set container-type: inline-size — without it, @container rules never apply",
      "Querying the container you're styling — a container cannot query itself; query its parent",
      "Using container queries for page-level layout — media queries are still the right tool there",
    ],
    examples: [
      {
        title: "Self-contained responsive card",
        description:
          "The card switches from a stacked to a side-by-side layout based on its container width, not the viewport.",
        code: `/* HTML:
  <div class="card-wrapper">          ← the container
    <article class="card">
      <img class="card-image" ...>
      <div class="card-body">...</div>
    </article>
  </div>
*/

/* 1. Register the wrapper as a container */
.card-wrapper {
  container-type: inline-size;
  container-name: card;
}

/* 2. Default (narrow) layout — stacked */
.card {
  display: grid;
  grid-template-columns: 1fr;
}

/* 3. When container is 500px or wider — side-by-side */
@container card (min-width: 500px) {
  .card {
    grid-template-columns: 200px 1fr;
  }

  .card-image {
    border-radius: 8px 0 0 8px;
  }
}

/* OUTPUT in narrow sidebar (300px):  [image over text]
   OUTPUT in main content (700px):    [image | text side-by-side]
   Same component, zero JS, responsive to its slot. */`,
        language: "css",
      },
    ],
  },
};

export const cssResponsive: TopicNode = {
  id: "css-responsive",
  title: "Responsive Design",
  iconName: "Smartphone",
  theory:
    "Responsive design makes web pages look good on any screen size. Mobile-first CSS, fluid typography, and flexible images are the three pillars of a robust responsive strategy.",
  theoryDetail: {
    keyConcepts: [
      "Mobile-first: write base styles for small screens, then expand with min-width media queries",
      "Viewport meta tag is required for correct scaling on mobile: <meta name='viewport' content='width=device-width, initial-scale=1'>",
      "clamp() enables fluid typography that scales between breakpoints without media queries",
      "Container queries make components responsive to their slot rather than the full viewport",
    ],
    whyItMatters:
      "Over 60% of web traffic is mobile. A responsive layout is not a nice-to-have — it is the baseline expectation for any production-grade website.",
    commonPitfalls: [
      "Desktop-first CSS with max-width queries — harder to maintain at scale",
      "Using fixed pixel widths for components instead of percentages, max-width, or grid tracks",
      "Testing only at one or two specific breakpoints instead of dragging the browser to every size",
    ],
  },
  children: [mediaQueries, fluidTypography, containerQueries],
};
