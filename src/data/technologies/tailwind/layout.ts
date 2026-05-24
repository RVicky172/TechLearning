import type { TopicNode } from "@/data/types";

export const tailwindLayout: TopicNode = {
  id: "tailwind-layout",
  title: "Layout & Responsive Design",
  iconName: "LayoutGrid",
  link: "https://tailwindcss.com/docs/display",
  theory:
    "Tailwind wraps CSS Flexbox and Grid in concise utility classes with responsive variants. The mobile-first breakpoint system means you write the base (small-screen) style first, then layer on overrides at sm:, md:, lg: etc.",
  theoryDetail: {
    keyConcepts: [
      "flex, flex-row, flex-col, items-center, justify-between: the core flexbox utilities",
      "grid, grid-cols-{n}, col-span-{n}, gap-{n}: CSS Grid utilities — grid-cols-12 with col-span-* for complex layouts",
      "Breakpoints (mobile-first): sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px) — un-prefixed = all sizes",
      "container + mx-auto: centres content with responsive max-width; add px-4 or px-6 for side padding",
      "space-x-{n} / space-y-{n}: adds margin between direct children — simpler than adding margin to each child individually",
      "aspect-ratio: aspect-video (16/9), aspect-square — eliminates manual padding-top hacks for responsive iframes/images",
      "Arbitrary values: w-[340px], text-[13px], bg-[#ff6b6b] — escape the design system for one-off values without custom config",
    ],
    whyItMatters:
      "Responsive layout is the core of frontend work. Tailwind's breakpoint system makes it trivial to write 'stack on mobile, side-by-side on desktop' layouts without a single media query in CSS — all expressed inline in JSX.",
    commonPitfalls: [
      "Thinking desktop-first — Tailwind is mobile-first; the base style applies to the smallest screens; use sm:, md: to progressively add layout",
      "Using w-full unnecessarily — block elements are full-width by default; use w-full on flex children when needed",
      "Forgetting min-w-0 on flex children — text truncation (truncate) inside a flex child requires min-w-0 on the flex child to work",
    ],
    examples: [
      {
        title: "Responsive page layout — sidebar + content",
        description: "Stack vertically on mobile, side-by-side on desktop with a fixed-width sidebar.",
        code: `// Mobile: full-width stack. lg+: fixed sidebar + flexible content
export function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 lg:flex-row">

        {/* Sidebar — full width on mobile, fixed 240px on lg+ */}
        <aside className="w-full shrink-0 lg:w-60">
          <nav className="sticky top-20 space-y-1">
            {/* nav items */}
          </nav>
        </aside>

        {/* Main content — grows to fill remaining space */}
        <main className="min-w-0 flex-1">
          {children}
        </main>

      </div>
    </div>
  );
}

// Responsive grid — 1 col → 2 col → 3 col
export function CardGrid({ items }: { items: string[] }) {
  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <li key={item} className="rounded-xl border p-4">{item}</li>
      ))}
    </ul>
  );
}`,
        language: "tsx",
      },
    ],
  },
};
