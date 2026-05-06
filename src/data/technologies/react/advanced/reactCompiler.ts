import type { TopicNode } from "@/data/types";

export const reactCompiler: TopicNode = {
  id: "react-compiler",
  title: "React Compiler",
  iconName: "Cpu",
  link: "https://react.dev/learn/react-compiler",
  theory:
    "The React Compiler (formerly React Forget) automatically memoizes components, hooks, and expressions at build time. It eliminates the need for manual useMemo, useCallback, and React.memo in most cases by analyzing your code and inserting fine-grained memoization where it provides real benefit.",
  theoryDetail: {
    keyConcepts: [
      "The compiler analyzes your component code at build time and inserts memoization automatically — no manual useMemo/useCallback needed",
      "It respects the Rules of React: components must be pure, hooks must follow the rules of hooks, props must be immutable",
      "Components that violate the Rules of React are skipped by the compiler — they still work but don't get optimized",
      "The compiler works with Babel or SWC as a plugin in your build pipeline (Next.js, Vite, etc.)",
      "'use no memo' directive opts a component out of compiler optimization if needed",
      "eslint-plugin-react-compiler helps catch code patterns the compiler can't optimize",
    ],
    whyItMatters:
      "Manual memoization (useMemo, useCallback, React.memo) is the #1 source of complexity in React codebases. Developers either over-memoize (wasting effort), under-memoize (causing performance bugs), or get dependency arrays wrong (causing stale data). The compiler eliminates this entire class of problems by doing it automatically and correctly.",
    commonPitfalls: [
      "Assuming the compiler fixes broken code — it only optimizes components that follow the Rules of React",
      "Mutating props or state directly — the compiler can't optimize code with side effects in render",
      "Not installing eslint-plugin-react-compiler — the linter warns about code the compiler will skip",
      "Removing all manual memoization before the compiler is actually enabled — verify the build setup first",
      "Expecting the compiler to optimize third-party libraries — it only processes your source code",
    ],
    examples: [
      {
        title: "Before vs After React Compiler",
        description:
          "The compiler automatically inserts the memoization you used to write manually. Your source code stays simple.",
        code: `// ──── WHAT YOU WRITE (with compiler) ────
function ProductList({ products, category }) {
  // ✅ Just write normal code — compiler memoizes automatically
  const filtered = products.filter(p => p.category === category);
  const sorted = filtered.sort((a, b) => a.price - b.price);
  const total = sorted.reduce((sum, p) => sum + p.price, 0);

  return (
    <div>
      <h2>{category} ({filtered.length} items, \${total})</h2>
      {sorted.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

// ──── WHAT THE COMPILER GENERATES (approximately) ────
function ProductList({ products, category }) {
  const $ = _c(6);     // compiler-managed cache slots
  let filtered, sorted, total;

  if ($[0] !== products || $[1] !== category) {
    filtered = products.filter(p => p.category === category);
    sorted = filtered.sort((a, b) => a.price - b.price);
    total = sorted.reduce((sum, p) => sum + p.price, 0);
    $[0] = products; $[1] = category;
    $[2] = filtered; $[3] = sorted; $[4] = total;
  } else {
    filtered = $[2]; sorted = $[3]; total = $[4];
  }
  // ... rest is also memoized
}`,
        language: "tsx",
      },
      {
        title: "Setting Up React Compiler in Next.js",
        description:
          "Enable the compiler in your Next.js project. It's a one-line config change.",
        code: `// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,   // ← That's it!
  },
};

export default nextConfig;

// ────────────────────────────
// Install the dependencies:
// npm install -D babel-plugin-react-compiler
// npm install -D eslint-plugin-react-compiler

// ────────────────────────────
// .eslintrc.js — add the compiler lint rules
module.exports = {
  plugins: ['react-compiler'],
  rules: {
    'react-compiler/react-compiler': 'error',
  },
};

// ────────────────────────────
// The linter will warn about patterns the compiler can't optimize:
// ⚠️ "Mutating a value returned from a function whose return value
//     should not be mutated"
// ⚠️ "React Compiler has skipped optimizing this component"`,
        language: "typescript",
      },
      {
        title: "Rules of React — What the Compiler Requires",
        description:
          "The compiler can only optimize code that follows React's rules. Here are the patterns it catches.",
        code: `// ❌ BAD — Compiler skips: mutating during render
function BadComponent({ items }) {
  items.sort();  // Mutating a prop!
  return <List data={items} />;
}

// ✅ GOOD — Pure: create new arrays
function GoodComponent({ items }) {
  const sorted = [...items].sort();  // New array
  return <List data={sorted} />;
}

// ──────────────────────────────────

// ❌ BAD — Side effect during render
function BadCounter() {
  let count = 0;
  count++;  // Side effect outside React's control
  return <p>{count}</p>;
}

// ✅ GOOD — Use state for values that change
function GoodCounter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

// ──────────────────────────────────

// Opt out of compiler for a specific component
// when you intentionally break the rules (rare)
'use no memo';
function LegacyIntegration({ mutableRef }) {
  // This component intentionally mutates and shouldn't be memoized
  mutableRef.current.update();
  return <div />;
}`,
        language: "tsx",
      },
    ],
  },
};
