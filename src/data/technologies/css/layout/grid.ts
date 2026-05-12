import type { TopicNode } from "@/data/types";

export const cssGrid: TopicNode = {
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
      "Track sizing belongs to the container; item width is usually a smell in Grid layouts",
    ],
    whyItMatters:
      "Grid makes complex page layouts (sidebar + main + footer) declarative and responsive. minmax() with auto-fit creates fluid card grids without a single media query.",
    commonPitfalls: [
      "Using percentage widths instead of fr units — percentages ignore gap and can cause overflow",
      "Forgetting that grid-gap is now gap — the old shorthand still works but is deprecated",
      "Setting explicit row heights that don't accommodate dynamic content, causing overflow",
      "Using Grid for simple one-dimensional lists — Flexbox is the right tool there",
    ],
    comparisons: [
      {
        title: "Grid vs Flexbox",
        summary: "Grid is stronger when placement in both rows and columns matters more than content flow along a single axis.",
        points: [
          "Best for dashboards, page shells, galleries, pricing tables, and editorial layouts",
          "Tracks define structure first; items then occupy or span those tracks",
          "If items only need horizontal or vertical alignment, Grid is usually more configuration than necessary",
        ],
      },
      {
        title: "auto-fit vs auto-fill",
        summary: "Both create repeated tracks, but they differ once there is extra room left in the container.",
        points: [
          "auto-fit collapses unused tracks so existing items stretch and fill the row",
          "auto-fill preserves the empty tracks, which can be useful when you want a fixed rhythm",
          "For most card grids, auto-fit is the more intuitive default",
        ],
      },
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
}`,
        output: `| 1 | 2 | 3 |
| 4 | 5 | 6 |`,
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
`,
        output: `|----------- Header -----------|
| Sidebar |        Main       |
|----------- Footer -----------|`,
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
`,
        output: `|-- header -- header --|
| sidebar   |   main   |
|-- footer -- footer --|`,
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

/* auto-fill vs auto-fit difference:
   auto-fill: keeps empty column tracks (reserves space)
   auto-fit:  collapses empty tracks (items stretch to fill) */`,
        output: `1200px wide: [Card] [Card] [Card] [Card]
800px wide:  [Card] [Card] [Card]
500px wide:  [Card] [Card]
280px wide:  [Card]

Zero media queries. The track definition adapts on its own.`,
        language: "css",
      },
    ],
  },
};