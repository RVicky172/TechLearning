import type { Technology } from "@/data/types";

const scss: Technology = {
  id: "scss",
  name: "SCSS / Sass",
  description: "A powerful CSS preprocessor that adds variables, nesting, mixins, and functions to keep stylesheets maintainable at scale.",
  color: "bg-pink-500",
  iconName: "Palette",
  deviconClass: "devicon-sass-original colored",
  tree: [
    {
      id: "scss-fundamentals",
      title: "SCSS / Sass Fundamentals",
      iconName: "BookOpen",
      theory: "Sass (Syntactically Awesome Style Sheets) is a CSS preprocessor that compiles to plain CSS. SCSS is the most popular syntax — a superset of CSS, so any valid CSS is valid SCSS. Understanding the compilation model and the two syntaxes is the foundation for everything else.",
      theoryDetail: {
        keyConcepts: [
          "Sass has two syntaxes: SCSS (uses braces and semicolons, superset of CSS) and the indented syntax (.sass, uses indentation)",
          "SCSS files are compiled to CSS by a build tool (Vite, webpack, Parcel, or the Sass CLI)",
          "The Dart Sass implementation is the canonical, actively maintained version — LibSass and Node-sass are deprecated",
        ],
        whyItMatters:
          "SCSS lets you write DRY, organised stylesheets that would be unwieldy in plain CSS. Variables, nesting, and mixins reduce repetition and make global changes — like a colour-scheme update — a one-line edit instead of a find-and-replace across hundreds of files.",
        commonPitfalls: [
          "Using the deprecated @import rule instead of the modern @use / @forward system",
          "Installing node-sass (deprecated) instead of sass (Dart Sass) from npm",
          "Treating SCSS as CSS-with-variables — missing the power of mixins, functions, and the module system",
        ],
      },
      children: [
        {
          id: "scss-variables",
          title: "Variables",
          iconName: "Variable",
          link: "https://sass-lang.com/documentation/variables/",
          theory: "Sass variables store values under a $ name. They are resolved at compile time, producing plain CSS values. For runtime-mutable design tokens prefer CSS custom properties; use Sass variables for values that only need to change during compilation.",
          theoryDetail: {
            keyConcepts: [
              "Declaration: $brand-color: #3b82f6; — use anywhere after the declaration in the same scope",
              "Sass variables are lexically scoped: a variable declared inside a rule is local to that block",
              "!default flag: $spacing: 8px !default; only sets the value if not already defined — useful in libraries",
            ],
            whyItMatters:
              "Variables centralise design tokens (colours, spacing, font stacks) so a single edit propagates across the entire compiled stylesheet. They are the entry point for most Sass adoption.",
            commonPitfalls: [
              "Confusing Sass variables ($var) with CSS custom properties (--var): Sass vars are erased at compile time",
              "Declaring variables in partials that are not yet @use'd — the variable is invisible outside that file",
              "Not using !default in library partials, making them impossible to configure from consumer code",
            ],
          },
        },
        {
          id: "scss-nesting",
          title: "Nesting",
          iconName: "Layers",
          link: "https://sass-lang.com/documentation/style-rules/declarations/#nesting",
          theory: "SCSS lets you nest selectors inside one another, mirroring the HTML structure. The parent selector & refers to the current selector and is used for modifiers, pseudo-classes, and BEM-style naming.",
          theoryDetail: {
            keyConcepts: [
              "Nested rules compile to descendant selectors: .card { .title {} } → .card .title {}",
              "& is replaced by the parent selector: .button { &:hover {} } → .button:hover {}",
              "& can be used as a suffix for BEM modifiers: .card { &--featured {} } → .card--featured {}",
            ],
            whyItMatters:
              "Nesting keeps related styles together and eliminates repetitive selector prefixes. It makes component-level stylesheets easier to scan and less error-prone to refactor.",
            commonPitfalls: [
              "Over-nesting beyond 3 levels — produces overly specific selectors that are hard to override",
              "Generating huge selector chains that bloat the compiled CSS",
              "Forgetting that nesting always creates descendant selectors unless & is used",
            ],
          },
        },
        {
          id: "scss-partials-use",
          title: "Partials & @use / @forward",
          iconName: "FileCode2",
          link: "https://sass-lang.com/documentation/at-rules/use/",
          theory: "Partials are SCSS files prefixed with _ (e.g. _variables.scss) that are not compiled directly but imported into other files. @use loads a module with its own namespace; @forward re-exports it for consumers.",
          theoryDetail: {
            keyConcepts: [
              "A partial named _tokens.scss is loaded with @use 'tokens'; — the underscore and extension are omitted",
              "@use creates a namespace: @use 'tokens'; then tokens.$brand-color — prevents name collisions",
              "@forward makes a partial's members available to files that @use the forwarding file",
            ],
            whyItMatters:
              "The @use / @forward module system replaced the deprecated @import. It eliminates global namespace pollution and makes dependency graphs explicit, enabling tree-shaking and preventing duplicate CSS output.",
            commonPitfalls: [
              "Still using @import — it loads everything into a global scope and will be removed from Sass",
              "Forgetting the namespace prefix when accessing members from a @use'd module",
              "Creating circular @forward chains that confuse the Sass compiler",
            ],
          },
        },
      ],
    },
    {
      id: "scss-features",
      title: "Core Features",
      iconName: "Wrench",
      theory: "Mixins, functions, and placeholder selectors are the three mechanisms Sass provides for abstraction and code reuse. Each has a different purpose: mixins emit CSS rules, functions return values, and placeholders share selectors without duplication.",
      theoryDetail: {
        keyConcepts: [
          "Mixins (@mixin / @include) generate CSS declarations or full rule-sets and accept arguments",
          "Functions (@function / @return) compute and return a value — they emit no CSS themselves",
          "Placeholder selectors (%) are like classes that only exist in compiled output via @extend",
        ],
        whyItMatters:
          "Without mixins and functions, Sass variables alone still leave a lot of repetition. These three features are what make Sass genuinely DRY — a single mixin can produce vendor-prefixed properties, responsive font sizes, or full button variants from a handful of arguments.",
        commonPitfalls: [
          "Using a mixin when a CSS custom property or a function would be more appropriate",
          "Excessive @extend usage creating massive comma-separated selectors in compiled output",
          "Writing functions that have side effects (emitting CSS) — functions must only return values",
        ],
      },
      children: [
        {
          id: "scss-mixins",
          title: "Mixins",
          iconName: "Blocks",
          link: "https://sass-lang.com/documentation/at-rules/mixin/",
          theory: "A mixin is a reusable block of CSS declarations (or full rules) defined with @mixin and included with @include. Mixins accept arguments with optional defaults, making them highly flexible.",
          theoryDetail: {
            keyConcepts: [
              "@mixin flex-center { display: flex; align-items: center; justify-content: center; }",
              "Arguments with defaults: @mixin button($bg: blue, $color: white) { … }",
              "@content block: wrapping @include inside @mixin allows the caller to inject additional CSS",
            ],
            whyItMatters:
              "Mixins eliminate copy-paste of vendor prefixes, repeated media query breakpoints, and multi-property patterns like flex centering. A responsive mixin can convert any block to a mobile-first component with a single @include.",
            commonPitfalls: [
              "Creating mixins for trivial one-liners — a utility class or custom property is simpler",
              "Not using @content when a mixin should wrap caller-supplied CSS",
              "Overloading a single mixin with too many arguments — split into focused mixins instead",
            ],
          },
        },
        {
          id: "scss-functions",
          title: "Functions",
          iconName: "FunctionSquare",
          link: "https://sass-lang.com/documentation/at-rules/function/",
          theory: "Sass functions compute a value and return it with @return. They are invoked like CSS function calls and can perform arithmetic, string manipulation, or colour math. Sass ships many built-in functions; you can also write custom ones.",
          theoryDetail: {
            keyConcepts: [
              "@function rem($px) { @return $px / 16px * 1rem; } — converts px to rem",
              "Built-in colour functions: lighten(), darken(), mix(), adjust-color(), scale-color()",
              "math.div($a, $b) from @use 'sass:math' — the safe division function replacing the / operator",
            ],
            whyItMatters:
              "Functions let you express design calculations in SCSS rather than pre-computing magic numbers. Colour functions, unit conversions, and spacing-scale generators all become first-class constructs.",
            commonPitfalls: [
              "Using / for division directly — it is ambiguous in CSS (font shorthand) and deprecated in Sass; use math.div()",
              "Writing functions that @include or output CSS — functions must return only a value",
              "Reinventing built-in functions — always check sass:math, sass:color, sass:string, sass:list first",
            ],
          },
        },
        {
          id: "scss-extend-placeholders",
          title: "Extend & Placeholders",
          iconName: "Share2",
          link: "https://sass-lang.com/documentation/at-rules/extend/",
          theory: "@extend makes one selector share the styles of another. Placeholder selectors (% prefix) are invisible in output until extended — they exist solely to be extended, producing no CSS on their own.",
          theoryDetail: {
            keyConcepts: [
              "%visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }",
              ".sr-only { @extend %visually-hidden; } — .sr-only gets all those declarations in compiled CSS",
              "@extend groups selectors with a comma: .a, .b { … } — both share the same declarations",
            ],
            whyItMatters:
              "Placeholders let you define reusable patterns (e.g. clearfix, visually-hidden, button-reset) that produce no CSS unless explicitly extended. This is lighter than a mixin because no CSS is duplicated — selectors are merged instead.",
            commonPitfalls: [
              "Extending real classes across files — can create unpredictable selector output",
              "Using @extend inside media queries — Sass will throw an error because you can't extend across query boundaries",
              "Preferring @extend over mixins everywhere — extend can bloat compiled output with long selector lists",
            ],
          },
        },
      ],
    },
    {
      id: "scss-control-directives",
      title: "Control Directives",
      iconName: "GitBranch",
      theory: "Sass provides programming constructs — @if, @each, @for, and @while — that run at compile time. They enable generating repetitive CSS (utility classes, grid variants, colour scales) programmatically rather than by hand.",
      theoryDetail: {
        keyConcepts: [
          "@if / @else if / @else — conditional CSS generation based on variable values or arguments",
          "@each $item in $list — iterate over a Sass list or map and emit a rule per item",
          "@for $i from 1 through 12 — numeric loop, inclusive of the end value",
        ],
        whyItMatters:
          "Utility-first frameworks like Tailwind generate thousands of classes with loops. Writing your own @each loops over a colour map or spacing scale produces consistent, DRY CSS that would take hours to write by hand.",
        commonPitfalls: [
          "Using @while without a termination condition — an infinite loop will hang the Sass compiler",
          "Generating CSS that is never used — prefer generating only what is needed or purging unused output",
          "Forgetting that through is inclusive and to is exclusive in @for loops",
        ],
      },
      children: [
        {
          id: "scss-if-else",
          title: "@if / @else",
          iconName: "GitMerge",
          link: "https://sass-lang.com/documentation/at-rules/control/if/",
          theory: "@if evaluates a Sass expression and conditionally emits CSS. It is most useful inside mixins to branch behaviour based on an argument.",
          theoryDetail: {
            keyConcepts: [
              "@if $theme == dark { background: #000; } @else { background: #fff; }",
              "Conditions can use ==, !=, <, >, and, or, not",
              "if() is an inline function: color: if($dark, white, black); — useful for single-value branches",
            ],
            whyItMatters:
              "Conditional compilation lets a single mixin handle light/dark themes, LTR/RTL layouts, or size variants without duplicating the mixin. It moves the branching logic into the SCSS rather than the HTML.",
            commonPitfalls: [
              "Using string comparison without quoting: @if $val == foo — always use quoted strings or unambiguous values",
              "Writing complex nested @if trees in mixins — break into smaller mixins instead",
            ],
          },
        },
        {
          id: "scss-each-for",
          title: "@each & @for",
          iconName: "RefreshCw",
          link: "https://sass-lang.com/documentation/at-rules/control/each/",
          theory: "@each iterates over lists and maps to generate repeated CSS. @for iterates over a numeric range. Both are compile-time constructs that emit static CSS.",
          theoryDetail: {
            keyConcepts: [
              "@each $color in red, green, blue { .text-#{$color} { color: $color; } }",
              "@each $key, $val in $map — destructures map entries into key and value variables",
              "@for $i from 1 through 5 { .col-#{$i} { width: $i * 20%; } }",
            ],
            whyItMatters:
              "Loops replace hand-written repetitive classes. Generating a 12-column grid, a spacing scale, or a full colour palette with a loop takes 5 lines instead of 50 and is trivially updated by changing the source list.",
            commonPitfalls: [
              "Using string interpolation #{$var} correctly — required when the variable appears in a selector or property name",
              "Forgetting that @for with through includes the last number but to excludes it",
              "Iterating maps with @each but not destructuring both key and value with two variables",
            ],
          },
        },
      ],
    },
    {
      id: "scss-maps-lists",
      title: "Maps & Lists",
      iconName: "Database",
      theory: "Sass lists and maps are data structures available at compile time. Lists are ordered sequences of values; maps are key-value stores. Both are central to design-token systems and programmatic CSS generation.",
      theoryDetail: {
        keyConcepts: [
          "List: $sizes: 4px, 8px, 16px, 32px; — access with list.nth($sizes, 2) (1-indexed)",
          "Map: $colors: ('primary': #3b82f6, 'danger': #ef4444); — access with map.get($colors, 'primary')",
          "Both must @use 'sass:list' and @use 'sass:map' to access their built-in functions",
        ],
        whyItMatters:
          "Maps are the native Sass way to store design tokens. Iterating a map with @each generates consistent utility classes and eliminates the risk of a token name typo in a raw string.",
        commonPitfalls: [
          "Using the deprecated map-get() global function instead of map.get() from @use 'sass:map'",
          "Expecting maps to be ordered — Sass maps preserve insertion order but avoid relying on it for logic",
          "Using comma-separated values where a list function expects a space-separated list — be explicit with separators",
        ],
      },
      children: [
        {
          id: "scss-maps",
          title: "Maps",
          iconName: "LayoutList",
          link: "https://sass-lang.com/documentation/values/maps/",
          theory: "Maps associate keys with values. They are the primary tool for design-token collections such as colour palettes, spacing scales, and breakpoint sets.",
          theoryDetail: {
            keyConcepts: [
              "$breakpoints: ('sm': 640px, 'md': 768px, 'lg': 1024px, 'xl': 1280px);",
              "map.get($breakpoints, 'md') returns 768px",
              "map.merge($map1, $map2) non-destructively combines two maps",
            ],
            whyItMatters:
              "A breakpoint map paired with an @each loop generates all responsive utility classes from a single source of truth, making breakpoint changes a one-line edit.",
            commonPitfalls: [
              "Accessing a missing key returns null — always guard with map.has-key() or provide a fallback",
              "Nesting maps require map.get called twice or using deep-map utilities",
            ],
          },
        },
        {
          id: "scss-built-in-modules",
          title: "Built-in Modules",
          iconName: "Package",
          link: "https://sass-lang.com/documentation/modules/",
          theory: "Sass ships several built-in modules — sass:math, sass:color, sass:string, sass:list, sass:map, sass:selector, sass:meta. Load them with @use and call their functions with a namespace.",
          theoryDetail: {
            keyConcepts: [
              "@use 'sass:math'; then math.div(10px, 2) for safe division",
              "@use 'sass:color'; then color.adjust($c, $lightness: 10%) — modern alternative to lighten()",
              "@use 'sass:string'; then string.to-upper-case('hello') → 'HELLO'",
            ],
            whyItMatters:
              "The built-in modules replace the old global functions (lighten, darken, percentage, nth …) that are now deprecated. Using the namespaced versions future-proofs code and avoids name collisions with author-defined functions.",
            commonPitfalls: [
              "Calling global built-in functions (lighten(), darken()) — they are deprecated and will be removed",
              "Forgetting the namespace: math.div not div, color.adjust not adjust-color",
              "Not importing the required module before calling its functions — the compiler will error",
            ],
          },
        },
      ],
    },
    {
      id: "scss-architecture",
      title: "Architecture & Best Practices",
      iconName: "FolderOpen",
      theory: "Organising SCSS at scale requires a deliberate folder structure and clear conventions. The 7-1 pattern is the most widely referenced architecture. BEM combined with SCSS nesting keeps component styles encapsulated and predictable.",
      theoryDetail: {
        keyConcepts: [
          "7-1 pattern: abstracts/, base/, components/, layout/, pages/, themes/, vendors/ — all forwarded from a single main.scss",
          "BEM (Block__Element--Modifier) with SCSS nesting avoids deep selector chains while remaining readable",
          "Keep partials small and single-purpose; use @forward in index files to re-export a folder's members",
        ],
        whyItMatters:
          "Without an architecture, SCSS projects degrade into a tangle of global variables and specificity battles. A consistent folder structure and naming convention make onboarding new contributors fast and refactoring safe.",
        commonPitfalls: [
          "Creating a single mega-file instead of partials — kills code review and merge conflict resolution",
          "Mixing global resets with component styles in the same partial",
          "Not documenting the token system — new contributors overwrite existing variables rather than using them",
        ],
      },
      children: [
        {
          id: "scss-7-1-pattern",
          title: "The 7-1 Pattern",
          iconName: "FolderTree",
          link: "https://sass-guidelin.es/#the-7-1-pattern",
          theory: "The 7-1 pattern organises SCSS into 7 folders and 1 main entry file that imports them all. Each folder has a clear responsibility, making the codebase easy to navigate.",
          theoryDetail: {
            keyConcepts: [
              "abstracts/ — variables, mixins, functions, and placeholders (no CSS output)",
              "base/ — resets, typography defaults, and global element styles",
              "components/ — self-contained UI components (button, card, modal)",
              "layout/ — macro layout (header, footer, sidebar, grid system)",
              "pages/ — page-specific overrides (home.scss, about.scss)",
              "themes/ — dark/light theme overrides",
              "vendors/ — third-party library overrides",
            ],
            whyItMatters:
              "The 7-1 pattern scales from small projects to large design systems. Every new file has an obvious home, and the main entry file acts as a manifest that documents the full stylesheet architecture.",
            commonPitfalls: [
              "Putting component-specific variables in abstracts/ — keep them in the component partial",
              "Skipping the pattern on small projects — bad habits are hard to undo as projects grow",
            ],
          },
        },
        {
          id: "scss-bem",
          title: "BEM with SCSS",
          iconName: "Boxes",
          link: "https://getbem.com/",
          theory: "BEM (Block, Element, Modifier) is a naming convention that maps cleanly to SCSS nesting. The & parent selector generates BEM class names without repeating the block name.",
          theoryDetail: {
            keyConcepts: [
              ".card { &__title { … } &__body { … } &--featured { … } } compiles to .card__title, .card__body, .card--featured",
              "Block: an independent component (.card); Element: a child of the block (.card__title); Modifier: a variant (.card--featured)",
              "BEM eliminates descendant selectors, keeping specificity flat and predictable",
            ],
            whyItMatters:
              "BEM combined with SCSS nesting gives you the readability of nested source code and the specificity safety of flat CSS output. It is the industry standard naming convention for component-based CSS.",
            commonPitfalls: [
              "Nesting BEM elements inside each other in SCSS — they compile to descendant selectors, breaking the BEM contract",
              "Using more than one modifier on an element — combine modifiers into a single class or use data attributes",
              "Deep BEM hierarchies (.block__element__sub-element) — BEM elements are always direct descendants of the block, not of each other",
            ],
          },
        },
      ],
    },
    {
      id: "scss-interview-questions",
      title: "Interview Questions",
      iconName: "HelpCircle",
      theory: "SCSS/Sass interview questions test your understanding of the preprocessor model, the module system, and when to use Sass features versus native CSS. Be ready to discuss trade-offs and modern best practices.",
      theoryDetail: {
        keyConcepts: [
          "Know the difference between Sass variables and CSS custom properties and when to use each",
          "Understand the @use / @forward module system and why @import is deprecated",
          "Be able to explain mixins vs functions vs @extend and their compiled output differences",
        ],
        whyItMatters:
          "SCSS expertise signals that you can maintain large-scale stylesheets, implement design systems, and write CSS that is DRY, scalable, and predictable across a team.",
        commonPitfalls: [
          "Describing outdated Sass features (LibSass, @import, global functions) as current best practice",
          "Not being able to explain what compiled CSS actually looks like from a given SCSS snippet",
        ],
      },
      children: [
        {
          id: "scss-q-variables-vs-custom-props",
          title: "Sass Variables vs CSS Custom Properties",
          iconName: "HelpCircle",
          theory: "Sass variables ($var) are resolved at compile time and erased from the output. CSS custom properties (--var) survive in the output and can be changed at runtime with JavaScript or via :root overrides. Use Sass vars for build-time tokens; use custom properties for runtime-mutable design tokens like theme colours.",
          theoryDetail: {
            keyConcepts: [
              "Sass variable: $brand: #3b82f6; — gone after compilation, no overhead in the browser",
              "CSS custom property: --brand: #3b82f6; — lives in the stylesheet, can be updated by JS or cascade",
              "Modern pattern: use Sass to generate custom property declarations, keeping both worlds",
            ],
            whyItMatters:
              "This distinction is a common interview topic. The wrong answer ('they're the same') reveals a surface-level understanding of SCSS.",
            commonPitfalls: [
              "Saying CSS custom properties replaced Sass variables completely — both have distinct use-cases",
              "Using Sass variables for theme colours when dark-mode switching requires runtime updates",
            ],
          },
        },
        {
          id: "scss-q-mixin-vs-extend",
          title: "Mixin vs @extend — When to Use Which",
          iconName: "HelpCircle",
          theory: "Mixins duplicate CSS declarations at every @include site (output grows with usage). @extend merges selectors so the declarations appear once (output stays flat). Prefer mixins for parameterised patterns; prefer @extend (with placeholders) for static, shared rule-sets like visually-hidden or clearfix.",
          theoryDetail: {
            keyConcepts: [
              "Mixin with 10 @include calls → declarations duplicated 10 times in the output",
              "@extend with 10 usages → one declaration block, 10-selector comma list",
              "@extend cannot be used inside @media queries — this is a hard compiler limitation",
            ],
            whyItMatters:
              "The mixin-vs-extend trade-off is a classic SCSS interview question. Knowing the compiled output difference and the @media constraint demonstrates real-world experience.",
            commonPitfalls: [
              "Using @extend inside media queries — Sass will throw an error",
              "Extending real selector classes across files — creates hard-to-predict compiled output",
            ],
          },
        },
        {
          id: "scss-q-import-vs-use",
          title: "@import vs @use / @forward",
          iconName: "HelpCircle",
          theory: "@import dumps all members into a global namespace and re-executes the file on each import, potentially duplicating CSS output. @use creates a private namespace and loads each file only once. @forward selectively exposes members to consumers of a module.",
          theoryDetail: {
            keyConcepts: [
              "@import is deprecated and scheduled for removal from the Sass language",
              "@use 'sass:math' as m; creates an alias: m.div(10, 2)",
              "@forward 'tokens' show $brand-color, $spacing; — explicit API surface for a module",
            ],
            whyItMatters:
              "All new Sass code should use @use and @forward. Interviewers expect you to know this distinction and to explain why @import is problematic at scale.",
            commonPitfalls: [
              "Writing new SCSS with @import because tutorials still show the old syntax",
              "Not knowing that @use requires specifying the namespace, breaking code that relies on global access",
            ],
          },
        },
      ],
    },
  ],
};

export default scss;
