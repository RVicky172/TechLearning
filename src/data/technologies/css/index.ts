import type { Technology } from "@/data/types";

const css: Technology = {
  id: "css",
  name: "CSS",
  description: "The styling language of the web — control layout, typography, color, and animation for every browser.",
  color: "bg-blue-400",
  iconName: "Paintbrush",
  deviconClass: "devicon-css3-plain colored",
  tree: [
    {
      id: "css-fundamentals",
      title: "CSS Fundamentals",
      iconName: "BookOpen",
      theory: "CSS (Cascading Style Sheets) controls how HTML elements look and are laid out. Understanding the cascade, specificity, and the box model is essential before tackling layouts or animations.",
      theoryDetail: {
        keyConcepts: [
          "The cascade determines which rule wins when multiple rules target the same element",
          "Specificity ranks selectors: inline styles > IDs > classes/pseudo-classes > elements",
          "Inheritance lets properties like color and font-family flow from parent to child automatically",
        ],
        whyItMatters:
          "Every CSS bug — from an override not working to a layout breaking on one browser — traces back to cascade, specificity, or the box model. Knowing these fundamentals lets you debug confidently instead of guessing.",
        commonPitfalls: [
          "Overusing !important to force overrides instead of fixing specificity properly",
          "Forgetting that non-inherited properties (e.g. border, padding) don't flow to children",
          "Mixing box-sizing: content-box and border-box across the project causing sizing inconsistencies",
        ],
      },
      children: [
        {
          id: "css-selectors",
          title: "Selectors & Specificity",
          iconName: "Target",
          link: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_selectors",
          theory: "Selectors target HTML elements. Specificity is the algorithm browsers use to determine which rule wins when multiple selectors match the same element.",
          theoryDetail: {
            keyConcepts: [
              "Selector types by specificity (low → high): element, class/attribute/pseudo-class, ID, inline",
              "Combinators: descendant (space), child (>), adjacent sibling (+), general sibling (~)",
              "Attribute selectors: [attr], [attr='val'], [attr^='val'], [attr$='val'], [attr*='val']",
            ],
            whyItMatters:
              "Understanding specificity prevents the common frustration of writing a rule that 'doesn't work' — it always loses to a higher-specificity rule somewhere in the stylesheet.",
            commonPitfalls: [
              "Chaining too many selectors creating brittle, over-specific rules hard to override later",
              "Relying on source order instead of intentional specificity to control rule priority",
              "Not using :is() or :where() to simplify long selector lists (where() adds zero specificity)",
            ],
          },
        },
        {
          id: "css-box-model",
          title: "The Box Model",
          iconName: "Square",
          link: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_box_model",
          theory: "Every HTML element is a rectangular box composed of content, padding, border, and margin. Box-sizing controls whether width includes padding and border.",
          theoryDetail: {
            keyConcepts: [
              "content-box (default): width = content only; border-box: width includes padding + border",
              "Margin collapse: adjacent vertical margins merge into the larger of the two",
              "outline is drawn outside the border and does not affect layout or box dimensions",
            ],
            whyItMatters:
              "Misunderstanding the box model is the root cause of most sizing bugs. Setting box-sizing: border-box globally (the modern standard) eliminates a whole class of arithmetic errors.",
            commonPitfalls: [
              "Forgetting that auto margins only work on block elements with a defined width",
              "Expecting margin between a parent and first child — use padding on the parent instead",
              "Not knowing that padding and border are included in border-box width calculations",
            ],
          },
        },
        {
          id: "css-cascade",
          title: "Cascade & Inheritance",
          iconName: "GitMerge",
          link: "https://developer.mozilla.org/en-US/docs/Web/CSS/Cascade",
          theory: "The cascade combines origin, specificity, and source order to decide which declaration wins. Inheritance lets certain properties propagate through the DOM tree automatically.",
          theoryDetail: {
            keyConcepts: [
              "Cascade layers (from highest priority): !important user agent → !important author → author → user agent",
              "Inheritable properties include color, font-*, line-height, text-align, visibility",
              "Use 'inherit', 'initial', 'unset', and 'revert' keywords to explicitly control inheritance",
            ],
            whyItMatters:
              "Knowing what the cascade prioritises lets you write CSS that's easy to override in the right direction rather than an escalating war of !important declarations.",
            commonPitfalls: [
              "Using !important to fix a specificity problem — address the root selector instead",
              "Assuming all properties inherit — border, padding, background do not",
              "Not using CSS Layers (@layer) in design systems leading to hard-to-manage specificity",
            ],
          },
        },
      ],
    },
    {
      id: "css-layout",
      title: "Layout",
      iconName: "Layout",
      theory: "Modern CSS layout is built on Flexbox and Grid. Together they replace most hacks involving floats, tables, and inline-block. Understanding when to use each is a core professional skill.",
      theoryDetail: {
        keyConcepts: [
          "Flexbox is one-dimensional — ideal for rows or columns of items that grow/shrink",
          "Grid is two-dimensional — ideal for page regions and explicit placement in rows and columns",
          "Both can be combined: a Grid handles the macro layout while Flex handles component internals",
        ],
        whyItMatters:
          "Layout bugs are the most visible CSS problems. Mastering Flexbox and Grid lets you build pixel-accurate UIs without hacks, and express complex responsive designs in a handful of properties.",
        commonPitfalls: [
          "Using Flexbox for every layout including 2D grids — Grid is the right tool there",
          "Forgetting that flex children become block-level and ignore display: inline",
          "Setting width on Grid items instead of using column tracks — tracks control the rhythm",
        ],
      },
      children: [
        {
          id: "css-flexbox",
          title: "Flexbox",
          iconName: "AlignLeft",
          link: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout",
          theory: "Flexbox arranges items along a single axis. The container controls direction, wrapping, and alignment; the items control their own growth and shrink behavior.",
          theoryDetail: {
            keyConcepts: [
              "flex-direction: row | row-reverse | column | column-reverse sets the main axis",
              "justify-content aligns along the main axis; align-items aligns along the cross axis",
              "flex: 1 is shorthand for flex-grow: 1; flex-shrink: 1; flex-basis: 0 — items share space equally",
            ],
            whyItMatters:
              "Flexbox replaced almost all float-based layouts. Its ability to distribute space and align items without fixed sizes makes it essential for nav bars, button groups, card rows, and any list of items.",
            commonPitfalls: [
              "Confusing justify-content (main axis) with align-items (cross axis) after rotating direction",
              "Not setting flex-wrap: wrap, causing overflow when items exceed container width",
              "Using flex: 1 on items expecting equal widths — add min-width: 0 to prevent overflow",
            ],
          },
        },
        {
          id: "css-grid",
          title: "CSS Grid",
          iconName: "Grid",
          link: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout",
          theory: "Grid layout defines rows and columns explicitly and places items into cells. It's the most powerful CSS layout system for two-dimensional designs.",
          theoryDetail: {
            keyConcepts: [
              "grid-template-columns: repeat(3, 1fr) creates three equal columns using fractional units",
              "grid-column and grid-row let items span multiple tracks or jump to named areas",
              "grid-template-areas creates named zones — assign items with grid-area: name",
            ],
            whyItMatters:
              "Grid makes complex page layouts (sidebar + main + footer) declarative and responsive without a single media query when using auto-fill/auto-fit with minmax().",
            commonPitfalls: [
              "Not using fr units — percentage widths ignore gap and cause overflow",
              "Forgetting that grid-gap is now gap — the old property still works but is deprecated",
              "Setting explicit row heights that don't accommodate dynamic content, causing overflow",
            ],
          },
        },
        {
          id: "css-positioning",
          title: "Positioning",
          iconName: "Move",
          link: "https://developer.mozilla.org/en-US/docs/Web/CSS/position",
          theory: "The position property controls how an element is removed from or kept in normal document flow. Absolute, fixed, and sticky each serve distinct UI patterns.",
          theoryDetail: {
            keyConcepts: [
              "static (default) follows normal flow; relative offsets from normal position without leaving flow",
              "absolute is placed relative to the nearest positioned ancestor (non-static)",
              "sticky is treated as relative until a scroll threshold is reached, then acts as fixed",
            ],
            whyItMatters:
              "Tooltips, dropdowns, modals, sticky headers, and floating action buttons all rely on correct positioning. Understanding containing blocks prevents the classic 'element jumps to the wrong place' bug.",
            commonPitfalls: [
              "Forgetting to set position: relative on the parent of an absolutely positioned child",
              "Using fixed positioning without accounting for virtual keyboards on mobile",
              "Over-using z-index without understanding stacking contexts — a z-index war is usually a design smell",
            ],
          },
        },
      ],
    },
    {
      id: "css-responsive",
      title: "Responsive Design",
      iconName: "Smartphone",
      theory: "Responsive design makes web pages look good on any screen size. Mobile-first CSS, fluid typography, and flexible images are the three pillars of a robust responsive strategy.",
      theoryDetail: {
        keyConcepts: [
          "Mobile-first: write base styles for small screens, then expand with min-width media queries",
          "Viewport meta tag (<meta name='viewport' content='width=device-width, initial-scale=1'>) is required for correct scaling on mobile",
          "CSS custom properties and clamp() enable fluid typography that scales between breakpoints without media queries",
        ],
        whyItMatters:
          "Over 60% of web traffic is mobile. A responsive layout is not a nice-to-have — it's the baseline expectation for any production-grade website.",
        commonPitfalls: [
          "Desktop-first CSS that requires max-width queries — these grow harder to maintain at scale",
          "Using fixed pixel widths for components instead of percentages, max-width, or grid tracks",
          "Testing only at one or two specific breakpoints instead of dragging the browser to every size",
        ],
      },
      children: [
        {
          id: "css-media-queries",
          title: "Media Queries",
          iconName: "MonitorSmartphone",
          link: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries",
          theory: "Media queries apply CSS rules conditionally based on device characteristics like viewport width, height, orientation, or color scheme preference.",
          theoryDetail: {
            keyConcepts: [
              "@media (min-width: 768px) applies styles at 768 px and above (mobile-first)",
              "prefers-color-scheme: dark detects OS dark mode; prefers-reduced-motion reduces animations",
              "Range syntax (Level 4): @media (768px <= width < 1200px) is cleaner than combining min/max",
            ],
            whyItMatters:
              "Media queries are the main tool for adapting layouts to different screen sizes and user preferences. The prefers-* queries let you respect accessibility and OS-level settings without JavaScript.",
            commonPitfalls: [
              "Too many breakpoints creating a maintenance burden — prefer fluid layouts over pixel-perfect steps",
              "Using max-width queries on a mobile-first codebase causing specificity confusion",
              "Forgetting to add viewport meta in HTML — without it, mobile browsers zoom out and ignore media queries",
            ],
          },
        },
        {
          id: "css-fluid-typography",
          title: "Fluid Typography & clamp()",
          iconName: "Type",
          link: "https://developer.mozilla.org/en-US/docs/Web/CSS/clamp",
          theory: "clamp(min, preferred, max) creates values that scale with the viewport between a minimum and maximum. Combined with viewport units it produces truly fluid typography with no media queries.",
          theoryDetail: {
            keyConcepts: [
              "clamp(1rem, 2.5vw, 2rem) — never smaller than 1 rem or larger than 2 rem",
              "min() and max() are the individual counterparts and can be composed",
              "CSS custom properties expose the scale tokens: --text-lg: clamp(1.125rem, 1rem + 0.5vw, 1.5rem)",
            ],
            whyItMatters:
              "Fluid typography eliminates font-size jumps at breakpoints, producing a smooth and professional reading experience at every viewport size without dozens of @media rules.",
            commonPitfalls: [
              "Using only vw units without clamp() — text becomes unreadably small on phones or huge on TVs",
              "Forgetting to set a sensible minimum so text remains legible at the smallest expected size",
              "Not testing with browser zoom — clamp() interacts with user zoom in ways pixel values don't",
            ],
          },
        },
      ],
    },
    {
      id: "css-visual",
      title: "Visual Styling",
      iconName: "Palette",
      theory: "Beyond layout, CSS controls every visual detail: color, typography, shadows, and borders. CSS custom properties (variables) make large design systems maintainable by centralizing design tokens.",
      theoryDetail: {
        keyConcepts: [
          "CSS custom properties (--name: value) are inherited, composable, and changeable at runtime with JavaScript",
          "Modern color spaces: oklch() provides perceptually uniform color and wider gamuts on P3 displays",
          "text-wrap: balance and text-wrap: pretty are modern properties that improve multi-line heading aesthetics",
        ],
        whyItMatters:
          "Consistent visual design at scale requires a token system. CSS custom properties are the native mechanism — they keep typography, spacing, and color coherent without a CSS-in-JS library.",
        commonPitfalls: [
          "Hardcoding hex values throughout the codebase instead of referencing design tokens",
          "Forgetting that custom properties are case-sensitive: --Color is different from --color",
          "Over-nesting selectors in preprocessors — native CSS nesting now works in all modern browsers",
        ],
      },
      children: [
        {
          id: "css-custom-properties",
          title: "CSS Custom Properties",
          iconName: "Variable",
          link: "https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties",
          theory: "Custom properties (CSS variables) store values under a name prefixed with -- and are accessed with var(). They are live — changing them at runtime instantly updates every place they're used.",
          theoryDetail: {
            keyConcepts: [
              "Declared on :root for global scope; can be re-declared on any element to create local overrides",
              "var(--color, fallback) uses a fallback if the property is not defined",
              "JavaScript: element.style.setProperty('--hue', 240) updates the variable in real time",
            ],
            whyItMatters:
              "Custom properties replace Sass variables for most token use-cases — they're native, runtime-mutable, and cascade, making dark mode, theming, and component overrides trivial.",
            commonPitfalls: [
              "Declaring custom properties with a typo — they silently produce an invalid value with no error",
              "Assuming var() is evaluated at declaration time — it's evaluated at use time, enabling dynamic changes",
              "Using JS to toggle classes instead of updating a custom property, requiring extra CSS rules",
            ],
          },
        },
        {
          id: "css-typography",
          title: "Typography",
          iconName: "Type",
          link: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts",
          theory: "CSS typography covers font loading, size, weight, line height, and spacing. Getting these right is the single biggest factor in perceived content quality.",
          theoryDetail: {
            keyConcepts: [
              "@font-face with font-display: swap prevents invisible text while the web font loads",
              "line-height is unitless (e.g. 1.6) — unitless values scale with the element's own font size",
              "font-variant-numeric: tabular-nums aligns numbers in tables and financial data",
            ],
            whyItMatters:
              "Typography accounts for 95% of web design. Correct line-height, measure (character width), and font-size produce readable, professional text without any other visual embellishment.",
            commonPitfalls: [
              "Loading multiple unused font weights — each adds latency; subset to what you actually use",
              "Setting line-height in px — it won't scale when users change their default font size",
              "Forgetting letter-spacing on uppercase headings — spaced-out caps read significantly better",
            ],
          },
        },
        {
          id: "css-pseudo",
          title: "Pseudo-classes & Pseudo-elements",
          iconName: "Wand2",
          link: "https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes",
          theory: "Pseudo-classes (:hover, :focus, :nth-child) select elements based on state or position. Pseudo-elements (::before, ::after) insert generated content or style part of an element.",
          theoryDetail: {
            keyConcepts: [
              ":is() and :where() accept a selector list — :where() adds zero specificity making it safe to override",
              ":has() is a parent selector: li:has(> input:checked) styles a list item containing a checked input",
              "::before and ::after require content: '' (even empty) and default to display: inline",
            ],
            whyItMatters:
              ":focus-visible improves keyboard accessibility without ugly outlines on mouse clicks. :has() enables relational styling patterns previously only possible with JavaScript.",
            commonPitfalls: [
              "Removing :focus outlines entirely harming keyboard navigation — use :focus-visible instead",
              "Forgetting content: '' on ::before/::after — the pseudo-element won't render without it",
              "Using :nth-child when :nth-of-type is the correct selector — they count differently",
            ],
          },
        },
      ],
    },
    {
      id: "css-animations",
      title: "Animations & Transitions",
      iconName: "Zap",
      theory: "CSS transitions animate property changes smoothly. Keyframe animations run independently of state changes. Both should respect prefers-reduced-motion to protect users with vestibular disorders.",
      theoryDetail: {
        keyConcepts: [
          "transition: property duration easing delay — runs when the value changes (e.g. on :hover)",
          "@keyframes define animation steps; animation shorthand wires them to an element",
          "Animating transform and opacity is GPU-accelerated — avoid animating width, height, or top/left",
        ],
        whyItMatters:
          "Motion gives users feedback about state changes and guides attention. Done correctly, subtle transitions make UIs feel polished. Done carelessly, they create accessibility issues and performance problems.",
        commonPitfalls: [
          "Animating layout properties (height, margin) causing costly reflows on every frame",
          "Not wrapping animations in @media (prefers-reduced-motion: no-preference) — some users get motion sick",
          "Using animation-fill-mode: forwards without understanding it keeps the final keyframe applied after the animation ends",
        ],
      },
      children: [
        {
          id: "css-transitions",
          title: "Transitions",
          iconName: "ArrowRightLeft",
          link: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transitions",
          theory: "Transitions interpolate a CSS property from one value to another over a set duration when a change is triggered (e.g. by :hover or a class change via JavaScript).",
          theoryDetail: {
            keyConcepts: [
              "transition: color 0.2s ease, transform 0.3s ease — comma-separate multiple properties",
              "Easing functions control pacing: ease, linear, ease-in-out, or cubic-bezier(x1,y1,x2,y2)",
              "transition: all is convenient but expensive — explicitly list only the properties that change",
            ],
            whyItMatters:
              "Hover states, focus rings, and theme switches all benefit from smooth transitions. A 200–300ms ease transition turns abrupt flips into polished micro-interactions with two lines of CSS.",
            commonPitfalls: [
              "Transitioning display: none — it's not animatable; use opacity or visibility instead",
              "Using too-long durations (> 500ms) making the UI feel sluggish",
              "Forgetting to add will-change: transform only when needed — overusing it wastes GPU memory",
            ],
          },
        },
        {
          id: "css-keyframes",
          title: "Keyframe Animations",
          iconName: "PlayCircle",
          link: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations",
          theory: "@keyframes define multi-step animations independent of user interaction. The animation property ties keyframes to an element with timing, iteration, and fill-mode control.",
          theoryDetail: {
            keyConcepts: [
              "@keyframes slidein { from { transform: translateX(-100%); } to { transform: translateX(0); } }",
              "animation shorthand: name duration easing delay iteration-count direction fill-mode play-state",
              "animation-play-state: paused lets you pause/resume animations with JavaScript or CSS",
            ],
            whyItMatters:
              "Keyframe animations drive loaders, skeleton screens, attention effects, and page transitions — patterns that would otherwise require JavaScript timers or libraries.",
            commonPitfalls: [
              "Animating properties that trigger layout (width, height) instead of transform: scaleX/scaleY",
              "Forgetting animation-fill-mode: both when the element should remain in its final state",
              "Not testing animation-iteration-count: infinite under prefers-reduced-motion — disable or reduce it",
            ],
          },
        },
      ],
    },
    {
      id: "css-interview-questions",
      title: "Interview Questions",
      iconName: "HelpCircle",
      theory: "CSS interviews test both conceptual depth and practical problem-solving. Expect questions on the cascade, layout, specificity, performance, and accessibility. Strong answers include trade-offs and real scenarios.",
      theoryDetail: {
        keyConcepts: [
          "Explain concepts clearly: cascade order, specificity scoring, box model modes, stacking contexts",
          "Discuss trade-offs: Flexbox vs Grid, transitions vs keyframes, rem vs em vs px",
          "Mention accessibility: focus management, reduced-motion, color contrast ratios",
        ],
        whyItMatters:
          "CSS interviews reveal whether a candidate can write maintainable, performant, and accessible styles — not just replicate a Figma mockup. These questions separate practitioners from guessers.",
        commonPitfalls: [
          "Memorising syntax without understanding why — interviewers follow up with 'why not just use X?'",
          "Ignoring performance concerns: animating layout properties, large paint areas, unused CSS",
          "Not mentioning accessibility — color contrast, focus styles, and reduced-motion are expected at senior level",
        ],
      },
      children: [
        {
          id: "css-iq-specificity",
          title: "Specificity Scoring",
          iconName: "Target",
          theory: "A common warm-up question: calculate which rule wins and explain the scoring system.",
          theoryDetail: {
            examples: [
              {
                title: "Q: Which rule applies and why?",
                description:
                  "Specificity is scored as (inline, IDs, classes, elements). The rule with the highest score wins; equal scores defer to source order.",
                code: `/* Specificity: (0, 0, 1, 1) — class + element */
nav a { color: gray; }

/* Specificity: (0, 0, 2, 0) — two classes — WINS */
.nav .link { color: blue; }

/* Specificity: (0, 1, 0, 0) — ID — would beat both */
#primary-nav { color: red; }`,
                language: "css",
              },
            ],
          },
        },
        {
          id: "css-iq-centering",
          title: "Centering an Element",
          iconName: "AlignCenter",
          theory: "One of the most asked CSS questions. Know at least three approaches and when to reach for each.",
          theoryDetail: {
            examples: [
              {
                title: "Q: How do you center a div both horizontally and vertically?",
                description:
                  "Flexbox and Grid are the modern answers. Position + translate works when you can't control the parent.",
                code: `/* Modern: Flexbox */
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Modern: Grid */
.parent {
  display: grid;
  place-items: center;
}

/* Legacy-compatible: Position + transform */
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}`,
                language: "css",
              },
            ],
          },
        },
        {
          id: "css-iq-bfc",
          title: "Block Formatting Context",
          iconName: "Box",
          theory: "BFC questions assess deep understanding of how layout contexts isolate float behaviour, margin collapse, and overflow.",
          theoryDetail: {
            examples: [
              {
                title: "Q: What is a Block Formatting Context and when does one form?",
                description:
                  "A BFC is an isolated layout region. Elements inside it don't interact with floats outside and margins don't collapse across its boundary.",
                code: `/* These properties create a new BFC */
overflow: hidden;   /* classic clearfix alternative */
display: flow-root; /* modern explicit BFC, no side effects */
display: flex;
display: grid;
position: absolute | fixed;

/* Practical use: contain floated children */
.container {
  display: flow-root; /* children's floats are contained */
}`,
                language: "css",
              },
            ],
          },
        },
        {
          id: "css-iq-stacking",
          title: "Stacking Contexts & z-index",
          iconName: "Layers",
          theory: "z-index only works within a stacking context. Understanding what creates a context explains why z-index: 9999 sometimes fails.",
          theoryDetail: {
            examples: [
              {
                title: "Q: Why doesn't my z-index work?",
                description:
                  "A stacking context is formed by opacity < 1, transform, filter, will-change, isolation: isolate, and more. z-index only competes within the same context.",
                code: `/* Parent creates a stacking context (opacity < 1) */
.parent { opacity: 0.99; }

/* Child's z-index: 9999 only ranks within .parent's context */
.child { position: relative; z-index: 9999; }

/* Fix: use isolation: isolate to intentionally create a context */
.modal-root { isolation: isolate; }

/* Or ensure the problematic ancestor doesn't create a context */`,
                language: "css",
              },
            ],
          },
        },
      ],
    },
  ],
};

export default css;
