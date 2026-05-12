import type { TopicNode } from "@/data/types";

export const cssIqFlexboxVsGrid: TopicNode = {
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