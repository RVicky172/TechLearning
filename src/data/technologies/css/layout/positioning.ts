import type { TopicNode } from "@/data/types";

export const cssPositioning: TopicNode = {
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
      "z-index only compares elements inside the same stacking context, so context creation matters as much as the number itself",
    ],
    whyItMatters:
      "Tooltips, dropdowns, modals, sticky headers, and floating action buttons all rely on correct positioning. Understanding containing blocks prevents the classic 'element jumps to the wrong place' bug.",
    commonPitfalls: [
      "Forgetting to set position: relative on the parent of an absolutely positioned child — it climbs the DOM to the viewport",
      "Using position: fixed without accounting for virtual keyboards on mobile (they resize the viewport)",
      "Overusing z-index without understanding stacking contexts — a z-index war usually signals a design issue",
    ],
    comparisons: [
      {
        title: "absolute vs fixed vs sticky",
        summary: "These modes all leave or alter normal flow, but they answer different positioning questions.",
        points: [
          "absolute: pin something inside a component such as a badge, close button, or tooltip anchor",
          "fixed: pin something to the viewport such as a global header, chat button, or back-to-top control",
          "sticky: keep something in normal document flow until scrolling reaches a threshold",
        ],
      },
      {
        title: "When not to Position",
        summary: "Positioning is not a substitute for layout systems.",
        points: [
          "If siblings need equal spacing or alignment, use Flexbox or Grid first",
          "If you only need a small decorative overlay, absolute is appropriate",
          "If many elements need custom coordinates, the design usually needs a stronger parent layout",
        ],
      },
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
}`,
        output: `+--------------[New]-+
|   Card content     |
+--------------------+

Without position: relative on .card, the badge can jump to the page instead.`,
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
}`,
        output: `Scroll table body downward:
[Name][Score]  <- stays pinned at the top
[Ada ] [98   ]
[Lin ] [95   ]
[Sam ] [91   ]

Sticky fails if an ancestor creates the wrong scroll container.`,
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
        output: `Unexpected result:
Sidebar appears above Modal

Reason:
Modal is trapped inside .modal-trigger's stacking context.

Fix:
Remove the accidental context or create the right one intentionally.`,
        language: "css",
      },
    ],
  },
};