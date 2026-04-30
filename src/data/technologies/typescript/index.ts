import type { Technology } from "@/data/types";

const typescript: Technology = {
  id: "typescript",
  name: "TypeScript",
  description: "Strongly typed superset of JavaScript that catches bugs at compile time and improves IDE support.",
  color: "bg-blue-700",
  iconName: "FileCode2",
  deviconClass: "devicon-typescript-plain colored",
  tree: [
    {
      id: "ts-basics",
      title: "TypeScript Fundamentals",
      iconName: "BookOpen",
      theory: "TypeScript adds optional static types to JavaScript. Start here to understand how type annotations work and why they make your code more maintainable.",
      children: [
        {
          id: "ts-types",
          title: "Basic Types",
          iconName: "Tag",
          link: "https://www.typescriptlang.org/docs/handbook/2/basic-types.html",
          theory: "TypeScript supports primitives like string, number, boolean, arrays, tuples, and special types like any, unknown, and never."
        },
        {
          id: "ts-interfaces",
          title: "Interfaces & Type Aliases",
          iconName: "Shapes",
          link: "https://www.typescriptlang.org/docs/handbook/2/objects.html",
          theory: "Interfaces describe the shape of objects. Type aliases let you name any type. Both are key tools for modeling your domain."
        },
        {
          id: "ts-narrowing",
          title: "Type Narrowing",
          iconName: "Filter",
          link: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html",
          theory: "TypeScript narrows types based on control flow. Use typeof, instanceof, and 'in' guards to work safely with union types."
        }
      ]
    },
    {
      id: "ts-advanced",
      title: "Advanced Patterns",
      iconName: "Zap",
      theory: "Master TypeScript's most powerful features to write fully type-safe APIs, utilities, and libraries.",
      children: [
        {
          id: "ts-generics",
          title: "Generics",
          iconName: "Box",
          link: "https://www.typescriptlang.org/docs/handbook/2/generics.html",
          theory: "Generics let you write reusable functions and types that work with any type while preserving type safety."
        },
        {
          id: "ts-utility",
          title: "Utility Types",
          iconName: "Wrench",
          link: "https://www.typescriptlang.org/docs/handbook/utility-types.html",
          theory: "Partial, Required, Pick, Omit, Record and more — TypeScript ships built-in generic utilities for transforming existing types."
        },
        {
          id: "ts-conditional",
          title: "Conditional & Mapped Types",
          iconName: "GitBranch",
          link: "https://www.typescriptlang.org/docs/handbook/2/conditional-types.html",
          theory: "Conditional types choose between types based on a condition. Mapped types transform every property of an existing type."
        }
      ]
    }
  ]
};

export default typescript;
