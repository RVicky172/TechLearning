import type { TopicNode } from "@/data/types";

export const cssKeyframes: TopicNode = {
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
  },
};
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
        preview: {
          html: `<section><h1 class="hero-title">Launch faster</h1><p class="hero-subtitle">Motion guides the reading order.</p><button class="hero-cta">Get Started</button></section>`,
        },
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
        preview: {
          html: `<div class="preview-stack"><div class="spinner" aria-label="Loading..."></div><div class="skeleton" style="width:180px;height:14px"></div></div>`,
        },
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
        preview: {
          html: `<form><input class="input-error" value="Invalid email" /></form>`,
          css: `input{padding:10px 12px;border:2px solid #cbd5e1;border-radius:8px}`,
        },
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
        preview: {
          html: `<div class="preview-stack"><article class="reveal-on-scroll">First reveal card</article><article class="reveal-on-scroll">Second reveal card</article><article class="reveal-on-scroll">Third reveal card</article></div>`,
          css: `.reveal-on-scroll{padding:16px;border-radius:12px;background:white;border:1px solid #cbd5e1}`,
        },
      },
    ],
  },
};