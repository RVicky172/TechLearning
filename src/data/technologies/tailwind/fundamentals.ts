import type { TopicNode } from "@/data/types";

export const tailwindFundamentals: TopicNode = {
  id: "tailwind-fundamentals",
  title: "Utility-First Philosophy",
  iconName: "Palette",
  link: "https://tailwindcss.com/docs/utility-first",
  theory:
    "Tailwind CSS is a utility-first framework — instead of writing semantic CSS classes like .card or .btn, you compose styles directly in HTML/JSX using small single-purpose classes like flex, p-4, bg-white, and rounded-xl. This eliminates the naming problem, keeps styles co-located with markup, and makes dead code elimination trivially easy.",
  theoryDetail: {
    keyConcepts: [
      "Utility classes: each class applies exactly one CSS property — text-lg sets font-size, font-bold sets font-weight, etc.",
      "JIT (Just-in-Time) engine: Tailwind scans your source files and generates only the CSS for classes that are actually used — zero unused CSS in production",
      "Responsive prefixes: sm:, md:, lg:, xl:, 2xl: apply utilities at specific breakpoints (mobile-first — base styles apply to all, sm: and up override)",
      "State variants: hover:, focus:, active:, disabled:, group-hover: — apply utilities conditionally without writing custom CSS",
      "Dark mode: dark: prefix applies utilities when the user's OS is in dark mode (media) or when a .dark class is present (class strategy)",
      "cn() / clsx: utility for conditionally joining class strings — essential for component variants; combine with class-variance-authority (CVA) for typed variants",
      "Design tokens: Tailwind's theme defines spacing, colors, typography, and shadows as a consistent scale — 4 = 1rem, 8 = 2rem, etc.",
    ],
    whyItMatters:
      "Tailwind is the most widely adopted CSS framework in the React/Next.js ecosystem. It's the default in Next.js scaffolding and most modern UI libraries (shadcn/ui, Radix Themes) are built on it. Knowing Tailwind is a practical requirement for frontend and fullstack roles.",
    commonPitfalls: [
      "Building class strings with string concatenation — dynamic class names like 'text-' + color are not statically analysable by the JIT scanner; always write full class names",
      "Overusing @apply — @apply is an escape hatch, not a primary pattern; it defeats the purpose of utility-first and re-introduces the naming problem",
      "Mixing Tailwind with a CSS-in-JS library — specificity conflicts are hard to debug; choose one styling approach per project",
      "Not purging correctly — ensure content paths in tailwind.config include all files that contain class names (tsx, mdx, js templates)",
    ],
    examples: [
      {
        title: "Component built entirely with Tailwind utilities",
        description:
          "A Card component that handles responsive layout, dark mode, hover states, and variants with no custom CSS.",
        code: `import { cn } from "@/lib/utils";  // clsx + tailwind-merge wrapper

interface CardProps {
  title: string;
  description: string;
  variant?: "default" | "featured";
  className?: string;
}

export function Card({ title, description, variant = "default", className }: CardProps) {
  return (
    <article
      className={cn(
        // Base styles
        "rounded-2xl border p-6 transition-shadow duration-200",
        // Colours via CSS variables (supports theming)
        "bg-white dark:bg-zinc-900",
        "border-zinc-200 dark:border-zinc-800",
        // Hover
        "hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-zinc-900/50",
        // Variant
        variant === "featured" && "border-violet-500 ring-2 ring-violet-500/20",
        className,
      )}
    >
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
        {description}
      </p>
    </article>
  );
}`,
        language: "tsx",
      },
    ],
  },
};
