import type { TopicNode } from "@/data/types";

export const cssFlexbox: TopicNode = {
  id: "css-flexbox",
  title: "Flexbox",
  iconName: "AlignLeft",
  link: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout",
  theory:
    "Flexbox arranges items along a single axis. The container controls direction, wrapping, and alignment; the items control their own growth and shrink behaviour.",
  theoryDetail: {
    keyConcepts: [
      "flex-direction: row | row-reverse | column | column-reverse — sets the main axis",
      "justify-content aligns along the main axis; align-items aligns along the cross axis",
      "flex: 1 is shorthand for flex-grow: 1; flex-shrink: 1; flex-basis: 0 — items share remaining space equally",
      "flex-wrap: wrap lets items spill onto the next line when they exceed container width",
      "gap (row-gap / column-gap) replaces margin hacks for spacing between flex children",
      "min-width: 0 is often required on flexible children so long text can actually shrink instead of overflowing",
    ],
    whyItMatters:
      "Flexbox replaced almost all float-based layouts. Its ability to distribute space and align items without fixed sizes makes it essential for nav bars, button groups, card rows, and any list of items.",
    commonPitfalls: [
      "Confusing justify-content (main axis) with align-items (cross axis) when flex-direction is column",
      "Not setting flex-wrap: wrap, causing overflow when items exceed container width",
      "Using flex: 1 on items expecting equal widths without min-width: 0 — long text can cause overflow",
      "Setting width on flex children instead of using flex-basis — basis is what flex respects",
    ],
    comparisons: [
      {
        title: "Flexbox vs Grid",
        summary: "Use Flexbox when the layout decision happens on one axis and items should distribute leftover space naturally.",
        points: [
          "Best for nav bars, toolbars, button groups, card rows, and vertical stacks",
          "Content can grow, shrink, wrap, and reorder without defining explicit columns or rows",
          "If you need row-and-column placement at the same time, switch to Grid",
        ],
      },
      {
        title: "Container-first Thinking",
        summary: "Most Flexbox bugs come from styling the item while the real decision belongs to the container.",
        points: [
          "Container decides axis, wrapping, and alignment with display, flex-direction, justify-content, and align-items",
          "Item decides its own space contract with flex-grow, flex-shrink, and flex-basis",
          "When spacing feels inconsistent, check gap before adding child margins",
        ],
      },
    ],
    examples: [
      {
        title: "Container properties",
        description: "Core properties that live on the flex container to control alignment and spacing.",
        code: `/* HTML:
  <nav class="navbar">
    <a>Home</a>
    <a>About</a>
    <a>Contact</a>
  </nav>
*/

.navbar {
  display: flex;

  /* Main axis (horizontal) alignment */
  justify-content: space-between;
  /* Options: flex-start | flex-end | center | space-between | space-around | space-evenly */

  /* Cross axis (vertical) alignment */
  align-items: center;
  /* Options: stretch (default) | flex-start | flex-end | center | baseline */

  gap: 16px;         /* space between children — no margin hacks */
  flex-wrap: wrap;   /* allow items to wrap to next line */
}`,
        output: `[Home]        [About]        [Contact]
<----------- space-between ----------->`,
        language: "css",
      },
      {
        title: "Item properties — grow, shrink, basis",
        description: "Control how individual flex items resize relative to their siblings.",
        code: `/* HTML:
  <div class="layout">
    <aside class="sidebar">Sidebar</aside>
    <main class="content">Main</main>
  </div>
*/

.layout {
  display: flex;
  gap: 24px;
  height: 100vh;
}

/* Sidebar: fixed width, won't grow or shrink */
.sidebar {
  flex: 0 0 240px;
  /* flex-grow: 0 | flex-shrink: 0 | flex-basis: 240px */
}

/* Main: takes ALL remaining space */
.content {
  flex: 1;
  /* flex-grow: 1 | flex-shrink: 1 | flex-basis: 0 */
  min-width: 0; /* prevent overflow if content is long */
}`,
        output: `|<-- 240px -->|<----------- flex: 1 ----------->|
|   Sidebar   |               Main               |`,
        language: "css",
      },
      {
        title: "Centering with Flexbox",
        description: "The simplest way to center an element both horizontally and vertically.",
        code: `/* HTML: <div class="card"><p>Centered</p></div> */

.card {
  display: flex;
  justify-content: center; /* horizontal center */
  align-items: center;     /* vertical center */
  width: 400px;
  height: 300px;
}

/* Shorthand using place-content (also works on Grid): */
.card-alt {
  display: flex;
  place-content: center;
}`,
        output: `+--------------------+
|                    |
|      Centered      |
|                    |
+--------------------+`,
        language: "css",
      },
      {
        title: "Responsive card row with wrap",
        description: "Cards fill the row and wrap to a new line on narrow viewports without media queries.",
        code: `/* HTML:
  <div class="card-row">
    <div class="card">Card 1</div>
    <div class="card">Card 2</div>
    <div class="card">Card 3</div>
  </div>
*/

.card-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.card {
  flex: 1 1 280px;
  /* grow: 1 | shrink: 1 | basis: 280px
     Each card is at least 280px wide.
     They grow equally to fill the row.
     They wrap when they don't fit. */
}`,
        output: `Wide viewport:
[Card 1]  [Card 2]  [Card 3]

Narrow viewport:
[Card 1]  [Card 2]
[Card 3]`,
        language: "css",
      },
    ],
  },
};