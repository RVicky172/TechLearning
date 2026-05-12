import type { TopicNode } from "@/data/types";

export const cssIqUnitsViewport: TopicNode = {
  id: "css-iq-units-viewport",
  title: "Units, Viewport, and Sizing Bugs",
  iconName: "Expand",
  theory:
    "Strong CSS interviews often include unit trade-offs because they reveal how you think about accessibility, responsive design, and debugging overflow bugs.",
  theoryDetail: {
    keyConcepts: [
      "rem is usually the safest default for type and spacing scales because it respects the root font size",
      "em compounds based on the local font size, which is useful for self-scaling components but dangerous when you forget nesting",
      "% is container-relative on many layout properties, while viewport units ignore the container and look only at the viewport",
      "100vw and 100vh are common interview traps because they can create scrollbar overflow and mobile viewport bugs",
    ],
    examples: [
      {
        title: "Q: When do you use px, rem, em, %, and viewport units?",
        description:
          "A strong answer is not a definition list. It explains which unit you choose by default and where each one becomes risky.",
        code: `/* Good interview answer structure:

1. rem
   - Default for typography and spacing tokens
   - Respects root font-size and user preferences

2. em
   - Use when a component should scale relative to itself
   - Watch out for nesting because values compound

3. px
   - Good for borders, shadows, and tiny one-off details
   - Avoid as the default for all type and spacing

4. %
   - Good for widths, transforms, and component-relative sizing
   - Depends on the containing box or relevant property context

5. vw/vh/dvh
   - Good for viewport-level effects like heroes and display text
   - Avoid for nested component spacing and be careful on mobile

Interview shortcut:
"I default to rem for system sizing, use % and fr for layout,
use px for precision edges, and reach for dvh/vw only when
the design truly depends on the viewport." */`,
        language: "css",
      },
      {
        title: "Q: Why does width: 100vw or height: 100vh break layouts?",
        description:
          "This is a common senior-level debugging question because the fix requires understanding browser behavior, not memorizing syntax.",
        code: `/* width: 100vw problem */
.page-strip {
  width: 100vw;
}
/* 100vw often includes the scrollbar width, so the element
   can become slightly wider than the document and cause overflow. */

/* Better */
.page-strip {
  width: 100%;
}

/* height: 100vh problem */
.mobile-hero {
  min-height: 100vh;
}
/* On mobile browsers, the visible viewport changes when the
   address bar expands/collapses, so 100vh can be too tall. */

/* Better */
.mobile-hero {
  min-height: 100dvh;
}

/* Interview answer:
   100vw can cause horizontal scroll; 100vh can be unstable on mobile.
   Prefer 100% for layout width and 100dvh for full-height mobile sections. */`,
        language: "css",
      },
    ],
  },
};