import type { TopicNode } from "@/data/types";

const transitions: TopicNode = {
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

const keyframes: TopicNode = {
  id: "css-keyframes",
  title: "Keyframe Animations",
  iconName: "PlayCircle",
  link: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations",
  theory:
    "@keyframes define multi-step animations independent of user interaction. The animation property ties keyframes to an element with timing, iteration, and fill-mode control.",
  theoryDetail: {
    keyConcepts: [
      "@keyframes name { from { ... } to { ... } } — two-step shorthand",
      "@keyframes name { 0% { ... } 50% { ... } 100% { ... } } — percentage steps",
      "animation shorthand: name duration easing delay iteration-count direction fill-mode play-state",
      "animation-fill-mode: both — element holds the first frame before starting AND the last frame after ending",
      "animation-play-state: paused lets you pause/resume animations via CSS or JavaScript",
    ],
    whyItMatters:
      "Keyframe animations drive loaders, skeleton screens, attention pulses, and entrance animations — patterns that would otherwise require JavaScript timers or libraries.",
    commonPitfalls: [
      "Animating layout properties (width, height, top, left) instead of transform — triggers costly layout reflow",
      "Forgetting animation-fill-mode: both when the element should stay in its final state",
      "Not wrapping infinite animations in prefers-reduced-motion to protect vestibular disorder users",
    ],
    examples: [
      {
        title: "Entrance animations",
        description: "Fade in and slide up elements on page load for a polished appearance.",
        code: `/* ─── Define keyframes ─── */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* ─── Apply to elements ─── */
.hero-title {
  animation: fadeInUp 0.6s ease-out both;
  /* 'both' = holds first frame before start AND last frame after end */
}

.hero-subtitle {
  animation: fadeInUp 0.6s ease-out 0.15s both; /* 150ms delay */
}

.hero-cta {
  animation: fadeInUp 0.6s ease-out 0.3s both;  /* 300ms delay */
}

/* ─── Accessibility: disable for reduced-motion users ─── */
@media (prefers-reduced-motion: reduce) {
  .hero-title,
  .hero-subtitle,
  .hero-cta {
    animation: fadeIn 0.1s ease both; /* instant but valid */
  }
}

/* OUTPUT:
   0ms  → elements invisible
   0ms  → title fades + slides up over 600ms
   150ms→ subtitle starts animating
   300ms→ CTA button starts animating
   Staggered cascade effect, no JavaScript. */`,
        language: "css",
      },
      {
        title: "Loading spinner",
        description: "A GPU-accelerated infinite rotation animation using only transform.",
        code: `/* HTML: <div class="spinner" aria-label="Loading..."></div> */

@keyframes spin {
  to { transform: rotate(360deg); }
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  /* Only animating transform: rotate — GPU-composited, zero reflow */
}

/* Pulsing skeleton loader */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}

.skeleton {
  background: var(--bg-elevated);
  border-radius: 4px;
  animation: pulse 1.5s ease-in-out infinite;
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .spinner  { animation: none; border-top-color: var(--accent); }
  .skeleton { animation: none; opacity: 0.6; }
}`,
        language: "css",
      },
      {
        title: "Attention-grabbing animation",
        description: "A subtle shake animation to highlight validation errors.",
        code: `@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%       { transform: translateX(-8px); }
  40%       { transform: translateX(8px); }
  60%       { transform: translateX(-6px); }
  80%       { transform: translateX(6px); }
}

.input-error {
  border-color: red;
  animation: shake 0.5s ease-in-out;
  /* No 'infinite' — plays once on error, then stops */
}

/* Trigger via JavaScript — toggle class to replay */
form.addEventListener('submit', (e) => {
  if (!isValid(form)) {
    e.preventDefault();
    const field = form.querySelector('.input-error');
    field.classList.remove('input-error');

    // Force a reflow to allow the animation to replay
    void field.offsetWidth;
    field.classList.add('input-error');
  }
});

/* OUTPUT: invalid submit → field shakes once, turns red
   Subsequent invalid submits → shakes again each time */`,
        language: "css",
      },
      {
        title: "Scroll-driven animations (CSS-only)",
        description: "Animate elements based on scroll position without JavaScript IntersectionObserver.",
        code: `/* CSS Scroll-driven Animations API (Chrome 115+, Firefox 130+) */

@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.reveal-on-scroll {
  animation: reveal linear both;
  /* Link the animation to scroll position */
  animation-timeline: view();
  /* Play during entry/exit of the viewport */
  animation-range: entry 0% entry 40%;
}

/* OUTPUT: elements fade in as they scroll into view —
   purely CSS, no JavaScript required.
   Fallback for unsupported browsers: elements are visible
   (opacity: 1, transform: none in the final keyframe via 'both') */

/* Feature detection */
@supports (animation-timeline: scroll()) {
  .reveal-on-scroll { opacity: 0; } /* hide initially only if supported */
}`,
        language: "css",
      },
    ],
  },
};

export const cssAnimations: TopicNode = {
  id: "css-animations",
  title: "Animations & Transitions",
  iconName: "Zap",
  theory:
    "CSS transitions animate property changes smoothly. Keyframe animations run independently of state changes. Both should respect prefers-reduced-motion to protect users with vestibular disorders.",
  theoryDetail: {
    keyConcepts: [
      "Transitions: triggered by state changes (:hover, class toggle) — simple two-value interpolation",
      "Keyframes: run on load or programmatically — multi-step, timing-controlled sequences",
      "Animate transform and opacity for GPU-composited, jank-free animations",
      "Always provide a prefers-reduced-motion alternative for infinite or large animations",
    ],
    whyItMatters:
      "Motion gives users feedback about state changes and guides attention. Subtle transitions make UIs feel polished. Done carelessly, animations create accessibility issues and performance problems.",
    commonPitfalls: [
      "Animating layout properties (height, margin, top) causing costly reflows on every frame",
      "Not wrapping animations in @media (prefers-reduced-motion: reduce)",
      "Using animation-fill-mode: forwards without understanding it keeps the final keyframe applied permanently",
    ],
  },
  children: [transitions, keyframes],
};
