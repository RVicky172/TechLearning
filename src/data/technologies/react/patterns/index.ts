import type { TopicNode } from "@/data/types";
import { hoc } from "./hoc";
import { renderProps } from "./renderProps";
import { portals } from "./portals";
import { lazyLoading } from "./lazyLoading";
import { errorBoundaries } from "./errorBoundaries";
import { testing } from "./testing";
import { forwardRef } from "./forwardRef";

export const reactPatterns: TopicNode = {
  id: "react-patterns-techniques",
  title: "Patterns & Techniques",
  iconName: "Shapes",
  theory:
    "Beyond the core building blocks, React has a rich set of patterns for solving recurring problems — code reuse, cross-cutting concerns, DOM escape hatches, resilience, and performance. These patterns range from legacy HOCs and render props to modern Portals, Error Boundaries, lazy loading, and ref forwarding.",
  theoryDetail: {
    keyConcepts: [
      "HOCs and render props are older patterns — still common in the ecosystem but usually replaceable with custom hooks",
      "Portals solve CSS constraint escaping — modals, tooltips, dropdowns that need to render above all other content",
      "Error Boundaries are the only way to gracefully catch rendering errors — every production app should have them",
      "React.lazy + Suspense is the standard way to code-split and improve initial load performance",
    ],
    whyItMatters:
      "Real production applications need more than just components and state. They need resilience (Error Boundaries), performance at scale (lazy loading), interoperability with the DOM (Portals, forwardRef), and ways to share cross-cutting logic across many components (HOCs, custom hooks). Mastering these patterns distinguishes senior React engineers.",
    commonPitfalls: [
      "Reaching for a pattern before the problem is clear — patterns add abstraction overhead; use them only when the problem is proven",
      "Mixing HOCs and hooks for the same concern — pick one approach per feature and stay consistent",
      "Forgetting accessibility in portals and modals — focus trapping, aria-modal, and keyboard navigation must be handled explicitly",
    ],
  },
  children: [hoc, renderProps, portals, lazyLoading, errorBoundaries, testing, forwardRef],
};
