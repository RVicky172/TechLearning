import type { TopicNode } from "@/data/types";
import { cssFlexbox } from "./flexbox";
import { cssGrid } from "./grid";
import { cssPositioning } from "./positioning";

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
      "A strong CSS layout usually starts with the smallest abstraction that solves the problem: Flexbox for axis alignment, Grid for explicit structure, positioning for overlays",
    ],
    whyItMatters:
      "Layout bugs are the most visible CSS problems. Mastering Flexbox, Grid, and positioning lets you build pixel-accurate UIs without hacks and express complex responsive designs in a handful of properties.",
    commonPitfalls: [
      "Using Flexbox for every layout including 2D grids — Grid is the right tool there",
      "Setting width on Grid items instead of using column tracks — tracks control the rhythm",
      "Forgetting that flex children become block-level and ignore display: inline",
    ],
    comparisons: [
      {
        title: "Choose Flexbox When",
        summary: "The layout problem is mainly about distribution and alignment on one axis.",
        points: [
          "Nav bars, forms, toolbars, breadcrumbs, button groups, and card rows",
          "You want items to grow, shrink, wrap, or push each other apart naturally",
          "You do not care about explicit row-to-row alignment across the whole section",
        ],
      },
      {
        title: "Choose Grid When",
        summary: "The layout problem is structural and you want deliberate row and column tracks.",
        points: [
          "Page shells, dashboards, galleries, pricing tables, and editorial blocks",
          "You need spanning, named areas, or consistent vertical rhythm across rows",
          "You want responsiveness to come from track sizing instead of many breakpoint overrides",
        ],
      },
      {
        title: "Choose Positioning When",
        summary: "An element must break out of normal flow or stay pinned to a viewport or container edge.",
        points: [
          "Badges, overlays, sticky headers, floating buttons, anchored menus, and tooltips",
          "Use it to layer or pin UI, not to fake a full layout system",
          "Combine it with Flexbox or Grid rather than replacing them",
        ],
      },
    ],
  },
  children: [cssFlexbox, cssGrid, cssPositioning],
};