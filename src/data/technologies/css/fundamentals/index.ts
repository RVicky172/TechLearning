import type { TopicNode } from "@/data/types";
import { cssSelectors } from "./selectors";
import { cssBoxModel } from "./boxModel";
import { cssCascade } from "./cascade";
import { cssUnits } from "./units";

export const cssFundamentals: TopicNode = { 
  id: "css-fundamentals",
  title: "CSS Fundamentals",
  iconName: "BookOpen",
  theory:
    "CSS (Cascading Style Sheets) controls how HTML elements look and are laid out. Understanding selectors, the cascade, the box model, and unit systems is essential before tackling layouts or animations.",
  theoryDetail: {
    keyConcepts: [
      "The cascade determines which rule wins when multiple rules target the same element",
      "Specificity ranks selectors: inline styles > IDs > classes/pseudo-classes > elements",
      "Inheritance lets properties like color and font-family flow from parent to child automatically",
      "The box model defines how content, padding, border, and margin compose an element's total size",
      "Unit choice determines whether styles scale relative to the root, parent, content, or viewport",
    ],
    whyItMatters:
      "Every CSS bug — from an override not working to a layout breaking on one browser — traces back to cascade, sizing, or the box model. Knowing these fundamentals lets you debug confidently instead of guessing.",
    commonPitfalls: [
      "Overusing !important to force overrides instead of fixing specificity properly",
      "Forgetting that non-inherited properties (border, padding) don't flow to children",
      "Mixing box-sizing: content-box and border-box causing sizing inconsistencies",
      "Choosing units by habit instead of intent, leading to poor zoom behavior or viewport bugs",
    ],
  },
  children: [cssSelectors, cssBoxModel, cssCascade, cssUnits],
};