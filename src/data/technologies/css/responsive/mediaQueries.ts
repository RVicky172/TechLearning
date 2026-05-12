import type { TopicNode } from "@/data/types";

export const cssMediaQueries: TopicNode = {
  id: "css-media-queries",
  title: "Media Queries",
  iconName: "MonitorSmartphone",
  link: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries",
  theory:
    "Media queries apply CSS rules conditionally based on device characteristics like viewport width, height, orientation, or user preferences.",
  theoryDetail: {
    keyConcepts: [
      "@media (min-width: 768px) applies styles at 768 px and above — mobile-first approach",
      "prefers-color-scheme: dark detects OS dark mode preference",
      "prefers-reduced-motion: reduce identifies users who need less animation",
      "Range syntax (Level 4): @media (768px <= width < 1200px) replaces combined min/max queries",
      "Logical operators: and, or (comma), not combine conditions",
    ],
    whyItMatters:
      "Media queries are the main tool for adapting layouts to different screen sizes and user preferences. The prefers-* queries let you respect accessibility and OS-level settings without JavaScript.",
    commonPitfalls: [
      "Too many breakpoints creating a maintenance burden — prefer fluid layouts over pixel-perfect steps",
      "Using max-width queries on a mobile-first codebase, causing specificity confusion",
      "Forgetting the viewport <meta> tag in HTML — without it, mobile browsers zoom out and ignore media queries",
    ],
    examples: [
      {
        title: "Mobile-first breakpoints",
        description:
          "Write base styles for mobile, then progressively enhance for larger screens using min-width.",
        code: `/* ─── Base styles (mobile) ─── */
.container {
  padding: 16px;
}

.card-grid {
  display: grid;
  grid-template-columns: 1fr; /* single column on mobile */
  gap: 16px;
}

/* ─── Tablet: 768px and up ─── */
@media (min-width: 768px) {
  .container {
    padding: 24px;
  }

  .card-grid {
    grid-template-columns: repeat(2, 1fr); /* two columns */
  }
}

/* ─── Desktop: 1024px and up ─── */
@media (min-width: 1024px) {
  .container {
    padding: 40px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .card-grid {
    grid-template-columns: repeat(3, 1fr); /* three columns */
  }
}

/* OUTPUT mobile:  [Card]
   OUTPUT tablet:  [Card] [Card]
   OUTPUT desktop: [Card] [Card] [Card] */`,
        language: "css",
        preview: {
          html: `<div class="container"><div class="card-grid"><article class="card">Card 1</article><article class="card">Card 2</article><article class="card">Card 3</article></div></div>`,
          css: `.card{background:white;border:1px solid #cbd5e1;border-radius:12px;padding:20px;min-height:72px;}`,
        },
      },
      {
        title: "User preference queries",
        description: "Adapt to OS-level user preferences for accessibility and comfort.",
        code: `/* ─── Dark mode ─── */
  },
};
  --text: black;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0d1117;
    --text: #e6edf3;
  }
}

body {
  background: var(--bg);
  color: var(--text);
}
/* OUTPUT: automatically switches to dark palette when
   the user has dark mode enabled in their OS settings */

/* ─── Reduced motion ─── */
.animated-icon {
  animation: spin 1s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animated-icon {
    animation: none; /* disable for vestibular disorder users */
  }
}

/* ─── Print ─── */
@media print {
  .sidebar, .nav { display: none; }
  body { font-size: 12pt; color: black; }
}`,
        language: "css",
        preview: {
          html: `<div class="theme-card"><div class="animated-icon">↻</div><p>Theme-aware surface</p><small>Try your OS dark mode and reduced motion settings.</small></div>`,
        },
      },
      {
        title: "Level 4 range syntax",
        description: "Cleaner syntax for bounded breakpoint ranges — no more min-width + max-width pairs.",
        code: `/* ─── Old syntax (Level 3) ─── */
@media (min-width: 768px) and (max-width: 1023px) {
  .sidebar { width: 200px; }
}

/* ─── New range syntax (Level 4) ─── */
@media (768px <= width < 1024px) {
  .sidebar { width: 200px; }
}

/* Other range operators */
@media (width >= 1200px) { /* same as min-width: 1200px */ }
@media (width <= 480px)  { /* same as max-width: 480px  */ }

/* Combining conditions */
@media (min-width: 768px) and (orientation: landscape) {
  .hero { height: 60vh; }
}`,
        language: "css",
        preview: {
          html: `<aside class="sidebar">Sidebar track adjusts inside this viewport size range.</aside>`,
        },
      },
    ],
  },
};