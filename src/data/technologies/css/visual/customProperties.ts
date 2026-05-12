import type { TopicNode } from "@/data/types";

export const cssCustomProperties: TopicNode = {
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