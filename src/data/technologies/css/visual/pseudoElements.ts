import type { TopicNode } from "@/data/types";

export const cssPseudoElements: TopicNode = {
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