import type { TopicNode } from "@/data/types";

export const cssBoxModel: TopicNode = {
  id: "css-box-model",
  title: "The Box Model",
  iconName: "Square",
  link: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_box_model",
  theory:
    "Every HTML element is a rectangular box composed of content, padding, border, and margin. box-sizing controls whether width/height applies to the content area alone or includes padding and border.",
  theoryDetail: {
    keyConcepts: [
      "content-box (default): width = content only — padding and border add to the total size",
      "border-box: width includes content + padding + border — no math needed",
      "Margin collapse: adjacent vertical margins merge into the larger of the two",
      "outline is drawn outside the border and does NOT affect layout or box dimensions",
    ],
    whyItMatters:
      "Misunderstanding the box model is the root cause of most sizing bugs. Setting box-sizing: border-box globally eliminates a whole class of arithmetic errors and is the modern standard.",
    commonPitfalls: [
      "Forgetting that auto margins only work on block elements with a defined width",
      "Expecting margin-top to create space between a parent and its first child — margin collapses through the parent; use padding on the parent instead",
      "Not applying box-sizing: border-box globally, leading to inconsistent element sizes across the project",
    ],
    examples: [
      {
        title: "content-box vs border-box",
        description:
          "With content-box the total rendered width is larger than declared. With border-box it matches exactly.",
        code: `/* ─── content-box (browser default) ─── */
.box-content {
  box-sizing: content-box; /* default */
  width: 200px;
  padding: 20px;
  border: 2px solid;
}
/* Total rendered width = 200 + 20*2 + 2*2 = 244px  ← WIDER THAN DECLARED */

/* ─── border-box (recommended) ─── */
.box-border {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 2px solid;
}
/* Total rendered width = 200px  ← MATCHES DECLARATION */
/* Content area shrinks to: 200 - 40 - 4 = 156px */

/* Global reset — apply to every project */
*, *::before, *::after {
  box-sizing: border-box;
}`,
        language: "css",
        preview: {
          html: `<div class="preview-stack"><div class="box-content">content-box</div><div class="box-border">border-box</div></div>`,
        },
      },
      {
        title: "Margin collapse",
        description:
          "Vertical margins between siblings and between parent–child collapse into the larger value.",
        code: `/* HTML:
  <div class="first">First</div>
  <div class="second">Second</div>
*/

.first  { margin-bottom: 30px; }
.second { margin-top:    20px; }

/* OUTPUT: space between them = 30px (NOT 50px)
   The larger margin wins — they collapse */

/* ─── Parent–child collapse ─── */
/* HTML: <div class="parent"><p class="child">Text</p></div> */

.parent { background: lightblue; }
.child  { margin-top: 24px; }

/* OUTPUT: margin-top leaks out of the parent, pushing .parent down
   FIX: add padding-top: 1px or overflow: hidden to .parent */`,
        language: "css",
      },
    ],
  },
};