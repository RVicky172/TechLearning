import type { TopicNode } from "@/data/types";

export const stylingStrategies: TopicNode = {
  id: "react-styling-strategies",
  title: "Styling Strategies",
  iconName: "Palette",
  theory:
    "React doesn't enforce a specific way to style components. Over the years, the ecosystem has evolved from global CSS to CSS Modules, CSS-in-JS (Styled Components, Emotion), Utility-first CSS (Tailwind), and UI component libraries (Radix, Shadcn UI). Choosing the right strategy impacts your bundle size, developer experience, and maintainability.",
  theoryDetail: {
    keyConcepts: [
      "CSS Modules: Scopes CSS locally to the component by generating unique class names at build time",
      "Utility-first (Tailwind CSS): Uses predefined utility classes directly in JSX — highly composable and eliminates unused CSS",
      "CSS-in-JS: Writes CSS directly inside JavaScript (e.g., Styled Components) — dynamic based on props, but has runtime overhead",
      "Headless UI: Unstyled, fully accessible component logic (Radix, Headless UI) that you style yourself (Shadcn UI approach)",
    ],
    whyItMatters:
      "Global CSS scales poorly in large apps — class name collisions are inevitable. Modern styling strategies solve encapsulation. Tailwind has become the industry standard for rapid development and zero-runtime overhead, while Headless UI libraries solve the accessibility and interactivity complexity without dictating visual design.",
    commonPitfalls: [
      "Using global CSS for component-specific styles — leads to naming collisions and specificity wars",
      "Using runtime CSS-in-JS (Styled Components, Emotion) in React Server Components — they do not support streaming SSR properly",
      "Building complex UI components (Select, Modal) from scratch without a Headless UI library — you will likely fail at accessibility (a11y)",
      "Dynamic class name string interpolation in Tailwind (e.g., \`bg-\${color}-500\`) — Tailwind's compiler won't see it and will purge the class",
    ],
    examples: [
      {
        title: "CSS Modules",
        description:
          "Traditional CSS, but scoped locally to the component. Best for teams migrating from traditional web dev.",
        code: `// Button.module.css
.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background-color: blue;
  color: white;
}
.btnPrimary { background-color: darkblue; }
.btnDisabled { opacity: 0.5; pointer-events: none; }

// Button.tsx
import styles from './Button.module.css';

export function Button({ isPrimary, disabled, children }) {
  // Combine classes based on props
  const classNames = [
    styles.btn,
    isPrimary ? styles.btnPrimary : '',
    disabled ? styles.btnDisabled : ''
  ].join(' ');

  return <button className={classNames} disabled={disabled}>{children}</button>;
}`,
        language: "tsx",
      },
      {
        title: "Tailwind CSS (Utility-first)",
        description:
          "The modern standard. Styling happens entirely in the class attribute. Zero runtime overhead, great for RSCs.",
        code: `// Button.tsx
// Using 'clsx' or 'tailwind-merge' is common for conditional classes
import { twMerge } from 'tailwind-merge';

export function Button({ isPrimary, disabled, children }) {
  return (
    <button
      disabled={disabled}
      className={twMerge(
        // Base styles
        "px-4 py-2 rounded-md font-medium transition-colors",
        // Conditional styles
        isPrimary 
          ? "bg-blue-600 text-white hover:bg-blue-700" 
          : "bg-gray-200 text-gray-900 hover:bg-gray-300",
        // Disabled state
        disabled && "opacity-50 cursor-not-allowed hover:bg-blue-600"
      )}
    >
      {children}
    </button>
  );
}`,
        language: "tsx",
      },
      {
        title: "Headless UI + Tailwind (The Shadcn approach)",
        description:
          "Use a library for accessibility/logic (Radix UI), and Tailwind for styling. You own the code.",
        code: `import * as Dialog from '@radix-ui/react-dialog';

export function AccessibleModal() {
  return (
    <Dialog.Root>
      {/* Radix handles all the ARIA roles and keyboard interactions */}
      <Dialog.Trigger className="bg-black text-white px-4 py-2 rounded">
        Open Modal
      </Dialog.Trigger>
      
      {/* Radix handles portaling the modal to the body */}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl w-96">
          <Dialog.Title className="text-xl font-bold">Are you sure?</Dialog.Title>
          <Dialog.Description className="mt-2 text-gray-600">
            This action cannot be undone.
          </Dialog.Description>
          
          <div className="mt-6 flex justify-end gap-3">
            <Dialog.Close className="px-4 py-2 bg-gray-200 rounded">
              Cancel
            </Dialog.Close>
            <button className="px-4 py-2 bg-red-500 text-white rounded">
              Delete
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}`,
        language: "tsx",
      },
    ],
  },
};
