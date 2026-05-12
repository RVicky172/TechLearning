import type { TopicNode } from "@/data/types";

export const cssSelectors: TopicNode = { 
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
        preview: {
          html: `<div class="preview-stack"><p class="intro" id="hero">Specificity demo text</p><p class="intro">Class-only paragraph</p></div>`,
        },
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
        preview: {
          html: `<div class="preview-stack"><a href="https://example.com">Secure Link</a><a href="doc.pdf">Project Specs</a><button class="primary-btn">Action Button</button></div>`,
        },
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