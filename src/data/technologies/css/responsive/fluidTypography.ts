import type { TopicNode } from "@/data/types";

export const cssFluidTypography: TopicNode = { 
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
        preview: {
          html: `<article><h1>Fluid Heading</h1><h2>Supporting heading</h2><p>This paragraph scales smoothly with clamp() instead of snapping at breakpoints.</p></article>`,
        },
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
        preview: {
          html: `<section class="section"><div class="container"><div class="card-grid"><div class="card">One</div><div class="card">Two</div><div class="card">Three</div></div></div></section>`,
          css: `.card{padding:16px;border-radius:10px;background:white;border:1px solid #cbd5e1}`,
        },
      },
    ],
  },
};