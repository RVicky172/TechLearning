import type { TopicNode } from "@/data/types";

const flexbox: TopicNode = {
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
    ],
    whyItMatters:
      "Flexbox replaced almost all float-based layouts. Its ability to distribute space and align items without fixed sizes makes it essential for nav bars, button groups, card rows, and any list of items.",
    commonPitfalls: [
      "Confusing justify-content (main axis) with align-items (cross axis) when flex-direction is column",
      "Not setting flex-wrap: wrap, causing overflow when items exceed container width",
      "Using flex: 1 on items expecting equal widths without min-width: 0 — long text can cause overflow",
      "Setting width on flex children instead of using flex-basis — basis is what flex respects",
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
}

/* OUTPUT:
  [Home]        [About]        [Contact]
  ←————————— space-between ——————————→  */`,
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
}

/* OUTPUT:
  |<——240px——>|<——————————flex: 1——————————>|
  |  Sidebar  |           Main              | */`,
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
}

/* OUTPUT:
  +————————————————————+
  |                    |
  |     Centered       |
  |                    |
  +————————————————————+ */`,
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
}

/* OUTPUT (wide viewport):  [Card 1]  [Card 2]  [Card 3]
   OUTPUT (narrow viewport): [Card 1]  [Card 2]
                              [Card 3]            */`,
        language: "css",
      },
    ],
  },
};

const grid: TopicNode = {
  id: "css-grid",
  title: "CSS Grid",
  iconName: "Grid",
  link: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout",
  theory:
    "Grid layout defines rows and columns explicitly and places items into cells. It is the most powerful CSS layout system for two-dimensional designs.",
  theoryDetail: {
    keyConcepts: [
      "grid-template-columns: repeat(3, 1fr) creates three equal columns using fractional units",
      "grid-column and grid-row let items span multiple tracks: grid-column: 1 / 3",
      "grid-template-areas creates named zones — assign items with grid-area: name",
      "auto-fill vs auto-fit: auto-fill keeps empty tracks; auto-fit collapses them",
      "minmax(min, max) sets a track's minimum and maximum size — key for responsive grids without media queries",
    ],
    whyItMatters:
      "Grid makes complex page layouts (sidebar + main + footer) declarative and responsive. minmax() with auto-fit creates fluid card grids without a single media query.",
    commonPitfalls: [
      "Using percentage widths instead of fr units — percentages ignore gap and can cause overflow",
      "Forgetting that grid-gap is now gap — the old shorthand still works but is deprecated",
      "Setting explicit row heights that don't accommodate dynamic content, causing overflow",
      "Using Grid for simple one-dimensional lists — Flexbox is the right tool there",
    ],
    examples: [
      {
        title: "Basic grid — equal columns",
        description: "Create a three-column grid where all columns share available space equally.",
        code: `/* HTML:
  <div class="grid">
    <div>1</div><div>2</div><div>3</div>
    <div>4</div><div>5</div><div>6</div>
  </div>
*/

.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* = 1fr 1fr 1fr — three equal columns */
  gap: 16px;
}

/* OUTPUT:
  | 1 | 2 | 3 |
  | 4 | 5 | 6 | */`,
        language: "css",
      },
      {
        title: "Spanning items across tracks",
        description: "Items can span multiple columns or rows using grid-column / grid-row.",
        code: `/* HTML:
  <div class="grid">
    <header class="header">Header</header>
    <aside class="sidebar">Sidebar</aside>
    <main class="main">Main</main>
    <footer class="footer">Footer</footer>
  </div>
*/

.grid {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 16px;
  min-height: 100vh;
}

.header { grid-column: 1 / -1; }  /* span ALL columns */
.sidebar { grid-row: 2; }
.main    { grid-row: 2; }
.footer  { grid-column: 1 / -1; } /* span ALL columns */

/* OUTPUT:
  |——————————Header——————————|
  | Sidebar |      Main      |
  |——————————Footer——————————| */`,
        language: "css",
      },
      {
        title: "Named template areas",
        description: "ASCII-art syntax makes complex layouts self-documenting.",
        code: `.page {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 60px 1fr 50px;
  grid-template-areas:
    "header  header"
    "sidebar main"
    "footer  footer";
  min-height: 100vh;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }

/* OUTPUT:
  |—header——header—|
  |sidebar |  main |
  |—footer——footer—| */`,
        language: "css",
      },
      {
        title: "Responsive auto-fit grid — no media queries",
        description:
          "auto-fit + minmax() creates a grid that automatically adjusts column count as the viewport narrows.",
        code: `.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

/* OUTPUT (1200px wide): [Card][Card][Card][Card]
   OUTPUT (800px wide):  [Card][Card][Card]
   OUTPUT (500px wide):  [Card][Card]
   OUTPUT (280px wide):  [Card]

   Zero media queries — the grid self-organises. */

/* auto-fill vs auto-fit difference:
   auto-fill: keeps empty column tracks (reserves space)
   auto-fit:  collapses empty tracks (items stretch to fill) */`,
        language: "css",
      },
    ],
  },
};

const positioning: TopicNode = {
  id: "css-positioning",
  title: "Positioning",
  iconName: "Move",
  link: "https://developer.mozilla.org/en-US/docs/Web/CSS/position",
  theory:
    "The position property controls how an element is removed from or kept in normal document flow. Absolute, fixed, and sticky each serve distinct UI patterns.",
  theoryDetail: {
    keyConcepts: [
      "static (default): follows normal flow; top/left/right/bottom have no effect",
      "relative: offsets from its normal position WITHOUT leaving the flow — still occupies space",
      "absolute: removed from flow, placed relative to the nearest positioned (non-static) ancestor",
      "fixed: removed from flow, positioned relative to the viewport — stays on screen when scrolling",
      "sticky: treated as relative until a scroll threshold, then acts as fixed within its scroll container",
    ],
    whyItMatters:
      "Tooltips, dropdowns, modals, sticky headers, and floating action buttons all rely on correct positioning. Understanding containing blocks prevents the classic 'element jumps to the wrong place' bug.",
    commonPitfalls: [
      "Forgetting to set position: relative on the parent of an absolutely positioned child — it climbs the DOM to the viewport",
      "Using position: fixed without accounting for virtual keyboards on mobile (they resize the viewport)",
      "Overusing z-index without understanding stacking contexts — a z-index war usually signals a design issue",
    ],
    examples: [
      {
        title: "relative vs absolute containing block",
        description:
          "absolute searches up the DOM for the nearest positioned ancestor. Always set position: relative on the parent.",
        code: `/* HTML:
  <div class="card">
    <span class="badge">New</span>
    <p>Card content</p>
  </div>
*/

.card {
  position: relative; /* ← establishes containing block */
  width: 300px;
}

.badge {
  position: absolute;
  top: 8px;
  right: 8px;
  /* Positioned relative to .card, NOT the page */
}

/* OUTPUT:
  +——————————[New]—+
  |  Card content  |
  +————————————————+

  Without position: relative on .card, the badge
  would anchor to the nearest positioned ancestor
  (possibly <body>), jumping to a random position. */`,
        language: "css",
      },
      {
        title: "sticky — scroll-aware positioning",
        description:
          "An element acts as relative until it hits the scroll threshold, then sticks in place within its parent.",
        code: `/* HTML:
  <div class="table-container">
    <table>
      <thead>
        <tr class="header-row"><th>Name</th><th>Score</th></tr>
      </thead>
      <tbody>...</tbody>
    </table>
  </div>
*/

.header-row th {
  position: sticky;
  top: 0;           /* sticks when the top of the element hits top: 0 */
  background: white;
  z-index: 1;
}

/* OUTPUT:
  Scrolling the table → header row "sticks" at the top
  of the viewport while row data scrolls underneath.

  NOTE: sticky only works if no ancestor has overflow: hidden
  or overflow: auto — those create a new scroll container. */`,
        language: "css",
      },
      {
        title: "Stacking context and z-index",
        description:
          "z-index only works within the same stacking context. Properties like opacity < 1 and transform create new contexts.",
        code: `/* HTML:
  <div class="modal-trigger">
    <div class="modal">Modal</div>    ← z-index: 100
  </div>
  <div class="sidebar">Sidebar</div>  ← z-index: 10
*/

/* PROBLEM: modal is trapped inside a stacking context */
.modal-trigger {
  opacity: 0.99;      /* ← creates a new stacking context! */
  position: relative;
}

.modal {
  position: absolute;
  z-index: 100;       /* only competes within .modal-trigger's context */
}

.sidebar {
  position: relative;
  z-index: 10;        /* in the ROOT context — beats .modal */
}

/* FIX 1: remove opacity (or use filter: opacity()) from trigger */
/* FIX 2: use isolation: isolate to explicitly declare intent */
.modal-root {
  isolation: isolate; /* creates a context without visual side-effects */
}`,
        language: "css",
      },
    ],
  },
};

export const cssLayout: TopicNode = {
  id: "css-layout",
  title: "Layout",
  iconName: "Layout",
  theory:
    "Modern CSS layout is built on Flexbox and Grid. Together they replace hacks involving floats, tables, and inline-block. Understanding when to use each is a core professional skill.",
  theoryDetail: {
    keyConcepts: [
      "Flexbox is one-dimensional — ideal for rows or columns of items that grow and shrink",
      "Grid is two-dimensional — ideal for page regions and explicit placement in rows and columns",
      "Both can be combined: Grid handles the macro page layout while Flex handles component internals",
      "Positioning (absolute, fixed, sticky) handles elements that need to escape normal document flow",
    ],
    whyItMatters:
      "Layout bugs are the most visible CSS problems. Mastering Flexbox, Grid, and positioning lets you build pixel-accurate UIs without hacks and express complex responsive designs in a handful of properties.",
    commonPitfalls: [
      "Using Flexbox for every layout including 2D grids — Grid is the right tool there",
      "Setting width on Grid items instead of using column tracks — tracks control the rhythm",
      "Forgetting that flex children become block-level and ignore display: inline",
    ],
  },
  children: [flexbox, grid, positioning],
};
