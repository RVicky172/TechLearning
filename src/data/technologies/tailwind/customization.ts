import type { TopicNode } from "@/data/types";

export const tailwindCustomization: TopicNode = {
  id: "tailwind-customization",
  title: "Configuration & Theming",
  iconName: "Settings",
  link: "https://tailwindcss.com/docs/configuration",
  theory:
    "tailwind.config.ts lets you extend or override Tailwind's default design system with your own tokens — brand colours, custom fonts, spacing values, and breakpoints. Custom CSS variables bridge Tailwind with dynamic theming (dark mode, user preferences).",
  theoryDetail: {
    keyConcepts: [
      "theme.extend: add to the default theme without replacing it — the safest way to add brand colours and custom values",
      "theme (without extend): replaces the entire default section — use only when you want full control with no defaults",
      "CSS variables as colour values: define --color-brand in :root, reference in Tailwind config as hsl(var(--color-brand)) — enables runtime theme switching",
      "content paths: tell Tailwind where to scan for class names — must include all files that generate class strings (tsx, mdx, js)",
      "plugins: extend Tailwind with custom utilities, components, or variant logic — official plugins: @tailwindcss/typography, @tailwindcss/forms",
      "@tailwindcss/typography (prose): applies beautiful typographic defaults to any HTML block — ideal for markdown/MDX rendering",
      "darkMode: 'class' vs 'media' — 'class' gives manual toggle control; 'media' follows OS preference",
    ],
    whyItMatters:
      "Custom Tailwind configuration is what transforms Tailwind from a generic framework into your design system. Token-based colours via CSS variables enable features like dark mode, colour themes, and accessibility contrast without component-level changes.",
    commonPitfalls: [
      "Hardcoding hex values in utilities instead of using theme tokens — bg-[#3b82f6] bypasses theming; define it in config and use bg-brand-500",
      "Missing content paths — if a file is not scanned, its classes are purged even if used; always test a production build",
      "Extending the font family without configuring fallback stacks — always include a generic fallback (sans, serif, mono) after your custom font",
    ],
    examples: [
      {
        title: "tailwind.config.ts with brand colours, CSS variable theming, and typography",
        description:
          "CSS variable colours enable a light/dark theme toggle controlled by adding/removing the .dark class on <html>.",
        code: `import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{ts,tsx,mdx}",
    "./app/**/*.{ts,tsx,mdx}",
  ],
  darkMode: "class",   // toggle with <html class="dark">
  theme: {
    extend: {
      colors: {
        // Reference CSS variables defined in globals.css
        // Usage: bg-brand, text-brand-muted, border-surface
        brand: {
          DEFAULT: "hsl(var(--color-brand))",
          muted:   "hsl(var(--color-brand-muted))",
          fg:      "hsl(var(--color-brand-fg))",
        },
        surface: "hsl(var(--color-surface))",
        border:  "hsl(var(--color-border))",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Menlo", "monospace"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),   // prose class for markdown
    require("@tailwindcss/forms"),         // sensible form element defaults
  ],
} satisfies Config;`,
        language: "typescript",
      },
      {
        title: "globals.css — CSS variable tokens for light and dark themes",
        description: "Define colour tokens once; Tailwind classes reference them everywhere.",
        code: `/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-brand:       220 90% 56%;   /* hsl(220, 90%, 56%) — blue */
    --color-brand-muted: 220 90% 80%;
    --color-brand-fg:    0 0% 100%;
    --color-surface:     0 0% 100%;
    --color-border:      220 13% 91%;
  }

  .dark {
    --color-brand:       220 90% 65%;
    --color-brand-muted: 220 90% 40%;
    --color-brand-fg:    0 0% 100%;
    --color-surface:     220 13% 10%;
    --color-border:      220 13% 20%;
  }
}`,
        language: "css",
      },
    ],
  },
};
