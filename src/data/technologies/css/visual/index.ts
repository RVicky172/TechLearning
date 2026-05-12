import type { TopicNode } from "@/data/types";
import { cssCustomProperties } from "./customProperties";
import { cssTypography } from "./typography";
import { cssPseudoElements } from "./pseudoElements";
import { cssColors } from "./colors";

export const cssVisual: TopicNode = {
  id: "css-visual",
  title: "Visual Styling",
  iconName: "Palette",
  theory:
    "Beyond layout, CSS controls every visual detail: color, typography, shadows, and borders. CSS custom properties (variables) make large design systems maintainable by centralizing design tokens.",
  theoryDetail: {
    keyConcepts: [
      "CSS custom properties (--name: value) are inherited, composable, and changeable at runtime with JavaScript",
      "oklch() provides perceptually uniform color and access to wider P3 display gamuts",
      "text-wrap: balance and text-wrap: pretty improve multi-line heading aesthetics",
    ],
    whyItMatters:
      "Consistent visual design at scale requires a token system. CSS custom properties are the native mechanism — they keep typography, spacing, and color coherent without a CSS-in-JS library.",
    commonPitfalls: [
      "Hardcoding hex values throughout the codebase instead of referencing design tokens",
      "Forgetting that custom properties are case-sensitive: --Color is different from --color",
      "Over-nesting selectors — native CSS nesting now works in all modern browsers",
    ],
  },
  children: [cssCustomProperties, cssTypography, cssPseudoElements, cssColors],
};