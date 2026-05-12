import type { TopicNode } from "@/data/types";

export const cssTypography: TopicNode = {
  id: "css-typography",
  title: "Typography",
  iconName: "Type",
  link: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts",
  theory:
    "CSS typography covers font loading, size, weight, line height, and spacing. Getting these right is the single biggest factor in perceived content quality.",
  theoryDetail: {
    keyConcepts: [
      "@font-face with font-display: swap prevents invisible text while the web font loads",
      "line-height should be unitless (e.g. 1.6) — it scales proportionally with the element's own font-size",
      "font-variant-numeric: tabular-nums aligns numbers in tables so columns don't shift on value changes",
      "ch unit (width of '0') is ideal for line length — research shows 60–75ch is the most readable measure",
      "text-wrap: balance equalises line lengths in headings, preventing ugly single-word final lines",
    ],
    whyItMatters:
      "Typography accounts for 95% of web design. Correct line-height, measure, and font-size produce readable, professional text without any other visual embellishment.",
    commonPitfalls: [
      "Loading multiple unused font weights — each adds network latency; subset and load only what you need",
      "Setting line-height in px — it won't scale when users increase their default browser font size",
      "Forgetting letter-spacing on uppercase headings — tracked-out caps read significantly better",
    ],
    examples: [
      {
        title: "Web font loading without invisible text",
        description:
          "font-display: swap shows a system font immediately and swaps in the web font when ready — zero flash of invisible text.",
        code: `<!-- HTML <head> — preload the critical font file -->
<link rel="preload"
      href="/fonts/Inter-Regular.woff2"
      as="font"
      type="font/woff2"
      crossorigin>

/* ─── CSS — register the font face ─── */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style:  normal;
  font-display: swap;  /* show system font instantly, swap later */
}

@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Bold.woff2') format('woff2');
  font-weight: 700;
  font-display: swap;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}`,
        language: "css",
        output: `FONT LOADING TIMELINE
═══════════════════════════════════════════════════

  0ms    → Page paints using system-ui (system font)
           User sees readable text immediately — no invisible flash

  ~300ms → Inter.woff2 finishes loading (preloaded = fast)
           Text swaps to Inter — subtle reflow, usually unnoticeable

  WITHOUT font-display: swap (browser default = "block"):
  0ms    → Text is INVISIBLE (browser blocks paint up to 3 s)
  ~300ms → Text suddenly appears in the web font
  Result → Users stare at blank content area

FONT-DISPLAY VALUES COMPARED
═══════════════════════════════════════════════════
  block    → invisible up to 3 s, then web font
  swap     → system font immediately, swap anytime  ✅ recommended
  fallback → system font for 100 ms, swap if loaded — else keep system
  optional → browser decides based on connection speed`,
      },
      {
        title: "Readable body typography",
        description:
          "Optimal line-length, line-height, and font-size for comfortable long-form reading.",
        code: `/* Optimal reading container */
.prose {
  max-width: 70ch;   /* ~65-75 chars per line — readability sweet spot */
  margin: 0 auto;
}

.prose p {
  font-size:     1.125rem;  /* 18px — comfortable body size */
  line-height:   1.7;       /* unitless, scales with font-size */
  margin-bottom: 1.5em;     /* em — relative to paragraph's own font-size */
}

/* Heading hierarchy */
.prose h1 {
  font-size:      clamp(2rem, 5vw, 3.5rem); /* fluid */
  line-height:    1.1;         /* tighter for large display text */
  letter-spacing: -0.02em;     /* optical tightening at large sizes */
  text-wrap:      balance;     /* equalise line lengths */
}

.prose h2 {
  font-size:   clamp(1.5rem, 3vw, 2rem);
  line-height: 1.2;
  margin-top:  2.5em;
}

/* Numbers in tables */
.price-col { font-variant-numeric: tabular-nums; }`,
        language: "css",
        output: `LINE LENGTH COMPARISON
═══════════════════════════════════════════════════

  max-width: 100% (too wide at 1200px viewport):
  The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick...
  ↑ Eyes must travel far — readers lose their place

  max-width: 70ch (optimal):
  The quick brown fox jumps over the lazy dog.
  The quick brown fox jumps over the lazy dog.
  ↑ Natural return — comfortable reading rhythm

LINE-HEIGHT VALUES
═══════════════════════════════════════════════════
  line-height: 1.0  → lines touch — cramped
  line-height: 1.4  → acceptable for headings
  line-height: 1.6  → good for body text
  line-height: 1.7  → ✅ optimal for long-form articles
  line-height: 2.0  → too airy — rhythm breaks down

TABULAR NUMBERS  (font-variant-numeric: tabular-nums)
═══════════════════════════════════════════════════
  WITHOUT              WITH
  $1,234.56            $1,234.56
  $9.99   ← shifts     $    9.99  ← aligned ✅
  $100.00              $  100.00`,
      },
      {
        title: "Letter-spacing by context",
        description:
          "Uppercase labels need positive tracking. Large display headings need negative tracking.",
        code: `/* Small uppercase labels — add tracking */
.section-label {
  font-size:      0.75rem;
  font-weight:    600;
  text-transform: uppercase;
  letter-spacing: 0.08em;   /* +8% of font-size */
  color:          var(--text-muted);
}

/* Large display headings — tighten tracking */
.hero-title {
  font-size:      clamp(3rem, 8vw, 6rem);
  font-weight:    900;
  letter-spacing: -0.04em;  /* -4% compensates optical spacing */
  line-height:    1.0;
}

/* Monospace / code — never add letter-spacing */
code {
  font-family:    'JetBrains Mono', monospace;
  letter-spacing: 0;
  font-size:      0.875em;
}`,
        language: "css",
        output: `LETTER-SPACING VISUAL COMPARISON
═══════════════════════════════════════════════════

  .section-label  (letter-spacing: 0.08em, uppercase)
  S E C T I O N   T I T L E     ← open, airy, readable at 12px

  .section-label  (no tracking, uppercase)
  SECTIONTITLE                   ← cramped, hard to scan

  .hero-title  (letter-spacing: -0.04em, 6rem)
  BigHeading                     ← tight, impactful at large size

  .hero-title  (letter-spacing: 0, 6rem)
  B i g H e a d i n g           ← optically loose, looks amateur

RULE OF THUMB
═══════════════════════════════════════════════════
  Small uppercase text  →  positive  (+0.06em to +0.12em)
  Body text             →  zero or slight positive (+0.01em)
  Large display text    →  negative  (-0.02em to -0.05em)
  Monospace / code      →  always zero`,
      },
    ],
  },
};