import type { TopicNode } from "@/data/types";

export const cssIqSpecificity: TopicNode = {
  id: "css-iq-specificity",
  title: "Specificity Scoring",
  iconName: "Target",
  theory: "A common warm-up question: calculate which rule wins and explain the scoring system.",
  theoryDetail: {
    keyConcepts: [
      "Specificity is scored as three buckets: (IDs, Classes/Attrs/Pseudo-classes, Elements/Pseudo-elements)",
      "!important overrides all specificity — avoid it; fix the selector instead",
      "Equal specificity defers to source order — the later declaration wins",
    ],
    examples: [
      {
        title: "Q: Which rule applies and why?",
        description:
          "Given these rules for the same element, calculate which color is rendered. Specificity is compared bucket-by-bucket left to right.",
        code: `/* HTML: <nav id="primary-nav"><a class="nav link active">Home</a></nav> */

/* (0,0,1,1) — element + class */
nav a { color: gray; }

/* (0,0,2,0) — two classes */
.nav .link { color: blue; }

/* (0,0,3,0) — three classes — BEATS two classes */
.nav .link.active { color: green; }

/* (0,1,0,0) — ID — BEATS all class selectors above */
#primary-nav a { color: purple; }

/* (0,1,1,0) — ID + class — highest specificity */
#primary-nav .link { color: red; }

/* OUTPUT: color is RED
   Scoring: (0,1,1,0) beats (0,1,0,0) beats (0,0,3,0) ...

   Tip: use browser DevTools → Computed → filter for 'color'
   to see which rule won and why it was struck through. */`,
        language: "css",
      },
      {
        title: "Q: Why doesn't my override work? How do you fix specificity wars?",
        description:
          "The correct fix is almost never !important. Restructure the selector or use CSS Layers.",
        code: `/* Problem: library adds a high-specificity rule */
.sidebar .widget .title { color: blue; }  /* (0,0,3,0) */

/* Your override has lower specificity — ignored */
.title { color: red; }                    /* (0,0,1,0) */

/* ❌ Wrong fix — !important escalates the war */
.title { color: red !important; }

/* ✅ Fix 1: Match or beat the specificity */
.sidebar .widget .title.custom { color: red; } /* (0,0,4,0) */

/* ✅ Fix 2: Use CSS Layers — utilities always win */
@layer base, utilities;

@layer base {
  .sidebar .widget .title { color: blue; }
}

@layer utilities {
  .title { color: red; } /* wins because 'utilities' > 'base' in layer order */
}

/* ✅ Fix 3: Use :where() to reduce library specificity to 0 */
:where(.sidebar .widget) .title { color: blue; } /* (0,0,1,0) */
/* Now .title { color: red; } (0,0,1,0) wins by source order */`,
        language: "css",
      },
    ],
  },
};