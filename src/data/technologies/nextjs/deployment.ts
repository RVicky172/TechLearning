import type { TopicNode } from "@/data/types";

export const nextjsDeployment: TopicNode = {
  id: "nextjs-deployment",
  title: "Deployment & Configuration",
  iconName: "Cloud",
  theoryDetail: {
    keyConcepts: [
      "Vercel is the official Next.js platform with zero-config deployment",
      "Deploy anywhere Node.js runs: AWS, Azure, Heroku, DigitalOcean, Docker",
      "Environment variables are injected at build time (NEXT_PUBLIC_*) and runtime (.env.local)",
      "next.config.ts configures build behavior, redirects, headers, and rewrites",
      "Output modes: standalone, export (static), default (Node.js server)",
      "ISR requires Node.js server; static export mode disables dynamic rendering",
    ],
    whyItMatters:
      "Deployment flexibility lets you choose the platform that fits your needs. Understanding configuration ensures your app runs correctly across different environments.",
    commonPitfalls: [
      "Using NEXT_PUBLIC_* for secrets; these are exposed to the browser",
      "Forgetting to set build environment variables in deployment platform",
      "Using dynamic rendering with static export mode; ISR requires a server",
      "Not configuring output mode correctly for serverless deployments",
      "Hardcoding domain/port; use environment variables for flexibility",
    ],
    examples: [
      {
        title: "next.config.ts Configuration",
        description: "Common configuration patterns.",
        code: `// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.example.com',
      },
    ],
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/old-page',
        destination: '/new-page',
        permanent: true,
      },
    ];
  },

  // Rewrite URLs internally
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: 'http://localhost:3001/:path*',
        },
      ],
    };
  },

  // Response headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },

  // Standalone output for Docker
  output: 'standalone',
};

export default nextConfig;`,
        language: "typescript",
      },
      {
        title: "Environment Variables",
        description: "Manage secrets and config across environments.",
        code: `// .env.local (local development)
DATABASE_URL="postgresql://user:pass@localhost/db"
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_API_URL="http://localhost:3000"

// .env.production (set in deployment platform)
# Use platform's UI or CLI to set these
# DATABASE_URL="postgresql://user:pass@prod.db/app"
# STRIPE_SECRET_KEY="sk_live_..."
# NEXT_PUBLIC_API_URL="https://api.example.com"

// app/page.tsx - Accessing variables
export default function Page() {
  // Only NEXT_PUBLIC_* available in browser
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  return <div>{apiUrl}</div>;
}

// Server Component or Server Action
export async function getData() {
  // All variables available on server
  const db = new Database(process.env.DATABASE_URL);
  return await db.query('SELECT * FROM posts');
}`,
        language: "typescript",
      },
    ],
  },
};
