import type { TopicNode } from "@/data/types";

export const cssTransitions: TopicNode = {
  id: "css-transitions",
  title: "Transitions",
  iconName: "ArrowRightLeft",
  link: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transitions",
  theory:
    "Transitions interpolate a CSS property from one value to another over a set duration when a change is triggered (e.g. by :hover or a class change via JavaScript).",
  theoryDetail: {
    keyConcepts: [
      "transition: property duration easing delay — each part is optional except duration",
      "Comma-separate multiple transitions: transition: color 0.2s ease, transform 0.3s ease",
      "Easing functions: ease, linear, ease-in, ease-out, ease-in-out, cubic-bezier(x1,y1,x2,y2)",
      "transition: all is convenient but expensive — explicitly list only the properties that change",
      "CSS transition-behavior: allow-discrete enables transitioning discrete properties like display",
    ],
    whyItMatters:
      "Hover states, focus rings, and theme switches all benefit from smooth transitions. A 200–300ms ease transition turns abrupt flips into polished micro-interactions with two lines of CSS.",
    commonPitfalls: [
      "Transitioning display: none — it is not animatable; use opacity or visibility instead",
      "Using durations longer than 500ms — the UI starts to feel sluggish",
      "Applying will-change: transform globally — overusing it wastes GPU memory",
    ],
    examples: [
      {
        title: "Button micro-interactions",
        description: "Smooth hover and focus states with multiple property transitions.",
        code: `/* HTML: <button class="btn">Save Changes</button> */

.btn {
  background: var(--color-primary, #3b82f6);
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  /* Explicitly list ONLY the properties that change */
  transition:
    background  0.2s ease,
    transform   0.15s ease,
    box-shadow  0.2s ease;
}

.btn:hover {
  background: #2563eb;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn:active {
  transform: scale(0.97);
  box-shadow: none;
}

/* OUTPUT:
  Default → blue, flat
  Hover   → darker blue + glow shadow (200ms ease)
  Click   → slight shrink (150ms ease)
  Release → returns to hover state */`,
        language: "css",
      },
      {
        title: "Theme switch transition",
        description: "Smooth dark/light mode transition across the whole page using custom properties.",
        code: `/* Apply transition on the token consumers, not on :root */
body,
.card,
.sidebar,
.header {
  transition:
    background-color 0.3s ease,
    color            0.3s ease,
    border-color     0.2s ease;
}

/* Tokens change instantly on :root */
[data-theme="light"] {
  --bg-surface: #ffffff;
  --text-1:     #0f172a;
  --border:     #e2e8f0;
}

[data-theme="dark"] {
  --bg-surface: #1e293b;
  --text-1:     #f1f5f9;
  --border:     #334155;
}

/* OUTPUT: toggling data-theme on <html> triggers a smooth
   300ms crossfade across all themed surfaces */`,
        language: "css",
        preview: {
          html: `<div data-theme="light"><article class="card"><h3>Theme card</h3><p>Transition token consumers, not the token declaration itself.</p></article></div>`,
        },
      },
      {
        title: "Transitioning height (the accordion problem)",
        description:
          "height: auto cannot be transitioned directly. Use max-height or the modern interpolate-size approach.",
        code: `/* HTML:
  <div class="accordion">
    <div class="accordion-content">Long content here...</div>
  </div>
*/

/* ─── Classic: max-height trick ─── */
.accordion-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease;
}

.accordion.open .accordion-content {
  max-height: 500px; /* must be larger than actual height */
}
/* Downside: the easing applies to max-height, not the
   visual height, so the animation feels slightly wrong. */

/* ─── Modern: interpolate-size (Chrome 129+) ─── */
:root {
  interpolate-size: allow-keywords;
}

.accordion-content {
  height: 0;
  overflow: hidden;
  transition: height 0.4s ease;
}

.accordion.open .accordion-content {
  height: auto; /* now animatable! */
}

/* OUTPUT: content smoothly expands from 0 to its natural
   height when the .open class is toggled. */`,
        language: "css",
      },
    ],
  },
};