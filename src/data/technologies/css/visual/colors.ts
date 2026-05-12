import type { TopicNode } from "@/data/types";

export const cssColors: TopicNode = {
  id: "css-colors",
  title: "Modern Color",
  iconName: "Palette",
  link: "https://developer.mozilla.org/en-US/docs/Web/CSS/color_value",
  theory:
    "CSS supports multiple color spaces. oklch() is the modern standard — it provides perceptually uniform lightness and access to the wider P3 display gamut for more vivid colors.",
  theoryDetail: {
    keyConcepts: [
      "oklch(lightness chroma hue) — lightness is perceptually uniform; changing L doesn't shift perceived hue",
      "color-mix(in oklch, red 40%, blue) — native CSS color blending without preprocessors",
      "color-scheme: dark light on :root tells the browser to style form controls to match the theme",
      "@supports (color: oklch(50% 0.2 200)) lets you feature-detect and provide sRGB fallbacks",
    ],
    whyItMatters:
      "HSL and hex are constrained to sRGB. oklch unlocks P3 wide-gamut colors on modern displays and produces consistent shade ramps — buttons look vivid rather than washed out.",
    commonPitfalls: [
      "Hardcoding hex values throughout instead of referencing design tokens via custom properties",
      "Generating shade palettes in HSL then wondering why hue appears to shift between shades",
      "Not providing sRGB fallbacks for oklch when supporting older browsers",
    ],
    examples: [
      {
        title: "oklch — perceptually uniform shade ramp",
        description:
          "In oklch only lightness varies across a shade ramp — the perceived hue stays constant. In HSL, hue drifts as lightness changes.",
        code: `/* ─── oklch shade ramp — hue stays at 260 throughout ─── */
:root {
  --blue-100: oklch(93% 0.06  260);  /* very light */
  --blue-300: oklch(75% 0.13  260);
  --blue-500: oklch(55% 0.20  260);  /* base — vivid */
  --blue-700: oklch(35% 0.15  260);
  --blue-900: oklch(18% 0.08  260);  /* very dark */
}

/* ─── Always provide an sRGB fallback ─── */
.button {
  background: #3b82f6;               /* sRGB fallback first */
  background: oklch(62% 0.19 258);   /* wide-gamut override */
}

/* ─── Feature detection ─── */
@supports (color: oklch(50% 0.2 200)) {
  :root { --accent: oklch(62% 0.2 258); }
}`,
        language: "css",
        output: `HSL vs OKLCH — SHADE RAMP COMPARISON
═══════════════════════════════════════════════════

  HSL ramp  hsl(220, 80%, L%):
  L=95% → looks slightly purple-grey (hue shift)
  L=60% → shifts toward cooler blue
  L=40% → shifts toward warmer navy
  ↑ Perceived hue changes even though the hue value is fixed

  OKLCH ramp  oklch(L% 0.2 260):
  L=93% → consistently pale blue
  L=55% → consistently vivid blue
  L=18% → consistently deep blue
  ↑ Perceptual hue stays constant — only brightness changes

DISPLAY GAMUTS
═══════════════════════════════════════════════════
  sRGB  gamut: ~35% of visible colours  (hex / hsl live here)
  P3    gamut: ~50% of visible colours  ← oklch can access this
  Rec2020:     ~75% of visible colours

  On iPhone 15 / MacBook with P3 display:
  oklch(62% 0.25 258) → vivid saturated blue (P3)
  #3b82f6             → same but clamped to sRGB (less vivid)

BROWSER SUPPORT (2026)
═══════════════════════════════════════════════════
  Chrome 111+  ✅   Firefox 113+  ✅   Safari 15.4+  ✅`,
      },
      {
        title: "color-mix() — native color blending",
        description:
          "Mix two colors natively in any color space — no Sass darken()/lighten() or JavaScript needed.",
        code: `/* Darken on hover — mix with black */
.btn         { background: #3b82f6; }
.btn:hover   { background: color-mix(in oklch, #3b82f6 75%, black); }

/* Lighten — tinted badge */
.chip {
  background: color-mix(in oklch, var(--color-primary) 20%, white);
  color:      var(--color-primary);
}

/* Semi-transparent overlay */
.overlay {
  background: color-mix(in srgb, black 40%, transparent);
  /* ≈ rgba(0, 0, 0, 0.4) but composable with custom properties */
}

/* Generate a full tonal palette from ONE base color */
:root {
  --base: oklch(55% 0.2 258);

  --tint-1:  color-mix(in oklch, var(--base) 20%, white);
  --tint-2:  color-mix(in oklch, var(--base) 40%, white);
  --shade-1: color-mix(in oklch, var(--base) 70%, black);
  --shade-2: color-mix(in oklch, var(--base) 50%, black);
}`,
        language: "css",
        output: `TONAL PALETTE FROM ONE BASE COLOR
═══════════════════════════════════════════════════

  --base:    oklch(55% 0.2 258)   →  vivid blue

  --tint-1:  base 20% + white 80% →  very pale blue  (background tints)
  --tint-2:  base 40% + white 60% →  light blue      (hover states)
  --shade-1: base 70% + black 30% →  medium dark blue (text on light)
  --shade-2: base 50% + black 50% →  dark navy        (deep accent)

  Visual ramp:
  [ pale ] [ light ] [ BASE ] [ dark ] [ navy ]

HOVER BUTTON
═══════════════════════════════════════════════════
  DEFAULT:  [ Button ]   background: #3b82f6
  HOVER:    [ Button ]   background: color-mix → darker blue (~#2a6cd6)

  Advantage: change --color-primary → hover adapts automatically.
  No second hardcoded hex value needed.

SASS EQUIVALENT (for comparison)
═══════════════════════════════════════════════════
  color-mix(in oklch, $blue 75%, black)  ≈  darken($blue, 15%)
  color-mix is NATIVE — no preprocessor required.`,
      },
    ],
  },
};