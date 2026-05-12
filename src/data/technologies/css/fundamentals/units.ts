import type { TopicNode } from "@/data/types";

export const cssUnits: TopicNode = {
  id: "css-units",
  title: "CSS Units & Sizing",
  iconName: "Ruler",
  link: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Values_and_units",
  theory:
    "CSS units define how large something should be relative to the root font size, the parent, the viewport, or the content itself. Choosing the wrong unit is a common source of responsive and accessibility bugs.",
  theoryDetail: {
    keyConcepts: [
      "Absolute units: px is the most common on screens; it does NOT scale with the user's font-size preference",
      "Root-relative units: rem is based on the html font-size, so it is the safest default for typography and spacing systems",
      "Parent-relative units: em is based on the current element's font-size, which compounds in nested components",
      "% is relative to a containing box or inherited font-size depending on the property",
      "Content and viewport units such as ch, vw, vh, dvh, and svh are useful but easy to misuse if you don't understand what they reference",
    ],
    whyItMatters:
      "Unit choice affects readability, zoom behavior, layout stability, and mobile browser behavior. A good CSS system usually mixes rem for spacing/type, % or fr for layout, and modern viewport units for full-screen sections.",
    commonPitfalls: [
      "Using px everywhere, making the UI less adaptive to user zoom and root font-size changes",
      "Using em for component spacing without realizing nested components compound the value",
      "Using 100vw for full-width sections and accidentally including the scrollbar width, causing horizontal overflow",
      "Using vh on mobile for full-screen heroes when the browser UI changes the visible viewport height",
    ],
    comparisons: [
      {
        title: "rem vs em vs px",
        points: [
          "rem: consistent design-token unit for app-wide type and spacing",
          "em: useful when a component should scale with its own font-size",
          "px: useful for hairlines, borders, shadows, and exact raster-aligned details",
        ],
      },
      {
        title: "% vs vw/vh",
        points: [
          "% responds to the containing box, so it is better for components inside layouts",
          "vw/vh respond to the viewport, so they are better for page-level sizing effects",
          "dvh/svh/lvh are safer than plain vh for mobile full-height sections",
        ],
      },
    ],
    examples: [
      {
        title: "Choosing the right unit for typography and spacing",
        description:
          "A practical mix: rem for system spacing and text, em for component-local scaling, px for borders and shadows.",
        code: `:root {
  font-size: 16px;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
}

.card {
  padding: var(--space-6);
  border: 1px solid #cbd5e1;
  border-radius: 0.75rem;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
}

.card-title {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.card-note {
  font-size: 0.875em;
}

/* OUTPUT:
   rem keeps spacing and headings consistent across the app.
   em lets .card-note scale with the card's local font size.
   px is reserved for the border and shadow precision. */`,
        language: "css",
        preview: {
          html: `<article class="card"><h3 class="card-title">System Units</h3><p>Use rem for spacing and type tokens.</p><p class="card-note">This note is 0.875em relative to the card text.</p></article>`,
        },
      },
      {
        title: "Why 100vw often causes horizontal scroll",
        description:
          "100vw includes the scrollbar width in many browsers, so it can be slightly wider than the visible page.",
        code: `body {
  margin: 0;
}

.bad-banner {
  width: 100vw;
  padding: 1rem;
  background: #dbeafe;
}

.good-banner {
  width: 100%;
  padding: 1rem;
  background: #bfdbfe;
}

/* OUTPUT:
   .bad-banner may trigger horizontal overflow on pages with scrollbars.
   .good-banner fills the layout width without overshooting it. */`,
        language: "css",
        preview: {
          html: `<div class="preview-stack"><section class="bad-banner">width: 100vw can overshoot the page width</section><section class="good-banner">width: 100% respects the parent layout</section></div>`,
        },
      },
    ],
  },
};