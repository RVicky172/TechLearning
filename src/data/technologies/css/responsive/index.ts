import type { TopicNode } from "@/data/types";
import { cssMediaQueries } from "./mediaQueries";
import { cssFluidTypography } from "./fluidTypography";
import { cssContainerQueries } from "./containerQueries";
import { cssViewportUnits } from "./viewportUnits";

export const cssResponsive: TopicNode = {
  id: "css-responsive",
  title: "Responsive Design",
  iconName: "Smartphone",
  theory:
    "Responsive design makes web pages look good on any screen size. Mobile-first CSS, fluid typography, and flexible images are the three pillars of a robust responsive strategy.",
  theoryDetail: {
    keyConcepts: [
      "Mobile-first: write base styles for small screens, then expand with min-width media queries",
      "Viewport meta tag is required for correct scaling on mobile: <meta name='viewport' content='width=device-width, initial-scale=1'>",
      "clamp() enables fluid typography that scales between breakpoints without media queries",
      "Container queries make components responsive to their slot rather than the full viewport",
      "Modern viewport units like dvh and svh solve many mobile full-height bugs that vh cannot",
    ],
    whyItMatters:
      "Over 60% of web traffic is mobile. A responsive layout is not a nice-to-have — it is the baseline expectation for any production-grade website.",
    commonPitfalls: [
      "Desktop-first CSS with max-width queries — harder to maintain at scale",
      "Using fixed pixel widths for components instead of percentages, max-width, or grid tracks",
      "Testing only at one or two specific breakpoints instead of dragging the browser to every size",
      "Using 100vh or 100vw blindly and triggering mobile viewport bugs or horizontal overflow",
    ],
  },
  children: [cssMediaQueries, cssFluidTypography, cssContainerQueries, cssViewportUnits],
};