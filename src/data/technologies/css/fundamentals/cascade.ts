import type { TopicNode } from "@/data/types";

export const cssCascade: TopicNode = {
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
        preview: {
          html: `<div class="preview-stack"><p>Later paragraph rule wins</p><div class="parent" style="border:2px solid #0f172a;"><div class="child">Inherited border</div></div><button>Reverted Button</button></div>`,
        },
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
        preview: {
          html: `<div class="preview-stack"><a href="#" class="text-red">Layered utility link</a><a href="#">Unlayered link</a></div>`,
        },
      },
    ],
  },
};