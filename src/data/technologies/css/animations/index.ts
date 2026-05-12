import type { TopicNode } from "@/data/types";
import { cssTransitions } from "./transitions";
import { cssKeyframes } from "./keyframes";

export const cssAnimations: TopicNode = { 
  id: "css-animations",
  title: "Animations & Transitions",
  iconName: "Zap",
  theory:
    "CSS transitions animate property changes smoothly. Keyframe animations run independently of state changes. Both should respect prefers-reduced-motion to protect users with vestibular disorders.",
  theoryDetail: {
    keyConcepts: [
      "Transitions: triggered by state changes (:hover, class toggle) — simple two-value interpolation",
      "Keyframes: run on load or programmatically — multi-step, timing-controlled sequences",
      "Animate transform and opacity for GPU-composited, jank-free animations",
      "Always provide a prefers-reduced-motion alternative for infinite or large animations",
    ],
    whyItMatters:
      "Motion gives users feedback about state changes and guides attention. Subtle transitions make UIs feel polished. Done carelessly, animations create accessibility issues and performance problems.",
    commonPitfalls: [
      "Animating layout properties (height, margin, top) causing costly reflows on every frame",
      "Not wrapping animations in @media (prefers-reduced-motion: reduce)",
      "Using animation-fill-mode: forwards without understanding it keeps the final keyframe applied permanently",
    ],
  },
  children: [cssTransitions, cssKeyframes],
};