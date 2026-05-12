import type { TopicNode } from "@/data/types";
import { cssIqSpecificity } from "./specificity";
import { cssIqCentering } from "./centering";
import { cssIqBfc } from "./bfc";
import { cssIqStacking } from "./stacking";
import { cssIqFlexboxVsGrid } from "./flexboxVsGrid";
import { cssIqPerformance } from "./performance";
import { cssIqAccessibility } from "./accessibility";
import { cssIqCssVsSass } from "./cssVsSass";
import { cssIqUnitsViewport } from "./unitsViewport";

export const cssInterviewQuestions: TopicNode = {
  id: "css-interview-questions",
  title: "Interview Questions",
  iconName: "HelpCircle",
  theory:
    "CSS interviews test both conceptual depth and practical problem-solving. Expect questions on the cascade, layout, specificity, sizing, performance, and accessibility. Strong answers include trade-offs, browser quirks, and real debugging scenarios.",
  theoryDetail: {
    keyConcepts: [
      "Explain concepts clearly: cascade order, specificity scoring, box model modes, stacking contexts",
      "Discuss trade-offs: Flexbox vs Grid, transitions vs keyframes, rem vs em vs px, CSS vs Sass",
      "Mention accessibility: focus management, reduced-motion, color contrast ratios",
      "Mention performance: which properties are GPU-composited, how to audit unused CSS",
      "Call out browser quirks: 100vw overflow, 100vh on mobile, and how dvh/svh improve viewport sizing",
    ],
    whyItMatters:
      "CSS interviews reveal whether a candidate writes maintainable, performant, and accessible styles — not just replicating a Figma mockup. These questions separate practitioners from guessers.",
    commonPitfalls: [
      "Memorising syntax without understanding why — interviewers always follow up with 'why not just use X?'",
      "Ignoring performance: animating layout properties, large paint areas, oversized stylesheets",
      "Not mentioning accessibility — focus styles and reduced-motion are expected at senior level",
      "Giving one-size-fits-all unit advice instead of explaining when rem, %, px, and viewport units are appropriate",
    ],
  },
  children: [
    cssIqSpecificity,
    cssIqCentering,
    cssIqBfc,
    cssIqStacking,
    cssIqFlexboxVsGrid,
    cssIqPerformance,
    cssIqAccessibility,
    cssIqCssVsSass,
    cssIqUnitsViewport,
  ],
};