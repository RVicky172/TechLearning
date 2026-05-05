import type { TopicNode } from "@/data/types";

const customProperties: TopicNode = {
  id: "css-custom-properties",
  title: "CSS Custom Properties (Variables)",
  iconName: "Variable",
  link: "https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties",
  theory:
    "Custom properties (CSS variables) store values under a name prefixed with -- and are accessed with var(). They are live — changing them at runtime instantly updates every place they are used.",
  theoryDetail: {
    keyConcepts: [
      "Declared on :root for global scope; re-declare on any element to create local overrides that only affect that subtree",
      "var(--color, fallback) uses the fallback value if the property is undefined or invalid",
      "Custom properties participate in the cascade and inheritance — a child element inherits the parent's variable",
      "JavaScript: element.style.setProperty('--hue', 240) updates the variable in real time without class toggling",
      "Computed value: var() is resolved at use-time, not declaration-time — changing --size updates every consumer instantly",
    ],
    whyItMatters:
      "Custom properties replace Sass variables for most token use-cases. They are native, runtime-mutable, and cascade — dark mode, theming, and component overrides become trivial without any build step.",
    commonPitfalls: [
      "Typos in property names silently produce an invalid value with no error in the browser console",
      "Assuming var() is evaluated at declaration time — it resolves at use time, enabling dynamic runtime changes",
      "Toggling classes to change visual state when a single setProperty() call on a custom property is far simpler",
    ],
    examples: [
      {
        title: "Declaring and consuming design tokens",
        description:
          "Define global tokens on :root and consume them anywhere. Changing a token cascades everywhere it is used.",
        code: `/* ─── 1. Define tokens on :root (global scope) ─── */
:root {
  --color-primary:  #3b82f6;
  --color-danger:   #ef4444;
  --color-success:  #22c55e;

  --spacing-sm:  8px;
  --spacing-md:  16px;

  --radius-md:   8px;
  --radius-full: 9999px;
}

/* ─── 2. Components consume tokens — no magic numbers ─── */
.button {
  background:    var(--color-primary);
  color:         white;
  padding:       var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  border:        none;
  cursor:        pointer;
}

.badge {
  background:    var(--color-success);
  padding:       4px var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size:     0.75rem;
  color:         white;
}

.alert {
  background:    color-mix(in srgb, var(--color-danger) 12%, white);
  border:        1px solid var(--color-danger);
  border-radius: var(--radius-md);
  padding:       var(--spacing-md);
}`,
        language: "css",
        output: `RENDERED RESULT
═══════════════════════════════════════════════════

  .button
  ┌──────────────────┐
  │    [ Button ]    │  ← blue bg (#3b82f6), 8px/16px padding, 8px radius
  └──────────────────┘

  .badge
  ╭──────────╮
  │  Active  │          ← green pill (#22c55e), fully rounded
  ╰──────────╯

  .alert
  ┌────────────────────────────────┐
  │  ⚠  Something went wrong      │  ← red border, light red bg
  └────────────────────────────────┘

Change ONE token — EVERY component updates:
  --color-primary: #8b5cf6  →  all buttons turn purple instantly
  --spacing-md: 24px        →  all buttons get wider padding`,
      },
      {
        title: "Dark mode with a single attribute toggle",
        description:
          "Redefine token values under [data-theme='dark']. Every component updates automatically — zero extra CSS rules per component.",
        code: `/* ─── Light theme (default) ─── */
:root {
  --bg-surface:   #ffffff;
  --text-primary: #0f172a;
  --text-muted:   #64748b;
  --border:       #e2e8f0;
  --accent:       #3b82f6;
}

/* ─── Dark theme — only token values change ─── */
[data-theme="dark"] {
  --bg-surface:   #1e293b;
  --text-primary: #f1f5f9;
  --text-muted:   #94a3b8;
  --border:       #334155;
  --accent:       #60a5fa;
}

/* ─── Components use tokens — identical for both themes ─── */
.card {
  background:    var(--bg-surface);
  border:        1px solid var(--border);
  color:         var(--text-primary);
  border-radius: 12px;
  padding:       24px;
}

.card-subtitle { color: var(--text-muted); }
.card-link     { color: var(--accent); }

/* Toggle via JavaScript */
/* document.documentElement.setAttribute('data-theme', 'dark'); */`,
        language: "css",
        output: `LIGHT THEME  (data-theme="light")
═══════════════════════════════════════════════════
  ┌─────────────────────────────────────────┐
  │  Card Title                             │  ← #0f172a (dark text)
  │  Subtitle text in muted tone            │  ← #64748b
  │  [Read more →]                          │  ← #3b82f6 (blue link)
  └─────────────────────────────────────────┘
  Background: #ffffff  |  Border: #e2e8f0

DARK THEME  (data-theme="dark")
═══════════════════════════════════════════════════
  ┌─────────────────────────────────────────┐
  │  Card Title                             │  ← #f1f5f9 (light text)
  │  Subtitle text in muted tone            │  ← #94a3b8
  │  [Read more →]                          │  ← #60a5fa (lighter blue)
  └─────────────────────────────────────────┘
  Background: #1e293b  |  Border: #334155

ONE setAttribute() call re-themes the entire page instantly.
No class duplication. No !important. No JavaScript style loops.`,
      },
      {
        title: "Component-scoped variable overrides",
        description:
          "Re-declare a variable on a component to create isolated variants. One CSS block, multiple variants.",
        code: `/* HTML:
  <button class="btn">Default</button>
  <button class="btn btn--danger">Delete</button>
  <button class="btn btn--success">Confirm</button>
  <button class="btn btn--ghost">Cancel</button>
*/

.btn {
  --btn-bg:     #3b82f6;   /* local token with default */
  --btn-color:  white;
  --btn-border: transparent;

  background:    var(--btn-bg);
  color:         var(--btn-color);
  border:        2px solid var(--btn-border);
  padding:       8px 20px;
  border-radius: 8px;
  font-weight:   600;
  cursor:        pointer;
  transition:    filter 0.15s ease;
}

.btn:hover { filter: brightness(1.1); }

/* Each variant only overrides the token — ONE line each */
.btn--danger  { --btn-bg: #ef4444; }
.btn--success { --btn-bg: #22c55e; }
.btn--ghost {
  --btn-bg:     transparent;
  --btn-color:  #3b82f6;
  --btn-border: #3b82f6;
}`,
        language: "css",
        output: `RENDERED BUTTONS
═══════════════════════════════════════════════════════════

  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
  │ Default  │  │  Delete  │  │ Confirm  │  │  Cancel  │
  └──────────┘  └──────────┘  └──────────┘  └──────────┘
  blue bg       red bg         green bg       transparent
  (#3b82f6)     (#ef4444)      (#22c55e)      + blue border

  ON HOVER → filter: brightness(1.1) → slightly lighter on ALL variants

  KEY INSIGHT:
  Only 1 set of CSS properties (.btn block).
  Each variant is ONE line: --btn-bg: <new-color>;
  Zero repeated padding / border-radius / font-weight rules.`,
      },
      {
        title: "Fallback values and scoping",
        description:
          "var() accepts a fallback as its second argument. Variables scoped to a parent only affect its subtree.",
        code: `/* Fallback: var(--name, fallback) */
.card {
  background: var(--card-bg, #ffffff);  /* fallback if unset */
  padding:    var(--card-padding, 16px);
  /* Chained fallback: try --primary, then --accent, then blue */
  color: var(--primary, var(--accent, blue));
}

/* ─── Scoped tokens — only apply within .sidebar ─── */
.sidebar {
  --card-bg:      #1e293b;   /* override for this subtree */
  --card-padding: 12px;
}

/* .card inside .sidebar → dark bg (inherited from .sidebar)
   .card outside .sidebar → white bg (fallback kicks in)   */`,
        language: "css",
        output: `SCOPING DIAGRAM
═══════════════════════════════════════════════════

  <body>                           --card-bg: not set
  │
  ├── <div class="card">           background: #ffffff  (fallback)
  │                                padding:    16px     (fallback)
  │
  └── <aside class="sidebar">      --card-bg: #1e293b  (local override)
      │                            --card-padding: 12px
      │
      └── <div class="card">       background: #1e293b  (inherited ✓)
                                   padding:    12px     (inherited ✓)

FALLBACK CHAIN RESOLUTION
═══════════════════════════════════════════════════
  var(--primary, var(--accent, blue))

  1. Is --primary defined? YES → use it, stop.
  2. Is --primary defined? NO  → check --accent
  3. Is --accent defined?  YES → use it, stop.
  4. Is --accent defined?  NO  → use 'blue' (keyword fallback)`,
      },
      {
        title: "JavaScript runtime — live variable updates",
        description:
          "Read and write custom properties from JavaScript for dynamic theming, colour pickers, or design tools.",
        code: `/* CSS */
:root {
  --hue:        220;
  --saturation: 70%;
  --lightness:  50%;
}

.themed {
  background: hsl(var(--hue), var(--saturation), var(--lightness));
  transition: background 0.3s ease;
}

/* JavaScript */
const root = document.documentElement;

// READ a custom property
const hue = getComputedStyle(root).getPropertyValue('--hue').trim();
console.log(hue); // "220"

// WRITE a custom property
root.style.setProperty('--hue', '280');
// → .themed shifts from blue to purple instantly

// REMOVE (reverts to :root declared value)
root.style.removeProperty('--hue');

// Wire a slider input
document.querySelector('#hue-slider').addEventListener('input', e => {
  root.style.setProperty('--hue', e.target.value);
});`,
        language: "css",
        output: `COLOUR AT DIFFERENT HUE VALUES
═══════════════════════════════════════════════════
  --hue:   0   →  hsl(0,   70%, 50%)  =  red
  --hue:  60   →  hsl(60,  70%, 50%)  =  yellow
  --hue: 120   →  hsl(120, 70%, 50%)  =  green
  --hue: 180   →  hsl(180, 70%, 50%)  =  cyan
  --hue: 220   →  hsl(220, 70%, 50%)  =  blue   ← default
  --hue: 280   →  hsl(280, 70%, 50%)  =  purple
  --hue: 320   →  hsl(320, 70%, 50%)  =  pink

Dragging the slider → setProperty('--hue', value)
→ background colour animates smoothly via transition: 0.3s ease
→ ALL elements using var(--hue) update simultaneously
→ Zero DOM queries, zero classList changes, zero re-renders`,
      },
    ],
  },
};

const typography: TopicNode = {
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

const pseudoElements: TopicNode = {
  id: "css-pseudo",
  title: "Pseudo-classes & Pseudo-elements",
  iconName: "Wand2",
  link: "https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes",
  theory:
    "Pseudo-classes (:hover, :focus, :nth-child) select elements based on state or position. Pseudo-elements (::before, ::after) insert generated content or style part of an element.",
  theoryDetail: {
    keyConcepts: [
      ":is() and :where() accept a selector list — :where() adds zero specificity, safe to override",
      ":has() is a parent selector: li:has(> input:checked) styles a list item with a checked input",
      "::before and ::after require content: '' (even empty string) and default to display: inline",
      ":focus-visible shows focus ring only when navigating by keyboard, not on mouse click",
      ":nth-child(an+b) targets children by position; :nth-of-type targets by element type",
    ],
    whyItMatters:
      ":focus-visible improves keyboard accessibility without ugly outlines on mouse clicks. :has() enables relational styling patterns previously only possible with JavaScript.",
    commonPitfalls: [
      "Removing :focus outlines entirely — this breaks keyboard navigation; use :focus-visible instead",
      "Forgetting content: '' on ::before/::after — the pseudo-element won't render at all",
      "Confusing :nth-child and :nth-of-type — they count siblings differently",
    ],
    examples: [
      {
        title: "State pseudo-classes — interactive button",
        description: "Style elements based on user interaction state.",
        code: `.btn {
  background:    #3b82f6;
  color:         white;
  border:        2px solid transparent;
  border-radius: 8px;
  padding:       10px 20px;
  font-weight:   600;
  cursor:        pointer;
  transition:    background 0.2s, transform 0.15s, box-shadow 0.2s;
}

.btn:hover {
  background: #2563eb;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.45);
}

.btn:active {
  transform:  scale(0.96);
  box-shadow: none;
}

/* Keyboard focus ONLY — not triggered by mouse clicks */
.btn:focus-visible {
  outline:        2px solid #3b82f6;
  outline-offset: 3px;
}

.btn:disabled {
  background: #94a3b8;
  cursor:     not-allowed;
}`,
        language: "css",
        output: `BUTTON STATE MACHINE
═══════════════════════════════════════════════════

  :default       [ Save Changes ]   blue, flat

  :hover         [ Save Changes ]   darker blue + glow shadow (200ms)

  :active        [ Save Changes ]   scale(0.96) — slight press-in (150ms)

  :focus-visible [ Save Changes ]   2px blue outline ring, 3px offset
                 ↑ Tab key only — NOT shown on mouse click

  :disabled      [ Save Changes ]   grey, cursor shows 🚫

:focus-visible vs :focus
═══════════════════════════════════════════════════
  Mouse click  → :focus fires, :focus-visible does NOT → no ring
  Tab key      → :focus fires, :focus-visible ALSO fires → ring shows
  This gives mouse users a cleaner UI while keeping keyboard nav accessible`,
      },
      {
        title: ":has() — the parent selector",
        description:
          "Style a parent based on what it contains. Previously impossible in CSS without JavaScript.",
        code: `/* Style <li> when its checkbox is checked */
.todo-item:has(input:checked) {
  opacity:         0.5;
  text-decoration: line-through;
  background:      #f0fdf4;
}

/* Highlight form groups that contain an invalid input */
.form-group:has(input:invalid:not(:placeholder-shown)) {
  background:  #fff1f2;
  border-left: 3px solid #ef4444;
  padding-left: 12px;
}

/* Card layout adapts based on whether an image is present */
.card:has(img) {
  display:               grid;
  grid-template-columns: 200px 1fr;
}
.card:not(:has(img)) {
  padding: 24px; /* text-only card gets more padding */
}`,
        language: "css",
        output: `TODO LIST — :has() in action
═══════════════════════════════════════════════════

  BEFORE checking:
  ☐  Buy groceries    ← full opacity, normal text
  ☐  Clean house

  AFTER checking "Buy groceries":
  ☑  ~~Buy groceries~~  ← 50% opacity + strikethrough + green tint
  ☐  Clean house

  No JavaScript. CSS detects the checkbox state via :has()
  and styles the PARENT <li> — zero event listeners.

CARD LAYOUT — :has(img)
═══════════════════════════════════════════════════

  Card with image:
  ┌──────────┬─────────────────────────┐
  │  [img]   │  Title                  │  ← grid: 200px | 1fr
  │          │  Description here       │
  └──────────┴─────────────────────────┘

  Card without image:
  ┌─────────────────────────────────────┐
  │  Title                              │  ← single col, more padding
  │  Description here                   │
  └─────────────────────────────────────┘`,
      },
      {
        title: "::before and ::after — generated content",
        description:
          "Insert decorative or contextual content without extra HTML elements.",
        code: `/* Required field asterisk */
.label-required::after {
  content: ' *';
  color:   #ef4444;
}

/* Decorative quote mark */
blockquote {
  position:    relative;
  padding:     16px 16px 16px 48px;
  font-style:  italic;
}
blockquote::before {
  content:     '"';
  position:    absolute;
  left:        8px;
  top:         -8px;
  font-size:   4rem;
  color:       #3b82f6;
  line-height: 1;
}

/* CSS-only tooltip via data attribute */
[data-tooltip]         { position: relative; }
[data-tooltip]::after  {
  content:        attr(data-tooltip); /* reads the HTML attribute */
  position:       absolute;
  bottom:         calc(100% + 8px);
  left:           50%;
  transform:      translateX(-50%);
  background:     #0f172a;
  color:          white;
  padding:        5px 10px;
  border-radius:  6px;
  font-size:      0.75rem;
  white-space:    nowrap;
  opacity:        0;
  pointer-events: none;
  transition:     opacity 0.2s;
}
[data-tooltip]:hover::after { opacity: 1; }`,
        language: "css",
        output: `::after — REQUIRED LABEL
═══════════════════════════════════════════════════
  HTML:    <label class="label-required">Email</label>
  Renders: Email *     ← " *" is CSS-generated, not in HTML

::before — BLOCKQUOTE
═══════════════════════════════════════════════════
  "                         ← ::before inserts the big quote mark
  The design is not just
  what it looks like —
  design is how it works.

CSS-ONLY TOOLTIP
═══════════════════════════════════════════════════
  HTML: <button data-tooltip="Copies to clipboard">Copy</button>

  DEFAULT:                      HOVER:
  [ Copy ]                      ┌──────────────────────┐
                                │ Copies to clipboard  │
                                └──────────────────────┘
                                        [ Copy ]

  Zero JavaScript. Tooltip text lives in the HTML attribute.
  content: attr(data-tooltip) reads it at render time.`,
      },
      {
        title: ":nth-child patterns",
        description: "Select elements by position using the an+b formula.",
        code: `/* Zebra striping */
tr:nth-child(odd)  { background: #f8fafc; }
tr:nth-child(even) { background: #ffffff; }

/* First 3 items highlighted */
li:nth-child(-n+3) {
  font-weight:  700;
  border-left:  3px solid #f59e0b;
}

/* Every 3rd item starting at 1 (1, 4, 7, ...) */
li:nth-child(3n+1) { color: #3b82f6; }

/* All except the first */
.nav-item:not(:first-child) {
  border-top: 1px solid var(--border);
}

/* Last item — remove trailing border */
li:last-child { border-bottom: none; }`,
        language: "css",
        output: `ZEBRA STRIPING — tr:nth-child(odd/even)
═══════════════════════════════════════════════════
  Row 1 (odd)   │ Name   │ Score │  ← #f8fafc light grey
  Row 2 (even)  │ Alice  │  98   │  ← #ffffff white
  Row 3 (odd)   │ Bob    │  87   │  ← #f8fafc light grey
  Row 4 (even)  │ Carol  │  76   │  ← #ffffff white

FIRST 3 FEATURED — :nth-child(-n+3)
═══════════════════════════════════════════════════
  ║ 🥇 First Place    ← bold + amber left border
  ║ 🥈 Second Place   ← bold + amber left border
  ║ 🥉 Third Place    ← bold + amber left border
    4th Place          ← no highlight
    5th Place          ← no highlight

FORMULA CHEAT SHEET
═══════════════════════════════════════════════════
  :nth-child(2)     → only item 2
  :nth-child(2n)    → every even item   (2, 4, 6…)
  :nth-child(2n+1)  → every odd item    (1, 3, 5…)
  :nth-child(3n)    → every 3rd item    (3, 6, 9…)
  :nth-child(-n+3)  → first 3 items     (1, 2, 3)
  :nth-child(n+4)   → from 4th onwards  (4, 5, 6…)`,
      },
    ],
  },
};

const colors: TopicNode = {
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

export const cssVisual: TopicNode = {
  id: "css-visual",
  title: "Visual Styling",
  iconName: "Palette",
  theory:
    "Beyond layout, CSS controls every visual detail: color, typography, shadows, and borders. CSS custom properties (variables) make large design systems maintainable by centralizing design tokens.",
  theoryDetail: {
    keyConcepts: [
      "CSS custom properties (--name: value) are inherited, composable, and changeable at runtime with JavaScript",
      "oklch() provides perceptually uniform color and access to wider P3 display gamuts",
      "text-wrap: balance and text-wrap: pretty improve multi-line heading aesthetics",
    ],
    whyItMatters:
      "Consistent visual design at scale requires a token system. CSS custom properties are the native mechanism — they keep typography, spacing, and color coherent without a CSS-in-JS library.",
    commonPitfalls: [
      "Hardcoding hex values throughout the codebase instead of referencing design tokens",
      "Forgetting that custom properties are case-sensitive: --Color is different from --color",
      "Over-nesting selectors — native CSS nesting now works in all modern browsers",
    ],
  },
  children: [customProperties, typography, pseudoElements, colors],
};
