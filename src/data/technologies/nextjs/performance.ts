import type { TopicNode } from "@/data/types";

export const nextjsPerformance: TopicNode = {
  id: "nextjs-performance",
  title: "Performance & Optimization",
  iconName: "Zap",
  theoryDetail: {
    keyConcepts: [
      "Image optimization with next/image: automatic format conversion, lazy loading, responsive images",
      "Code splitting: every route automatically becomes its own bundle to reduce JS download",
      "Dynamic imports with next/dynamic for large components that don't need SSR",
      "Font optimization: self-hosted fonts with @next/font reduce third-party requests",
      "Script optimization: defer, async, and worker threads available via next/script",
      "Bundle analysis: use @next/bundle-analyzer to identify large dependencies",
    ],
    whyItMatters:
      "Performance directly affects user experience and SEO rankings. Next.js provides built-in optimizations that are easy to use and drastically improve Core Web Vitals.",
    commonPitfalls: [
      "Using <img> instead of next/image; you lose automatic optimization",
      "Not setting width/height on images; causes layout shift and poor CLS scores",
      "Loading all fonts in layout.tsx; only load fonts you actually use",
      "Lazy-loading above-the-fold images; prioritize critical images with priority prop",
      "Not using dynamic imports for heavy client-side libraries (editors, charts, maps)",
      "Forgetting that code splitting happens per route; shared code is bundled into a separate chunk",
    ],
    examples: [
      {
        title: "Image Optimization",
        description: "Use next/image for automatic optimization.",
        code: `import Image from 'next/image';

export default function Hero() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero banner"
      width={1200}
      height={600}
      priority // Load immediately (for above-the-fold)
      sizes="(max-width: 768px) 100vw, 50vw" // Responsive sizes
    />
  );
}

// Lazy-loaded image (below-the-fold)
export function ProductImage() {
  return (
    <Image
      src="/product.jpg"
      alt="Product"
      width={400}
      height={400}
      loading="lazy"
    />
  );
}`,
        language: "typescript",
      },
      {
        title: "Dynamic Imports for Heavy Libraries",
        description: "Code-split large components and libraries.",
        code: `import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import heavy chart library
const Chart = dynamic(() => import('@/components/Chart'), {
  loading: () => <div>Loading chart...</div>,
  ssr: false, // Don't render on server
});

// Dynamically import editor
const Editor = dynamic(() => import('@/components/Editor'), {
  loading: () => <div>Loading editor...</div>,
});

export default function Dashboard() {
  return (
    <main>
      <h1>Dashboard</h1>
      <Chart />
      <Editor />
    </main>
  );
}`,
        language: "typescript",
      },
    ],
  },
};
