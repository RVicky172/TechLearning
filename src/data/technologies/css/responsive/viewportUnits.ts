import type { TopicNode } from "@/data/types";

export const cssViewportUnits: TopicNode = {
  id: "css-viewport-units",
  title: "Viewport Units & Mobile Sizing",
  iconName: "SmartphoneCharging",
  link: "https://developer.mozilla.org/en-US/docs/Web/CSS/length#viewport-percentage_lengths",
  theory:
    "Viewport units size elements relative to the browser viewport, but mobile browsers complicate the idea of 'the viewport' because the URL bar and browser chrome expand and collapse.",
  theoryDetail: {
    keyConcepts: [
      "vw and vh use the layout viewport, which can differ from the currently visible viewport on mobile",
      "svh = small viewport height, lvh = large viewport height, dvh = dynamic viewport height",
      "Use min-height: 100dvh for full-screen sections that should match the actually visible viewport",
      "Viewport units are ideal for hero sections, immersive panels, and type scales, but they are usually too blunt for nested components",
    ],
    whyItMatters:
      "Many 'broken on mobile Safari' bugs are really viewport-unit bugs. Understanding dvh, svh, and lvh avoids cropped heroes, jumpy layouts, and accidental overflow when browser UI changes size.",
    commonPitfalls: [
      "Using height: 100vh on mobile heroes and getting content hidden behind the browser chrome",
      "Using 100vw inside page layouts and causing extra horizontal scroll",
      "Using viewport units for small component spacing instead of container-relative units or rem",
    ],
    comparisons: [
      {
        title: "vh vs dvh vs svh",
        points: [
          "vh: legacy viewport height, often unstable on mobile browsers",
          "dvh: current visible viewport height, best default for app shells and heroes",
          "svh: guaranteed minimum visible viewport, useful when layout jumps are unacceptable",
        ],
      },
    ],
    examples: [
      {
        title: "Safer mobile hero sizing",
        description:
          "Prefer dynamic viewport height so the hero tracks the actual visible space as browser chrome changes.",
        code: `body {
  margin: 0;
}

.hero {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 2rem;
  background: linear-gradient(180deg, #eff6ff, #dbeafe);
}

@supports not (height: 100dvh) {
  .hero {
    min-height: 100vh;
  }
}

/* OUTPUT:
   The hero fills the visible screen height more reliably on mobile.
   When the browser bars expand or collapse, dvh tracks the change. */`,
        language: "css",
        preview: {
          html: `<section class="hero"><div><h2>Dynamic Viewport Height</h2><p>Use 100dvh for mobile full-screen sections.</p></div></section>`,
        },
      },
      {
        title: "Viewport units for fluid display text",
        description:
          "Combine viewport units with clamp() so headings scale fluidly without becoming absurdly small or large.",
        code: `.display-title {
  font-size: clamp(2rem, 5vw + 1rem, 4.5rem);
  line-height: 1.05;
}

.display-copy {
  max-width: 60ch;
  font-size: clamp(1rem, 1vw + 0.9rem, 1.25rem);
}

/* OUTPUT:
   Headings respond to the viewport width, but clamp() keeps them readable.
   The body copy uses ch to cap line length for better readability. */`,
        language: "css",
        preview: {
          html: `<section><h1 class="display-title">Viewport-aware heading</h1><p class="display-copy">Viewport units work best when combined with sensible minimums, maximums, and readable line lengths.</p></section>`,
        },
      },
    ],
  },
};