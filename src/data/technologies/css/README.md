# CSS Technology Data

This folder contains the learning content for the CSS technology. The content is split by topic so layout, visual styling, responsiveness, animation, and interview prep can evolve independently.

## Current Structure

```text
css/
├── README.md
├── index.ts
├── fundamentals/
│   ├── index.ts
│   ├── selectors.ts
│   ├── boxModel.ts
│   ├── cascade.ts
│   └── units.ts
├── layout/
│   ├── index.ts
│   ├── flexbox.ts
│   ├── grid.ts
│   └── positioning.ts
├── responsive/
│   ├── index.ts
│   ├── mediaQueries.ts
│   ├── fluidTypography.ts
│   ├── containerQueries.ts
│   └── viewportUnits.ts
├── visual/
│   ├── index.ts
│   ├── customProperties.ts
│   ├── typography.ts
│   ├── pseudoElements.ts
│   └── colors.ts
├── animations/
│   ├── index.ts
│   ├── transitions.ts
│   └── keyframes.ts
└── interviewQuestions/
    ├── index.ts
    ├── specificity.ts
    ├── centering.ts
    ├── bfc.ts
    ├── stacking.ts
    ├── flexboxVsGrid.ts
    ├── performance.ts
    ├── accessibility.ts
    ├── cssVsSass.ts
    └── unitsViewport.ts
```

## Section Inventory

Top-level order in `css/index.ts`:

1. Fundamentals
2. Layout
3. Responsive Design
4. Visual Styling
5. Animations
6. Interview Questions

### Fundamentals

- Selectors & Specificity
- The Box Model
- Cascade & Inheritance
- CSS Units & Sizing

Structure note:

- each section now uses a folder with `index.ts` plus one topic file per concept

### Layout

- Flexbox
- CSS Grid
- Positioning

Current focus:

- richer theory details for tradeoffs between Flexbox, Grid, and positioning
- explicit output previews for layout examples via `theoryDetail.examples[].output`
- section content is split into `layout/index.ts` plus one file per topic so updates stay local

### Responsive Design

- Media Queries
- Fluid Typography & clamp()
- Container Queries
- Viewport Units & Mobile Sizing

### Visual Styling

- CSS Custom Properties (Variables)
- Typography
- Pseudo-classes & Pseudo-elements
- Modern Color

### Animations

- Transitions
- Keyframe Animations

### Interview Questions

- Specificity Scoring
- Centering an Element
- Block Formatting Context
- Stacking Contexts & z-index
- Flexbox vs Grid
- CSS Performance
- CSS & Accessibility
- Modern CSS vs Sass
- Units, Viewport, and Sizing Bugs

## How It Works

- Each file exports one or more named `TopicNode` values.
- `css/index.ts` assembles the final `Technology` object used by the app.
- Section folders can use an `index.ts` parent file that imports child topic files and assembles the section node.
- Rich topic content lives in `theoryDetail`, including concepts, pitfalls, comparisons, examples, and output previews.
- CSS examples now render through a browser preview iframe on the topic page. Add `preview` when an example needs custom HTML, CSS, or JavaScript; otherwise the renderer can infer from common `/* HTML: ... */` blocks or fall back to rendered explanatory output.

## Maintenance Notes

When adding or updating CSS content:

1. Keep examples practical and short enough to scan on the topic page.
2. Prefer a browser preview over static output text. Use `preview` for custom demos or include an `/* HTML: ... */` block in CSS examples when possible.
3. Add comparison notes when a topic is likely to be confused with a neighboring CSS feature.
4. For larger sections, prefer a folder with one topic per file and an `index.ts` that assembles the parent node.
5. Update this README when sections or tracking notes change.
6. Cover browser quirks explicitly when they are common interview traps, especially sizing bugs involving units, scrollbars, and mobile viewport behavior.
