import type { TopicNode } from "@/data/types";

const selectors: TopicNode = {
  id: "css-selectors",
  title: "Selectors & Specificity",
  iconName: "Target",
  link: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors",
  theory:
    "Selectors target HTML elements. Specificity is the algorithm browsers use to determine which rule wins when multiple selectors match the same element.",
  theoryDetail: {
    keyConcepts: [
      "Selector types by specificity (low → high): element (0,0,1), class/attribute/pseudo-class (0,1,0), ID (1,0,0), inline style (inline)",
      "Combinators: descendant (space), child (>), adjacent sibling (+), general sibling (~)",
      "Attribute selectors: [attr], [attr='val'], [attr^='val'] starts-with, [attr$='val'] ends-with, [attr*='val'] contains",
      ":is() and :where() accept selector lists — :where() contributes zero specificity, making overrides safe",
    ],
    whyItMatters:
      "Understanding specificity prevents the common frustration of writing a rule that appears to 'not work'. It always loses to a higher-specificity rule. Knowing the scoring system lets you write predictable, debuggable CSS.",
    commonPitfalls: [
      "Chaining too many selectors creating brittle, over-specific rules that are hard to override later",
      "Relying on source order rather than intentional specificity to control rule priority",
      "Not using :is() or :where() to simplify long selector lists",
    ],
    examples: [
      {
        title: "Specificity scoring in practice",
        description:
          "Each selector gets a score (IDs, Classes, Elements). Higher score wins regardless of source order.",
        code: `/* (0,0,1) — element selector */
p { color: black; }

/* (0,1,0) — class selector — beats element */
.intro { color: gray; }

/* (0,1,1) — class + element */
p.intro { color: blue; }

/* (1,0,0) — ID selector — beats everything above */
#hero { color: red; }

/* (0,0,0) — :where() adds ZERO specificity — always overridable */
:where(p, li, h1) { margin: 0; }

/* OUTPUT: a <p class="intro" id="hero"> element will be RED
   because the ID selector (1,0,0) beats class+element (0,1,1) */`,
        language: "css",
      },
      {
        title: "Attribute selectors",
        description: "Style elements based on attribute presence or value patterns.",
        code: `/* Matches any <a> with an href */
a[href] { text-decoration: underline; }

/* Matches <a href="https://..."> — starts with https */
a[href^="https"] { color: green; }

/* Matches <a href="...pdf"> — ends with pdf */
a[href$=".pdf"]::after { content: " (PDF)"; }

/* Matches any element whose class contains "btn" */
[class*="btn"] { border-radius: 4px; }

/* OUTPUT: <a href="https://example.com"> → green underlined link
   <a href="doc.pdf"> → link with " (PDF)" appended after it */`,
        language: "css",
      },
      {
        title: "Combinators",
        description: "Control which descendants are targeted with combinators.",
        code: `/* HTML:
  <nav>
    <ul>
      <li><a class="link">Home</a></li>
      <li><a class="link">About</a></li>
    </ul>
  </nav>
  <a class="link">Footer link</a>
*/

/* Descendant — all .link inside nav (both list links) */
nav .link { color: blue; }

/* Child — only direct children of ul */
ul > li { list-style: none; }

/* Adjacent sibling — <a> immediately after a <li> */
li + a { margin-left: 8px; }

/* General sibling — every <a> that follows a <li> */
li ~ a { opacity: 0.6; }

/* OUTPUT: nav .link targets both <a> inside nav
   ul > li only matches <li>, not deeper nested items */`,
        language: "css",
      },
    ],
  },
};

const boxModel: TopicNode = {
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

const cascade: TopicNode = {
  id: "css-cascade",
  title: "Cascade & Inheritance",
  iconName: "GitMerge",
  link: "https://developer.mozilla.org/en-US/docs/Web/CSS/Cascade",
  theory:
    "The cascade combines origin, specificity, and source order to decide which declaration wins. Inheritance lets certain properties propagate through the DOM tree automatically.",
  theoryDetail: {
    keyConcepts: [
      "Cascade priority (high → low): !important user-agent → !important author → author styles → user agent defaults",
      "Inheritable properties: color, font-*, line-height, text-align, visibility, cursor",
      "Non-inheritable properties: margin, padding, border, background, width, height",
      "Keywords: inherit (force inheritance), initial (reset to spec default), unset (inherit if inheritable else initial), revert (browser default)",
      "@layer lets you define cascade layers — rules in later layers beat earlier ones at the same specificity",
    ],
    whyItMatters:
      "Knowing what the cascade prioritises lets you write CSS that overrides in a predictable direction rather than an escalating war of !important declarations.",
    commonPitfalls: [
      "Adding !important to fix a specificity problem — address the root selector instead",
      "Assuming all properties inherit — border, padding, and background do NOT",
      "Not using @layer in design systems, making third-party overrides difficult",
    ],
    examples: [
      {
        title: "Cascade order and override keywords",
        description:
          "Source order breaks ties when specificity is equal. Keyword values give explicit control.",
        code: `/* Both are (0,0,1) — source order decides: SECOND rule wins */
p { color: blue; }
p { color: red; }   /* OUTPUT: red */

/* inherit — force a non-inheritable property to inherit */
.child {
  border: inherit; /* takes parent's border value */
}

/* initial — reset to CSS spec default (not browser default) */
.reset {
  color: initial;        /* → black (spec default for color) */
  display: initial;      /* → inline */
}

/* unset — inherits if the property inherits, else initial */
.unset-demo {
  color: unset;    /* inherits (color IS inheritable) */
  border: unset;   /* initial (border is NOT inheritable) */
}

/* revert — restores browser user-agent stylesheet value */
button {
  all: revert; /* strips all custom styles, back to browser defaults */
}`,
        language: "css",
      },
      {
        title: "Cascade Layers (@layer)",
        description:
          "Layers let you explicitly order specificity groups — later layers always beat earlier ones.",
        code: `/* Declare layer order — utilities always wins */
@layer base, components, utilities;

@layer base {
  a { color: blue; }          /* specificity (0,0,1) */
}

@layer utilities {
  .text-red { color: red; }   /* specificity (0,1,0) */
}

/* OUTPUT: .text-red wins NOT because of higher specificity
   but because 'utilities' is declared after 'base' */

/* Unlayered styles are always above all layers */
a { color: green; } /* beats everything in @layer */`,
        language: "css",
      },
    ],
  },
};

export const cssFundamentals: TopicNode = {
  id: "css-fundamentals",
  title: "CSS Fundamentals",
  iconName: "BookOpen",
  theory:
    "CSS (Cascading Style Sheets) controls how HTML elements look and are laid out. Understanding the cascade, specificity, and the box model is essential before tackling layouts or animations.",
  theoryDetail: {
    keyConcepts: [
      "The cascade determines which rule wins when multiple rules target the same element",
      "Specificity ranks selectors: inline styles > IDs > classes/pseudo-classes > elements",
      "Inheritance lets properties like color and font-family flow from parent to child automatically",
      "The box model defines how content, padding, border, and margin compose an element's total size",
    ],
    whyItMatters:
      "Every CSS bug — from an override not working to a layout breaking on one browser — traces back to cascade, specificity, or the box model. Knowing these fundamentals lets you debug confidently instead of guessing.",
    commonPitfalls: [
      "Overusing !important to force overrides instead of fixing specificity properly",
      "Forgetting that non-inherited properties (border, padding) don't flow to children",
      "Mixing box-sizing: content-box and border-box causing sizing inconsistencies",
    ],
  },
  children: [selectors, boxModel, cascade],
};
