import type { TopicNode } from "@/data/types";

export const cssIqCentering: TopicNode = {
  id: "css-iq-centering",
  title: "Centering an Element",
  iconName: "AlignCenter",
  theory:
    "One of the most asked CSS questions. Know at least three approaches and when each is appropriate.",
  theoryDetail: {
    keyConcepts: [
      "Flexbox and Grid are the modern approaches — one or two properties each",
      "position + transform works when you cannot modify the parent",
      "margin: auto horizontally centers block elements with a defined width",
    ],
    examples: [
      {
        title: "Q: How do you center a div both horizontally and vertically?",
        description:
          "Multiple valid approaches exist. The modern answers are Flexbox and Grid.",
        code: `/* HTML: <div class="parent"><div class="child">Centered</div></div> */

/* ─── 1. Flexbox (most common modern approach) ─── */
.parent {
  display: flex;
  justify-content: center; /* horizontal */
  align-items: center;     /* vertical */
  height: 100vh;
}

/* ─── 2. Grid — one-liner ─── */
.parent {
  display: grid;
  place-items: center; /* shorthand for align-items + justify-items */
  height: 100vh;
}

/* ─── 3. Position + transform (no parent modification needed) ─── */
.parent { position: relative; height: 100vh; }

.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  /* Works regardless of child's width/height */
}

/* ─── 4. Margin auto (horizontal only, block elements) ─── */
.child {
  width: 600px;
  margin: 0 auto; /* left + right auto = centered */
}

/* OUTPUT: All four center the child inside the parent.
   Prefer Flexbox/Grid — they handle dynamic sizes and
   don't require knowing the child's dimensions. */`,
        language: "css",
      },
    ],
  },
};