import type { TopicNode } from "@/data/types";

export const cssIqCssVsSass: TopicNode = {
  id: "css-iq-css-vs-sass",
  title: "Modern CSS vs Sass",
  iconName: "GitMerge",
  theory:
    "With native CSS nesting, custom properties, and color functions, many classic Sass features are now available in plain CSS. Know when a preprocessor still adds value.",
  theoryDetail: {
    keyConcepts: [
      "CSS nesting is now baseline — supported in all modern browsers since 2024",
      "CSS custom properties replace Sass variables for runtime-mutable tokens",
      "Sass still wins for: @use/@forward module system, @mixin, @each/@for loops, and compile-time math",
    ],
    examples: [
      {
        title: "Q: Do we still need Sass in 2025?",
        description:
          "Side-by-side comparison of features now native in CSS versus where Sass still adds unique value.",
        code: `/* ─── Variables ─── */

/* Sass (compile-time only) */
$primary: #3b82f6;
.button { background: $primary; }

/* Modern CSS (runtime-mutable) — PREFER THIS */
:root { --primary: #3b82f6; }
.button { background: var(--primary); }
/* CSS variables can change at runtime; Sass variables cannot. */

/* ─── Nesting ─── */

/* Sass */
.card {
  padding: 16px;
  &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  & .title { font-size: 1.25rem; }
}

/* Modern CSS — identical syntax (baseline 2024) */
.card {
  padding: 16px;
  &:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  & .title { font-size: 1.25rem; }
}

/* ─── Where Sass STILL wins ─── */

/* 1. Mixins — no native CSS equivalent */
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.hero { @include flex-center; }

/* 2. Loops — generate utility classes */
@each $size in sm, md, lg {
  .gap-#{$size} { gap: map.get($sizes, $size); }
}

/* 3. Module system */
@use 'tokens' as t;
.button { background: t.$primary; }

/* OUTPUT: For new projects, modern CSS handles 80% of
   what Sass provided. Sass still wins for large design
   systems with loops, mixins, and module boundaries. */`,
        language: "css",
      },
    ],
  },
};