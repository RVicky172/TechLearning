import type { TopicNode } from "@/data/types";

export const tailwindAdvanced: TopicNode = {
  id: "tailwind-advanced",
  title: "Advanced Patterns",
  iconName: "Sparkles",
  link: "https://tailwindcss.com/docs/reusing-styles",
  theory:
    "Advanced Tailwind usage centres on component abstraction patterns (CVA, cn()), the group and peer pseudo-class variants for parent-driven styling, and animation utilities. The goal is expressive, type-safe component APIs without leaving the utility-class model.",
  theoryDetail: {
    keyConcepts: [
      "class-variance-authority (CVA): defines typed variant props that map to Tailwind class strings — replaces ad-hoc if/else class logic",
      "tailwind-merge (twMerge): intelligently merges Tailwind classes, resolving conflicts (e.g. p-4 + p-6 → p-6) — always wrap with cn()",
      "group / group-hover: parent container gets group class; children use group-hover:visible to respond to the parent's hover state",
      "peer / peer-invalid: sibling element gets peer; subsequent sibling uses peer-invalid:block to react to the peer's state — powerful for form validation UI",
      "animate-*: built-in animations — animate-spin, animate-pulse, animate-bounce, animate-ping for loading states",
      "@layer utilities: write custom utilities inside @layer utilities {} so they respect Tailwind's purge and specificity rules",
      "transition + duration + ease: compose transition animations with transition-colors duration-200 ease-in-out",
    ],
    whyItMatters:
      "CVA + cn() is the dominant pattern for building design system components in Next.js/React projects — it's the approach used by shadcn/ui, which is installed in millions of projects. Understanding group and peer unlocks interactive UI patterns with no JavaScript.",
    commonPitfalls: [
      "Forgetting tailwind-merge when merging external className prop — without twMerge, conflicting utilities like p-4 and p-6 both apply and the last one wins unpredictably",
      "Using group without scoping — nested groups can interfere with each other; use group/{name} named groups in Tailwind v3.2+",
      "Animating layout properties (width, height) — these trigger reflow; animate transform and opacity instead for 60 fps animations",
    ],
    examples: [
      {
        title: "Button component with CVA variants + cn()",
        description:
          "Type-safe variant props that compile to Tailwind class strings — no custom CSS needed.",
        code: `import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base classes applied to all variants
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium " +
  "transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:   "bg-violet-600 text-white hover:bg-violet-700 focus-visible:ring-violet-600",
        secondary: "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50",
        ghost:     "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
        danger:    "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
      },
      size: {
        sm:   "h-8  px-3 text-xs",
        md:   "h-10 px-4",
        lg:   "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

// Usage
<Button variant="secondary" size="sm">Cancel</Button>
<Button variant="danger">Delete account</Button>`,
        language: "tsx",
      },
    ],
  },
};
