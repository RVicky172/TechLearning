import type { TopicNode } from "@/data/types";

export const cssIqBfc: TopicNode = {
  id: "css-iq-bfc",
  title: "Block Formatting Context",
  iconName: "Box",
  theory:
    "BFC questions assess deep understanding of how layout contexts isolate float behaviour, margin collapse, and overflow.",
  theoryDetail: {
    keyConcepts: [
      "A BFC is an isolated layout region where internal floats are contained",
      "display: flow-root is the clean, no-side-effect way to create a BFC",
      "Margin collapse does NOT cross a BFC boundary",
    ],
    examples: [
      {
        title: "Q: What is a BFC and when does one form?",
        description:
          "A BFC is an isolated layout region. Floats are contained within it and margins don't collapse across its boundary.",
        code: `/* ─── What creates a BFC ─── */
display: flow-root;       /* modern, explicit, no side effects ✅ */
display: flex;            /* also a BFC */
display: grid;            /* also a BFC */
overflow: hidden;         /* classic hack — creates a BFC */
position: absolute | fixed;
float: left | right;
contain: layout | content | paint;

/* ─── Practical: contain floated children ─── */
/* HTML:
  <div class="container">
    <div class="float-left">Float</div>
    <p>Normal content</p>
  </div>
*/

/* WITHOUT BFC — container collapses to 0 height */
.container { background: lightblue; }

/* WITH BFC — container wraps around the float */
.container {
  background: lightblue;
  display: flow-root; /* ← establishes a BFC */
}

/* ─── Margin collapse prevention ─── */
.parent { overflow: hidden; } /* BFC prevents child margin from escaping */
.child  { margin-top: 24px; } /* stays INSIDE the parent, doesn't collapse out */`,
        language: "css",
      },
    ],
  },
};