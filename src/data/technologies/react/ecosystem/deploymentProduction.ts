import type { TopicNode } from "@/data/types";

export const deploymentProduction: TopicNode = {
  id: "react-deployment",
  title: "Deployment & Production",
  iconName: "Rocket",
  link: "https://nextjs.org/docs/app/building-your-application/deploying",
  theory:
    "Deploying a React app involves building an optimized production bundle, configuring a hosting platform, and setting up monitoring. Modern React frameworks (Next.js, Remix) handle most optimization automatically — code splitting, tree shaking, and asset compression. Understanding the deployment pipeline helps you diagnose performance issues and configure caching correctly.",
  theoryDetail: {
    keyConcepts: [
      "npm run build creates an optimized production bundle with minification, tree shaking, and code splitting",
      "Static exports (next export) generate plain HTML/CSS/JS — host on any CDN (GitHub Pages, S3, Cloudflare Pages)",
      "Server-rendered apps (Next.js) need a Node.js server or serverless platform (Vercel, AWS Lambda)",
      "Environment variables: .env.local for development, platform-specific settings for production (never commit secrets)",
      "Performance monitoring: Core Web Vitals (LCP, FID, CLS), error tracking (Sentry), analytics",
      "Caching strategy: immutable hashes for JS/CSS bundles, revalidation for HTML, CDN edge caching for static assets",
    ],
    whyItMatters:
      "Your app is only as good as its deployment. A beautiful UI with a 5-second load time loses users. Understanding the build pipeline, caching, and monitoring lets you deliver fast, reliable experiences and diagnose issues in production before users report them.",
    commonPitfalls: [
      "Not running npm run build locally before deploying — build errors are caught too late in CI",
      "Committing .env files with secrets to git — use .env.local and platform environment variables",
      "Not setting up error monitoring (Sentry, LogRocket) — you won't know about production errors",
      "Ignoring bundle size — use next/bundle-analyzer to find and remove unnecessary dependencies",
      "Not configuring caching headers — stale assets and no-cache on everything both hurt performance",
    ],
    examples: [
      {
        title: "Next.js Production Build & Analysis",
        description:
          "Build, analyze, and optimize your production bundle step by step.",
        code: `// ── Step 1: Build for production ──
// Terminal:
// npm run build
//
// Output shows:
// Route (app)                              Size     First Load JS
// ┌ ○ /                                    5.2 kB        87 kB
// ├ ○ /about                               1.8 kB        83 kB
// ├ ● /blog/[slug]                         3.1 kB        85 kB
// └ λ /api/contact                         0 B           80 kB
//
// ○ Static   — rendered at build time (fastest)
// ● SSG      — static with dynamic params
// λ Dynamic  — rendered at request time (server)

// ── Step 2: Analyze bundle size ──
// npm install @next/bundle-analyzer
// next.config.ts:
import bundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer({
  // ... your config
});

// Terminal: ANALYZE=true npm run build
// Opens a visual treemap of your bundle

// ── Step 3: Common optimizations ──
// 1. Dynamic imports for heavy components
import dynamic from 'next/dynamic';
const HeavyEditor = dynamic(() => import('./Editor'), {
  loading: () => <p>Loading editor...</p>,
  ssr: false,  // Don't include in server bundle
});

// 2. Image optimization
import Image from 'next/image';
// <Image src="/hero.jpg" width={800} height={400} alt="Hero" />
// Automatically: WebP conversion, lazy loading, srcset

// 3. Font optimization
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
// Fonts are self-hosted and preloaded automatically`,
        language: "typescript",
      },
      {
        title: "CI/CD Pipeline & Environment Config",
        description:
          "GitHub Actions workflow for testing, building, and deploying a Next.js app.",
        code: `# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci        # ci = clean install (uses lockfile exactly)

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npx tsc --noEmit

      - name: Run tests
        run: npm test -- --coverage

      - name: Build
        run: npm run build
        env:
          DATABASE_URL: \${{ secrets.DATABASE_URL }}
          # ↑ Set in GitHub Settings > Secrets

      - name: Deploy to Vercel
        if: github.ref == 'refs/heads/main'
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

# ── Environment Variables ──
# .env.local (local dev — NOT committed)
# DATABASE_URL=postgresql://localhost/myapp
# NEXT_PUBLIC_API_URL=http://localhost:3001

# Vercel/Platform settings (production)
# DATABASE_URL=postgresql://prod-server/myapp
# NEXT_PUBLIC_API_URL=https://api.myapp.com`,
        language: "yaml",
      },
      {
        title: "Performance Monitoring with Web Vitals",
        description:
          "Track Core Web Vitals in production to catch performance regressions before users notice.",
        code: `// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SpeedInsights />  {/* Core Web Vitals tracking */}
        <Analytics />      {/* Page view analytics */}
      </body>
    </html>
  );
}

// ── Manual Web Vitals reporting ──
// app/components/WebVitals.tsx
'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    // metric.name: 'LCP' | 'FID' | 'CLS' | 'FCP' | 'TTFB'
    // metric.value: number (ms or score)

    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,  // 'good' | 'needs-improvement' | 'poor'
      page: window.location.pathname,
    });

    // Send to your analytics endpoint
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/vitals', body);
    } else {
      fetch('/api/vitals', { body, method: 'POST', keepalive: true });
    }
  });

  return null;
}

// ── Target thresholds (Google recommendations) ──
// LCP  (Largest Contentful Paint): < 2.5s   = Good
// FID  (First Input Delay):        < 100ms  = Good
// CLS  (Cumulative Layout Shift):  < 0.1    = Good
// TTFB (Time to First Byte):       < 800ms  = Good
// FCP  (First Contentful Paint):    < 1.8s   = Good`,
        language: "tsx",
      },
    ],
  },
};
